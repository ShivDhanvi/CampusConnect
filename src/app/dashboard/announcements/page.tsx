import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const announcements = [
    { 
        title: 'Annual Sports Day', 
        content: 'The annual sports day will be held on Sept 15th. All students are requested to participate. Events include track and field, team sports, and fun games.',
        author: 'Mr. Smith',
        date: '2024-08-15'
    },
    { 
        title: 'New Library Books', 
        content: 'We have added a new collection of fiction and non-fiction books to the library. Come and explore the new arrivals.',
        author: 'Ms. Jones',
        date: '2024-08-14'
    },
    { 
        title: 'Exam Schedule Update', 
        content: 'The final exam schedule for the term has been updated. Please check the notice board near the main office for details.',
        author: 'Admin Office',
        date: '2024-08-12'
    },
    { 
        title: 'Photography Club', 
        content: 'The first meeting of the new photography club will be this Friday in the art room. All interested students are welcome.',
        author: 'Mrs. Williams',
        date: '2024-08-10'
    },
];

export default function AnnouncementsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Announcements</h1>
                    <p className="text-muted-foreground">Read the latest news and updates.</p>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Announcement
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {announcements.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>Posted on {item.date} by {item.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{item.content}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">Read More</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
