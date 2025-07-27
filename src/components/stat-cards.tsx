
import { StatCard } from '@/components/stat-card';

export function StatCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Students"
                value="1,250"
                description="+20.1% from last month"
                iconName="Users"
            />
            <StatCard 
                title="Attendance"
                value="92.5%"
                description="+2% from yesterday"
                iconName="UserCheck"
            />
             <StatCard 
                title="Revenue"
                value="$54,230"
                description="+15% from last month"
                iconName="Wallet"
            />
            <StatCard 
                title="Teacher Activity"
                value="High"
                description="Based on recent logins"
                iconName="Activity"
            />
        </div>
    )
}
