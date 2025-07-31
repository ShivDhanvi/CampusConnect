
"use client"
import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, Ratio, DollarSign, BookOpen } from "lucide-react"
import dynamic from 'next/dynamic'

const enrollmentData = [
  { year: '2020', students: 850 },
  { year: '2021', students: 920 },
  { year: '2022', students: 1050 },
  { year: '2023', students: 1180 },
  { year: '2024', students: 1250 },
];

const financialsData = [
  { month: 'Jan', revenue: 18600, expenses: 12000 },
  { month: 'Feb', revenue: 30500, expenses: 15000 },
  { month: 'Mar', revenue: 23700, expenses: 18000 },
  { month: 'Apr', revenue: 17300, expenses: 11000 },
  { month: 'May', revenue: 20900, expenses: 16000 },
  { month: 'Jun', revenue: 28400, expenses: 20000 },
];

const subjectPerformanceData = [
  { subject: 'Math', avgScore: 88 },
  { subject: 'History', avgScore: 76 },
  { subject: 'Science', avgScore: 92 },
  { subject: 'English', avgScore: 81 },
  { subject: 'Art', avgScore: 95 },
  { subject: 'Music', avgScore: 89 },
];

const userDemographicsData = [
    { role: 'Students', count: 1250, fill: "hsl(var(--chart-1))" },
    { role: 'Teachers', count: 75, fill: "hsl(var(--chart-2))" },
    { role: 'Parents', count: 2100, fill: "hsl(var(--chart-3))" },
]

const chartConfigs = {
    students: { label: "Students", color: "hsl(var(--chart-1))" },
    teachers: { label: "Teachers", color: "hsl(var(--chart-2))" },
    parents: { label: "Parents", color: "hsl(var(--chart-3))" },
    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
    avgScore: { label: "Avg. Score", color: "hsl(var(--chart-1))" }
};

const StudentLocationMap = dynamic(() => import('@/components/student-location-map').then(mod => mod.StudentLocationMap), {
    ssr: false,
    loading: () => <div className="h-[450px] w-full bg-muted animate-pulse rounded-lg" />
});


export default function InsightsPage() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Insights</h1>
                <p className="text-muted-foreground">High-level analytics and reports for school administration.</p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,250</div>
                        <p className="text-xs text-muted-foreground">+5.9% from last year</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Student-Teacher Ratio</CardTitle>
                        <Ratio className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">16.7 : 1</div>
                        <p className="text-xs text-muted-foreground">Slightly down from 17.1 last year</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">YTD Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$136,800</div>
                        <p className="text-xs text-muted-foreground">On track to meet annual goals</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performing Subject</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Art</div>
                        <p className="text-xs text-muted-foreground">95% average score across all grades</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Enrollment Trend</CardTitle>
                        <CardDescription>Student enrollment over the last 5 years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigs} className="h-[300px] w-full">
                            <LineChart data={enrollmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis domain={[700, 1400]} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Line type="monotone" dataKey="students" stroke="var(--color-students)" strokeWidth={2} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Financial Overview</CardTitle>
                        <CardDescription>Monthly revenue vs. expenses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigs} className="h-[300px] w-full">
                           <BarChart data={financialsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>User Demographics</CardTitle>
                        <CardDescription>Distribution of user roles in the system.</CardDescription>
                    </CardHeader>
                     <CardContent className="flex-1 pb-0 flex items-center justify-center">
                        <ChartContainer config={chartConfigs} className="mx-auto aspect-square h-[300px]">
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={userDemographicsData} dataKey="count" nameKey="role" innerRadius={50} strokeWidth={5} >
                                     {userDemographicsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Average Subject Performance</CardTitle>
                        <CardDescription>Average scores across all grades for each subject.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigs} className="h-[300px] w-full">
                            <BarChart data={subjectPerformanceData} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis type="category" dataKey="subject" width={60} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Student Location Insights</CardTitle>
                    <CardDescription>A map showing the geographic distribution of students in the Chennai area.</CardDescription>
                </CardHeader>
                <CardContent className="h-[450px] w-full p-0">
                   {isClient && <StudentLocationMap />}
                </CardContent>
            </Card>

        </div>
    )
}
