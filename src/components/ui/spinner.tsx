import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("inline-block animate-spin px-3 transition", {
    variants: {
        size: {
            default: "text-2xl",
            sm: "text-xl",
            lg: "text-4xl",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

export interface SpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof spinnerVariants> {
    show?: boolean;
    wait?: boolean;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className, size, show, wait, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={cn(
                    spinnerVariants({ size, className }),
                    show ?? true
                        ? `opacity-1 duration-500 ${wait ?? "delay-300"}`
                        : "duration-500 opacity-0 delay-0"
                )}
            >
                ⍥
            </div>
        );
    }
);

Spinner.displayName = "Spinner";

export { Spinner };
