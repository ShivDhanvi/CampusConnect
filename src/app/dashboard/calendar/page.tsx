
"use client";

import { Calendar, dateFnsLocalizer, Views, EventProps, View, ToolbarProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState, useEffect, useCallback } from 'react';
import { set, addDays, eachWeekOfInterval, Day } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const timetables = {
    '10-A': {
        'Monday': [
            { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
            { time: '09:00 - 09:45', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
            { time: '10:00 - 10:45', subject: 'Biology', teacher: 'Mr. Davis', room: 'Lab A' },
        ],
        'Tuesday': [
            { time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Williams', room: '103' },
            { time: '11:00 - 11:45', subject: 'Physical Education', teacher: 'Mr. Taylor', room: 'Gym' },
        ],
        'Wednesday': [
            { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
            { time: '10:00 - 10:45', subject: 'Geography', teacher: 'Mrs. Clark', room: '104' },
        ],
        'Thursday': [
             { time: '09:00 - 09:45', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
        ],
        'Friday': [
            { time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Williams', room: '103' },
            { time: '13:00 - 13:45', subject: 'Biology', teacher: 'Mr. Davis', room: 'Lab A' },
        ],
    },
    '10-B': {
        'Monday': [
            { time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
            { time: '10:00 - 10:45', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
            { time: '11:00 - 11:45', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
        ],
        'Tuesday': [
            { time: '09:00 - 09:45', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
            { time: '10:00 - 10:45', subject: 'English', teacher: 'Ms. Williams', room: '103' },
        ],
        'Wednesday': [
            { time: '09:00 - 09:45', subject: 'Art', teacher: 'Ms. Green', room: 'Art Room' },
            { time: '14:00 - 14:45', subject: 'Computer Science', teacher: 'Mr. Black', room: 'CS Lab' },
        ],
        'Thursday': [
             { time: '10:00 - 10:45', subject: 'Physical Education', teacher: 'Mr. Taylor', room: 'Gym' },
        ],
        'Friday': [
            { time: '09:00 - 09:45', subject: 'Music', teacher: 'Mrs. White', room: 'Music Room' },
        ],
    },
    '11-A': {
        'Monday': [
            { time: '11:00 - 11:45', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
            { time: '13:00 - 13:45', subject: 'Chemistry', teacher: 'Mr. Brown', room: 'Lab C' },
        ],
        'Tuesday': [
            { time: '09:00 - 09:45', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
        ],
        'Wednesday': [
             { time: '14:00 - 14:45', subject: 'Computer Science', teacher: 'Mr. Black', room: 'CS Lab' },
        ],
        'Thursday': [
             { time: '15:00 - 15:45', subject: 'Geography', teacher: 'Mrs. Clark', room: '104' },
        ],
        'Friday': [
            { time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Williams', room: '103' },
        ],
    }
}
const CLASS_OPTIONS = Object.keys(timetables);
type TimetableDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const dayMapping: Record<TimetableDay, Day> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6,
};

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  resource: {
    room: string;
    teacher: string;
    subject: string;
  };
}

const colorMap: Record<string, string> = {
    'Mathematics': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800',
    'History': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800',
    'Biology': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:border-purple-800',
    'Physics': 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:border-pink-800',
    'Chemistry': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-800',
    'English': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800',
    'Physical Education': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:border-green-800',
    'Art': 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:border-pink-800',
    'Geography': 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:border-teal-800',
    'Computer Science': 'bg-gray-200 text-gray-800 border-gray-400 dark:bg-gray-800/30 dark:border-gray-700',
    'Music': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:border-purple-800',
};

const generateEventsForDateRange = (startDate: Date, selectedClass: keyof typeof timetables) => {
    const events: MyEvent[] = [];
    const timetable = timetables[selectedClass];
    if (!timetable) return [];
    
    const weeks = eachWeekOfInterval({
        start: startDate,
        end: addDays(startDate, 35) 
    }, { weekStartsOn: 1 });

    weeks.forEach(weekStart => {
        (Object.keys(timetable) as TimetableDay[]).forEach(day => {
            const dayOfWeek = dayMapping[day];
            const currentDate = addDays(weekStart, dayOfWeek - 1); 

            timetable[day as keyof typeof timetable]?.forEach(session => {
                const [startTime, endTime] = session.time.split(' - ');
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);
                
                const startDateTime = set(currentDate, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 });
                const endDateTime = set(currentDate, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 });

                events.push({
                    title: session.subject,
                    start: startDateTime,
                    end: endDateTime,
                    resource: { 
                      room: session.room,
                      teacher: session.teacher,
                      subject: session.subject,
                    },
                });
            });
        });
    });

    return events;
}

const CustomToolbar = ({ onNavigate, label, view, onView }: ToolbarProps) => {
    return (
        <div className="rbc-toolbar">
            <div className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('TODAY')}>Today</button>
                <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
                <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
            </div>
            <span className="rbc-toolbar-label">{label}</span>
            <div className="rbc-btn-group">
                <button
                    type="button"
                    className={cn(view === 'week' && 'rbc-active')}
                    onClick={() => onView && onView('week')}
                >
                    Week
                </button>
                <button
                    type="button"
                    className={cn(view === 'day' && 'rbc-active')}
                    onClick={() => onView && onView('day')}
                >
                    Day
                </button>
            </div>
        </div>
    );
};

const CustomEvent = ({ event }: EventProps<MyEvent>) => {
    return (
        <div className="flex flex-col text-xs leading-tight">
            <span className="font-semibold whitespace-normal">{event.title}</span>
            <span className="text-xs text-foreground/80">{event.resource.teacher}</span>
        </div>
    );
};

export default function CalendarPage() {
    
    const [isClient, setIsClient] = useState(false);
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState<View>(Views.WEEK);
    const [selectedClass, setSelectedClass] = useState<keyof typeof timetables>('10-A');


    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const onNavigate = useCallback((newDate: Date) => {
        setDate(newDate);
    }, [setDate]);

    const onView = useCallback((newView: View) => {
        setView(newView);
    }, [setView]);
    
    useEffect(() => {
        if(isClient) {
            setEvents(generateEventsForDateRange(date, selectedClass));
        }
    }, [isClient, date, selectedClass]);

    const { defaultDate, scrollToTime, min, max } = useMemo(() => {
        const today = new Date();
        return {
            defaultDate: today,
            scrollToTime: set(today, { hours: 8, minutes: 0 }),
            min: set(today, { hours: 8, minutes: 0, seconds: 0 }),
            max: set(today, { hours: 17, minutes: 0, seconds: 0 }),
        }
    }, []);
    
    const eventPropGetter = useCallback((event: MyEvent) => {
        const colorClass = colorMap[event.resource.subject] || 'bg-primary text-primary-foreground';
        return {
            className: cn(
                "p-2 border flex flex-col justify-center",
                colorClass
            ),
        };
    }, []);

    const handleDrillDown = useCallback((newDate: Date) => {
        setDate(newDate);
        setView('day');
      }, []);

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Timetable</h1>
                    <p className="text-muted-foreground">View your weekly class schedule.</p>
                </div>
                 <div className="w-full md:w-auto md:max-w-xs">
                    <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as keyof typeof timetables)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                            {CLASS_OPTIONS.map(c => (
                                <SelectItem key={c} value={c}>Class {c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex-1 min-h-[70vh] bg-card p-4 rounded-lg shadow-sm">
                {isClient && <Calendar<MyEvent>
                    localizer={localizer}
                    events={events}
                    date={date}
                    view={view}
                    onView={onView}
                    onNavigate={onNavigate}
                    onDrillDown={handleDrillDown}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }}
                    step={60}
                    timeslots={1}
                    defaultDate={defaultDate}
                    scrollToTime={scrollToTime}
                    min={min}
                    max={max}
                    eventPropGetter={eventPropGetter}
                    components={{
                        toolbar: CustomToolbar,
                        event: CustomEvent,
                    }}
                />}
            </div>
        </div>
    )
}
