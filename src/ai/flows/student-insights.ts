'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating holistic student insights.
 *
 * - generateStudentInsights - Analyzes academic, extracurricular, and behavioral data to create a comprehensive student report.
 * - StudentInsightsInput - The input type for the generateStudentInsights function.
 * - StudentInsightsOutput - The return type for the generateStudentInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentInsightsInputSchema = z.object({
    academicPerformance: z.array(z.object({
        subject: z.string(),
        currentScore: z.number(),
        previousScore: z.number(),
    })).describe("The student's academic performance data, comparing current and previous scores."),
    extracurricularActivities: z.array(z.object({
        activity: z.string(),
        level: z.string().describe("e.g., Participation, Winner, Leader"),
        points: z.number(),
    })).describe("A list of the student's extracurricular activities and achievements."),
    teacherNotes: z.string().describe("Qualitative notes from teachers about the student's behavior, responsibilities, and nature."),
});
export type StudentInsightsInput = z.infer<typeof StudentInsightsInputSchema>;

const StudentInsightsOutputSchema = z.object({
  academicSummary: z.string().describe("A narrative summary of the student's academic performance, highlighting trends and progress."),
  strengths: z.array(z.string()).describe("A list of key strengths identified from all provided data."),
  areasForImprovement: z.array(z.string()).describe("A list of constructive suggestions for areas where the student can grow."),
  holisticSummary: z.string().describe("An overall summary that synthesizes academic, extracurricular, and behavioral observations into a cohesive, encouraging narrative."),
});
export type StudentInsightsOutput = z.infer<typeof StudentInsightsOutputSchema>;

export async function generateStudentInsights(input: StudentInsightsInput): Promise<StudentInsightsOutput> {
  return studentInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentInsightsPrompt',
  input: {schema: StudentInsightsInputSchema},
  output: {schema: StudentInsightsOutputSchema},
  prompt: `You are an expert educational analyst and guidance counselor. Your task is to provide a holistic and encouraging analysis of a student based on the data provided.

Analyze the following data:
- Academic Performance: {{{json academicPerformance}}}
- Extracurricular Activities: {{{json extracurricularActivities}}}
- Teacher's Notes: "{{{teacherNotes}}}"

Your analysis should be constructive and focus on nurturing the student's potential.
1.  **Academic Summary**: Write a brief summary of the student's academic progress. Compare current and previous scores to identify trends. Mention subjects where they are excelling and where they might need more focus.
2.  **Strengths**: Identify at least 3 key strengths. These can be academic, from extracurriculars (like leadership in chess), or personal qualities mentioned in teacher notes (like responsibility).
3.  **Areas for Improvement**: Provide at least 2 constructive suggestions for growth. Frame these positively. For example, instead of "bad at history," say "Could benefit from exploring new study techniques for History."
4.  **Holistic Summary**: Write a final, encouraging paragraph that ties everything together. Connect their extracurricular interests to their academic life and personal growth.

The tone should be positive, insightful, and motivating.
`,
});

const studentInsightsFlow = ai.defineFlow(
  {
    name: 'studentInsightsFlow',
    inputSchema: StudentInsightsInputSchema,
    outputSchema: StudentInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
