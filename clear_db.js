const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://czgcacpkdjmuomryceqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y';
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
