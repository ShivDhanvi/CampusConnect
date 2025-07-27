import { StatCard, FinancialChart, AttendanceChart, IntelligentNotifications } from '@/components/dashboard-widgets';
import { Activity, Users, Wallet, UserCheck } from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin! Here's your school's overview.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Students"
                    value="1,250"
                    description="+20.1% from last month"
                    icon={Users}
                />
                <StatCard 
                    title="Attendance"
                    value="92.5%"
                    description="+2% from yesterday"
                    icon={UserCheck}
                />
                 <StatCard 
                    title="Revenue"
                    value="$54,230"
                    description="+15% from last month"
                    icon={Wallet}
                />
                <StatCard 
                    title="Teacher Activity"
                    value="High"
                    description="Based on recent logins"
                    icon={Activity}
                />
            </div>

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
