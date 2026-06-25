import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-bold leading-none text-slate-700 dark:text-zinc-300 select-none uppercase tracking-wider",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
