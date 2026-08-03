import { DocumentsBoard } from "@/components/documents/documents-board";

export const metadata = {
  title: "Documents · Orbit",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-[1.625rem] font-semibold tracking-tight text-foreground">
          Documents
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every spec, design, and note across your projects.
        </p>
      </header>

      <DocumentsBoard />
    </div>
  );
}
