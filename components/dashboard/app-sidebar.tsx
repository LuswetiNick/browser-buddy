"use client"

import Logo from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { OrganizationSwitcher } from "@clerk/nextjs"

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton
          size="lg"
          aria-label="BrowserBuddy"
          className="group-data-[collapsible=icon]:justify-center"
        >
          <Logo wordmarkClassName="group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox:
                  "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",
                organizationSwitcherTrigger:
                  "w-full! justify-between! bg-background! border! border-border! rounded-md! pl-1! pr-2! py-1! gap-3! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1! shadow-[0px_1px_1.5px_0px_rgba(44,54,53,0.03)]!",
                organizationPreview: "gap-2!",
                organizationPreviewAvatarBox: "size-6! rounded-sm!",
                organizationPreviewTextContainer:
                  "text-xs! tracking-tight! font-medium! text-foreground! group-data-[collapsible=icon]:hidden!",
                organizationPreviewMainIdentifier: "text-[13px]!",
                organizationSwitcherTriggerIcon:
                  "size-4! text-sidebar-foreground! group-data-[collapsible=icon]:hidden!",
                notificationBadge: "group-data-[collapsible=icon]:hidden!",
              },
            }}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
