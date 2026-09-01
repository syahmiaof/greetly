
import re

with open("pi_scripts/recognize_attendance.py", "r", encoding="utf-8") as f:
    code = f.read()

old_logic = """                    if not hasattr(sync_hardware_config, "frame_delay"): sync_hardware_config.frame_delay = 0
                    sync_hardware_config.frame_delay += 1
                    if sync_hardware_config.frame_delay > 10:
                        face_img = gray[y:y+h, x:x+w]
                        cv2.imwrite(os.path.join(student_folder, f"img_{count}.jpg"), face_img)
                        print(f"Captured {count+1}/20 for {student_name}")
                        sync_hardware_config.frame_delay = 0"""

new_logic = """                    if not hasattr(sync_hardware_config, "frame_delay"): sync_hardware_config.frame_delay = 0
                    sync_hardware_config.frame_delay += 1
                    if sync_hardware_config.frame_delay > 3:
                        face_img = gray[y:y+h, x:x+w]
                        cv2.imwrite(os.path.join(student_folder, f"img_{count}.jpg"), face_img)
                        print(f"Captured {count+1}/20 for {student_name}")
                        threading.Thread(target=trigger_buzzer, args=(0.1,), daemon=True).start()
                        sync_hardware_config.frame_delay = 0"""

code = code.replace(old_logic, new_logic, 1)

with open("pi_scripts/recognize_attendance.py", "w", encoding="utf-8") as f:
    f.write(code)
print("Updated registration logic locally.")

