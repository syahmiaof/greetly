
import os
import random
import time
from datetime import datetime, timedelta
from supabase import create_client

# Supabase Credentials
url = "https://czgcacpkdjmuomryceqs.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z2NhY3BrZGptdW9tcnljZXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTgzMDcsImV4cCI6MjEwMzQ5NDMwN30.LEXNad0QqUCEwO_2lk67sWvLswvm2mWsAui3V8F-E7Y"
supabase = create_client(url, key)

print("Inserting 100 dummy students...")
students = []
for i in range(1, 101):
    student_data = {
        "student_name": f"Dummy Student {i}",
        "matric_no": f"DUMMY-{i:03d}",
        "status": "Active"
    }
    # Insert student and get ID
    res = supabase.table("students").insert(student_data).execute()
    students.append(res.data[0])

print(f"Successfully inserted {len(students)} students.")
print("Generating 3 weeks of attendance logs...")

logs = []
now = datetime.now()

# 21 days
for i in range(21):
    date = now - timedelta(days=i)
    # Skip weekends
    if date.weekday() >= 5:
        continue
        
    for student in students:
        # 80% chance of attending
        if random.random() < 0.8:
            # Random time between 7:30 and 8:30
            hour = 7
            minute = random.randint(30, 59)
            if random.random() < 0.3: # 30% chance of being late (after 8:00)
                hour = 8
                minute = random.randint(0, 30)
                status = "Late"
            else:
                status = "Present"
                
            timestamp = date.replace(hour=hour, minute=minute, second=random.randint(0, 59)).isoformat()
            
            logs.append({
                "student_id": student["id"],
                "status": status,
                "confidence_score": round(random.uniform(85.0, 99.9), 1),
                "timestamp": timestamp
            })

print(f"Inserting {len(logs)} attendance logs...")
# Supabase limits inserts to 1000 rows per request usually, so chunk it
chunk_size = 500
for i in range(0, len(logs), chunk_size):
    chunk = logs[i:i+chunk_size]
    supabase.table("attendance_logs").insert(chunk).execute()
    print(f"Inserted chunk {i//chunk_size + 1}")

print("Done!")

