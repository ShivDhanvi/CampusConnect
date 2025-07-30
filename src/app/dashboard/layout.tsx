
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
import { Menu, LogOut } from 'lucide-react';
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                 <Sidebar>
                    <MainSidebar />
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
                             <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle right sidebar</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 w-[350px] sm:max-w-[350px]">
                                    <div className="p-4">
                                     <RightColumn />
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="https://placehold.co/32x32.png" alt="Admin" data-ai-hint="user avatar" />
                                            <AvatarFallback>A</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">Admin</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                admin@example.com
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
