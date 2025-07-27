import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
};

type Day = keyof typeof timetable;

export default function CalendarPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Timetable</h1>
                <p className="text-muted-foreground">View your weekly class schedule.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(Object.keys(timetable) as Day[]).map(day => (
                    <Card key={day}>
                        <CardHeader>
                            <CardTitle className="text-center">{day}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {timetable[day].length > 0 ? timetable[day].map(session => (
                                <Card key={session.time} className="bg-background">
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm">{session.subject}</CardTitle>
                                        <CardDescription className="text-xs">{session.time}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
                                        <p>Teacher: {session.teacher}</p>
                                        <p>Room: {session.room}</p>
                                    </CardContent>
                                </Card>
                            )) : (
                                <p className="text-sm text-center text-muted-foreground">No classes scheduled.</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
