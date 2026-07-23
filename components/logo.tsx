import { CableIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  wordmarkClassName?: string
}

const Logo = ({ className, wordmarkClassName }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CableIcon className="size-6" />
      <span className={cn("text-xl font-bold", wordmarkClassName)}>
        BrowserBuddy.
      </span>
    </div>
  )
}

export default Logo
