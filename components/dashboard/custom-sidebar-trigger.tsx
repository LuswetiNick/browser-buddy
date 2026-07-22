import { Kbd, KbdGroup } from "../ui/kbd"
import { SidebarTrigger } from "../ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const CustomSidebarTrigger = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarTrigger />
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1" side="right">
        Toggle Sidebar{" "}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>b</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  )
}

export default CustomSidebarTrigger
