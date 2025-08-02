
"use client";

import { MainSidebar } from '@/components/main-sidebar';
import { RightColumn } from '@/components/right-column';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { Menu, LogOut, Bell, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { StudentSidebar } from '@/components/student-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                 <Sidebar>
                    <StudentSidebar />
                </Sidebar>
                <div className="flex flex-1 flex-col">
                     <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="md:hidden" />
                            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                               <h1 className="text-lg font-semibold">CampusConnect</h1>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="relative">
                                         <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">3</div>
                                        <Bell className="h-5 w-5" />
                                        <span className="sr-only">Toggle notifications</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="p-2 space-y-2">
                                        <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted">
                                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                                                <GraduationCap className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">New Assignment</p>
                                                <p className="text-xs text-muted-foreground">"WWII Essay" was just posted for History.</p>
                                            </div>
                                        </div>
                                         <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted">
                                            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                                                <Users className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">New User</p>
                                                <p className="text-xs text-muted-foreground">A new parent "Sarah Miller" has registered.</p>
                                            </div>
                                        </div>
                                         <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted">
                                            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                                                <Bell className="h-5 w-5 text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Fee Reminder</p>
                                                <p className="text-xs text-muted-foreground">Term fee payment is due in 7 days.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="justify-center">
                                        <span>View All Notifications</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                             <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle right sidebar</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 w-[350px] sm:max-w-[350px]">
                                     <SheetHeader className="p-4 pb-0">
                                        <SheetTitle>Notifications & Events</SheetTitle>
                                    </SheetHeader>
                                    <div className="p-4">
                                     <RightColumn />
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="https://placehold.co/32x32.png" alt="Student" data-ai-hint="user avatar" />
                                            <AvatarFallback>S</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">Student</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                student@example.com
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/')}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                    <div className="flex flex-1">
                        <main className="flex-1 p-4 md:p-6 lg:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
