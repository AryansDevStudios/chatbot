'use server';
/**
 * @fileOverview A tool for updating user details.
 *
 * This file defines a Genkit tool that allows the AI to update
 * the user's name. In a real application, this would likely
 * write to a database, but for this prototype, it will
 * simply return the updated information to be handled by the client.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Note: In a real app, this would write to a database.
// For the prototype, we just define the action and the AI will "hallucinate"
// the result, which we can then process on the client side.
// We are not actually storing it anywhere on the server.
const UpdateUserDetailsInputSchema = z.object({
  name: z.string().describe("The user's name to save."),
});
export type UpdateUserDetailsInput = z.infer<typeof UpdateUserDetailsInputSchema>;

export const updateUserDetailsTool = ai.defineTool(
    {
        name: 'updateUserDetails',
        description: "Updates the user's details, like their name.",
        inputSchema: UpdateUserDetailsInputSchema,
        outputSchema: z.object({ success: z.boolean(), name: z.string() }),
    },
    async (input) => {
        console.log(`AI is updating user name to: ${input.name}`);
        // In a real app, you'd save this to a database.
        // For this prototype, we'll just confirm it back.
        return { success: true, name: input.name };
    }
);


export async function updateUserDetails(input: UpdateUserDetailsInput): Promise<{ success: boolean, name: string }> {
    // This is a wrapper function if you needed to call it directly,
    // but we'll primarily use the tool with the LLM.
    return updateUserDetailsTool(input);
}
