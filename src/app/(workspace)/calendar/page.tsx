import { ScheduleView } from "@/components/calendar/schedule-view";

export const metadata = {
  title: "Calendar · Orbit",
};

export default function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-[1.625rem] font-semibold tracking-tight text-foreground">
          Calendar
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your day at a glance: meetings, focus blocks, and everything between.
        </p>
      </header>

      <ScheduleView />
    </div>
  );
}
