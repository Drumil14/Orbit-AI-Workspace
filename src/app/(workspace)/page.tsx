import { HomeBrief } from "@/components/home/home-brief";
import { HomeHero } from "@/components/home/home-hero";
import { PinnedProjectsCard } from "@/components/home/pinned-projects-card";
import { QuickActionsCard } from "@/components/home/quick-actions-card";
import { TodaysFocusCard } from "@/components/home/todays-focus-card";
import { getCurrentUser } from "@/lib/data/queries";
import { greeting } from "@/lib/text";

export default async function HomePage() {
  const user = await getCurrentUser();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <HomeHero greeting={greeting()} firstName={firstName} />

      {/* Orbit's read on the workspace — the first thing that should teach you
          something, before you scan a single card. */}
      <div className="mt-5 lg:mt-6">
        <HomeBrief />
      </div>

      {/* Asymmetric secondary tier: the primary work column (Focus, with the
          quick-action launchers filling in beneath it) beside a narrower Pinned
          rail — so neither column leaves a dead zone. */}
      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:mt-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <TodaysFocusCard />
          <QuickActionsCard />
        </div>
        <div className="lg:col-span-5">
          <PinnedProjectsCard />
        </div>
      </div>
    </div>
  );
}
