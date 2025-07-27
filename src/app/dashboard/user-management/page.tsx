import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    avatar: "https://placehold.co/32x32.png",
    initials: "JD",
    status: "Active",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Teacher",
    avatar: "https://placehold.co/32x32.png",
    initials: "JS",
    status: "Active",
  },
  {
    name: "Peter Jones",
    email: "peter.jones@example.com",
    role: "Parent",
    avatar: "https://placehold.co/32x32.png",
    initials: "PJ",
    status: "Inactive",
  },
  {
    name: "Mary Williams",
    email: "mary.williams@example.com",
    role: "Student",
    avatar: "https://placehold.co/32x32.png",
    initials: "MW",
    status: "Active",
  },
    {
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Teacher",
    avatar: "https://placehold.co/32x32.png",
    initials: "DB",
    status: "Active",
  },
]

export default function UserManagementPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">User Management</h1>
                    <p className="text-muted-foreground">Manage students, teachers, and staff.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>A list of all users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.email}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                                    <AvatarFallback>{user.initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium whitespace-nowrap">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground whitespace-nowrap">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'Teacher' ? 'secondary' : 'default'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'Active' ? 'outline' : 'destructive'} className="whitespace-nowrap">
                                            {user.status === 'Active' ? 
                                                <span className="relative mr-2 flex h-2 w-2 rounded-full bg-green-500" /> : 
                                                <span className="relative mr-2 flex h-2 w-2 rounded-full bg-red-500" />
                                            }
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
