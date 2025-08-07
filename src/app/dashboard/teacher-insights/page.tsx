
"use client";

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Award, BrainCircuit, Users, Target, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useRoleRedirect } from '@/hooks/use-role-redirect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockTeacherData = {
  classPerformance: [
    { name: 'Class 10-A', avgScore: 88, attendance: 95.5 },
    { name: 'Class 10-B', avgScore: 82, attendance: 92.1 },
    { name: 'Class 11-A', avgScore: 78, attendance: 94.2 },
  ],
  subjectPerformance: [
    { subject: 'Mathematics', '10-A': 92, '10-B': 85 },
    { subject: 'History', '10-A': 85, '10-B': 78 },
    { subject: 'Science', '10-A': 88, '10-B': 90 },
    { subject: 'English', '10-A': 91, '10-B': 84 },
    { subject: 'Art', '10-A': 95, '10-B': 93 },
    { subject: 'P.E.', '10-A': 89, '10-B': 88 },
  ],
  topStudents: [
    { name: 'Mary Williams', class: '10-A', score: '98%' },
    { name: 'John Doe', class: '10-A', score: '95%' },
  ],
  insights: {
    summary: "Class 10-A is outperforming 10-B in both Mathematics and History. Overall attendance is strong, but 10-B's dip in History scores may correlate with slightly lower engagement.",
    anomalies: [
        { type: 'Declining Performance', detail: 'John Doe\'s History score dropped 10% from the previous assessment.' },
        { type: 'Low Engagement', detail: 'Class 10-B shows 20% lower participation in discussion forums for Science.' },
        { type: 'Assignment Overdue', detail: '3 students in Class 10-B are more than 5 days overdue on the Math homework.' },
    ],
  }
};

const chartConfig = {
  avgScore: { label: 'Avg. Score', color: 'hsl(var(--chart-1))' },
  attendance: { label: 'Attendance %', color: 'hsl(var(--chart-2))' },
};

export default function TeacherInsightsPage() {
    const loading = useRoleRedirect(['teacher', 'admin']);

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
                 <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Insights</h1>
                <p className="text-muted-foreground">Performance analysis and recommendations for your classes.</p>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-6 w-6 text-primary" /> AI Summary & Anomalies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base leading-relaxed">{mockTeacherData.insights.summary}</p>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Key Anomalies</h4>
                        <div className="space-y-4">
                            {mockTeacherData.insights.anomalies.map((item, index) => (
                                <div key={index}>
                                    <p className="font-semibold text-sm">{item.type}</p>
                                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Overall Class Performance</CardTitle>
                        <CardDescription>Average scores and attendance rates for your classes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={mockTeacherData.classPerformance} margin={{ top: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="avgScore" fill="var(--color-avgScore)" radius={4} />
                                <Bar yAxisId="right" dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Subject Breakdown</CardTitle>
                        <CardDescription>Comparing average scores for each subject you teach.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <ChartContainer config={{ '10-A': { label: '10-A', color: 'hsl(var(--chart-1))' }, '10-B': { label: '10-B', color: 'hsl(var(--chart-2))' }}} className="h-[250px] w-full">
                            <BarChart data={mockTeacherData.subjectPerformance} margin={{ top: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="subject" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Bar dataKey="10-A" fill="var(--color-10-A)" radius={4} />
                                <Bar dataKey="10-B" fill="var(--color-10-B)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
             <div className="grid gap-6 grid-cols-1">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" /> Top Performing Students</CardTitle>
                        <CardDescription>Recognize students who are excelling in your classes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTeacherData.topStudents.map((student) => (
                                    <TableRow key={student.name}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell className="text-right"><Badge>{student.score}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
