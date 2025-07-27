import { MainSidebar } from '@/components/main-sidebar';
import { RightColumn } from '@/components/right-column';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <aside className="hidden w-72 flex-shrink-0 flex-col border-r bg-card md:flex">
                <MainSidebar />
            </aside>
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 md:hidden">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                       <h1 className="text-lg font-semibold">CampusConnect</h1>
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
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
    );
}
