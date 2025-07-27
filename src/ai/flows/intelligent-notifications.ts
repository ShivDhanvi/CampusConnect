// src/ai/flows/intelligent-notifications.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for intelligent notifications, which analyzes student data to identify anomalies.
 *
 * - analyzeStudentData - Analyzes student activity logs, attendance, and grades to identify anomalies.
 * - AnalyzeStudentDataInput - The input type for the analyzeStudentData function.
 * - AnalyzeStudentDataOutput - The return type for the analyzeStudentData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentDataInputSchema = z.object({
  studentActivityLogs: z.string().describe('Student activity logs in JSON format.'),
  attendanceRecords: z.string().describe('Student attendance records in JSON format.'),
  grades: z.string().describe('Student grades in JSON format.'),
});
export type AnalyzeStudentDataInput = z.infer<typeof AnalyzeStudentDataInputSchema>;

const AnalyzeStudentDataOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      studentId: z.string().describe('The ID of the student with the anomaly.'),
      anomalyType: z.string().describe('The type of anomaly detected (e.g., declining grades, attendance issues).'),
      description: z.string().describe('A detailed description of the anomaly and its potential impact.'),
      severity: z.enum(['high', 'medium', 'low']).describe('The severity level of the anomaly.'),
    })
  ).describe('A list of anomalies detected in the student data.'),
  summary: z.string().describe('A summary of the analysis, including the total number of anomalies detected and their overall impact.'),
});
export type AnalyzeStudentDataOutput = z.infer<typeof AnalyzeStudentDataOutputSchema>;

export async function analyzeStudentData(input: AnalyzeStudentDataInput): Promise<AnalyzeStudentDataOutput> {
  return analyzeStudentDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentDataPrompt',
  input: {schema: AnalyzeStudentDataInputSchema},
  output: {schema: AnalyzeStudentDataOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing student data to identify anomalies and potential issues.

You will receive student activity logs, attendance records, and grades in JSON format.
Your task is to analyze this data and identify any anomalies, such as declining grades, attendance issues, or unusual activity patterns.

Based on your analysis, generate a list of anomalies, including the student ID, anomaly type, a detailed description of the anomaly, and its severity level (high, medium, or low).

Finally, provide a summary of your analysis, including the total number of anomalies detected and their overall impact.

Student Activity Logs: {{{studentActivityLogs}}}
Attendance Records: {{{attendanceRecords}}}
Grades: {{{grades}}}

Output should be in JSON format.
`,
});

const analyzeStudentDataFlow = ai.defineFlow(
  {
    name: 'analyzeStudentDataFlow',
    inputSchema: AnalyzeStudentDataInputSchema,
    outputSchema: AnalyzeStudentDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
