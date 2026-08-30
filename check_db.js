const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://czgcacpkdjmuomryceqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y';
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
