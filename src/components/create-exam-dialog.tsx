
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileUp } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

const examSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.date({ required_error: "Exam date is required." }),
  className: z.string({ required_error: "Please select a class." }),
});

type ExamFormValues = z.infer<typeof examSchema>;

interface CreateExamDialogProps {
  children: React.ReactNode;
  onExamCreated: (data: ExamFormValues) => void;
  teacherClasses?: string[];
}

export function CreateExamDialog({ children, onExamCreated, teacherClasses = [] }: CreateExamDialogProps) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema),
    });

    const onSubmit = (data: ExamFormValues) => {
        onExamCreated(data);
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Exam</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new exam to the schedule.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Exam Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="className">Class</Label>
                        <Controller
                            control={control}
                            name="className"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teacherClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.className && <p className="text-destructive text-sm mt-1">{errors.className.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Controller
                            control={control}
                            name="date"
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
                        {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">OR</span>
                        <Separator className="flex-1" />
                    </div>

                     <Button variant="outline" className="w-full" disabled>
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload Excel File (Coming Soon)
                    </Button>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Exam</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

