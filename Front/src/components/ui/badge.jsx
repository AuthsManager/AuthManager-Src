import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 hover:shadow-md",
        secondary:
          "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30 hover:shadow-md",
        destructive:
          "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:shadow-md",
        success:
          "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 hover:shadow-md",
        warning:
          "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 hover:shadow-md",
        outline: "bg-transparent text-white border-[#2C3B5B] hover:bg-[#1B2B4B] hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
