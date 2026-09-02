# AI Implementation Documentation

## Overview
This document outlines the architecture, configuration, and best practices for the AI features integrated into our Next.js application. The system leverages the Vercel AI SDK (`@ai-sdk/react`, `@ai-sdk/google`) and is powered by the `gemini-3.5-flash` model.

## 1. Context & System Prompt Injection
The AI model requires real-time data to provide accurate responses regarding student attendance. We dynamically inject context into the system prompt using records fetched from the Supabase database. 
* **Data Points**: Students are categorized as **Present**, **Late**, or **Absent**.
* **Logic**: The categorization is based on strict cutoffs—8:00 AM and 11:00 AM. 
* **Implementation**: Before initializing the stream, the backend retrieves these records, formats them into a structured summary, and appends them to the system prompt.

## 2. Multi-Language Support Configuration
To accommodate a diverse user base, the system prompt is configured to support multiple languages. 
* **Behavior**: The prompt explicitly instructs the AI to detect the user's language and respond in the same language.
* **Fallback**: English is used as the default fallback language if detection is ambiguous.

## 3. Message Sanitization (Gemini Workaround)
There is a known discrepancy between how standard messages are formatted and how Gemini processes them, specifically regarding `m.parts` versus `m.content`.
* **Issue**: Passing standard message objects directly can lead to "empty content" errors.
* **Workaround**: We implement a sanitization step that maps over the message array before sending it to the Vercel AI SDK. This ensures all messages correctly utilize the `content` property expected by the standard AI SDK, while accommodating any Gemini-specific underlying requirements without crashing.

## 4. Dynamic CSS Infographic State
The frontend provides a visually interactive experience by parsing the AI's response for specific keywords or structured data to update the UI.
* **State Management**: We use an `activeTopic` state in the frontend.
* **Logic**: As the AI streams its response, the frontend parses the text. Depending on the inferred topic (e.g., highlighting attendance statistics), `activeTopic` is updated.
* **UI Feedback**: This state triggers dynamic CSS changes, rendering engaging infographics that align with the current conversation context.

## 5. Limitations & Caveats
When maintaining or scaling this implementation, keep the following constraints in mind:
* **Token Limits**: Dynamically injecting Supabase records for a small class is feasible. However, scaling this to thousands of students will exceed the context window (token limit) of the model. 
  * *Mitigation*: In the future, implement RAG (Retrieval-Augmented Generation) or aggregate statistics instead of passing raw records for large datasets.
* **Latency**: Fetching Supabase records prior to initiating the chat stream adds a slight delay to the initial response time (TTFB).

## 6. Future Possibilities (Generative UI)
To further enhance the interactive experience, we plan to adopt **Generative UI** capabilities using Vercel AI SDK's `streamUI`.
* **Concept**: Instead of relying solely on markdown and CSS parsing, the AI can stream actual React components directly into the chat interface.
* **Use Case**: Dynamically rendering interactive charts (e.g., Recharts) for attendance analytics directly within the chat stream based on user queries.
