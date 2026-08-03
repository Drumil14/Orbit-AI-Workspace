import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/projects/detail/project-detail-view";
import { getProjectBySlug } from "@/lib/data/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project ? `${project.name} · Orbit` : "Project · Orbit" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <ProjectDetailView slug={slug} />
    </div>
  );
}
