import Link from "next/link";
import { FolderX } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <EmptyState
        icon={FolderX}
        title="Project not found"
        description="This project may have been moved or archived."
        action={
          <Button variant="outline" size="sm" render={<Link href="/projects" />}>
            Back to projects
          </Button>
        }
      />
    </div>
  );
}
