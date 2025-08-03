
"use client";

import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, ArrowUpDown, ChevronDown, Calendar as CalendarIcon, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { addDays, format, isToday } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const today = new Date();
const initialStudentAttendanceData = [
  { id: 1, studentId: 'S-1024', name: 'John Doe', class: '10-A', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { id: 2, studentId: 'S-1024', name: 'John Doe', class: '10-A', date: format(addDays(today, -1), 'yyyy-MM-dd'), status: 'Present' },
  { id: 3, studentId: 'S-1024', name: 'John Doe', class: '10-A', date: format(addDays(today, -2), 'yyyy-MM-dd'), status: 'Late' },
  { id: 4, studentId: 'S-1024', name: 'John Doe', class: '10-A', date: format(addDays(today, -3), 'yyyy-MM-dd'), status: 'Present' },
  { id: 5, studentId: 'S-1024', name: 'John Doe', class: '10-A', date: format(addDays(today, -4), 'yyyy-MM-dd'), status: 'Absent' },
  { id: 6, studentId: 'S-0987', name: 'Jane Smith', class: '10-B', date: format(today, 'yyyy-MM-dd'), status: 'Absent' },
  { id: 7, studentId: 'S-1152', name: 'Peter Jones', class: '11-A', date: format(addDays(today, -1), 'yyyy-MM-dd'), status: 'Present' },
  { id: 8, studentId: 'S-1056', name: 'Mary Williams', class: '11-B', date: format(addDays(today, -8), 'yyyy-MM-dd'), status: 'Late' },
  { id: 9, studentId: 'S-1025', name: 'David Brown', class: '10-A', date: format(addDays(today, -32), 'yyyy-MM-dd'), status: 'Present' },
  { id: 10, studentId: 'S-0988', name: 'Emily Davis', class: '10-B', date: format(addDays(today, -100), 'yyyy-MM-dd'), status: 'Present' },
];

const initialTeacherAttendanceData = [
  { id: 1, teacherId: 'T-001', name: 'Mr. Smith', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { id: 2, teacherId: 'T-002', name: 'Mrs. Jones', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { id: 3, teacherId: 'T-003', name: 'Mr. Davis', date: format(addDays(today, -5), 'yyyy-MM-dd'), status: 'Absent' },
];

const initialStaffAttendanceData = [
  { id: 1, staffId: 'ST-01', name: 'Admin Clerk', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { id: 2, staffId: 'ST-02', name: 'Librarian', date: format(addDays(today, -3), 'yyyy-MM-dd'), status: 'Late' },
];

const ALL_CLASS_OPTIONS = ["All", "10-A", "10-B", "11-A", "11-B"];
const TEACHER_CLASSES = ['10-A', '10-B'];
const ITEMS_PER_PAGE = 5;
const STUDENT_NAME = 'John Doe';
type SortDirection = 'asc' | 'desc' | null;
const STATUS_OPTIONS = ["Present", "Absent", "Late", "Holiday"];

const exportToCsv = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) {
        return;
    }
    const header = Object.keys(rows[0]).filter(key => key !== 'id');
    const csvContent = [
        header.join(','),
        ...rows.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


export default function AttendancePage() {
    const { toast } = useToast();
    const [userRole, setUserRole] = useState<string | null>(null);

    // State for data
    const [studentAttendance, setStudentAttendance] = useState(initialStudentAttendanceData);
    const [teacherAttendance, setTeacherAttendance] = useState(initialTeacherAttendanceData);
    const [staffAttendance, setStaffAttendance] = useState(initialStaffAttendanceData);

    // Common state
    const [timeframe, setTimeframe] = useState("today");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: today, to: today });

    // Students state
    const [studentSearch, setStudentSearch] = useState("");
    const [studentClassFilter, setStudentClassFilter] = useState("All");
    const [studentSortColumn, setStudentSortColumn] = useState<string | null>(null);
    const [studentSortDirection, setStudentSortDirection] = useState<SortDirection>(null);
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);
    const [studentClassOptions, setStudentClassOptions] = useState(ALL_CLASS_OPTIONS);

    // Teachers state
    const [teacherSearch, setTeacherSearch] = useState("");
    const [teacherSortColumn, setTeacherSortColumn] = useState<string | null>(null);
    const [teacherSortDirection, setTeacherSortDirection] = useState<SortDirection>(null);
    const [teacherCurrentPage, setTeacherCurrentPage] = useState(1);

    // Staff state
    const [staffSearch, setStaffSearch] = useState("");
    const [staffSortColumn, setStaffSortColumn] = useState<string | null>(null);
    const [staffSortDirection, setStaffSortDirection] = useState<SortDirection>(null);
    const [staffCurrentPage, setStaffCurrentPage] = useState(1);
    
     useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
        if (role === 'teacher') {
            setStudentClassOptions(['All', ...TEACHER_CLASSES]);
        } else {
            setStudentClassOptions(ALL_CLASS_OPTIONS);
        }
    }, []);

    useEffect(() => {
        const now = new Date();
        let fromDate;
        switch (timeframe) {
            case "today":
                fromDate = now;
                break;
            case "7":
                fromDate = addDays(now, -7);
                break;
            case "30":
                fromDate = addDays(now, -30);
                break;
            case "90":
                fromDate = addDays(now, -90);
                break;
            case "custom":
                return; // For custom, the calendar will set the date
            default:
                fromDate = now;
        }
        setDateRange({ from: fromDate, to: now });
    }, [timeframe]);

    const handleSort = (column: string, sortColumn: any, setSortColumn: any, sortDirection: any, setSortDirection: any) => {
        if (sortColumn === column) {
            setSortDirection((prev: SortDirection) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: string, sortColumn: string | null, sortDirection: SortDirection) => {
        if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        if (sortDirection === 'asc') return <ArrowUp className="ml-2 h-4 w-4 text-foreground" />;
        return <ArrowDown className="ml-2 h-4 w-4 text-foreground" />;
    };
    
    const filterByTimeframe = (data: any[]) => {
        if (!dateRange?.from) return data;
        const from = dateRange.from.setHours(0,0,0,0);
        const to = (dateRange.to ?? dateRange.from).setHours(23,59,59,999);
        return data.filter(item => {
            const itemDate = new Date(item.date).getTime();
            return itemDate >= from && itemDate <= to;
        });
    };
    
    const handleUpdateStatus = (id: number, newStatus: string, type: 'student' | 'teacher' | 'staff') => {
        let setData: React.Dispatch<React.SetStateAction<any[]>>;
        let data: any[];
        
        switch(type) {
            case 'student':
                setData = setStudentAttendance;
                data = studentAttendance;
                break;
            case 'teacher':
                setData = setTeacherAttendance;
                data = teacherAttendance;
                break;
            case 'staff':
                setData = setStaffAttendance;
                data = staffAttendance;
                break;
        }

        setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
        toast({ title: "Attendance Updated", description: `Status has been updated to ${newStatus}.`});
    }

    // Memoized filtered data for each tab
    const filteredStudents = useMemo(() => {
        let dataToFilter = studentAttendance;
        if (userRole === 'student') {
            dataToFilter = studentAttendance.filter(s => s.name === STUDENT_NAME);
        } else if (userRole === 'teacher') {
            dataToFilter = studentAttendance.filter(s => TEACHER_CLASSES.includes(s.class));
        }

        let filtered = filterByTimeframe(dataToFilter)
            .filter(item => 
                (item.name.toLowerCase().includes(studentSearch.toLowerCase()) || item.studentId.toLowerCase().includes(studentSearch.toLowerCase())) && 
                (studentClassFilter === 'All' || item.class === studentClassFilter)
            );
            
        if (studentSortColumn && studentSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[studentSortColumn as keyof typeof a];
                const bValue = b[studentSortColumn as keyof typeof b];
                if (aValue < bValue) return studentSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return studentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [studentSearch, studentClassFilter, studentSortColumn, studentSortDirection, dateRange, userRole, studentAttendance]);

    const filteredTeachers = useMemo(() => {
        let filtered = filterByTimeframe(teacherAttendance).filter(item => item.name.toLowerCase().includes(teacherSearch.toLowerCase()));
        if (teacherSortColumn && teacherSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[teacherSortColumn as keyof typeof a];
                const bValue = b[teacherSortColumn as keyof typeof b];
                if (aValue < bValue) return teacherSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return teacherSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [teacherSearch, teacherSortColumn, teacherSortDirection, dateRange, teacherAttendance]);

    const filteredStaff = useMemo(() => {
        let filtered = filterByTimeframe(staffAttendance).filter(item => item.name.toLowerCase().includes(staffSearch.toLowerCase()));
        if (staffSortColumn && staffSortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[staffSortColumn as keyof typeof a];
                const bValue = b[staffSortColumn as keyof typeof b];
                if (aValue < bValue) return staffSortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return staffSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [staffSearch, staffSortColumn, staffSortDirection, dateRange, staffAttendance]);


    // Pagination logic
    const paginatedStudents = filteredStudents.slice((studentCurrentPage - 1) * ITEMS_PER_PAGE, studentCurrentPage * ITEMS_PER_PAGE);
    const totalStudentPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

    const paginatedTeachers = filteredTeachers.slice((teacherCurrentPage - 1) * ITEMS_PER_PAGE, teacherCurrentPage * ITEMS_PER_PAGE);
    const totalTeacherPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
    
    const paginatedStaff = filteredStaff.slice((staffCurrentPage - 1) * ITEMS_PER_PAGE, staffCurrentPage * ITEMS_PER_PAGE);
    const totalStaffPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);

    const renderDateLabel = () => {
        if (timeframe !== 'custom' || !dateRange) {
            const options: { [key: string]: string } = {
                today: "Today",
                "7": "Last 7 days",
                "30": "Last 30 days",
                "90": "Last 90 days",
            };
            return options[timeframe];
        }
        if (dateRange.from) {
            if (dateRange.to) {
                return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
            }
            return format(dateRange.from, "LLL dd, y");
        }
        return "Pick a date";
    };

    const studentView = (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Attendance</CardTitle>
                    <CardDescription>Log of your attendance records.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCsv('my_attendance.csv', filteredStudents)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Button variant="ghost" onClick={() => handleSort('date', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Date {renderSortIcon('date', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('class', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Class {renderSortIcon('class', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{r.date}</TableCell>
                                    <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.class}</TableCell>
                                    <TableCell className="text-right"><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Holiday' ? 'outline' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {paginatedStudents.length === 0 && <div className="text-center py-10 text-muted-foreground">No records found.</div>}
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">Page {studentCurrentPage} of {totalStudentPages}</div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setStudentCurrentPage(p => Math.max(p - 1, 1))} disabled={studentCurrentPage === 1}>Previous</Button><Button variant="outline" size="sm" onClick={() => setStudentCurrentPage(p => Math.min(p + 1, totalStudentPages))} disabled={studentCurrentPage === totalStudentPages}>Next</Button></div>
                </div>
            </CardContent>
        </Card>
    );
    
    const studentAttendanceCard = (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Student Attendance</CardTitle>
                    <CardDescription>Log of student attendance records.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCsv('student_attendance.csv', filteredStudents)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <Input placeholder="Search by name or ID..." value={studentSearch} onChange={e => {setStudentSearch(e.target.value); setStudentCurrentPage(1);}} className="max-w-sm" />
                    {(userRole === 'admin' || (userRole === 'teacher' && TEACHER_CLASSES.length > 1)) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Filter by Class: {studentClassFilter} <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={studentClassFilter} onValueChange={setStudentClassFilter}>
                                    {studentClassOptions.map(c => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Button variant="ghost" onClick={() => handleSort('name', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Name {renderSortIcon('name', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('studentId', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Student ID {renderSortIcon('studentId', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('class', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Class {renderSortIcon('class', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Date {renderSortIcon('date', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                <TableHead>Status</TableHead>
                                {userRole === 'teacher' && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.studentId}</TableCell>
                                    <TableCell className="hidden md:table-cell whitespace-nowrap">{r.class}</TableCell>
                                    <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.date}</TableCell>
                                    <TableCell><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Holiday' ? 'outline' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
                                    {userRole === 'teacher' && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={!isToday(new Date(r.date))}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {STATUS_OPTIONS.map(status => (
                                                        <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(r.id, status, 'student')}>
                                                            Mark as {status}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {paginatedStudents.length === 0 && <div className="text-center py-10 text-muted-foreground">No records found.</div>}
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">Page {studentCurrentPage} of {totalStudentPages}</div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setStudentCurrentPage(p => Math.max(p - 1, 1))} disabled={studentCurrentPage === 1}>Previous</Button><Button variant="outline" size="sm" onClick={() => setStudentCurrentPage(p => Math.min(p + 1, totalStudentPages))} disabled={studentCurrentPage === totalStudentPages}>Next</Button></div>
                </div>
            </CardContent>
        </Card>
    );

    const teacherView = studentAttendanceCard;

    const adminView = (
        <Tabs defaultValue="students">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="students">{studentAttendanceCard}</TabsContent>

            <TabsContent value="teachers">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Teacher Attendance</CardTitle>
                            <CardDescription>Log of teacher attendance records.</CardDescription>
                        </div>
                         <Button variant="outline" size="sm" onClick={() => exportToCsv('teacher_attendance.csv', filteredTeachers)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6"><Input placeholder="Search by name..." value={teacherSearch} onChange={e => {setTeacherSearch(e.target.value); setTeacherCurrentPage(1);}} className="max-w-sm" /></div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead><Button variant="ghost" onClick={() => handleSort('name', teacherSortColumn, setTeacherSortColumn, teacherSortDirection, setTeacherSortDirection)}>Name {renderSortIcon('name', teacherSortColumn, teacherSortDirection)}</Button></TableHead>
                                        <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('teacherId', teacherSortColumn, setTeacherSortColumn, teacherSortDirection, setTeacherSortDirection)}>Teacher ID {renderSortIcon('teacherId', teacherSortColumn, teacherSortDirection)}</Button></TableHead>
                                        <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', teacherSortColumn, setTeacherSortColumn, teacherSortDirection, setTeacherSortDirection)}>Date {renderSortIcon('date', teacherSortColumn, teacherSortDirection)}</Button></TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTeachers.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.teacherId}</TableCell>
                                            <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.date}</TableCell>
                                            <TableCell><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Holiday' ? 'outline' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" disabled={!isToday(new Date(r.date))}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {STATUS_OPTIONS.map(status => (
                                                            <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(r.id, status, 'teacher')}>
                                                                Mark as {status}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {paginatedTeachers.length === 0 && <div className="text-center py-10 text-muted-foreground">No records found.</div>}
                        </div>
                       <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">Page {teacherCurrentPage} of {totalTeacherPages}</div>
                            <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setTeacherCurrentPage(p => Math.max(p - 1, 1))} disabled={teacherCurrentPage === 1}>Previous</Button><Button variant="outline" size="sm" onClick={() => setTeacherCurrentPage(p => Math.min(p + 1, totalTeacherPages))} disabled={teacherCurrentPage === totalTeacherPages}>Next</Button></div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="staff">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Staff Attendance</CardTitle>
                            <CardDescription>Log of staff attendance records.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => exportToCsv('staff_attendance.csv', filteredStaff)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center gap-4 mb-6"><Input placeholder="Search by name..." value={staffSearch} onChange={e => {setStaffSearch(e.target.value); setStaffCurrentPage(1)}} className="max-w-sm" /></div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead><Button variant="ghost" onClick={() => handleSort('name', staffSortColumn, setStaffSortColumn, staffSortDirection, setStaffSortDirection)}>Name {renderSortIcon('name', staffSortColumn, staffSortDirection)}</Button></TableHead>
                                        <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('staffId', staffSortColumn, setStaffSortColumn, staffSortDirection, setStaffSortDirection)}>Staff ID {renderSortIcon('staffId', staffSortColumn, staffSortDirection)}</Button></TableHead>
                                        <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', staffSortColumn, setStaffSortColumn, staffSortDirection, setStaffSortDirection)}>Date {renderSortIcon('date', staffSortColumn, staffSortDirection)}</Button></TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedStaff.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.staffId}</TableCell>
                                            <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.date}</TableCell>
                                            <TableCell><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Holiday' ? 'outline' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" disabled={!isToday(new Date(r.date))}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {STATUS_OPTIONS.map(status => (
                                                            <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(r.id, status, 'staff')}>
                                                                Mark as {status}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {paginatedStaff.length === 0 && <div className="text-center py-10 text-muted-foreground">No records found.</div>}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">Page {staffCurrentPage} of {totalStaffPages}</div>
                            <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setStaffCurrentPage(p => Math.max(p - 1, 1))} disabled={staffCurrentPage === 1}>Previous</Button><Button variant="outline" size="sm" onClick={() => setStaffCurrentPage(p => Math.min(p + 1, totalStaffPages))} disabled={staffCurrentPage === totalStaffPages}>Next</Button></div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
    
    const renderViewForRole = () => {
        switch (userRole) {
            case 'student': return studentView;
            case 'teacher': return teacherView;
            case 'admin': return adminView;
            default: return null;
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Attendance</h1>
                    <p className="text-muted-foreground">
                        {userRole === 'student' ? "View your personal attendance record." : "Track and manage student, teacher, and staff attendance."}
                    </p>
                </div>
                 <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>{renderDateLabel()}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuRadioGroup value={timeframe} onValueChange={setTimeframe}>
                                <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="7">Last 7 days</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="30">Last 30 days</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="90">Last 90 days</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className={cn("w-full justify-start font-normal px-2 py-1.5", timeframe === 'custom' && 'font-bold')}>Custom</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            setDateRange(range);
                                            setTimeframe('custom');
                                        }}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
            </div>
            {renderViewForRole()}
        </div>
    );
}

    