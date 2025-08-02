
"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, RefreshCw, Bot } from 'lucide-react'
import type { AnalyzeStudentDataOutput } from "@/ai/flows/intelligent-notifications"
import { Button } from '@/components/ui/button';

// Mock data, in a real app this would be fetched from the AI flow
const mockData: AnalyzeStudentDataOutput = {
    anomalies: [
        { studentId: 'S-1024', anomalyType: 'Declining Grades', description: 'Grades dropped by 15% in Mathematics this term.', severity: 'high' },
        { studentId: 'S-0987', anomalyType: 'Attendance Issue', description: 'Missed 5 days of school in the last 2 weeks without prior notice.', severity: 'high' },
        { studentId: 'S-1152', anomalyType: 'Low Participation', description: 'Activity logs show minimal interaction in online class forums.', severity: 'medium' },
        { studentId: 'T-004', anomalyType: 'Leave Plan', description: 'Teacher scheduled a 3-day leave next week. Substitute needed.', severity: 'medium' },
        { studentId: 'ALL-PARENTS', anomalyType: 'Fee Reminder', description: 'Term fee payment is due in 7 days.', severity: 'low' },
        { studentId: 'S-1056', anomalyType: 'Unusual Login Times', description: 'Student logging in consistently between 1 AM and 3 AM.', severity: 'medium' },
        { studentId: 'S-1101', anomalyType: 'Assignment Overdue', description: 'History essay is 5 days overdue.', severity: 'low' },

    ],
    summary: '7 anomalies were found after analyzing recent school data.'
}

const severityVariantMap: Record<AnalyzeStudentDataOutput['anomalies'][0]['severity'], 'destructive' | 'secondary' | 'outline'> = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
}

export default function IntelligentAlertsPage() {
    const data = mockData;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Intelligent Alerts</h1>
                    <p className="text-muted-foreground">AI-powered analysis of school data.</p>
                </div>
                <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-analyze Data
                </Button>
            </div>
            
             <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <CardTitle>Analysis Summary</CardTitle>
                            <CardDescription>{data.summary}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                            <CardTitle>Detected Anomalies</CardTitle>
                            <CardDescription>A list of potential issues identified by the AI.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Identifier</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Severity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.anomalies.length > 0 ? data.anomalies.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium whitespace-nowrap">{item.studentId}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.anomalyType}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={severityVariantMap[item.severity]} className="capitalize">{item.severity}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No anomalies to display. Run analysis to see results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
