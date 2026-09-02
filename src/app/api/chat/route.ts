import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Membenarkan strim tindak balas panjang ke klien
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'), // Guna model Gemini 1.5 Flash yang stabil
      system: `You are 'Greetly Copilot', a smart AI assistant for the Greetly IoT Facial Recognition Attendance System.
Your task is to help teachers and school administrators manage attendance, view statistics, and answer their questions professionally, concisely, and politely in English.
This system uses a Raspberry Pi for Edge AI and Supabase for the database.
CRITICAL INSTRUCTION: DO NOT use any Markdown formatting (no asterisks **, no hashes ###, no bold, no lists). ONLY use plain text and friendly emojis. Write in a conversational, friendly, and plain text manner.`,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("AI Error:", error);
    require('fs').writeFileSync('AI_ERROR_LOG.txt', String(error.stack || error));
    return new Response("Ralat memproses AI: " + (error.message || String(error)), { status: 500 });
  }
}
