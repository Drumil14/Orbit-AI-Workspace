import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { EmptyState } from "@/components/common/empty-state";
import { FileText } from "lucide-react";
import type { DocumentItem } from "@/types";
import { DocumentCard } from "./document-card";

export function ProjectDocuments({ documents }: { documents: DocumentItem[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Documents
        </CardTitle>
        <span className="tabular rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          {documents.length}
        </span>
      </CardHeader>
      <CardContent className="pt-1">
        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Specs, designs, and notes will appear here."
          />
        ) : (
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
