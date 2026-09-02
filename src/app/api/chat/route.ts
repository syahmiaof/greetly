import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Membenarkan strim tindak balas panjang ke klien
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'), // Guna model Gemini yang sangat pantas
      system: `Anda adalah 'Greetly Copilot', seorang pembantu AI pintar untuk Sistem Kedatangan Pengecaman Wajah IoT (Greetly).
Tugas anda adalah untuk membantu guru dan pentadbir sekolah menguruskan kedatangan, melihat statistik, dan menjawab persoalan mereka dengan profesional, ringkas, dan sopan dalam Bahasa Melayu.
Sistem ini menggunakan Raspberry Pi untuk Edge AI dan Supabase untuk database.`,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("AI Error:", error);
    return new Response("Ralat memproses AI: " + (error.message || String(error)), { status: 500 });
  }
}
