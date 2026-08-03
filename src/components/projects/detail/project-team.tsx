import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { UserAvatar } from "@/components/common/user-avatar";
import { getPerson } from "@/lib/data/people";
import type { ProjectMember, UserStatus } from "@/types";

const presenceLabel: Record<UserStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "In focus",
  offline: "Offline",
};

export function ProjectTeam({ members }: { members: ProjectMember[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="size-4 text-muted-foreground" />
          Team
        </CardTitle>
        <span className="tabular rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          {members.length}
        </span>
      </CardHeader>
      <CardContent className="pt-1">
        <ul className="-mx-2 flex flex-col">
          {members.map((member) => {
            const user = getPerson(member.userId);
            if (!user) return null;
            return (
              <li
                key={member.userId}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-accent/70"
              >
                <UserAvatar user={user} size="sm" showPresence />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {presenceLabel[user.status]}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
