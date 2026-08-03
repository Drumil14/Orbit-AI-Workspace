import { TasksBoard } from "@/components/tasks/tasks-board";

export const metadata = {
  title: "Tasks · Orbit",
};

export default function TasksPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-[1.625rem] font-semibold tracking-tight text-foreground">
          Tasks
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything on your plate, grouped by project.
        </p>
      </header>

      <TasksBoard />
    </div>
  );
}
