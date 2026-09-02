const fs = require('fs');
let code = fs.readFileSync('src/app/copilot/page.tsx', 'utf8');

const replacement = \          <div className="flex gap-3 relative">
            <input
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input && input.trim() !== "") {
                    try { append({ role: "user", content: input }); setInput(""); } catch (err: any) { alert(err.message); }
                  }
                }
              }}
              placeholder="Tanya Greetly Copilot sesuatu..."
              disabled={isLoading}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (input && input.trim() !== "") {
                  try { append({ role: "user", content: input }); setInput(""); } catch (err: any) { alert(err.message); }
                }
              }}
              disabled={isLoading || (!input || !input.trim())}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl transition flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>\;

code = code.replace(/<div className="flex gap-3 relative">[\s\S]*?<\/div>/, replacement);
fs.writeFileSync('src/app/copilot/page.tsx', code);
