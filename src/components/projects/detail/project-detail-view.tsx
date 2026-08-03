"use client";

import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { useAmbientHue } from "@/components/layout/ambient-provider";
import { Button } from "@/components/ui/button";
import { useProjectDetail } from "@/hooks/use-projects";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { AiSummaryCard } from "./ai-summary-card";
import { ContinueWorkingPanel } from "./continue-working-panel";
import { ProjectDetailSkeleton } from "./project-detail-skeleton";
import { ProjectDocuments } from "./project-documents";
import { ProjectHero } from "./project-hero";
import { ProjectTasks } from "./project-tasks";
import { ProjectTeam } from "./project-team";
import { ProjectTimeline } from "./project-timeline";

/**
 * Client shell for a project. It claims the app atmosphere for the project's
 * hue, owns load/error states, then composes the screen as one connected work
 * surface: a compact command header over an asymmetric body — a dominant task
 * surface on the left, a quieter context rail on the right. Sections rise into
 * place on entry so the workspace assembles rather than appears.
 */
export function ProjectDetailView({ slug }: { slug: string }) {
  const { data: project, isPending, isError, refetch } = useProjectDetail(slug);
  useAmbientHue(project?.hue);

  if (isPending) return <ProjectDetailSkeleton />;

  if (isError || !project) {
    return (
      <EmptyState
        className="py-20"
        icon={TriangleAlert}
        title="Couldn't load this project"
        description="Something went wrong reaching the workspace."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerChildren(0.06)}
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <ProjectHero project={project} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <ContinueWorkingPanel point={project.continuePoint} hue={project.hue} />
      </motion.div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Primary work surface */}
        <div className="min-w-0 space-y-6">
          <motion.div variants={fadeInUp}>
            <ProjectTasks slug={slug} tasks={project.tasks} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ProjectDocuments documents={project.documents} />
          </motion.div>
        </div>

        {/* Context rail — supporting, then quiet utilities */}
        <aside className="space-y-6">
          <motion.div variants={fadeInUp}>
            <AiSummaryCard ai={project.ai} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ProjectTeam members={project.members} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ProjectTimeline events={project.timeline} />
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
}
