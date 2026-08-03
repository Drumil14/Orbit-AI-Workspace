import { Card } from "@/components/common/card";

/** A titled settings block — the consistent frame for every preference group. */
export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 border-b border-border/50 pb-4">
        <h2 className="text-[0.95rem] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </Card>
  );
}
