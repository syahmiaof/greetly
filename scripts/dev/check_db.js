const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
    const { data: students, error: err2 } = await supabase.from('students').select('*');
    console.log(`Students count: ${students?.length}`);
    if (students) {
        for (const s of students.slice(0, 5)) {
            console.log(` - ${s.student_name} (ID: ${s.id})`);
        }
    }
    
    const { data: logs, error: err3 } = await supabase.from('attendance_logs').select('*');
    console.log(`Logs count: ${logs?.length}`);
    if (logs) {
        for (const l of logs.slice(-5)) {
            console.log(` - Log:`, l);
        }
    }
}

checkDB();

