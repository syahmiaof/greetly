
with open("pi_scripts/recognize_attendance.py", "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("box_color = (255, 165, 0)", "student_name = f\"{student_name} (Sudah Hadir)\"\\n                        box_color = (255, 0, 0)")
with open("pi_scripts/recognize_attendance.py", "w", encoding="utf-8") as f:
    f.write(c)

