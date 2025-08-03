
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { User, ClipboardCheck, CheckCircle2, XCircle, Clock, BookOpen } from "lucide-react";

// Mock Data for the Student Dashboard
const studentData = {
    name: "John Doe",
    class: "10-A",
    classTeacher: "Mr. Smith",
    attendance: {
        present: 85,
        absent: 5,
        late: 10,
    },
    pendingAssignments: 3,
    upcomingLessons: [
        { subject: "Mathematics", teacher: "Mr. Smith", topic: "Introduction to Trigonometry" },
        { subject: "History", teacher: "Mrs. Jones", topic: "The Roman Empire: Rise and Fall" },
        { subject: "Biology", teacher: "Mr. Davis", topic: "Cell Structure and Function" },
        { subject: "English", teacher: "Ms. Williams", topic: "Analyzing Shakespeare's Sonnets" },
        { subject: "Geography", teacher: "Mrs. Clark", topic: "Climate Zones of the World" },
    ]
};

const attendanceChartData = [
    { name: 'Present', value: studentData.attendance.present, fill: 'hsl(var(--chart-1))' },
    { name: 'Late', value: studentData.attendance.late, fill: 'hsl(var(--chart-2))' },
    { name: 'Absent', value: studentData.attendance.absent, fill: 'hsl(var(--destructive))' },
];

const totalDays = studentData.attendance.present + studentData.attendance.absent + studentData.attendance.late;
const overallAttendancePercentage = totalDays > 0 ? ((studentData.attendance.present + studentData.attendance.late) / totalDays) * 100 : 0;


export default function StudentDashboardPage() {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold font-headline">Welcome, {studentData.name}!</h1>
                <p className="text-muted-foreground">Here's your academic snapshot for today.</p>
            </div>
            
            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentData.pendingAssignments}</div>
                        <p className="text-xs text-muted-foreground">Don't forget to submit them on time!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallAttendancePercentage.toFixed(1)}%</div>
                         <p className="text-xs text-muted-foreground">Keep up the great work.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Class Teacher</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentData.classTeacher}</div>
                        <p className="text-xs text-muted-foreground">Class {studentData.class}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Attendance Chart */}
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>Attendance Breakdown</CardTitle>
                        <CardDescription>Your attendance summary for the term.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center items-center">
                        <ChartContainer
                            config={{}}
                            className="mx-auto aspect-square h-[200px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel indicator="dot" />}
                                    />
                                    <Pie data={attendanceChartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} stroke="hsl(var(--card))">
                                        {attendanceChartData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardContent className="flex justify-center gap-4 text-sm mt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-chart-1" />
                            <span>Present ({studentData.attendance.present})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-chart-2" />
                            <span>Late ({studentData.attendance.late})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span>Absent ({studentData.attendance.absent})</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Lessons Table */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-6 w-6" />
                            <div>
                               <CardTitle>Upcoming Lessons</CardTitle>
                                <CardDescription>Get a head start on these topics for the week.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Topic</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentData.upcomingLessons.map((lesson, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{lesson.subject}</TableCell>
                                            <TableCell>{lesson.teacher}</TableCell>
                                            <TableCell>{lesson.topic}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
