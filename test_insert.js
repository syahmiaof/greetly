const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://czgcacpkdjmuomryceqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Testing insert into attendance_logs...");
    const { data: students, error: err2 } = await supabase.from('students').select('*').eq('student_name', 'Syahmi Aof');
    
    if (students && students.length > 0) {
        const student = students[0];
        console.log(`Found student: ${student.id}`);
        
        const logData = {
            student_id: student.id,
            status: "Present",
            confidence_score: 95.5
        };
        
        const { data: insertData, error: errInsert } = await supabase.from('attendance_logs').insert(logData).select();
        
        if (errInsert) {
            console.error("INSERT ERROR:", errInsert);
        } else {
            console.log("INSERT SUCCESS:", insertData);
        }
    } else {
        console.log("Student not found.");
    }
}

testInsert();
