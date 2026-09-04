import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const maxDuration = 30;

// Primary and fallback models
const PRIMARY_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Fetch Students
    const { data: students } = await supabase.from('students').select('id, student_id, student_name, grade_class');
    
    // 2. Fetch Today's Attendance Logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: logs } = await supabase
      .from('attendance_logs')
      .select('student_id, timestamp, status')
      .gte('timestamp', today.toISOString());

    // 3. Process the data to create a context string
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let studentsContext: string[] = [];

    const logsMap = new Map();
    if (logs) {
      logs.forEach(log => {
        if (!logsMap.has(log.student_id) || new Date(log.timestamp) < new Date(logsMap.get(log.student_id).timestamp)) {
          logsMap.set(log.student_id, log);
        }
      });
    }

    if (students) {
      students.forEach(student => {
        const log = logsMap.get(student.id);
        if (log) {
          const scanTime = new Date(log.timestamp);
          const thresholdLate = new Date(scanTime);
          thresholdLate.setHours(8, 0, 0, 0);
          const thresholdAbsent = new Date(scanTime);
          thresholdAbsent.setHours(11, 0, 0, 0);

          if (scanTime > thresholdAbsent) {
            absentCount++;
            studentsContext.push(`${student.student_name} (${student.grade_class}) - ABSENT (Scanned too late at ${scanTime.toLocaleTimeString()})`);
          } else if (scanTime >= thresholdLate) {
            lateCount++;
            studentsContext.push(`${student.student_name} (${student.grade_class}) - LATE (Scanned at ${scanTime.toLocaleTimeString()})`);
          } else {
            presentCount++;
            studentsContext.push(`${student.student_name} (${student.grade_class}) - PRESENT (Scanned at ${scanTime.toLocaleTimeString()})`);
          }
        } else {
          absentCount++;
          studentsContext.push(`${student.student_name} (${student.grade_class}) - ABSENT (No record)`);
        }
      });
    }

    const dbContext = `
CURRENT DATABASE CONTEXT (LIVE FROM SUPABASE):
- Total Students: ${students?.length || 0}
- Present (Scanned before 8:00 AM): ${presentCount}
- Late (Scanned between 8:00 AM and 11:00 AM): ${lateCount}
- Absent (Scanned after 11:00 AM or no scan today): ${absentCount}

Detailed List of All Students (Present, Late, Absent):
${studentsContext.join('\n')}

ATTENDANCE RULES:
- "Hadir" (Present): Student scanned BEFORE 8:00 AM.
- "Lewat" (Late): Student scanned BETWEEN 8:00 AM and 11:00 AM.
- "Tak Hadir" (Absent): Student scanned AFTER 11:00 AM, or has no scan record for the day.
`;

    const systemPrompt = `You are 'Greetly Copilot' (also known as Synthia), a smart AI assistant for the Greetly IoT Facial Recognition Attendance System.
Your task is to help teachers and school administrators manage attendance, view statistics, and answer their questions professionally, concisely, and politely.
You MUST reply in the same language that the user speaks to you (e.g., if the user speaks Bahasa Melayu, reply in Bahasa Melayu. If English, reply in English).
This system uses a Raspberry Pi for Edge AI and Supabase for the database.

${dbContext}

CRITICAL INSTRUCTION: DO NOT use any Markdown formatting (no asterisks **, no hashes ###, no bold, no lists). ONLY use plain text and friendly emojis. Write in a conversational, friendly, and plain text manner.
If asked about absentees or latecomers, read the CURRENT DATABASE CONTEXT to answer accurately. Never make up names.`;

    const sanitizedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || (m.parts ? m.parts.map((p: any) => p.text).join("") : "")
    }));

    // Try primary model first, then fallback
    try {
      const result = await streamText({
        model: google(PRIMARY_MODEL),
        system: systemPrompt,
        messages: sanitizedMessages,
        maxRetries: 0, // CRITICAL: Disable auto-retry to conserve quota
      });
      return result.toUIMessageStreamResponse();
    } catch (primaryError: any) {
      console.error("Primary model error:", primaryError.message);
      
      // Check if it's a rate limit error
      const isRateLimit = primaryError.message?.includes('429') || 
                          primaryError.message?.includes('quota') ||
                          primaryError.message?.includes('RESOURCE_EXHAUSTED') ||
                          primaryError.message?.includes('rate');

      if (isRateLimit) {
        // Try fallback model (different model may have separate quota)
        try {
          console.log("Trying fallback model:", FALLBACK_MODEL);
          const fallbackResult = await streamText({
            model: google(FALLBACK_MODEL),
            system: systemPrompt,
            messages: sanitizedMessages,
            maxRetries: 0,
          });
          return fallbackResult.toUIMessageStreamResponse();
        } catch (fallbackError: any) {
          console.error("Fallback model also failed:", fallbackError.message);
          
          // Both models exhausted — return friendly chat message as 500 error
          // Both models exhausted — return friendly chat message as 429 error
          return new Response(
            'Synthia tengah berehat sekejap sebab terlalu banyak permintaan hari ini. Quota harian API (1,500 request/hari) mungkin dah habis. Cuba lagi esok ya, atau minta admin upgrade ke pelan berbayar di Google AI Studio! 😊',
            { status: 429 }
          );
        }
      }

      // Non-rate-limit error — throw it
      throw primaryError;
    }
  } catch (error: any) {
    console.error("AI Error:", error);
    
    return new Response(
      'Maaf, Synthia mengalami masalah teknikal. Sila cuba lagi sebentar. 🔧\n\nRalat: ' + error.message,
      { status: 400 }
    );
  }
}
