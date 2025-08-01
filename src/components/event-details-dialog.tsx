
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { MyEvent } from "@/app/dashboard/calendar/page";
import { User, Clock, Building, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  event: MyEvent | null;
}

export function EventDetailsDialog({ isOpen, onOpenChange, event }: EventDetailsDialogProps) {
  if (!event) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {format(event.start, "eeee, MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">{event.resource.subject}</span>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span>{`${format(event.start, "p")} - ${format(event.end, "p")}`}</span>
          </div>
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span>{event.resource.teacher}</span>
          </div>
          <div className="flex items-center gap-4">
            <Building className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span>Room: {event.resource.room}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
