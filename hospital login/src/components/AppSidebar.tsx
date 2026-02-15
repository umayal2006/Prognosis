import {
  LayoutDashboard,
  Users,
  UserRound,
  Activity,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const allNavItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard, roles: ["admin", "doctor", "nurse", "accounts"] },
  { title: "Employees", url: "/employees", icon: Users, roles: ["admin"] },
  { title: "Patients", url: "/patients", icon: UserRound, roles: ["admin", "doctor", "nurse"] },
  { title: "Treatments", url: "/treatments", icon: Activity, roles: ["admin", "doctor", "nurse"] },
];

export function AppSidebar() {
  const { signOut, user } = useAuth();
  const { primaryRole, hasRole } = useUserRole();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const visibleItems = allNavItems.filter(
    (item) => item.roles.some((r) => hasRole(r as any))
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">H</div>
                <div>
                  <p className="text-sm font-semibold text-sidebar-foreground">MedDash</p>
                  <p className="text-xs text-muted-foreground capitalize">{primaryRole}</p>
                </div>
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {!collapsed && (
          <div className="mb-2 px-2 text-xs text-muted-foreground truncate">
            {user?.email}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
