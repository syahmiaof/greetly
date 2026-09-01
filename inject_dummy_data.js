
const { createClient } = require('@supabase/supabase-js');
const url = 'https://czgcacpkdjmuomryceqs.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y';
const supabase = createClient(url, key);

async function injectData() {
    console.log('Inserting 100 dummy students...');
    const studentsToInsert = [];
    for (let i = 1; i <= 100; i++) {
        studentsToInsert.push({
            student_name: 'Dummy Student ' + i,
            student_id: 'DUMMY-' + i.toString().padStart(3, '0'),
            status: 'Active',
            grade_class: 'Sem 1A'
        });
    }
    const { data: students, error: err1 } = await supabase.from('students').insert(studentsToInsert).select();
    if (err1) { console.error(err1); return; }
    
    console.log('Successfully inserted ' + students.length + ' students.');
    console.log('Generating 3 weeks of attendance logs with new rules...');

    const logs = [];
    const now = new Date();

    for (let d = 0; d <= 21; d++) {
        let date = new Date(now);
        date.setDate(date.getDate() - d);
        if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

        for (const student of students) {
            let rand = Math.random();
            let hour, minute, status;

            if (rand < 0.6) {
                // 60% Present (Before 8 AM)
                hour = 7;
                minute = Math.floor(Math.random() * 30) + 15; // 7:15 - 7:44
                status = 'Present';
            } else if (rand < 0.85) {
                // 25% Late (8 AM - 11 AM)
                hour = Math.floor(Math.random() * 3) + 8; // 8, 9, 10
                minute = Math.floor(Math.random() * 60);
                status = 'Late';
            } else {
                // 15% Absent (After 12 PM)
                hour = Math.floor(Math.random() * 3) + 12; // 12, 13, 14
                minute = Math.floor(Math.random() * 60);
                status = 'Absent';
            }

            date.setHours(hour, minute, Math.floor(Math.random() * 60));
            
            logs.push({
                student_id: student.id,
                status: status,
                confidence_score: parseFloat((Math.random() * (99.9 - 85.0) + 85.0).toFixed(1)),
                timestamp: date.toISOString() // DB column is timestamp!
            });
        }
    }

    console.log('Inserting ' + logs.length + ' attendance logs...');
    const chunkSize = 500;
    for (let i = 0; i < logs.length; i += chunkSize) {
        const chunk = logs.slice(i, i + chunkSize);
        const { error: err2 } = await supabase.from('attendance_logs').insert(chunk);
        if (err2) { console.error('Chunk error:', err2); }
    }
    console.log('Done!');
}
injectData();

