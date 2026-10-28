import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type FileKind = "excel" | "pdf";

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  kind: FileKind;
  uploadedAt: Date;
  url: string;
};

type FilesContextValue = {
  files: UploadedFile[];
  addFiles: (list: FileList | File[]) => { added: number; rejected: string[] };
  removeFile: (id: string) => void;
};

const FilesContext = createContext<FilesContextValue | null>(null);

const MAX_SIZE = 20 * 1024 * 1024;

export function detectKind(file: File): FileKind | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") return "pdf";
  if (/\.(xlsx|xls|csv)$/.test(name)) return "excel";
  return null;
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  const addFiles = useCallback((list: FileList | File[]) => {
    const rejected: string[] = [];
    const accepted: UploadedFile[] = [];
    for (const file of Array.from(list)) {
      const kind = detectKind(file);
      if (!kind || file.size > MAX_SIZE) {
        rejected.push(file.name);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        kind,
        uploadedAt: new Date(),
        url: URL.createObjectURL(file),
      });
    }
    if (accepted.length) setFiles((prev) => [...accepted, ...prev]);
    return { added: accepted.length, rejected };
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return <FilesContext.Provider value={{ files, addFiles, removeFile }}>{children}</FilesContext.Provider>;
}

export function useFiles() {
  const ctx = useContext(FilesContext);
  if (!ctx) throw new Error("useFiles must be used within FilesProvider");
  return ctx;
}
