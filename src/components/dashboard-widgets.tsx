
"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, TrendingUp } from 'lucide-react'
import type { AnalyzeStudentDataOutput } from "@/ai/flows/intelligent-notifications"
import { Button } from './ui/button';

// FinancialChart Component
const financialChartData = [
    { month: "Jan", revenue: 18600 },
    { month: "Feb", revenue: 30500 },
    { month: "Mar", revenue: 23700 },
    { month: "Apr", revenue: 17300 },
    { month: "May", revenue: 20900 },
    { month: "Jun", revenue: 28400 },
]

const financialChartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
}

export function FinancialChart() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Financial Analysis</CardTitle>
            <CardDescription>Monthly Revenue for the Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={financialChartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={financialChartData}>
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}

// AttendanceChart Component
const attendanceChartData = [
  { category: "Students", value: 92.5, fill: "hsl(var(--chart-1))" },
  { category: "Teachers", value: 98.2, fill: "hsl(var(--chart-2))" },
  { category: "Staff", value: 96.8, fill: "hsl(var(--chart-3))" },
]
const attendanceChartConfig = {
  value: { label: "Attendance" },
  students: { label: "Students", color: "hsl(var(--chart-1))" },
  teachers: { label: "Teachers", color: "hsl(var(--chart-2))" },
  staff: { label: "Staff", color: "hsl(var(--chart-3))" },
}

export function AttendanceChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Overall Attendance</CardTitle>
        <CardDescription>Today's Attendance Rate</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer config={attendanceChartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={attendanceChartData} dataKey="value" nameKey="category" innerRadius={60} strokeWidth={5}>
                {attendanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5% this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing overall attendance for today
        </div>
      </CardFooter>
    </Card>
  )
}

// IntelligentNotifications Component
const mockData: AnalyzeStudentDataOutput = {
    anomalies: [
        { studentId: 'S-1024', anomalyType: 'Declining Grades', description: 'Grades dropped by 15% in Mathematics this term.', severity: 'high' },
        { studentId: 'S-0987', anomalyType: 'Attendance Issue', description: 'Missed 5 days of school in the last 2 weeks without prior notice.', severity: 'high' },
        { studentId: 'S-1152', anomalyType: 'Low Participation', description: 'Activity logs show minimal interaction in online class forums.', severity: 'medium' },
    ],
    summary: '3 critical anomalies were found after analyzing recent school data.'
}

const severityVariantMap: Record<AnalyzeStudentDataOutput['anomalies'][0]['severity'], 'destructive' | 'secondary' | 'outline'> = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
}

export function IntelligentNotifications() {
    const data = mockData;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>Intelligent Alerts</CardTitle>
                            <CardDescription>{data.summary}</CardDescription>
                        </div>
                    </div>
                    <Button variant="link" size="sm" asChild>
                        <a href="/dashboard/intelligent-alerts">View all</a>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Identifier</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Description</TableHead>
                            <TableHead className="text-right">Severity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.anomalies.length > 0 ? data.anomalies.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.studentId}</TableCell>
                                <TableCell>{item.anomalyType}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.description}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={severityVariantMap[item.severity]} className="capitalize">{item.severity}</Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                    No anomalies to display.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
