
"use client";

import { useState, useEffect } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, UploadCloud, Info } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  role: z.enum(["Student", "Teacher", "Parent"], { required_error: "Please select a role." }),
  profilePicture: z
    .any()
    .refine((files) => files?.length == 1, "Profile picture is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  address: z.string().min(5, { message: "Address is required." }).max(150, { message: "Address cannot be more than 150 characters." }),
  pincode: z.string().min(6, { message: "Pincode must be at least 6 characters." }),
  city: z.string().min(2, { message: "City is required." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  interests: z.string().min(2, { message: "Interests are required." }),
  className: z.string().min(1, { message: "Class & Section is required." }),
  classesAssigned: z.string().min(1, { message: "Classes Assigned is required." }).max(150, { message: "Classes Assigned cannot be more than 150 characters." }),
}).superRefine((data, ctx) => {
    if (data.role !== 'Student' && data.role !== 'Teacher') {
        if (!data.dob) {
           data.dob = new Date(); // Mock date for non-students/teachers to pass validation
        }
        if(!data.interests){
            data.interests = "N/A";
        }
    }
    if (data.role !== 'Student') {
        if (!data.className) {
            data.className = "N/A";
        }
    }
    if (data.role !== 'Teacher') {
        if (!data.classesAssigned) {
            data.classesAssigned = "N/A";
        }
    }
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
    });

    const role = watch("role");
    const profilePicture = watch("profilePicture");
    const [preview, setPreview] = useState<string | null>(null);
    
    useEffect(() => {
        if (profilePicture && profilePicture.length > 0) {
            const file = profilePicture[0];
            if (file instanceof File) {
                 const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setPreview(null);
        }
    }, [profilePicture]);


    const onSubmit = (data: UserFormValues) => {
        // Create a new object for submission that doesn't include the refined optional fields for non-students/teachers
        const submissionData: any = {...data};
        if (data.role === 'Parent') {
            delete submissionData.dob;
            delete submissionData.interests;
            delete submissionData.className;
            delete submissionData.classesAssigned;
        } else if (data.role === 'Student') {
            delete submissionData.classesAssigned;
        } else if (data.role === 'Teacher') {
            delete submissionData.className;
        }

        onUserAdded(submissionData);
        reset();
        setPreview(null);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                reset();
                setPreview(null);
            }
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new user to the system. All fields are required.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <ScrollArea className="max-h-[65vh]">
                        <div className="px-6 py-4">
                            <TooltipProvider>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" {...register("phone")} />
                                            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                                                Blood Group
                                                    <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>e.g., O+, A-, AB+</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <Input id="bloodGroup" {...register("bloodGroup")} placeholder="e.g. O+" />
                                            {errors.bloodGroup && <p className="text-destructive text-sm mt-1">{errors.bloodGroup.message}</p>}
                                        </div>
                                         <div>
                                            <Label htmlFor="profilePicture" className="flex items-center gap-2">
                                                Profile Picture
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Accepted formats: JPG, PNG. Max size: 5MB.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-full">
                                                    <Input id="profilePicture" type="file" {...register("profilePicture")} className="hidden" accept="image/png, image/jpeg, image/jpg" />
                                                    <Label htmlFor="profilePicture" className="cursor-pointer border rounded-md p-2 flex items-center justify-center h-32">
                                                            {preview ? (
                                                            <div className="relative h-full w-full">
                                                                    <Image src={preview} alt="Profile preview" layout="fill" objectFit="contain" />
                                                            </div>
                                                            ) : (
                                                            <div className="text-center">
                                                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                                                <p className="text-sm text-muted-foreground">Click to upload</p>
                                                            </div>
                                                            )}
                                                    </Label>
                                                </div>
                                            </div>
                                            {errors.profilePicture && <p className="text-destructive text-sm mt-1">{errors.profilePicture.message as string}</p>}
                                        </div>

                                    </div>

                                    {/* Column 2 */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="address" className="flex items-center gap-2">
                                                Address
                                                    <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Maximum 150 characters.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
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
                                                                        captionLayout="dropdown-buttons"
                                                                        fromYear={1960}
                                                                        toYear={new Date().getFullYear()}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    />
                                                    {errors.dob && <p className="text-destructive text-sm mt-1">{errors.dob.message}</p>}
                                                </div>
                                                <div>
                                                    <Label htmlFor="interests">Interests</Label>
                                                    <Input id="interests" {...register("interests")} placeholder="e.g. Reading, Sports, Music" />
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
                            </TooltipProvider>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Add User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
