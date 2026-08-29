"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const messageBoxVariants = cva(
  "rounded-lg border p-6 text-center transition-colors",
  {
    variants: {
      variant: {
        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-900",
        success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-900",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-900",
        error: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-900",
        default: "bg-muted text-muted-foreground border-border",
      },
      size: {
        sm: "p-4 text-sm",
        md: "p-6 text-base",
        lg: "p-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface MessageBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageBoxVariants> {
  title?: string;
  description?: string;
}

export function MessageBox({
  title,
  description,
  variant,
  size,
  className,
  ...props
}: MessageBoxProps) {
  return (
    <div className={cn("max-w-xl mx-auto py-10", className)} {...props}>
      <div className={cn(messageBoxVariants({ variant, size }))}>
        {title && <h2 className="font-semibold mb-2">{title}</h2>}
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
