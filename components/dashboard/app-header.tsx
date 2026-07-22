import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import { Separator } from "../ui/separator"
import CustomSidebarTrigger from "./custom-sidebar-trigger"

const AppHeader = () => {
  return (
    <header
      className={cn(
        "pxx-4 mb-6 flex items-center justify-between gap-2 md:px-2"
      )}
    >
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
      </div>
      <div>
        <UserButton />
      </div>
    </header>
  )
}

export default AppHeader
