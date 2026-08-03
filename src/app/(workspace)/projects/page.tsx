import { ProjectsBoard } from "@/components/projects/overview/projects-board";

export const metadata = {
  title: "Projects · Orbit",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-[1.625rem] font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every effort in motion, and where each one needs you.
        </p>
      </header>

      <ProjectsBoard />
    </div>
  );
}
