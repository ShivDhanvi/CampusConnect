
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
import { CalendarIcon, Info, UploadCloud } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg", "image/jpg"];

const assignmentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  subject: z.string().min(2, { message: "Subject is required." }),
  dueDate: z.date({ required_error: "Due date is required." }),
  description: z.string().optional(),
  attachment: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files?.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .doc, .docx, .png, .jpg, and .jpeg formats are supported."
    ),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface CreateAssignmentDialogProps {
  children: React.ReactNode;
  onAssignmentCreated: (data: AssignmentFormValues) => void;
}

export function CreateAssignmentDialog({ children, onAssignmentCreated }: CreateAssignmentDialogProps) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm<AssignmentFormValues>({
        resolver: zodResolver(assignmentSchema),
    });
    const { toast } = useToast();

    const attachment = watch("attachment");
    const [preview, setPreview] = useState<string | null>(null);

    const onSubmit = (data: AssignmentFormValues) => {
        onAssignmentCreated(data);
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
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new assignment for students.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title")} />
                            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" {...register("subject")} />
                            {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Controller
                            control={control}
                            name="dueDate"
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
                        {errors.dueDate && <p className="text-destructive text-sm mt-1">{errors.dueDate.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" {...register("description")} />
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="attachment">Attachment (Optional)</Label>
                        <div>
                            <Input id="attachment" type="file" {...register("attachment")} className="hidden" />
                            <Label htmlFor="attachment" className="cursor-pointer border rounded-md p-2 flex items-center justify-center h-24 text-center">
                                {attachment?.[0]?.name ? (
                                    <p className="text-sm text-foreground">{attachment[0].name}</p>
                                ) : (
                                    <div className="text-center">
                                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Click to upload file</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                            </Label>
                        </div>
                        {errors.attachment && <p className="text-destructive text-sm mt-1">{errors.attachment.message as string}</p>}
                    </div>


                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Assignment</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

