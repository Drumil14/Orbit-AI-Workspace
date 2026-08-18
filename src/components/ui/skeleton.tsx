import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("orbit-skeleton rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
