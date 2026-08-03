import { PersonGlyph } from "@/components/common/person-glyph";
import { StatusDot } from "@/components/common/status-dot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { userStatusTone } from "@/lib/status";
import type { User } from "@/types";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "default" | "lg";
  /** Show a presence dot in the corner (drop for dense stacks). */
  showPresence?: boolean;
  className?: string;
}

/**
 * A person's identity: a generated round mark seeded by their id, never
 * initials. Without presence it returns the bare Avatar so it composes cleanly
 * inside an AvatarGroup (whose ring/overlap styles target direct avatar
 * children).
 */
export function UserAvatar({
  user,
  size = "default",
  showPresence = false,
  className,
}: UserAvatarProps) {
  const avatar = (
    <Avatar size={size} title={user.name} className={className}>
      <AvatarFallback className="bg-transparent p-0">
        <PersonGlyph seed={user.id} hue={user.hue} className="size-full ring-0" />
      </AvatarFallback>
    </Avatar>
  );

  if (!showPresence) return avatar;

  return (
    <span className="relative inline-flex">
      {avatar}
      <StatusDot
        tone={userStatusTone[user.status]}
        label={`${user.name}, ${user.status}`}
        className="absolute right-0 bottom-0 ring-2 ring-background"
      />
    </span>
  );
}
