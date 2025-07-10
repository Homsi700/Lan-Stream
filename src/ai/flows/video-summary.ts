// src/ai/flows/video-summary.ts
'use server';
/**
 * @fileOverview A flow that generates summaries for videos.
 *
 * - summarizeVideos - A function that generates summaries for a list of videos.
 * - VideoSummaryInput - The input type for the summarizeVideos function.
 * - VideoSummaryOutput - The return type for the summarizeVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoSummaryInputSchema = z.object({
  videoTitles: z.array(z.string()).describe('The titles of the videos to summarize.'),
  videoDescriptions: z.array(z.string()).describe('The descriptions of the videos to summarize.'),
});
export type VideoSummaryInput = z.infer<typeof VideoSummaryInputSchema>;

const VideoSummaryOutputSchema = z.object({
  summaries: z.array(z.string()).describe('The AI-generated summaries for each video.'),
});
export type VideoSummaryOutput = z.infer<typeof VideoSummaryOutputSchema>;

export async function summarizeVideos(input: VideoSummaryInput): Promise<VideoSummaryOutput> {
  return summarizeVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoSummaryPrompt',
  input: {schema: VideoSummaryInputSchema},
  output: {schema: VideoSummaryOutputSchema},
  prompt: `You are an AI video summarization expert. You will be provided a list of video titles and descriptions, and you should generate a short, concise summary for each video.

Video Titles: {{{videoTitles}}}
Video Descriptions: {{{videoDescriptions}}}

Generate a summary for each video:
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const summarizeVideosFlow = ai.defineFlow(
  {
    name: 'summarizeVideosFlow',
    inputSchema: VideoSummaryInputSchema,
    outputSchema: VideoSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
