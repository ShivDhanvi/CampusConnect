import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from "lucide-react";

const attendanceData = [
  { studentId: 'S-1024', name: 'John Doe', date: '2024-08-26', status: 'Present' },
  { studentId: 'S-0987', name: 'Jane Smith', date: '2024-08-26', status: 'Absent' },
  { studentId: 'S-1152', name: 'Peter Jones', date: '2024-08-26', status: 'Present' },
  { studentId: 'S-1056', name: 'Mary Williams', date: '2024-08-26', status: 'Late' },
  { studentId: 'S-1025', name: 'David Brown', date: '2024-08-25', status: 'Present' },
  { studentId: 'S-0988', name: 'Emily Davis', date: '2024-08-25', status: 'Present' },
];

export default function AttendancePage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Attendance</h1>
                    <p className="text-muted-foreground">Track student and staff attendance.</p>
                </div>
                 <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Attendance Log</CardTitle>
                    <CardDescription>A log of student attendance records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData.map((record) => (
                                    <TableRow key={record.studentId + record.date}>
                                        <TableCell className="font-medium whitespace-nowrap">{record.studentId}</TableCell>
                                        <TableCell className="whitespace-nowrap">{record.name}</TableCell>
                                        <TableCell className="whitespace-nowrap">{record.date}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={
                                                record.status === 'Present' ? 'default' :
                                                record.status === 'Late' ? 'secondary' : 'destructive'
                                            }>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
