
"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, ArrowUpDown, ChevronDown } from "lucide-react"
import { AddUserDialog } from "@/components/add-user-dialog";

const initialUsers = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    avatar: "https://placehold.co/32x32.png",
    initials: "JD",
    status: "Active",
  },
  {
    id: "U002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Teacher",
    avatar: "https://placehold.co/32x32.png",
    initials: "JS",
    status: "Active",
  },
  {
    id: "U003",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    role: "Parent",
    avatar: "https://placehold.co/32x32.png",
    initials: "PJ",
    status: "Inactive",
  },
  {
    id: "U004",
    name: "Mary Williams",
    email: "mary.williams@example.com",
    role: "Student",
    avatar: "https://placehold.co/32x32.png",
    initials: "MW",
    status: "Active",
  },
  {
    id: "U005",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Teacher",
    avatar: "https://placehold.co/32x32.png",
    initials: "DB",
    status: "Active",
  },
  {
    id: "U006",
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    role: "Student",
    avatar: "https://placehold.co/32x32.png",
    initials: "SM",
    status: "Active",
  },
  {
    id: "U007",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Parent",
    avatar: "https://placehold.co/32x32.png",
    initials: "MW",
    status: "Active",
  },
  {
    id: "U008",
    name: "Emily Garcia",
    email: "emily.garcia@example.com",
    role: "Teacher",
    avatar: "https://placehold.co/32x32.png",
    initials: "EG",
    status: "Inactive",
  },
];

const ROLES = ["Student", "Teacher", "Parent"];
const ITEMS_PER_PAGE = 5;

type SortDirection = 'asc' | 'desc' | null;

export default function UserManagementPage() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilters, setRoleFilters] = useState<Record<string, boolean>>({
        Student: true,
        Teacher: true,
        Parent: true,
    });
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredUsers = useMemo(() => {
        let filtered = users.filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            roleFilters[user.role]
        );

        if (sortColumn && sortDirection) {
            filtered.sort((a, b) => {
                const aValue = a[sortColumn as keyof typeof a];
                const bValue = b[sortColumn as keyof typeof b];

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return filtered;
    }, [users, searchTerm, roleFilters, sortColumn, sortDirection]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleAddUser = (newUser: any) => {
        const getInitials = (name: string) => {
            const names = name.split(' ');
            if (names.length > 1) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        };

        const newId = `U${(users.length + 1).toString().padStart(3, '0')}`;

        const userToAdd = {
            ...newUser,
            id: newId,
            status: "Active",
            avatar: newUser.profilePicture?.[0] ? URL.createObjectURL(newUser.profilePicture[0]) : "https://placehold.co/32x32.png",
            initials: getInitials(newUser.name),
        };
        setUsers(prev => [...prev, userToAdd]);
    };
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">User Management</h1>
                    <p className="text-muted-foreground">Manage students, teachers, and staff.</p>
                </div>
                <AddUserDialog onUserAdded={handleAddUser}>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </AddUserDialog>
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>A list of all users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                        <Input
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full sm:max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                                    Filter by Role <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {ROLES.map(role => (
                                     <DropdownMenuCheckboxItem
                                        key={role}
                                        checked={roleFilters[role]}
                                        onCheckedChange={(checked) => {
                                            setRoleFilters(prev => ({...prev, [role]: !!checked}));
                                            setCurrentPage(1);
                                        }}
                                     >
                                        {role}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('name')}>
                                            User
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="hidden md:table-cell">Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                                    <AvatarFallback>{user.initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium whitespace-nowrap">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'Teacher' ? 'secondary' : 'default'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant={user.status === 'Active' ? 'outline' : 'destructive'} className="whitespace-nowrap">
                                            {user.status === 'Active' ? 
                                                <span className="relative mr-2 flex h-2 w-2 rounded-full bg-green-500" /> : 
                                                <span className="relative mr-2 flex h-2 w-2 rounded-full bg-red-500" />
                                            }
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {paginatedUsers.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                No users found.
                            </div>
                        )}
                    </div>
                     <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

    