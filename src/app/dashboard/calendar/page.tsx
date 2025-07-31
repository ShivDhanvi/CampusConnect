
"use client";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo } from 'react';
import { startOfDay, addHours, getWeek, getMonth, getYear, set, addDays, nextDay } from 'date-fns';

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
        { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '09:00 - 10:00', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
        { time: '10:00 - 11:00', subject: 'Biology', teacher: 'Mr. Davis', room: 'Lab A' },
    ],
    'Tuesday': [
        { time: '08:00 - 09:00', subject: 'English', teacher: 'Ms. Williams', room: '103' },
        { time: '09:00 - 10:00', subject: 'Physics', teacher: 'Mr. Brown', room: 'Lab B' },
    ],
    'Wednesday': [
        { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '09:00 - 10:00', subject: 'Art', teacher: 'Ms. Green', room: 'Art Room' },
    ],
    'Thursday': [
         { time: '09:00 - 10:00', subject: 'History', teacher: 'Mrs. Jones', room: '102' },
         { time: '10:00 - 11:00', subject: 'Physical Education', teacher: 'Mr. Taylor', room: 'Gym' },
    ],
    'Friday': [
        { time: '08:00 - 09:00', subject: 'English', teacher: 'Ms. Williams', room: '103' },
        { time: '09:00 - 10:00', subject: 'Music', teacher: 'Mrs. White', room: 'Music Room' },
    ],
    'Saturday': [],
    'Sunday': [],
};

type Day = keyof typeof timetable;
const dayMapping: Record<Day, number> = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
};


const generateEvents = () => {
    const events: any[] = [];
    const today = new Date();
    const currentMonth = getMonth(today);
    const currentYear = getYear(today);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    (Object.keys(timetable) as Day[]).forEach(day => {
        const dayOfWeek = dayMapping[day];
        let currentDate = nextDay(firstDayOfMonth, dayOfWeek);
        
        // Adjust if the first occurrence is in the previous month
        if (getDay(currentDate) !== dayOfWeek) {
            currentDate = addDays(currentDate, 7);
        }
        if(getMonth(currentDate) < currentMonth) {
            currentDate = nextDay(addDays(firstDayOfMonth, -7), dayOfWeek);
        }


        while(getMonth(currentDate) === currentMonth) {
            timetable[day].forEach(session => {
                const [startTime, endTime] = session.time.split(' - ');
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);

                events.push({
                    title: `${session.subject} (${session.teacher})`,
                    start: set(currentDate, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 }),
                    end: set(currentDate, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 }),
                    resource: { room: session.room },
                });
            });
            currentDate = addDays(currentDate, 7);
        }

    });
    return events;
}


export default function CalendarPage() {
    
    const events = useMemo(() => generateEvents(), []);

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold font-headline">Timetable</h1>
                <p className="text-muted-foreground">View your weekly class schedule.</p>
            </div>
            <div className="flex-1 min-h-[70vh]">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }}
                    views={['month', 'week', 'day', 'agenda']}
                    step={60}
                    showMultiDayTimes
                />
            </div>
        </div>
    )
}
