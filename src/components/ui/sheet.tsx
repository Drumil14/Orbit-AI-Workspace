"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A right-anchored sheet (side drawer), built on Base UI's Dialog primitive —
 * same focus trap / scroll lock / Escape handling as a modal, but the popup
 * slides in from the right edge and runs full height. Used for detail panels
 * (e.g. task detail) that should keep the underlying list in view.
 */

function Sheet(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function SheetTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger {...props} />;
}

function SheetClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close {...props} />;
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  showClose = true,
  ...props
}: DialogPrimitive.Popup.Props & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm transition-opacity duration-300 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-dvh w-[92vw] max-w-md flex-col border-l border-border bg-popover text-popover-foreground shadow-xl outline-none transition-transform duration-300 ease-out data-[ending-style]:translate-x-full data-[ending-style]:duration-200 data-[starting-style]:translate-x-full",
          className,
        )}
        {...props}
      >
        {showClose && (
          <DialogPrimitive.Close
            className="absolute top-4 right-4 z-10 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 border-b border-border/70 px-6 py-5 pr-12",
        className,
      )}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-5", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border/70 px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetBody,
  SheetFooter,
};
