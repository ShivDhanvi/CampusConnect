"use client"
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    iconName: keyof typeof Icons;
}

export function StatCard({ title, value, description, iconName }: StatCardProps) {
    const Icon = Icons[iconName] as LucideIcon;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
