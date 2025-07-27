import { FinancialChart, AttendanceChart, IntelligentNotifications } from '@/components/dashboard-widgets';
import { StatCards } from '@/components/stat-cards';

export default function AdminDashboardPage() {
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
