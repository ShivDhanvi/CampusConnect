
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, UploadCloud } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent } from "./ui/card";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  role: z.enum(["Student", "Teacher", "Parent"], { required_error: "Please select a role." }),
  profilePicture: z.any().optional(),
  phone: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().max(150, { message: "Address cannot be more than 150 characters." }).optional(),
  pincode: z.string().optional(),
  city: z.string().optional(),
  dob: z.date().optional(),
  interests: z.string().optional(),
  className: z.string().optional(),
  classesAssigned: z.string().max(150, { message: "Classes Assigned cannot be more than 150 characters." }).optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface AddUserDialogProps {
  children: React.ReactNode;
  onUserAdded: (user: UserFormValues) => void;
}

export function AddUserDialog({ children, onUserAdded }: AddUserDialogProps) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
        }
    });

    const role = watch("role");

    const onSubmit = (data: UserFormValues) => {
        onUserAdded(data);
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                reset();
            }
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="p-6">
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new user to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <Card className="max-h-[70vh] overflow-y-auto rounded-t-none border-x-0 border-y">
                        <CardContent className="p-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Column 1 */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" {...register("name")} />
                                        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...register("email")} />
                                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Role</Label>
                                        <Controller
                                            control={control}
                                            name="role"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Student">Student</SelectItem>
                                                        <SelectItem value="Teacher">Teacher</SelectItem>
                                                        <SelectItem value="Parent">Parent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.role && <p className="text-destructive text-sm mt-1">{errors.role.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="profilePicture">Profile Picture</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-full">
                                                <Input id="profilePicture" type="file" {...register("profilePicture")} className="hidden" />
                                                <Label htmlFor="profilePicture" className="cursor-pointer border rounded-md p-2 flex items-center justify-center h-24">
                                                    <div className="text-center">
                                                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">Click to upload</p>
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" {...register("phone")} />
                                        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="bloodGroup">Blood Group</Label>
                                        <Input id="bloodGroup" {...register("bloodGroup")} />
                                        {errors.bloodGroup && <p className="text-destructive text-sm mt-1">{errors.bloodGroup.message}</p>}
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" {...register("address")} />
                                        {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" {...register("city")} />
                                            {errors.city && <p className="text-destructive text-sm mt-1">{errors.city.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="pincode">Pincode</Label>
                                            <Input id="pincode" {...register("pincode")} />
                                            {errors.pincode && <p className="text-destructive text-sm mt-1">{errors.pincode.message}</p>}
                                        </div>
                                    </div>

                                    {(role === 'Student' || role === 'Teacher') && (
                                        <>
                                            <div>
                                                <Label htmlFor="dob">Date of Birth</Label>
                                                <Controller
                                                    control={control}
                                                    name="dob"
                                                    render={({ field }) => (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full justify-start text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                />
                                                {errors.dob && <p className="text-destructive text-sm mt-1">{errors.dob.message}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="interests">Interests</Label>
                                                <Textarea id="interests" {...register("interests")} placeholder="e.g. Reading, Sports, Music" />
                                                {errors.interests && <p className="text-destructive text-sm mt-1">{errors.interests.message}</p>}
                                            </div>
                                        </>
                                    )}
                                    
                                    {role === 'Student' && (
                                        <div>
                                            <Label htmlFor="className">Class & Section</Label>
                                            <Input id="className" {...register("className")} placeholder="e.g. V-A" />
                                            {errors.className && <p className="text-destructive text-sm mt-1">{errors.className.message}</p>}
                                        </div>
                                    )}

                                    {role === 'Teacher' && (
                                        <div>
                                            <Label htmlFor="classesAssigned">Classes Assigned</Label>
                                            <Input id="classesAssigned" {...register("classesAssigned")} placeholder="e.g. Class V-A, Class VII-B" />
                                            {errors.classesAssigned && <p className="text-destructive text-sm mt-1">{errors.classesAssigned.message}</p>}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <DialogFooter className="p-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Add User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
