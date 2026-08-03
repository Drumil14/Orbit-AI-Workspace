import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/common/user-avatar";
import type { User } from "@/types";

interface AvatarStackProps {
  users: User[];
  /** How many to show before collapsing into a "+N" chip. */
  max?: number;
  size?: "sm" | "default" | "lg";
}

/** Overlapping avatars for a team, with a tidy overflow count. */
export function AvatarStack({ users, max = 4, size = "default" }: AvatarStackProps) {
  const shown = users.slice(0, max);
  const overflow = users.length - shown.length;

  return (
    <AvatarGroup>
      {shown.map((user) => (
        <UserAvatar key={user.id} user={user} size={size} />
      ))}
      {overflow > 0 && (
        <AvatarGroupCount aria-label={`${overflow} more`}>
          +{overflow}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  );
}
