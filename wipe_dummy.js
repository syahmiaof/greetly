
const { createClient } = require('@supabase/supabase-js');
const url = 'https://czgcacpkdjmuomryceqs.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y';
const supabase = createClient(url, key);

async function wipe() {
    console.log('Wiping dummy students...');
    const { error } = await supabase.from('students').delete().like('student_id', 'DUMMY-%');
    if (error) console.error(error);
    else console.log('Wiped successfully!');
}
wipe();

