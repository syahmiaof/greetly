const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://czgcacpkdjmuomryceqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSyahmi() {
    const { data, error } = await supabase.from('students').insert([
        {
            student_id: 'S001',
            student_name: 'Syahmi Aof',
            grade_class: '4 Sains',
            status: 'active'
        }
    ]).select();
    
    if (error) console.error("Error inserting:", error);
    else console.log("Successfully inserted Syahmi Aof:", data);
}

insertSyahmi();
