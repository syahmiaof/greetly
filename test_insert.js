const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

