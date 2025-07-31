
"use client";

import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, ArrowUpDown, ChevronDown, Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const today = new Date();
const studentAttendanceData = [
  { studentId: 'S-1024', name: 'John Doe', class: '10-A', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { studentId: 'S-0987', name: 'Jane Smith', class: '10-B', date: format(today, 'yyyy-MM-dd'), status: 'Absent' },
  { studentId: 'S-1152', name: 'Peter Jones', class: '11-A', date: format(addDays(today, -1), 'yyyy-MM-dd'), status: 'Present' },
  { studentId: 'S-1056', name: 'Mary Williams', class: '11-B', date: format(addDays(today, -8), 'yyyy-MM-dd'), status: 'Late' },
  { studentId: 'S-1025', name: 'David Brown', class: '10-A', date: format(addDays(today, -32), 'yyyy-MM-dd'), status: 'Present' },
  { studentId: 'S-0988', name: 'Emily Davis', class: '10-B', date: format(addDays(today, -100), 'yyyy-MM-dd'), status: 'Present' },
];

const teacherAttendanceData = [
  { teacherId: 'T-001', name: 'Mr. Smith', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { teacherId: 'T-002', name: 'Mrs. Jones', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { teacherId: 'T-003', name: 'Mr. Davis', date: format(addDays(today, -5), 'yyyy-MM-dd'), status: 'Absent' },
];

const staffAttendanceData = [
  { staffId: 'ST-01', name: 'Admin Clerk', date: format(today, 'yyyy-MM-dd'), status: 'Present' },
  { staffId: 'ST-02', name: 'Librarian', date: format(addDays(today, -3), 'yyyy-MM-dd'), status: 'Late' },
];

const CLASS_OPTIONS = ["All", "10-A", "10-B", "11-A", "11-B"];
const ITEMS_PER_PAGE = 5;
type SortDirection = 'asc' | 'desc' | null;

const exportToCsv = (filename: string, studentRows: any[], teacherRows: any[], staffRows: any[]) => {
    let csvContent = "";

    const createSection = (title: string, rows: any[]) => {
        if (!rows || rows.length === 0) return "";
        const header = Object.keys(rows[0]);
        let sectionCsv = title + '\n';
        sectionCsv += header.join(',') + '\n';
        sectionCsv += rows.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(',')).join('\n');
        return sectionCsv + '\n\n';
    };
    
    csvContent += createSection("Students", studentRows);
    csvContent += createSection("Teachers", teacherRows);
    csvContent += createSection("Staff", staffRows);

    if (csvContent === "") return;

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
    // Common state
    const [timeframe, setTimeframe] = useState("today");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: today, to: today });

    // Students state
    const [studentSearch, setStudentSearch] = useState("");
    const [studentClassFilter, setStudentClassFilter] = useState("All");
    const [studentSortColumn, setStudentSortColumn] = useState<string | null>(null);
    const [studentSortDirection, setStudentSortDirection] = useState<SortDirection>(null);
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);

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

    // Memoized filtered data for each tab
    const filteredStudents = useMemo(() => {
        let filtered = filterByTimeframe(studentAttendanceData)
            .filter(item => (item.name.toLowerCase().includes(studentSearch.toLowerCase()) || item.studentId.toLowerCase().includes(studentSearch.toLowerCase())) && (studentClassFilter === 'All' || item.class === studentClassFilter));
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
    }, [studentSearch, studentClassFilter, studentSortColumn, studentSortDirection, dateRange]);

    const filteredTeachers = useMemo(() => {
        let filtered = filterByTimeframe(teacherAttendanceData).filter(item => item.name.toLowerCase().includes(teacherSearch.toLowerCase()));
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
    }, [teacherSearch, teacherSortColumn, teacherSortDirection, dateRange]);

    const filteredStaff = useMemo(() => {
        let filtered = filterByTimeframe(staffAttendanceData).filter(item => item.name.toLowerCase().includes(staffSearch.toLowerCase()));
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
    }, [staffSearch, staffSortColumn, staffSortDirection, dateRange]);


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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Attendance</h1>
                    <p className="text-muted-foreground">Track student, teacher, and staff attendance.</p>
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

                    <Button variant="outline" onClick={() => exportToCsv('attendance_report.csv', filteredStudents, filteredTeachers, filteredStaff)}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                 </div>
            </div>
            <Tabs defaultValue="students">
                <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Attendance</CardTitle>
                            <CardDescription>Log of student attendance records.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                                <Input placeholder="Search by name or ID..." value={studentSearch} onChange={e => {setStudentSearch(e.target.value); setStudentCurrentPage(1);}} className="max-w-sm" />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="ml-auto">
                                            Filter by Class: {studentClassFilter} <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuRadioGroup value={studentClassFilter} onValueChange={setStudentClassFilter}>
                                            {CLASS_OPTIONS.map(c => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead><Button variant="ghost" onClick={() => handleSort('name', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Name {renderSortIcon('name', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('studentId', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Student ID {renderSortIcon('studentId', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden md:table-cell"><Button variant="ghost" onClick={() => handleSort('class', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Class {renderSortIcon('class', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', studentSortColumn, setStudentSortColumn, studentSortDirection, setStudentSortDirection)}>Date {renderSortIcon('date', studentSortColumn, studentSortDirection)}</Button></TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedStudents.map(r => (
                                            <TableRow key={r.studentId + r.date}>
                                                <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                                                <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.studentId}</TableCell>
                                                <TableCell className="hidden md:table-cell whitespace-nowrap">{r.class}</TableCell>
                                                <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.date}</TableCell>
                                                <TableCell className="text-right"><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
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
                </TabsContent>

                {/* Teachers Tab */}
                <TabsContent value="teachers">
                     <Card>
                        <CardHeader><CardTitle>Teacher Attendance</CardTitle><CardDescription>Log of teacher attendance records.</CardDescription></CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-6"><Input placeholder="Search by name..." value={teacherSearch} onChange={e => {setTeacherSearch(e.target.value); setTeacherCurrentPage(1);}} className="max-w-sm" /></div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead><Button variant="ghost" onClick={() => handleSort('name', teacherSortColumn, setTeacherSortColumn, teacherSortDirection, setTeacherSortDirection)}>Name {renderSortIcon('name', teacherSortColumn, teacherSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('teacherId', teacherSortColumn, setTeacherSortColumn, teacherSortDirection, setTeacherSortDirection)}>Teacher ID {renderSortIcon('teacherId', teacherSortColumn, teacherSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', teacherSortColumn, setTeacherSortColumn, teacherSortDirection, setTeacherSortDirection)}>Date {renderSortIcon('date', teacherSortColumn, teacherSortDirection)}</Button></TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedTeachers.map(r => (
                                            <TableRow key={r.teacherId + r.date}>
                                                <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                                                <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.teacherId}</TableCell>
                                                <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.date}</TableCell>
                                                <TableCell className="text-right"><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
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
                
                {/* Staff Tab */}
                <TabsContent value="staff">
                    <Card>
                        <CardHeader><CardTitle>Staff Attendance</CardTitle><CardDescription>Log of staff attendance records.</CardDescription></CardHeader>
                        <CardContent>
                           <div className="flex items-center gap-4 mb-6"><Input placeholder="Search by name..." value={staffSearch} onChange={e => {setStaffSearch(e.target.value); setStaffCurrentPage(1)}} className="max-w-sm" /></div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead><Button variant="ghost" onClick={() => handleSort('name', staffSortColumn, setStaffSortColumn, staffSortDirection, setStaffSortDirection)}>Name {renderSortIcon('name', staffSortColumn, staffSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('staffId', staffSortColumn, setStaffSortColumn, staffSortDirection, setStaffSortDirection)}>Staff ID {renderSortIcon('staffId', staffSortColumn, staffSortDirection)}</Button></TableHead>
                                            <TableHead className="hidden sm:table-cell"><Button variant="ghost" onClick={() => handleSort('date', staffSortColumn, setStaffSortColumn, staffSortDirection, setStaffSortDirection)}>Date {renderSortIcon('date', staffSortColumn, staffSortDirection)}</Button></TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedStaff.map(r => (
                                            <TableRow key={r.staffId + r.date}>
                                                <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                                                <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.staffId}</TableCell>
                                                <TableCell className="hidden sm:table-cell whitespace-nowrap">{r.date}</TableCell>
                                                <TableCell className="text-right"><Badge variant={r.status === 'Present' ? 'default' : r.status === 'Late' ? 'secondary' : 'destructive'}>{r.status}</Badge></TableCell>
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
        </div>
    );
}

    