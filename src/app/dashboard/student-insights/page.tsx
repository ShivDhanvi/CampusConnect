
"use client";

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Award, BrainCircuit, Lightbulb, Target, TrendingUp, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateStudentInsights, StudentInsightsInput, StudentInsightsOutput } from '@/ai/flows/student-insights';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for the student
const mockStudentData: StudentInsightsInput = {
  academicPerformance: [
    { subject: 'Mathematics', previousScore: 78, currentScore: 85 },
    { subject: 'History', previousScore: 82, currentScore: 75 },
    { subject: 'Science', previousScore: 88, currentScore: 92 },
    { subject: 'English', previousScore: 85, currentScore: 88 },
    { subject: 'Art', previousScore: 90, currentScore: 95 },
  ],
  extracurricularActivities: [
    { activity: 'Chess Club', level: 'Captain', points: 50 },
    { activity: 'Debate Team', level: 'Participation', points: 20 },
    { activity: 'Soccer', level: 'Team Player', points: 30 },
  ],
  teacherNotes: 'John is a responsible and creative student. He shows great leadership in the Chess Club and actively participates in class discussions, especially in English. He seems less engaged in History and could benefit from connecting the subject to his interests.'
};

const chartConfig = {
  previousScore: { label: 'Previous Score', color: 'hsl(var(--chart-2))' },
  currentScore: { label: 'Current Score', color: 'hsl(var(--chart-1))' },
};

export default function StudentInsightsPage() {
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState<StudentInsightsOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getInsights = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateStudentInsights(mockStudentData);
            setInsights(result);
        } catch (e) {
            console.error(e);
            setError("There was an error generating insights. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getInsights();
    }, []);

    const renderLoadingSkeleton = () => (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Insights</h1>
                <p className="text-muted-foreground">A personalized analysis of your academic and extracurricular progress.</p>
            </div>

            {loading ? renderLoadingSkeleton() : error ? (
                 <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive mb-4">{error}</p>
                        <Button onClick={getInsights}>Try Again</Button>
                    </CardContent>
                </Card>
            ) : insights && (
                 <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-6 w-6 text-primary" /> AI-Powered Holistic Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base leading-relaxed">{insights.holisticSummary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Academic Performance</CardTitle>
                                <CardDescription>{insights.academicSummary}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <BarChart data={mockStudentData.academicPerformance} margin={{ top: 20 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="subject" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis />
                                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                        <Legend />
                                        <Bar dataKey="previousScore" fill="var(--color-previousScore)" radius={4} />
                                        <Bar dataKey="currentScore" fill="var(--color-currentScore)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Extracurricular Activities</CardTitle>
                                <CardDescription>Your involvement and achievements outside the classroom.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {mockStudentData.extracurricularActivities.map(activity => (
                                    <div key={activity.activity} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div>
                                            <p className="font-semibold">{activity.activity}</p>
                                            <p className="text-sm text-muted-foreground">{activity.level}</p>
                                        </div>
                                        <Badge variant="secondary">{activity.points} pts</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                     <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500" /> Your Strengths</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc space-y-2 pl-5">
                                    {insights.strengths.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-red-500" /> Areas for Improvement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc space-y-2 pl-5">
                                    {insights.areasForImprovement.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                 </>
            )}
        </div>
    );
}
