import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // 1. Base Layout & Typography
        "flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-sm transition-colors outline-none md:text-sm",

        // 2. Colors (Using daisyUI base variables directly)
        "bg-base-200/50 text-base-content", // Slightly tinted background, readable text
        "border border-base-content/20", // Subtle border that works in dark/light mode

        // 3. Placeholder & Focus States
        "placeholder:text-base-content/50", // Muted placeholder text
        "focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary", // Clean focus ring

        // 4. Disabled States
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-base-200",

        // 5. File Input Styling
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-base-content",

        className,
      )}
      {...props}
    />
  );
}

export { Input };
