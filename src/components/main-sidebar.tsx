
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  BarChart3,
  Megaphone,
  MessageSquare,
  Settings,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import {
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    useSidebar
} from '@/components/ui/sidebar';


const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/user-management', label: 'User Management', icon: Users },
  { href: '/dashboard/academics', label: 'Academics', icon: GraduationCap },
  { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardList },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, badge: 1 },
  { href: '/dashboard/intelligent-alerts', label: 'Intelligent Alerts', icon: ShieldAlert, badge: 3 },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const navItems = adminNavItems;

  return (
    <>
        <SidebarHeader>
            <div className="flex h-16 items-center px-2">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    {state === 'expanded' && <span className="">CampusConnect</span>}
                </Link>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {navItems.map(({ href, label, icon: Icon, badge }) => (
                    <SidebarMenuItem key={href+label}>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard')}
                            tooltip={{
                                children: label,
                                side: "right",
                            }}
                        >
                            <Link href={href}>
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                                {badge && <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{badge}</span>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Separator className="my-2" />
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === "/dashboard/settings"}
                        tooltip={{
                            children: "Settings",
                            side: "right",
                        }}
                    >
                        <Link href="/dashboard/settings">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
