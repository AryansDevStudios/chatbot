'use server';

/**
 * @fileOverview Sentiment analysis flow for analyzing user messages.
 *
 * - analyzeSentiment - A function that analyzes the sentiment of a message.
 * - SentimentAnalysisInput - The input type for the analyzeSentiment function.
 * - SentimentAnalysisOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  message: z.string().describe('The message to analyze.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentAnalysisOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the message, e.g., positive, negative, or neutral.'
    ),
  confidence: z
    .number()
    .describe('The confidence score of the sentiment analysis (0-1).'),
});
export type SentimentAnalysisOutput = z.infer<typeof SentimentAnalysisOutputSchema>;

export async function analyzeSentiment(input: SentimentAnalysisInput): Promise<SentimentAnalysisOutput> {
  return sentimentAnalysisFlow(input);
}

const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `Analyze the sentiment of the following message and provide a sentiment label (positive, negative, or neutral) and a confidence score (0-1):

Message: {{{message}}}

Output format: { \"sentiment\": \"<sentiment>\", \"confidence\": <confidence> }`,
});

const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await sentimentAnalysisPrompt(input);
    return output!;
  }
);
