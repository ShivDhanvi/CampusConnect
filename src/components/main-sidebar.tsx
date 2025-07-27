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

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '#', label: 'User Management', icon: Users },
  { href: '#', label: 'Academics', icon: GraduationCap },
  { href: '#', label: 'Attendance', icon: ClipboardList },
  { href: '#', label: 'Insights', icon: BarChart3 },
  { href: '#', label: 'Calendar', icon: Calendar },
  { href: '#', label: 'Announcements', icon: Megaphone },
  { href: '#', label: 'Messages', icon: MessageSquare },
  { href: '#', label: 'Intelligent Alerts', icon: ShieldAlert, badge: 5 },
];

export function MainSidebar() {
  const pathname = usePathname();

  const navItems = adminNavItems;

  return (
    <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="">CampusConnect</span>
            </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map(({ href, label, icon: Icon, badge }) => (
                    <Link
                        key={href+label}
                        href={href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent",
                            pathname === href && "bg-sidebar-accent text-primary font-semibold"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                        {badge && <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{badge}</span>}
                    </Link>
                ))}
            </nav>
        </div>
        <div className="mt-auto p-4">
            <Separator className="my-2" />
             <Link
                href="#"
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent",
                )}
            >
                <Settings className="h-4 w-4" />
                Settings
            </Link>
        </div>
    </div>
  );
}
