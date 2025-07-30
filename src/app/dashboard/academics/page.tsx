
"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PlusCircle, ArrowUpDown, ChevronDown, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CreateAssignmentDialog } from "@/components/create-assignment-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const initialAssignments = [
    { id: 'A001', title: 'Algebra Homework 1', subject: 'Mathematics', dueDate: '2024-09-10', status: 'Pending' },
    { id: 'A002', title: 'World War II Essay', subject: 'History', dueDate: '2024-09-12', status: 'Submitted' },
    { id: 'A003', title: 'Lab Report: Photosynthesis', subject: 'Biology', dueDate: '2024-09-15', status: 'Graded' },
    { id: 'A004', title: 'Book Report: "To Kill a Mockingbird"', subject: 'English', dueDate: '2024-09-18', status: 'Pending' },
    { id: 'A005', title: 'Geometry Proofs', subject: 'Mathematics', dueDate: '2024-09-20', status: 'Submitted' },
    { id: 'A006', title: 'The Cold War Presentation', subject: 'History', dueDate: '2024-09-22', status: 'Graded' },
];

const initialResults = [
    { student: 'John Doe', class: '10-A', subject: 'Mathematics', examTitle: 'Mid-Term Mathematics', score: '95%', date: '2024-08-20' },
    { student: 'John Doe', class: '10-A', subject: 'History', examTitle: 'Mid-Term History', score: '88%', date: '2024-08-21' },
    { student: 'Jane Smith', class: '10-B', subject: 'Biology', examTitle: 'Mid-Term Biology', score: '92%', date: '2024-08-22' },
    { student: 'Jane Smith', class: '10-B', subject: 'English', examTitle: 'Mid-Term English', score: '97%', date: '2024-08-23' },
    { student: 'Peter Jones', class: '11-A', subject: 'Physics', examTitle: 'Final Physics', score: '72%', date: '2024-08-24' },
    { student: 'Mary Williams', class: '11-B', subject: 'Chemistry', examTitle: 'Final Chemistry', score: '85%', date: '2024-08-25' },
]

const initialExams = [
    { id: 'E001', title: 'Mid-Term Mathematics', class: '10-A', date: '2024-10-01' },
    { id: 'E002', title: 'Mid-Term History', class: '10-A', date: '2024-10-03' },
    { id: 'E003', title: 'Mid-Term Biology', class: '10-B', date: '2024-10-01' },
    { id: 'E004', title: 'Mid-Term English', class: '10-B', date: '2024-10-03' },
    { id: 'E005', title: 'Final Physics', class: '11-A', date: '2024-12-10' },
    { id: 'E006', title: 'Final Chemistry', class: '11-B', date: '2024-12-12' },
];


const STATUS_OPTIONS = ["Pending", "Submitted", "Graded"];
const CLASS_OPTIONS = ["10-A", "10-B", "11-A", "11-B"];
const EXAM_TITLE_OPTIONS = [...new Set(initialResults.map(r => r.examTitle))];
const ITEMS_PER_PAGE = 5;

type SortDirection = 'asc' | 'desc' | null;

const tagColors = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
];

export default function AcademicsPage() {
    const { toast } = useToast();

    // State for Assignments
    const [assignments, setAssignments] = useState(initialAssignments);
    const [assignmentSearch, setAssignmentSearch] = useState("");
    const [assignmentStatusFilters, setAssignmentStatusFilters] = useState<Record<string, boolean>>({ Pending: true, Submitted: true, Graded: true });
    const [assignmentSortColumn, setAssignmentSortColumn] = useState<string | null>(null);
    const [assignmentSortDirection, setAssignmentSortDirection] = useState<SortDirection>(null);
    const [assignmentCurrentPage, setAssignmentCurrentPage] = useState(1);
    
    // State for Results
    const [results, setResults] = useState(initialResults);
    const [resultSearch, setResultSearch] = useState("");
    const [resultClassFilters, setResultClassFilters] = useState<Record<string, boolean>>(CLASS_OPTIONS.reduce((acc, c) => ({...acc, [c]: true}), {}));
    const [resultExamFilter, setResultExamFilter] = useState<string>('All');
    const [resultSortColumn, setResultSortColumn] = useState<string | null>(null);
    const [resultSortDirection, setResultSortDirection] = useState<SortDirection>(null);
    const [resultCurrentPage, setResultCurrentPage] = useState(1);

    // State for Exams
    const [exams, setExams] = useState(initialExams);
    const [examSearch, setExamSearch] = useState("");
    const [examClassFilters, setExamClassFilters] = useState<Record<string, boolean>>(CLASS_OPTIONS.reduce((acc, c) => ({...acc, [c]: true}), {}));
    const [examSortColumn, setExamSortColumn] = useState<string | null>(null);
    const [examSortDirection, setExamSortDirection] = useState<SortDirection>(null);
    const [examCurrentPage, setExamCurrentPage] = useState(1);

    // Generic sort handler
    const handleSort = (column: string, sortColumn: any, setSortColumn: any, sortDirection: any, setSortDirection: any) => {
        if (sortColumn === column) {
            setSortDirection((prev: SortDirection) => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };
    
    // Generic filter toggle handler
    const toggleAllFilters = (options: string[], filters: Record<string, boolean>, setFilters: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
        const allSelected = options.every(option => filters[option]);
        const newFilters = options.reduce((acc, option) => ({ ...acc, [option]: !allSelected }), {});
        setFilters(newFilters);
    };

    // Generic sort icon renderer
    const renderSortIcon = (column: string, sortColumn: string | null, sortDirection: SortDirection) => {
        if (sortColumn !== column) {
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
        }
        if (sortDirection === 'asc') {
            return <ArrowUp className="ml-2 h-4 w-4 text-foreground" />;
        }
        return <ArrowDown className="ml-2 h-4 w-4 text-foreground" />;
    };

    // Memoized filtered and sorted data
    const filteredAssignments = useMemo(() => {
        let filtered = assignments.filter(item =>
            (item.title.toLowerCase().includes(assignmentSearch.toLowerCase()) || 
             item.subject.toLowerCase().includes(assignmentSearch.toLowerCase())) && 
             assignmentStatusFilters[item.status]
        );
        if (assignmentSortColumn && assignmentSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[assignmentSortColumn as keyof typeof a];
                const bValue = b[assignmentSortColumn as keyof typeof b];
                if (aValue < bValue) return assignmentSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return assignmentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [assignments, assignmentSearch, assignmentStatusFilters, assignmentSortColumn, assignmentSortDirection]);

    const filteredResults = useMemo(() => {
        const searchTermLower = resultSearch.toLowerCase();
        let filtered = results.filter(item =>
            (item.student.toLowerCase().includes(searchTermLower) ||
             item.class.toLowerCase().includes(searchTermLower) ||
             item.subject.toLowerCase().includes(searchTermLower) ||
             item.examTitle.toLowerCase().includes(searchTermLower) ||
             item.score.toLowerCase().includes(searchTermLower)) && 
             resultClassFilters[item.class] &&
             (resultExamFilter === 'All' || item.examTitle === resultExamFilter)
        );
         if (resultSortColumn && resultSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[resultSortColumn as keyof typeof a];
                const bValue = b[resultSortColumn as keyof typeof b];
                if (aValue < bValue) return resultSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return resultSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [results, resultSearch, resultClassFilters, resultSortColumn, resultSortDirection, resultExamFilter]);

    const filteredExams = useMemo(() => {
        const searchTermLower = examSearch.toLowerCase();
        let filtered = exams.filter(item => 
            (item.title.toLowerCase().includes(searchTermLower) ||
             item.class.toLowerCase().includes(searchTermLower)) && 
             examClassFilters[item.class]
        );
        if (examSortColumn && examSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[examSortColumn as keyof typeof a];
                const bValue = b[examSortColumn as keyof typeof b];
                if (aValue < bValue) return examSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return examSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [exams, examSearch, examClassFilters, examSortColumn, examSortDirection]);


    // Pagination logic
    const paginatedAssignments = filteredAssignments.slice((assignmentCurrentPage - 1) * ITEMS_PER_PAGE, assignmentCurrentPage * ITEMS_PER_PAGE);
    const totalAssignmentPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);

    const paginatedResults = filteredResults.slice((resultCurrentPage - 1) * ITEMS_PER_PAGE, resultCurrentPage * ITEMS_PER_PAGE);
    const totalResultPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    
    const paginatedExams = filteredExams.slice((examCurrentPage - 1) * ITEMS_PER_PAGE, examCurrentPage * ITEMS_PER_PAGE);
    const totalExamPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);

    const handleCreateAssignment = (data: any) => {
        const newAssignment = {
            id: `A${(assignments.length + 1).toString().padStart(3, '0')}`,
            title: data.title,
            subject: data.subject,
            dueDate: data.dueDate.toISOString().split('T')[0],
            status: 'Pending',
        };
        setAssignments(prev => [newAssignment, ...prev]);
        toast({
            title: "Assignment Created",
            description: `"${data.title}" has been successfully created.`,
            action: <CheckCircle className="text-green-500" />,
        })
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Academics</h1>
                <p className="text-muted-foreground">Manage assignments, results, and other academic information.</p>
            </div>
            <div className="max-w-full">
                <Tabs defaultValue="assignments">
                    <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                        <TabsTrigger value="exams">Exams</TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                    </TabsList>
                    <TabsContent value="assignments">
                        <Card>
                            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Assignments</CardTitle>
                                    <CardDescription>Manage and track student assignments.</CardDescription>
                                </div>
                                <CreateAssignmentDialog onAssignmentCreated={handleCreateAssignment}>
                                    <Button>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create Assignment
                                    </Button>
                                </CreateAssignmentDialog>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                                    <Input placeholder="Search by title or subject..." value={assignmentSearch} onChange={(e) => { setAssignmentSearch(e.target.value); setAssignmentCurrentPage(1); }} className="max-w-sm" />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="ml-auto">
                                                Filter by Status <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => toggleAllFilters(STATUS_OPTIONS, assignmentStatusFilters, setAssignmentStatusFilters)}>
                                                {STATUS_OPTIONS.every(s => assignmentStatusFilters[s]) ? 'Unselect All' : 'Select All'}
                                            </DropdownMenuItem>
                                            {STATUS_OPTIONS.map(status => (
                                                <DropdownMenuCheckboxItem key={status} checked={assignmentStatusFilters[status]} onCheckedChange={(checked) => { setAssignmentStatusFilters(prev => ({...prev, [status]: !!checked})); setAssignmentCurrentPage(1); }}>{status}</DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead><Button variant="ghost" onClick={() => handleSort('title', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Title {renderSortIcon('title', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('subject', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Subject {renderSortIcon('subject', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('dueDate', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Due Date {renderSortIcon('dueDate', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedAssignments.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.title}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{item.subject}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{item.dueDate}</TableCell>
                                                    <TableCell><Badge variant={item.status === 'Graded' ? 'default' : item.status === 'Submitted' ? 'secondary' : 'outline'}>{item.status}</Badge></TableCell>
                                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Upload className="h-4 w-4" /></Button></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {paginatedAssignments.length === 0 && <div className="text-center py-10 text-muted-foreground">No assignments found.</div>}
                                </div>
                                 <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-muted-foreground">Page {assignmentCurrentPage} of {totalAssignmentPages}</div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setAssignmentCurrentPage(prev => Math.max(prev - 1, 1))} disabled={assignmentCurrentPage === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => setAssignmentCurrentPage(prev => Math.min(prev + 1, totalAssignmentPages))} disabled={assignmentCurrentPage === totalAssignmentPages}>Next</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="exams">
                         <Card>
                            <CardHeader>
                                <CardTitle>Exam Schedule</CardTitle>
                                <CardDescription>View upcoming exam dates and details.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                                    <Input placeholder="Search by title or class..." value={examSearch} onChange={(e) => { setExamSearch(e.target.value); setExamCurrentPage(1); }} className="max-w-sm" />
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="ml-auto">
                                                Filter by Class <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => toggleAllFilters(CLASS_OPTIONS, examClassFilters, setExamClassFilters)}>
                                                {CLASS_OPTIONS.every(c => examClassFilters[c]) ? 'Unselect All' : 'Select All'}
                                            </DropdownMenuItem>
                                            {CLASS_OPTIONS.map(c => (
                                                <DropdownMenuCheckboxItem key={c} checked={examClassFilters[c]} onCheckedChange={(checked) => { setExamClassFilters(prev => ({...prev, [c]: !!checked})); setExamCurrentPage(1); }}>{c}</DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                 <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead><Button variant="ghost" onClick={() => handleSort('title', examSortColumn, setExamSortColumn, examSortDirection, setExamSortDirection)}>Exam Title {renderSortIcon('title', examSortColumn, examSortDirection)}</Button></TableHead>
                                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('class', examSortColumn, setExamSortColumn, examSortDirection, setExamSortDirection)}>Class {renderSortIcon('class', examSortColumn, examSortDirection)}</Button></TableHead>
                                                <TableHead><Button variant="ghost" onClick={() => handleSort('date', examSortColumn, setExamSortColumn, examSortDirection, setExamSortDirection)}>Date {renderSortIcon('date', examSortColumn, examSortDirection)}</Button></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedExams.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.title}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{item.class}</TableCell>
                                                    <TableCell>{item.date}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {paginatedExams.length === 0 && <div className="text-center py-10 text-muted-foreground">No exams found.</div>}
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-muted-foreground">Page {examCurrentPage} of {totalExamPages}</div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setExamCurrentPage(prev => Math.max(prev - 1, 1))} disabled={examCurrentPage === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => setExamCurrentPage(prev => Math.min(prev + 1, totalExamPages))} disabled={examCurrentPage === totalExamPages}>Next</Button>
                                    </div>
                                </div>
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
                                <div className="space-y-4 mb-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <Input placeholder="Search results..." value={resultSearch} onChange={(e) => { setResultSearch(e.target.value); setResultCurrentPage(1); }} className="max-w-sm" />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="ml-auto">
                                                    Filter by Class <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => toggleAllFilters(CLASS_OPTIONS, resultClassFilters, setResultClassFilters)}>
                                                    {CLASS_OPTIONS.every(c => resultClassFilters[c]) ? 'Unselect All' : 'Select All'}
                                                </DropdownMenuItem>
                                                {CLASS_OPTIONS.map(c => (
                                                    <DropdownMenuCheckboxItem key={c} checked={resultClassFilters[c]} onCheckedChange={(checked) => { setResultClassFilters(prev => ({...prev, [c]: !!checked})); setResultCurrentPage(1); }}>{c}</DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap mt-4">
                                        <Badge
                                            onClick={() => setResultExamFilter('All')}
                                            className={cn("cursor-pointer", resultExamFilter !== 'All' && "bg-muted text-muted-foreground hover:bg-muted/80")}
                                        >
                                            All
                                        </Badge>
                                        {EXAM_TITLE_OPTIONS.map((title, index) => (
                                            <Badge
                                                key={title}
                                                onClick={() => setResultExamFilter(title)}
                                                className={cn(
                                                    "cursor-pointer",
                                                    resultExamFilter === title ? `border-2 border-primary-foreground/50 ${tagColors[index % tagColors.length]}` : `bg-muted text-muted-foreground hover:bg-muted/80 ${tagColors[index % tagColors.length]} opacity-70`
                                                )}
                                            >
                                                {title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                 <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead><Button variant="ghost" onClick={() => handleSort('student', resultSortColumn, setResultSortColumn, resultSortDirection, setResultSortDirection)}>Student {renderSortIcon('student', resultSortColumn, resultSortDirection)}</Button></TableHead>
                                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('class', resultSortColumn, setResultSortColumn, resultSortDirection, setResultSortDirection)}>Class {renderSortIcon('class', resultSortColumn, resultSortDirection)}</Button></TableHead>
                                                <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('subject', resultSortColumn, setResultSortColumn, resultSortDirection, setResultSortDirection)}>Subject {renderSortIcon('subject', resultSortColumn, resultSortDirection)}</Button></TableHead>
                                                <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('examTitle', resultSortColumn, setResultSortColumn, resultSortDirection, setResultSortDirection)}>Exam Title {renderSortIcon('examTitle', resultSortColumn, resultSortDirection)}</Button></TableHead>
                                                <TableHead>Score</TableHead>
                                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', resultSortColumn, setResultSortColumn, resultSortDirection, setResultSortDirection)}>Date {renderSortIcon('date', resultSortColumn, resultSortDirection)}</Button></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedResults.map(item => (
                                                <TableRow key={item.student + item.subject + item.examTitle}>
                                                    <TableCell className="font-medium">{item.student}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{item.class}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{item.subject}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{item.examTitle}</TableCell>
                                                    <TableCell>{item.score}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{item.date}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {paginatedResults.length === 0 && <div className="text-center py-10 text-muted-foreground">No results found.</div>}
                                </div>
                                 <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-muted-foreground">Page {resultCurrentPage} of {totalResultPages}</div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setResultCurrentPage(prev => Math.max(prev - 1, 1))} disabled={resultCurrentPage === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => setResultCurrentPage(prev => Math.min(prev + 1, totalResultPages))} disabled={resultCurrentPage === totalResultPages}>Next</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
