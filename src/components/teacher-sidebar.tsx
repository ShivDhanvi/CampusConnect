
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
  GraduationCap
} from 'lucide-react';
import {
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    useSidebar
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';

const teacherNavItems = [
  { href: '/dashboard/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/academics', label: 'Academics', icon: GraduationCap },
  { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardList },
  { href: '/dashboard/teacher-insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, badge: 1 },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const navItems = teacherNavItems;

  return (
    <>
        <SidebarHeader>
            <div className="flex h-16 items-center px-2">
                <Link href="/dashboard/teacher" className="flex items-center gap-2 font-semibold font-headline">
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
                            isActive={pathname.startsWith(href) && (href !== '/dashboard/teacher' || pathname === '/dashboard/teacher')}
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
