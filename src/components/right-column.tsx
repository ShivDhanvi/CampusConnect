
"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

const eventsByDate: Record<string, { time: string; title: string; type: 'event' | 'holiday' | 'exam' }[]> = {
    '2024-08-15': [{ time: '10:00 AM', title: 'Parent-Teacher Meeting', type: 'event' }],
    '2024-08-20': [{ time: '09:00 AM', title: 'Maths Unit Test', type: 'exam' }],
    '2024-08-25': [{ time: 'All Day', title: 'Summer Break Ends', type: 'holiday' }],
    '2024-09-01': [{ time: '02:00 PM', title: 'Science Fair', type: 'event' }],
};

const announcements = [
    { title: 'Annual Sports Day', content: 'The annual sports day will be held on Sept 15th. All students are requested to participate.' },
    { title: 'New Library Books', content: 'We have added a new collection of fiction and non-fiction books to the library.' },
    { title: 'Exam Schedule Update', content: 'The final exam schedule for the term has been updated. Please check the notice board.' },
    { title: 'Photography Club', content: 'The first meeting of the new photography club will be this Friday.' },
];

const cardColors = [
    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900",
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
    "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900",
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900",
    "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-900",
];

const getTodayString = () => {
    const today = new Date();
    return new Date(today.getTime() - (today.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
}

const findNextUpcomingEvents = (todayString: string): { date: Date, events: any[] } | null => {
    const sortedDates = Object.keys(eventsByDate).sort();
    const nextDateString = sortedDates.find(date => date >= todayString);

    if (nextDateString) {
        const date = new Date(nextDateString);
        // Adjust for timezone when creating date from string to avoid off-by-one errors
        const tzOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + tzOffset);
        return {
            date: adjustedDate,
            events: eventsByDate[nextDateString]
        };
    }
    return null;
}

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}


export function RightColumn() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This ensures the component has mounted on the client before using `new Date()`
        setIsClient(true);
        setDate(new Date());
    }, []);
    
    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) return; 
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date && isSameDay(newDate, date) && !isSameDay(newDate, today)) {
             // If a selected date (that is not today) is clicked again, revert to today
            setDate(today);
        } else {
            // Otherwise, select the new date
            setDate(newDate);
        }
    };
    
    let eventsToShow: any[] = [];
    let titleMessage = "Loading events...";

    if (isClient && date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selectedDateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
        eventsToShow = eventsByDate[selectedDateString] || [];
        
        if(isSameDay(date, today)){
            titleMessage = "Today's Events";
            if(eventsToShow.length === 0){
                 const upcoming = findNextUpcomingEvents(getTodayString());
                 if(upcoming && !isSameDay(upcoming.date, today)){
                    eventsToShow = upcoming.events;
                    titleMessage = `Upcoming: ${upcoming.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
                 }
            }
        } else {
            titleMessage = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        }
    }


    return (
        <div className="space-y-6">
            <Card className="border-none shadow-none">
                <CardContent className="p-0">
                    {isClient ? (
                         <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="rounded-md"
                        />
                    ) : (
                        <div className="p-3">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-6 w-24 bg-muted rounded" />
                            </div>
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        {[...Array(7)].map((_, j) => <div key={j} className="h-9 w-9 bg-muted rounded-md" />)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Events</h3>
                    <Button variant="link" size="sm" className="text-primary">View all</Button>
                </div>
                <CardDescription>
                    {titleMessage}
                </CardDescription>
                 {eventsToShow.length > 0 ? (
                    <ul className="space-y-3 pt-2">
                       {eventsToShow.map((event, index) => (
                           <li key={index} className="flex items-start gap-3 text-sm">
                               <div className="font-semibold text-muted-foreground w-20 pt-0.5">{event.time}</div>
                               <div className="flex-1 text-foreground font-medium">{event.title}</div>
                               <Badge variant={event.type === 'holiday' ? 'destructive' : event.type === 'exam' ? 'secondary' : 'default'} className="capitalize">{event.type}</Badge>
                           </li>
                       ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground pt-2">
                         {isClient ? "No events to show for the selected date." : "Loading..."}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Announcements</h3>
                    <Button variant="link" size="sm" className="text-primary">View all</Button>
                </div>
               <ScrollArea className="h-48 pr-4">
                    <div className="space-y-4">
                        {announcements.map((ann, index) => (
                            <Card key={index} className={cn("bg-background", cardColors[index % cardColors.length])}>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-sm">{ann.title}</CardTitle>
                                    <CardDescription className="text-xs">{ann.content}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
               </ScrollArea>
            </div>
        </div>
    );
}
