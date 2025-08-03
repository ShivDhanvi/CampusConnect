
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PlusCircle, ArrowUpDown, ChevronDown, CheckCircle, ArrowUp, ArrowDown, Sparkles, MoreHorizontal, MessageSquare, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CreateAssignmentDialog } from "@/components/create-assignment-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { differenceInDays, isPast, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getConversations, addConversation } from "@/lib/messages";


const initialAssignments = [
    { id: 'A001', title: 'Algebra Homework 1', subject: 'Mathematics', dueDate: '2024-09-10', class: '10-A' },
    { id: 'A002', title: 'World War II Essay', subject: 'History', dueDate: '2024-09-12', class: '10-A' },
    { id: 'A003', title: 'Lab Report: Photosynthesis', subject: 'Biology', dueDate: '2024-09-15', class: '10-B' },
    { id: 'A004', title: 'Book Report: "To Kill a Mockingbird"', subject: 'English', dueDate: '2024-09-18', class: '10-B' },
    { id: 'A005', title: 'Geometry Proofs', subject: 'Mathematics', dueDate: '2024-09-20', class: '11-A' },
    { id: 'A006', title: 'The Cold War Presentation', subject: 'History', dueDate: '2024-09-22', class: '11-A' },
    { id: 'A007', title: 'Wave Optics Problems', subject: 'Physics', dueDate: '2024-09-25', class: '11-A' },
    // Add an assignment with a past due date for testing 'Late' status
    { id: 'A008', title: 'Chemical Reactions Worksheet', subject: 'Chemistry', dueDate: '2024-08-01', class: '11-B' },
];

const students = {
    '10-A': [{ id: 'S-1024', name: 'John Doe', initials: 'JD' }],
    '10-B': [{ id: 'S-0987', name: 'Jane Smith', initials: 'JS' }],
    '11-A': [{ id: 'S-1152', name: 'Peter Jones', initials: 'PJ' }],
    '11-B': [{ id: 'S-1056', name: 'Mary Williams', initials: 'MW' }],
}

// Create a more realistic set of student submissions
const initialStudentAssignments = [
    // Teacher's subjects: Mathematics, Biology, Physics
    { studentId: 'S-1024', studentName: 'John Doe', initials: 'JD', assignmentId: 'A001', title: 'Algebra Homework 1', subject: 'Mathematics', dueDate: '2024-09-10', class: '10-A', status: 'Submitted' },
    // Make this one pending for the teacher to see
    { studentId: 'S-1152', studentName: 'Peter Jones', initials: 'PJ', assignmentId: 'A001', title: 'Algebra Homework 1', subject: 'Mathematics', dueDate: '2024-09-10', class: '10-A', status: 'Pending' },
    { studentId: 'S-0987', studentName: 'Jane Smith', initials: 'JS', assignmentId: 'A003', title: 'Lab Report: Photosynthesis', subject: 'Biology', dueDate: '2024-09-15', class: '10-B', status: 'Graded' },
    // Make this one have a past due date to test "Late" status
    { studentId: 'S-1152', studentName: 'Peter Jones', initials: 'PJ', assignmentId: 'A005', title: 'Geometry Proofs', subject: 'Mathematics', dueDate: '2024-08-15', class: '11-A', status: 'Pending' },
    { studentId: 'S-1152', studentName: 'Peter Jones', initials: 'PJ', assignmentId: 'A007', title: 'Wave Optics Problems', subject: 'Physics', dueDate: '2024-09-25', class: '11-A', status: 'Submitted' },

    // Other subjects for student view
    { studentId: 'S-1024', studentName: 'John Doe', initials: 'JD', assignmentId: 'A002', title: 'World War II Essay', subject: 'History', dueDate: '2024-09-12', class: '10-A', status: 'Submitted' },
    { studentId: 'S-0987', studentName: 'Jane Smith', initials: 'JS', assignmentId: 'A004', title: 'Book Report: "To Kill a Mockingbird"', subject: 'English', dueDate: '2024-09-18', class: '10-B', status: 'Pending' },
    { studentId: 'S-1024', studentName: 'John Doe', initials: 'JD', assignmentId: 'A008', title: 'Chemical Reactions Worksheet', subject: 'Chemistry', dueDate: '2024-08-01', class: '11-B', status: 'Pending' },
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


const STATUS_OPTIONS = ["Pending", "Submitted", "Graded", "Late"];
const ALL_CLASS_OPTIONS = ["10-A", "10-B", "11-A", "11-B"];
const TEACHER_CLASSES = ['10-A', '10-B', '11-A']; // For teacher role
const TEACHER_SUBJECTS = ['Mathematics', 'Biology', 'Physics']; // For teacher role
const EXAM_TITLE_OPTIONS = [...new Set(initialResults.map(r => r.examTitle))];
const ITEMS_PER_PAGE = 5;
const STUDENT_CLASS = '10-A'; // For student role
const STUDENT_ID = 'S-1024'; // For student role
const STUDENT_NAME = 'John Doe'; // For student role
const TEACHER_ID = 'teacher1'; // For messaging

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
    const [userRole, setUserRole] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAssignment, setUploadingAssignment] = useState<{ studentId: string, assignmentId: string, dueDate: string } | null>(null);

    // State for Assignments
    const [assignments, setAssignments] = useState(initialStudentAssignments);
    const [assignmentSearch, setAssignmentSearch] = useState("");
    const [assignmentStatusFilters, setAssignmentStatusFilters] = useState<Record<string, boolean>>({ Pending: true, Submitted: true, Graded: true, Late: true });
    const [assignmentSortColumn, setAssignmentSortColumn] = useState<string | null>(null);
    const [assignmentSortDirection, setAssignmentSortDirection] = useState<SortDirection>(null);
    const [assignmentCurrentPage, setAssignmentCurrentPage] = useState(1);
    
    // State for Results
    const [results, setResults] = useState(initialResults);
    const [resultSearch, setResultSearch] = useState("");
    const [resultClassOptions, setResultClassOptions] = useState(ALL_CLASS_OPTIONS);
    const [resultClassFilters, setResultClassFilters] = useState<Record<string, boolean>>(ALL_CLASS_OPTIONS.reduce((acc, c) => ({...acc, [c]: true}), {}));
    const [resultExamFilter, setResultExamFilter] = useState<string>('All');
    const [resultSortColumn, setResultSortColumn] = useState<string | null>(null);
    const [resultSortDirection, setResultSortDirection] = useState<SortDirection>(null);
    const [resultCurrentPage, setResultCurrentPage] = useState(1);

    // State for Exams
    const [exams, setExams] = useState(initialExams);
    const [examSearch, setExamSearch] = useState("");
    const [examClassOptions, setExamClassOptions] = useState(ALL_CLASS_OPTIONS);
    const [examClassFilters, setExamClassFilters] = useState<Record<string, boolean>>(ALL_CLASS_OPTIONS.reduce((acc, c) => ({...acc, [c]: true}), {}));
    const [examSortColumn, setExamSortColumn] = useState<string | null>(null);
    const [examSortDirection, setExamSortDirection] = useState<SortDirection>(null);
    const [examCurrentPage, setExamCurrentPage] = useState(1);
    
    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
         if (role === 'teacher') {
            const uniqueTeacherClasses = [...new Set(initialStudentAssignments.filter(a => TEACHER_SUBJECTS.includes(a.subject)).map(a => a.class))];
            setExamClassOptions(uniqueTeacherClasses);
            setResultClassOptions(uniqueTeacherClasses);
            setExamClassFilters(uniqueTeacherClasses.reduce((acc, c) => ({...acc, [c]: true}), {}));
            setResultClassFilters(uniqueTeacherClasses.reduce((acc, c) => ({...acc, [c]: true}), {}));
        } else {
            setExamClassOptions(ALL_CLASS_OPTIONS);
            setResultClassOptions(ALL_CLASS_OPTIONS);
            setExamClassFilters(ALL_CLASS_OPTIONS.reduce((acc, c) => ({...acc, [c]: true}), {}));
            setResultClassFilters(ALL_CLASS_OPTIONS.reduce((acc, c) => ({...acc, [c]: true}), {}));
        }
    }, []);

    const getStatus = (status: string, dueDate: string) => {
        if (status === 'Pending' && isPast(parseISO(dueDate))) {
            return 'Late';
        }
        return status;
    }

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
        let filtered = assignments.filter(item => {
            const searchMatch = (
                item.title.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
                item.subject.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
                (userRole === 'teacher' && item.studentName.toLowerCase().includes(assignmentSearch.toLowerCase()))
            );
            const itemStatus = getStatus(item.status, item.dueDate);
            const statusMatch = assignmentStatusFilters[itemStatus];
            
            if(userRole === 'teacher') {
                const classMatch = TEACHER_CLASSES.includes(item.class);
                const subjectMatch = TEACHER_SUBJECTS.includes(item.subject);
                return searchMatch && statusMatch && classMatch && subjectMatch;
            }
            if(userRole === 'student') {
                return item.studentId === STUDENT_ID && searchMatch && statusMatch;
            }
            // Admin view
            return searchMatch && statusMatch;
        });

        if (assignmentSortColumn && assignmentSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[assignmentSortColumn as keyof typeof a];
                const bValue = b[assignmentSortColumn as keyof typeof b];
                if (assignmentSortColumn === 'status') {
                    const aStatus = getStatus(a.status, a.dueDate);
                    const bStatus = getStatus(b.status, b.dueDate);
                     if (aStatus < bStatus) return assignmentSortDirection === 'asc' ? -1 : 1;
                    if (aStatus > bStatus) return assignmentSortDirection === 'asc' ? 1 : -1;
                    return 0;
                }
                if (aValue < bValue) return assignmentSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return assignmentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [assignments, assignmentSearch, assignmentStatusFilters, assignmentSortColumn, assignmentSortDirection, userRole]);

    const filteredResults = useMemo(() => {
        const searchTermLower = resultSearch.toLowerCase();
        let filtered = results.filter(item => {
            const isStudentMatch = userRole === 'student' ? item.student === STUDENT_NAME : true;
            let isClassMatch = true;
            if (userRole === 'student') isClassMatch = item.class === STUDENT_CLASS;
            else if (userRole === 'teacher') isClassMatch = TEACHER_CLASSES.includes(item.class) && resultClassFilters[item.class];
            else isClassMatch = resultClassFilters[item.class];


            return (item.student.toLowerCase().includes(searchTermLower) ||
             item.class.toLowerCase().includes(searchTermLower) ||
             item.subject.toLowerCase().includes(searchTermLower) ||
             item.examTitle.toLowerCase().includes(searchTermLower) ||
             item.score.toLowerCase().includes(searchTermLower)) && 
             isClassMatch &&
             isStudentMatch &&
             (resultExamFilter === 'All' || item.examTitle === resultExamFilter);
        });
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
    }, [results, resultSearch, resultClassFilters, resultSortColumn, resultSortDirection, resultExamFilter, userRole]);

    const filteredExams = useMemo(() => {
        const searchTermLower = examSearch.toLowerCase();
        let filtered = exams.filter(item => {
             let isClassMatch = true;
            if (userRole === 'student') isClassMatch = item.class === STUDENT_CLASS;
            else if (userRole === 'teacher') isClassMatch = TEACHER_CLASSES.includes(item.class) && examClassFilters[item.class];
            else isClassMatch = examClassFilters[item.class];

            return (item.title.toLowerCase().includes(searchTermLower) ||
             item.class.toLowerCase().includes(searchTermLower)) && 
             isClassMatch;
        });

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
    }, [exams, examSearch, examClassFilters, examSortColumn, examSortDirection, userRole]);


    // Pagination logic
    const paginatedAssignments = filteredAssignments.slice((assignmentCurrentPage - 1) * ITEMS_PER_PAGE, assignmentCurrentPage * ITEMS_PER_PAGE);
    const totalAssignmentPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);

    const paginatedResults = filteredResults.slice((resultCurrentPage - 1) * ITEMS_PER_PAGE, resultCurrentPage * ITEMS_PER_PAGE);
    const totalResultPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    
    const paginatedExams = filteredExams.slice((examCurrentPage - 1) * ITEMS_PER_PAGE, examCurrentPage * ITEMS_PER_PAGE);
    const totalExamPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);

    const handleCreateAssignment = (data: any) => {
        const newAssignmentId = `A${(initialAssignments.length + 1).toString().padStart(3, '0')}`;
        
        // This is a simplified logic. In a real app, you'd have a list of all students.
        // Here, we add the assignment for students in the target classes.
        const studentsToAssign = Object.entries(students)
            .filter(([className]) => TEACHER_CLASSES.includes(className))
            .flatMap(([, studentList]) => studentList);
        
        const newSubmissions = studentsToAssign.map(student => ({
            studentId: student.id,
            studentName: student.name,
            initials: student.initials,
            assignmentId: newAssignmentId,
            title: data.title,
            subject: data.subject,
            dueDate: data.dueDate.toISOString().split('T')[0],
            status: 'Pending',
            class: '10-A' // This should be dynamic based on student class
        }));

        setAssignments(prev => [...newSubmissions, ...prev]);
        initialAssignments.push({
            id: newAssignmentId,
            title: data.title,
            subject: data.subject,
            dueDate: data.dueDate.toISOString().split('T')[0],
            class: '10-A', // This should be dynamic
        });

        toast({
            title: "Assignment Created",
            description: `"${data.title}" has been successfully created.`,
            action: <CheckCircle className="text-green-500" />,
        })
    };

    const handleUploadClick = (studentId: string, assignmentId: string, dueDate: string) => {
        setUploadingAssignment({ studentId, assignmentId, dueDate });
        fileInputRef.current?.click();
    };
    
    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0 && uploadingAssignment) {
            const { studentId, assignmentId, dueDate } = uploadingAssignment;

            const isLate = isPast(parseISO(dueDate));

            setAssignments(prev => prev.map(item =>
                item.studentId === studentId && item.assignmentId === assignmentId 
                ? { ...item, status: 'Submitted' } 
                : item
            ));
            
            const currentPoints = parseInt(localStorage.getItem('streakPoints') || '0', 10);
            if (!isLate) {
                toast({
                    title: "Streak Point Earned!",
                    description: "Great job submitting on time. Keep it up!",
                    action: <Sparkles className="text-yellow-500" />,
                });
                localStorage.setItem('streakPoints', (currentPoints + 1).toString());
            } else {
                 toast({
                    title: "Assignment Submitted Late",
                    description: "Your assignment has been submitted, but 1 streak point was deducted.",
                    action: <AlertTriangle className="text-destructive" />,
                });
                localStorage.setItem('streakPoints', Math.max(0, currentPoints - 1).toString());
            }
             window.dispatchEvent(new Event('storage'));
        }
        // Reset state and file input
        setUploadingAssignment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
     const handleMarkAsGraded = (studentId: string, assignmentId: string) => {
        setAssignments(prev => prev.map(item =>
            item.studentId === studentId && item.assignmentId === assignmentId 
            ? { ...item, status: 'Graded' } 
            : item
        ));
        toast({
            title: "Assignment Marked as Graded",
            description: "The assignment status has been updated.",
            action: <CheckCircle className="text-green-500" />,
        });
    };

    const handleSendReminder = (student: { id: string, name: string }, assignment: { title: string }) => {
        const conversations = getConversations();
        const existingConv = conversations.find(c => 
            c.type === 'dm' && c.participants.includes(student.id) && c.participants.includes(TEACHER_ID)
        );

        const reminderMessage = `Hi ${student.name}, this is a reminder that the assignment "${assignment.title}" is due. Please submit it as soon as possible.`;

        if (existingConv) {
            existingConv.messages.push({
                id: `msg${Date.now()}`,
                sender: TEACHER_ID,
                text: reminderMessage,
                timestamp: new Date()
            });
            addConversation(existingConv, true);
        } else {
             const newConversation = {
                id: `conv${Date.now()}`,
                type: 'dm',
                participants: [TEACHER_ID, student.id],
                messages: [{ id: `msg${Date.now()}`, sender: TEACHER_ID, text: reminderMessage, timestamp: new Date() }],
                lastMessage: reminderMessage,
                lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 1,
                pinned: false,
            };
            addConversation(newConversation);
        }

        toast({
            title: "Reminder Sent",
            description: `A message has been sent to ${student.name}.`,
            action: <MessageSquare className="text-blue-500" />,
        });
    };
    
    return (
        <div className="space-y-8">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelected} 
                className="hidden" 
                accept=".docx,.pdf,.png,.jpeg,.jpg"
            />
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
                                {(userRole === 'admin' || userRole === 'teacher') && (
                                    <CreateAssignmentDialog onAssignmentCreated={handleCreateAssignment}>
                                        <Button>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Create Assignment
                                        </Button>
                                    </CreateAssignmentDialog>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                                    <Input 
                                      placeholder={userRole === 'teacher' ? "Search by title, subject, or student..." : "Search by title or subject..."} 
                                      value={assignmentSearch} onChange={(e) => { setAssignmentSearch(e.target.value); setAssignmentCurrentPage(1); }} 
                                      className="max-w-sm" 
                                    />
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
                                                {userRole === 'teacher' ? (
                                                     <>
                                                        <TableHead><Button variant="ghost" onClick={() => handleSort('studentName', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Student {renderSortIcon('studentName', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                        <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('title', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Assignment {renderSortIcon('title', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                        <TableHead><Button variant="ghost" onClick={() => handleSort('dueDate', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Due Date {renderSortIcon('dueDate', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableHead><Button variant="ghost" onClick={() => handleSort('title', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Title {renderSortIcon('title', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                        <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('subject', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Subject {renderSortIcon('subject', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                        <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('dueDate', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Due Date {renderSortIcon('dueDate', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                    </>
                                                )}
                                                <TableHead><Button variant="ghost" onClick={() => handleSort('status', assignmentSortColumn, setAssignmentSortColumn, assignmentSortDirection, setAssignmentSortDirection)}>Status {renderSortIcon('status', assignmentSortColumn, assignmentSortDirection)}</Button></TableHead>
                                                {userRole !== 'admin' && <TableHead className="text-right">Actions</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedAssignments.map(item => {
                                                const itemStatus = getStatus(item.status, item.dueDate);
                                                return (
                                                <TableRow key={item.studentId + item.assignmentId}>
                                                   {userRole === 'teacher' ? (
                                                        <>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                                                        <AvatarImage src={`https://placehold.co/32x32.png`} alt={item.studentName} data-ai-hint="user avatar" />
                                                                        <AvatarFallback>{item.initials}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="font-medium">{item.studentName}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                <div>{item.title}</div>
                                                                <div className="text-xs text-muted-foreground">{item.subject}</div>
                                                            </TableCell>
                                                            <TableCell>{item.dueDate}</TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell className="font-medium">{item.title}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{item.subject}</TableCell>
                                                            <TableCell className="hidden sm:table-cell">{item.dueDate}</TableCell>
                                                        </>
                                                    )}
                                                    <TableCell><Badge variant={itemStatus === 'Graded' ? 'default' : itemStatus === 'Submitted' ? 'secondary' : itemStatus === 'Late' ? 'destructive' : 'outline'}>{itemStatus}</Badge></TableCell>
                                                    {userRole !== 'admin' && (
                                                        <TableCell className="text-right">
                                                            {userRole === 'student' && (itemStatus === 'Pending' || itemStatus === 'Late') && (
                                                                <Button variant="ghost" size="icon" onClick={() => handleUploadClick(item.studentId, item.assignmentId, item.dueDate)}>
                                                                    <Upload className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            {userRole === 'student' && itemStatus === 'Submitted' && (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleUploadClick(item.studentId, item.assignmentId, item.dueDate)}>
                                                                            Re-upload
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )}
                                                            {userRole === 'teacher' && (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        {(itemStatus === 'Pending' || itemStatus === 'Late') && (
                                                                            <DropdownMenuItem onClick={() => handleSendReminder({ id: item.studentId, name: item.studentName }, { title: item.title })}>
                                                                                <MessageSquare className="mr-2 h-4 w-4" /> Send Reminder
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {itemStatus === 'Submitted' && (
                                                                            <DropdownMenuItem onClick={() => handleMarkAsGraded(item.studentId, item.assignmentId)}>
                                                                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Graded
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                         {itemStatus !== 'Submitted' && itemStatus !== 'Graded' && <DropdownMenuItem disabled>Mark as Graded</DropdownMenuItem>}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )})}
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
                                     {(userRole === 'admin' || (userRole === 'teacher' && examClassOptions.length > 1)) && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="ml-auto">
                                                    Filter by Class <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => toggleAllFilters(examClassOptions, examClassFilters, setExamClassFilters)}>
                                                    {examClassOptions.every(c => examClassFilters[c]) ? 'Unselect All' : 'Select All'}
                                                </DropdownMenuItem>
                                                {examClassOptions.map(c => (
                                                    <DropdownMenuCheckboxItem key={c} checked={examClassFilters[c]} onCheckedChange={(checked) => { setExamClassFilters(prev => ({...prev, [c]: !!checked})); setExamCurrentPage(1); }}>{c}</DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                     )}
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
                                        {(userRole === 'admin' || (userRole === 'teacher' && resultClassOptions.length > 1)) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="ml-auto">
                                                        Filter by Class <ChevronDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => toggleAllFilters(resultClassOptions, resultClassFilters, setResultClassFilters)}>
                                                        {resultClassOptions.every(c => resultClassFilters[c]) ? 'Unselect All' : 'Select All'}
                                                    </DropdownMenuItem>
                                                    {resultClassOptions.map(c => (
                                                        <DropdownMenuCheckboxItem key={c} checked={resultClassFilters[c]} onCheckedChange={(checked) => { setResultClassFilters(prev => ({...prev, [c]: !!checked})); setResultCurrentPage(1); }}>{c}</DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
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
                                        <Button variant="outline" size="sm" onClick={() => setResultCurrentPage(prev => Math.min(prev + 1, totalResultPages))} disabled={resultCurrentPage === totalPages}>Next</Button>
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
