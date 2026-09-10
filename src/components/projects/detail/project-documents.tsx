"use client";

import { FileText, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { EmptyState } from "@/components/common/empty-state";
import { useDocActions } from "@/components/documents/doc-actions-provider";
import { Button } from "@/components/ui/button";
import type { AccentHue, DocumentItem, DocumentWithProject } from "@/types";
import { DocumentCard } from "./document-card";

interface DocProject {
  id: string;
  name: string;
  slug: string;
  hue: AccentHue;
}

export function ProjectDocuments({
  project,
  documents,
}: {
  project: DocProject;
  documents: DocumentItem[];
}) {
  const { openDoc, openCreateDoc } = useDocActions();

  const withProject = (doc: DocumentItem): DocumentWithProject => ({
    ...doc,
    projectId: project.id,
    projectName: project.name,
    projectSlug: project.slug,
    projectHue: project.hue,
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Documents
        </CardTitle>
        <div className="flex items-center gap-1.5">
          <span className="tabular rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            {documents.length}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="New document"
            onClick={() => openCreateDoc(project.slug)}
          >
            <Plus />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Specs, designs, and notes will appear here."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCreateDoc(project.slug)}
              >
                <Plus className="size-4" />
                New document
              </Button>
            }
          />
        ) : (
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onOpen={() => openDoc(withProject(doc))}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
