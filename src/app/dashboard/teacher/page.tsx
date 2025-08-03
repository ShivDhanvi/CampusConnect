
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ClipboardCheck, Users, Award, Star, CheckCircle2, XCircle, Clock, FileCheck } from "lucide-react";

const teacherData = {
    name: "Mr. Smith",
    classes: ["10-A", "10-B"],
    totalStudents: 60,
    attendance: {
        "10-A": { present: 28, absent: 2 },
        "10-B": { present: 27, absent: 3 },
    },
    assignments: {
        submitted: 45,
        pending: 15,
        late: 5,
        graded: 30,
    },
    leaderboard: [
        { name: "Mary Williams", class: "10-A", score: "98%", streak: 5 },
        { name: "John Doe", class: "10-A", score: "95%", streak: 8 },
        { name: "Student C", class: "10-B", score: "94%", streak: 3 },
        { name: "Student D", class: "10-B", score: "92%", streak: 4 },
    ]
};

const assignmentChartData = [
    { name: 'Graded', value: teacherData.assignments.graded, fill: 'hsl(var(--chart-1))' },
    { name: 'Submitted', value: teacherData.assignments.submitted, fill: 'hsl(var(--chart-2))' },
    { name: 'Pending', value: teacherData.assignments.pending, fill: 'hsl(var(--chart-4))' },
    { name: 'Late', value: teacherData.assignments.late, fill: 'hsl(var(--destructive))' },
];

const attendanceChartData = teacherData.classes.map(c => ({
    name: `Class ${c}`,
    present: teacherData.attendance[c as keyof typeof teacherData.attendance].present,
    absent: teacherData.attendance[c as keyof typeof teacherData.attendance].absent,
}));

const chartConfig = {
    present: { label: 'Present', color: 'hsl(var(--chart-1))' },
    absent: { label: 'Absent', color: 'hsl(var(--destructive))' },
};


export default function TeacherDashboardPage() {
    const totalAttendance = teacherData.classes.reduce((acc, c) => acc + teacherData.attendance[c as keyof typeof teacherData.attendance].present + teacherData.attendance[c as keyof typeof teacherData.attendance].absent, 0);
    const totalPresent = teacherData.classes.reduce((acc, c) => acc + teacherData.attendance[c as keyof typeof teacherData.attendance].present, 0);
    const overallAttendancePercentage = totalAttendance > 0 ? (totalPresent / totalAttendance) * 100 : 0;
    
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold font-headline">Welcome, {teacherData.name}!</h1>
                <p className="text-muted-foreground">Here's an overview of your classes today.</p>
            </div>
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacherData.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across {teacherData.classes.length} classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallAttendancePercentage.toFixed(1)}%</div>
                         <p className="text-xs text-muted-foreground">Across all your classes today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assignments Submitted</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacherData.assignments.submitted}</div>
                        <p className="text-xs text-muted-foreground">{teacherData.assignments.pending} pending</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Class Attendance</CardTitle>
                        <CardDescription>Live view of student attendance in your classes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                           <BarChart data={attendanceChartData} margin={{ top: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Bar dataKey="present" fill="var(--color-present)" radius={4} />
                                <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>Assignment Status</CardTitle>
                        <CardDescription>Overview of all active assignments.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center items-center">
                        <ChartContainer config={{}} className="mx-auto aspect-square w-full max-w-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" />} />
                                    <Pie data={assignmentChartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} stroke="hsl(var(--card))">
                                        {assignmentChartData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4 pb-4">
                        <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4" style={{ color: 'hsl(var(--chart-1))' }} />
                            <span>Graded ({teacherData.assignments.graded})</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" style={{ color: 'hsl(var(--chart-2))' }} />
                            <span>Submitted ({teacherData.assignments.submitted})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" style={{ color: 'hsl(var(--chart-4))' }} />
                            <span>Pending ({teacherData.assignments.pending})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" style={{ color: 'hsl(var(--destructive))' }} />
                            <span>Late ({teacherData.assignments.late})</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Award className="h-6 w-6 text-yellow-500" />
                        <div>
                           <CardTitle>Student Leaderboard</CardTitle>
                            <CardDescription>Top performers based on recent results and streaks.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead className="text-right">Streak</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacherData.leaderboard.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-bold">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell>
                                            <Badge variant="default">{student.score}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-1">
                                            {student.streak} <Star className="h-4 w-4 text-yellow-500" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
