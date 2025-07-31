
"use client";

import { Calendar, dateFnsLocalizer, Views, EventProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState, useEffect, useCallback } from 'react';
import { set, addDays, eachWeekOfInterval, startOfMonth, endOfMonth, Day } from 'date-fns';
import { cn } from '@/lib/utils';

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

const timetable = {
    'Monday': [
        { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '09:00 - 09:45', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
        { time: '10:00 - 10:45', subject: 'Biology', teacher: 'Mr. Davis', room: 'Lab A' },
        { time: '11:00 - 11:45', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
        { time: '13:00 - 13:45', subject: 'Chemistry', teacher: 'Mr. Brown', room: 'Lab C' },
    ],
    'Tuesday': [
        { time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Williams', room: '103' },
        { time: '09:00 - 09:45', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
        { time: '11:00 - 11:45', subject: 'Physical Education', teacher: 'Mr. Taylor', room: 'Gym' },
    ],
    'Wednesday': [
        { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '09:00 - 09:45', subject: 'Art', teacher: 'Ms. Green', room: 'Art Room' },
        { time: '10:00 - 10:45', subject: 'Geography', teacher: 'Mrs. Clark', room: '104' },
        { time: '14:00 - 14:45', subject: 'Computer Science', teacher: 'Mr. Black', room: 'CS Lab' },
    ],
    'Thursday': [
         { time: '09:00 - 09:45', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
         { time: '10:00 - 10:45', subject: 'Physical Education', teacher: 'Mr. Taylor', room: 'Gym' },
         { time: '15:00 - 15:45', subject: 'Geography', teacher: 'Mrs. Clark', room: '104' },
    ],
    'Friday': [
        { time: '08:00 - 08:45', subject: 'English', teacher: 'Ms. Williams', room: '103' },
        { time: '09:00 - 09:45', subject: 'Music', teacher: 'Mrs. White', room: 'Music Room' },
        { time: '13:00 - 13:45', subject: 'Biology', teacher: 'Mr. Davis', room: 'Lab A' },
    ],
    'Saturday': [],
    'Sunday': [],
};

type TimetableDay = keyof typeof timetable;
const dayMapping: Record<TimetableDay, Day> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6,
};

const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
    'History': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    'Biology': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
    'Physics': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800',
    'Chemistry': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800',
    'English': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800',
    'Physical Education': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    'Art': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
    'Computer Science': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600',
    'Geography': 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/50 dark:text-lime-300 dark:border-lime-800',
    'Music': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800',
};

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  resource: {
    room: string;
    teacher: string;
    time: string;
    colorClass: string;
  };
}

const CustomEvent = ({ event }: EventProps<MyEvent>) => (
  <div className="h-full p-2">
    <p className="text-xs text-muted-foreground">{event.resource.time}</p>
    <p className="font-semibold">{event.title}</p>
  </div>
);


const generateEventsForDateRange = (startDate: Date, endDate: Date) => {
    const events: MyEvent[] = [];
    
    const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 /* Monday */ });

    weeks.forEach(weekStart => {
        (Object.keys(timetable) as TimetableDay[]).forEach(day => {
            const dayOfWeek = dayMapping[day];
            const currentDate = addDays(weekStart, dayOfWeek -1); // Adjust for week start on Monday

            if (currentDate >= startDate && currentDate <= endDate) {
                timetable[day].forEach(session => {
                    const [startTime, endTime] = session.time.split(' - ');
                    const [startHour, startMinute] = startTime.split(':').map(Number);
                    const [endHour, endMinute] = endTime.split(':').map(Number);

                    events.push({
                        title: session.subject,
                        start: set(currentDate, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 }),
                        end: set(currentDate, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 }),
                        resource: { 
                          room: session.room,
                          teacher: session.teacher,
                          time: session.time,
                          colorClass: subjectColors[session.subject] || 'bg-gray-100 text-gray-800 border-gray-200'
                        },
                    });
                });
            }
        });
    });
    return events;
}


export default function CalendarPage() {
    
    const [isClient, setIsClient] = useState(false);
    const [events, setEvents] = useState<MyEvent[]>([]);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const onNavigate = useCallback((newDate: Date) => {
        const start = startOfWeek(newDate, { weekStartsOn: 1 });
        const end = addDays(start, 6);
        setEvents(generateEventsForDateRange(start, end));
    }, []);

    useEffect(() => {
        if(isClient) {
            const today = new Date();
            const start = startOfWeek(today, { weekStartsOn: 1 });
            const end = addDays(start, 6);
            setEvents(generateEventsForDateRange(start, end));
        }
    }, [isClient]);

    const { defaultDate, scrollToTime, min, max } = useMemo(() => {
        const today = new Date();
        return {
            defaultDate: today,
            scrollToTime: set(today, { hours: 8, minutes: 0 }),
            min: set(today, { hours: 8, minutes: 0 }),
            max: set(today, { hours: 18, minutes: 0 }),
        }
    }, [])

    const eventStyleGetter = (event: MyEvent) => {
        const className = `${event.resource.colorClass} rbc-event-custom`;
        return {
            className: className,
        };
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold font-headline">Timetable</h1>
                <p className="text-muted-foreground">View your weekly class schedule.</p>
            </div>
            <div className="flex-1 min-h-[70vh] bg-card p-4 rounded-lg shadow-sm">
                {isClient && <Calendar<MyEvent>
                    localizer={localizer}
                    events={events}
                    defaultView={Views.WEEK}
                    views={['week', 'day']}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }}
                    step={15}
                    timeslots={4}
                    defaultDate={defaultDate}
                    scrollToTime={scrollToTime}
                    onNavigate={onNavigate}
                    min={min}
                    max={max}
                    className="[&_.rbc-off-range-bg]:bg-background"
                    eventPropGetter={eventStyleGetter}
                    components={{
                        event: CustomEvent,
                    }}
                />}
            </div>
        </div>
    )
}

