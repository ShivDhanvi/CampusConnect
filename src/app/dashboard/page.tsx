
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FinancialChart, AttendanceChart, IntelligentNotifications } from '@/components/dashboard-widgets';
import { StatCards } from '@/components/stat-cards';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, you'd get this from a context or session
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        if (role === 'student') {
            router.replace('/dashboard/student');
        }
    }, [router]);

    if (!userRole || userRole === 'student') {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                <div className="grid gap-6 lg:grid-cols-5">
                    <Skeleton className="lg:col-span-3 h-80" />
                    <Skeleton className="lg:col-span-2 h-80" />
                </div>
                <div>
                   <Skeleton className="h-64" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin! Here's your school's overview.</p>
            </div>
            
            <StatCards />

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <FinancialChart />
                </div>
                <div className="lg:col-span-2">
                    <AttendanceChart />
                </div>
            </div>

            <div>
                <IntelligentNotifications />
            </div>
        </div>
    )
}
