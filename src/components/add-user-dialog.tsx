
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  role: z.enum(["Student", "Teacher", "Parent"], { required_error: "Please select a role." }),
});

type UserFormValues = z.infer<typeof userSchema>;

interface AddUserDialogProps {
  children: React.ReactNode;
  onUserAdded: (user: Omit<UserFormValues, "id" | "avatar" | "initials" | "status">) => void;
}

export function AddUserDialog({ children, onUserAdded }: AddUserDialogProps) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
        }
    });

    const onSubmit = (data: UserFormValues) => {
        onUserAdded(data);
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new user to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <div className="col-span-3">
                                <Input id="name" {...register("name")} />
                                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                             <div className="col-span-3">
                                <Input id="email" type="email" {...register("email")} />
                                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <div className="col-span-3">
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
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
