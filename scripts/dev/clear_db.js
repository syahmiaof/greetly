const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearDB() {
    console.log("Clearing attendance_logs...");
    const { error: err1 } = await supabase.from('attendance_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err1) console.error(err1);

    console.log("Fetching students...");
    const { data: students, error: err2 } = await supabase.from('students').select('*');
    
    if (students) {
        let count = 0;
        for (const student of students) {
            if (student.student_name !== 'Syahmi Aof') {
                await supabase.from('students').delete().eq('id', student.id);
                count++;
            }
        }
        console.log(`Deleted ${count} dummy students.`);
    }
    
    console.log("Database cleared! Only Syahmi Aof remains.");
}

clearDB();

