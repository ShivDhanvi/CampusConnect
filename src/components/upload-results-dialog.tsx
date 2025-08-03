
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

const resultSchema = z.object({
  studentName: z.string().min(2, { message: "Student name is required." }),
  className: z.string({ required_error: "Please select a class." }),
  subject: z.string().min(2, { message: "Subject is required." }),
  examTitle: z.string().min(3, { message: "Exam title is required." }),
  score: z.string().min(1, { message: "Score is required." }),
  date: z.date({ required_error: "Date is required." }),
});

type ResultFormValues = z.infer<typeof resultSchema>;

interface UploadResultsDialogProps {
  children: React.ReactNode;
  onResultUploaded: (data: ResultFormValues) => void;
  teacherClasses?: string[];
}

export function UploadResultsDialog({ children, onResultUploaded, teacherClasses = [] }: UploadResultsDialogProps) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ResultFormValues>({
        resolver: zodResolver(resultSchema),
    });

    const onSubmit = (data: ResultFormValues) => {
        onResultUploaded(data);
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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload Student Result</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new result.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="studentName">Student Name</Label>
                            <Input id="studentName" {...register("studentName")} />
                            {errors.studentName && <p className="text-destructive text-sm mt-1">{errors.studentName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="className">Class</Label>
                            <Controller
                                control={control}
                                name="className"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teacherClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.className && <p className="text-destructive text-sm mt-1">{errors.className.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" {...register("subject")} />
                        {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="examTitle">Exam Title</Label>
                        <Input id="examTitle" {...register("examTitle")} />
                        {errors.examTitle && <p className="text-destructive text-sm mt-1">{errors.examTitle.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="score">Score (%)</Label>
                            <Input id="score" {...register("score")} />
                            {errors.score && <p className="text-destructive text-sm mt-1">{errors.score.message}</p>}
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="date">Date</Label>
                            <Controller
                                control={control}
                                name="date"
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
                        </div>
                    </div>
                     <div className="flex items-center gap-4 pt-2">
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
                        <Button type="submit">Upload Result</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
