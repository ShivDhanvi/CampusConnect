"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';

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

export function RightColumn() {
    const [date, setDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        setDate(new Date('2024-08-15'));
    }, []);

    const selectedDateString = date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split('T')[0] : '';
    const selectedEvents = eventsByDate[selectedDateString] || [];

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-none">
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        disabled={!date}
                    />
                </CardContent>
            </Card>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Events</h3>
                    <Button variant="link" size="sm" className="text-primary">View all</Button>
                </div>
                <CardDescription>
                    {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'No date selected'}
                </CardDescription>
                 {selectedEvents.length > 0 ? (
                    <ul className="space-y-3 pt-2">
                       {selectedEvents.map((event, index) => (
                           <li key={index} className="flex items-start gap-3 text-sm">
                               <div className="font-semibold text-muted-foreground w-20 pt-0.5">{event.time}</div>
                               <div className="flex-1 text-foreground font-medium">{event.title}</div>
                               <Badge variant={event.type === 'holiday' ? 'destructive' : event.type === 'exam' ? 'secondary' : 'default'} className="capitalize">{event.type}</Badge>
                           </li>
                       ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground pt-2">No events for this day.</p>
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
                            <Card key={index} className="bg-background">
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
