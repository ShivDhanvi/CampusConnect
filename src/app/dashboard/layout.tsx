import { MainSidebar } from '@/components/main-sidebar';
import { RightColumn } from '@/components/right-column';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 md:hidden">
                                <MainSidebar />
                            </SheetContent>
                        </Sheet>
                    </header>
                    <div className="flex flex-1">
                        <main className="flex-1 p-4 md:p-6 lg:p-8">
                            {children}
                        </main>
                        <aside className="hidden shrink-0 border-l bg-card p-4 lg:block lg:w-[350px]">
                            <RightColumn />
                        </aside>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
