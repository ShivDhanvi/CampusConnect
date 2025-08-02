
'use server';

/**
 * @fileOverview A Genkit flow for generating a mind map from a given topic.
 * 
 * - generateMindMap - Generates a mind map for a specific topic.
 * - MindMapNodeSchema - The schema for a node in the mind map.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Recursive schema for a mind map node
export const MindMapNodeSchema = z.object({
  id: z.string().describe('A unique identifier for the node.'),
  topic: z.string().describe('The topic or concept for this node.'),
  children: z.lazy(() => MindMapNodeSchema.array()).optional().describe('An array of child nodes.'),
});

export type MindMapNode = z.infer<typeof MindMapNodeSchema>;

const GenerateMindMapInputSchema = z.object({
  topic: z.string().describe('The central topic for which to generate a mind map.'),
});
export type GenerateMindMapInput = z.infer<typeof GenerateMindMapInputSchema>;


export async function generateMindMap(input: GenerateMindMapInput): Promise<MindMapNode> {
  return generateMindMapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindMapPrompt',
  input: { schema: GenerateMindMapInputSchema },
  output: { schema: MindMapNodeSchema },
  prompt: `You are an expert educator and visual learning specialist. Your task is to generate a hierarchical mind map for a given topic.

The mind map should be structured as a JSON object, with a central root node representing the main topic. This node can have several child nodes for main ideas or sub-topics. Each of these children can, in turn, have their own children, creating a nested structure.

Break down the topic into its most critical components. Aim for a depth of at least 2-3 levels where appropriate to provide a comprehensive overview. Ensure the structure is logical and easy to follow.

The root node's "topic" should be the same as the input topic. Each node needs a unique ID.

Topic: {{{topic}}}

Generate the mind map in the specified JSON format.
`,
});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: GenerateMindMapInputSchema,
    outputSchema: MindMapNodeSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
