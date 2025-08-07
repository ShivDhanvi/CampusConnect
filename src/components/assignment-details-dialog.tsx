
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, BookOpen, Clock, FileText, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface AssignmentDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assignment: any | null;
}

export function AssignmentDetailsDialog({ isOpen, onOpenChange, assignment }: AssignmentDetailsDialogProps) {
  if (!assignment) {
    return null;
  }

  const { studentName, title, subject, dueDate, status, fileUrl } = assignment;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Details for the assignment submitted by {studentName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">{studentName}</span>
          </div>
          <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span>{subject}</span>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span>Due on {dueDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Badge variant={status === 'Graded' ? 'default' : status === 'Submitted' ? 'secondary' : status === 'Late' ? 'destructive' : 'outline'}>{status}</Badge>
          </div>
          {fileUrl && status !== 'Pending' && (
            <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Button asChild variant="link" className="p-0 h-auto">
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        View Submitted File
                    </a>
                </Button>
            </div>
          )}
        </div>
        <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    