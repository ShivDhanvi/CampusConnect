import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, PlusCircle, Upload } from "lucide-react";

const assignments = [
    { id: 'A001', title: 'Algebra Homework 1', subject: 'Mathematics', dueDate: '2024-09-10', status: 'Pending' },
    { id: 'A002', title: 'World War II Essay', subject: 'History', dueDate: '2024-09-12', status: 'Submitted' },
    { id: 'A003', title: 'Lab Report: Photosynthesis', subject: 'Biology', dueDate: '2024-09-15', status: 'Graded' },
    { id: 'A004', title: 'Book Report: "To Kill a Mockingbird"', subject: 'English', dueDate: '2024-09-18', status: 'Pending' },
];

const results = [
    { student: 'John Doe', subject: 'Mathematics', grade: 'A', score: '95%', date: '2024-08-20' },
    { student: 'John Doe', subject: 'History', grade: 'B+', score: '88%', date: '2024-08-21' },
    { student: 'Jane Smith', subject: 'Biology', grade: 'A-', score: '92%', date: '2024-08-22' },
    { student: 'Jane Smith', subject: 'English', grade: 'A', score: '97%', date: '2024-08-23' },
]

export default function AcademicsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Academics</h1>
                <p className="text-muted-foreground">Manage assignments, results, and other academic information.</p>
            </div>
            <Tabs defaultValue="assignments">
                <TabsList>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="assignments">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Assignments</CardTitle>
                                <CardDescription>Manage and track student assignments.</CardDescription>
                            </div>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Assignment
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignments.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell>{item.subject}</TableCell>
                                            <TableCell>{item.dueDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    item.status === 'Graded' ? 'default' :
                                                    item.status === 'Submitted' ? 'secondary' : 'outline'
                                                }>{item.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="results">
                     <Card>
                        <CardHeader>
                            <CardTitle>Student Results</CardTitle>
                            <CardDescription>View and manage student grades.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.map(item => (
                                        <TableRow key={item.student + item.subject}>
                                            <TableCell className="font-medium">{item.student}</TableCell>
                                            <TableCell>{item.subject}</TableCell>
                                            <TableCell>
                                                <Badge>{item.grade}</Badge>
                                            </TableCell>
                                            <TableCell>{item.score}</TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
