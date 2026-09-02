
with open("docs/AI.md", "a", encoding="utf-8") as f:
    f.write("""

**Senibina Memori AI Chatbot (Bagaimana AI Mengingat):**
Untuk menjadikan Chatbot Greetly pintar, ia akan menggunakan tiga lapisan memori:
1. **Memori Jangka Pendek (Session Context):** Menggunakan *Vercel AI SDK*, sejarah perbualan (chat history) disimpan sementara dalam format tatasusunan (array) `messages`. Setiap kali pengguna menaip soalan baru, keseluruhan sejarah perbualan dihantar kepada *Gemini API* supaya AI faham konteks perbualan yang sedang berlangsung.
2. **Memori Jangka Panjang (Supabase Database):** Untuk membolehkan guru menyambung perbualan hari sebelumnya, array `messages` ini akan disimpan (saved) ke dalam jadual khas di Supabase (contoh: `chat_history`). Apabila guru log masuk, sejarah perbualan akan ditarik (fetch) semula.
3. **Memori Data Sebenar (Function Calling / Grounding):** AI LLM itu sendiri tidak "menghafal" jadual kedatangan pelajar (kerana data LLM statik). Sebaliknya, apabila cikgu bertanya "Siapa ponteng?", AI akan menggunakan fungsi *Tool Calling* untuk bertanya (query) secara terus kepada *database* Supabase dan memberikan jawapan berdasarkan data yang paling terkini (live data).
""")

