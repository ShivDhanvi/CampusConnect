
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


const generateEventsForDateRange = (startDate: Date) => {
    const events: MyEvent[] = [];
    const weeks = eachWeekOfInterval({
        start: startDate,
        end: addDays(startDate, 35) 
    }, { weekStartsOn: 1 });

    weeks.forEach(weekStart => {
        (Object.keys(timetable) as TimetableDay[]).forEach(day => {
            const dayOfWeek = dayMapping[day];
            const currentDate = addDays(weekStart, dayOfWeek - 1); 

            timetable[day].forEach(session => {
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

const CustomToolbar = (toolbar: ToolbarProps) => {
	const { onNavigate, label, view, onView } = toolbar;
    const goTo = (action: 'PREV' | 'NEXT' | 'TODAY') => {
        onNavigate(action);
    };

	return (
		<div className="rbc-toolbar">
            <div className="rbc-btn-group">
                <button type="button" onClick={() => goTo('TODAY')}>Today</button>
                <button type="button" onClick={() => goTo('PREV')}>Back</button>
                <button type="button" onClick={() => goTo('NEXT')}>Next</button>
            </div>
			<span className="rbc-toolbar-label">{label}</span>
            <div className="rbc-btn-group">
                <button
                    type="button"
                    className={view === 'week' ? 'rbc-active' : ''}
                    onClick={() => onView('week')}
                >
                    Week
                </button>
                <button
                    type="button"
                    className={view === 'day' ? 'rbc-active' : ''}
                    onClick={() => onView('day')}
                >
                    Day
                </button>
            </div>
		</div>
	);
};


export default function CalendarPage() {
    
    const [isClient, setIsClient] = useState(false);
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const onNavigate = useCallback((newDate: Date) => {
        setDate(newDate);
    }, [setDate]);
    
    useEffect(() => {
        if(isClient) {
            setEvents(generateEventsForDateRange(date));
        }
    }, [isClient, date]);

    const { defaultDate, scrollToTime, min, max, views } = useMemo(() => {
        const today = new Date();
        return {
            defaultDate: today,
            scrollToTime: set(today, { hours: 8, minutes: 0 }),
            min: set(today, { hours: 8, minutes: 0, seconds: 0 }),
            max: set(today, { hours: 17, minutes: 0, seconds: 0 }),
            views: { week: true, day: true }
        }
    }, []);
    
    const eventPropGetter = useCallback((event: MyEvent) => {
        const colorClass = colorMap[event.resource.subject] || 'bg-primary text-primary-foreground';
        return {
            className: cn(
                "p-2 border-0 flex flex-col justify-center text-center",
                colorClass
            ),
        };
    }, []);


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
                    defaultView={Views.DAY}
                    views={views}
                    date={date}
                    onNavigate={onNavigate}
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
                        toolbar: CustomToolbar
                    }}
                />}
            </div>
        </div>
    )
}
