
import re

with open("pi_scripts/recognize_attendance.py", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add json and datetime
if "import json" not in code:
    code = code.replace("import os", "import os\nimport json\nfrom datetime import datetime", 1)

# 2. Add offline queue functions
queue_code = """
OFFLINE_QUEUE_FILE = "offline_queue.json"

def save_offline_log(log_data):
    try:
        queue = []
        if os.path.exists(OFFLINE_QUEUE_FILE):
            with open(OFFLINE_QUEUE_FILE, "r") as f:
                queue = json.load(f)
        queue.append(log_data)
        with open(OFFLINE_QUEUE_FILE, "w") as f:
            json.dump(queue, f)
        print(f"[*] Saved offline log for {log_data.get('student_id')}")
    except Exception as e:
        print(f"[-] Offline Queue Error: {e}")

def process_offline_queue():
    if not supabase or not os.path.exists(OFFLINE_QUEUE_FILE):
        return
    try:
        with open(OFFLINE_QUEUE_FILE, "r") as f:
            queue = json.load(f)
        if len(queue) > 0:
            print(f"[*] Attempting to sync {len(queue)} offline logs...")
            res = supabase.table("attendance_logs").insert(queue).execute()
            print("[+] Successfully synced offline logs!")
            os.remove(OFFLINE_QUEUE_FILE) # Clear queue
    except Exception as e:
        print(f"[-] Failed to sync offline queue: {e}")

def update_oled"""
code = code.replace("def update_oled", queue_code, 1)

# 3. Add -98 for reboot
reboot_code = """                    elif kiosk_reset == -98:
                        print("[!] Web Triggered RESTART!")
                        update_oled("SYSTEM RESTART", "Rebooting...")
                        trigger_buzzer(1.0)
                        try: supabase.table("hardware_config").update({"kiosk_reset": 30}).eq("id", 1).execute()
                        except: pass
                        os.system("sudo reboot")
                        stop_threads = True
                    elif kiosk_reset == -99:"""
code = code.replace("                    elif kiosk_reset == -99:", reboot_code, 1)

# 4. Process offline queue inside sync_hardware_config
sync_db_code = """                sync_counter += 1
                
                # Process any offline logs
                if sync_counter % 3 == 0:
                    process_offline_queue()
                
                # Sync hardware config from DB"""
code = code.replace("""                sync_counter += 1
                # Sync hardware config from DB""", sync_db_code, 1)

# 5. Modify exception handling in main loop
old_log = """                                    log_data = {"student_id": res.data[0]['id'], "status": "Present", "confidence_score": float(round(confidence, 1))}
                                    supabase.table("attendance_logs").insert(log_data).execute()
                                    print(f"[+] Synced to cloud: {student_name}")
                            except Exception as e: 
                                print(f"[-] Cloud Sync Error: {e}")"""

new_log = """                                    log_data = {
                                        "student_id": res.data[0]['id'], 
                                        "status": "Present", 
                                        "confidence_score": float(round(confidence, 1)),
                                        "timestamp": datetime.utcnow().isoformat() + "Z"
                                    }
                                    try:
                                        supabase.table("attendance_logs").insert(log_data).execute()
                                        print(f"[+] Synced to cloud: {student_name}")
                                    except Exception as e:
                                        print(f"[-] Cloud Sync Error: {e}. Queueing offline.")
                                        save_offline_log(log_data)
                            except Exception as e: 
                                print(f"[-] Student Lookup Error: {e}")"""

code = code.replace(old_log, new_log, 1)

with open("pi_scripts/recognize_attendance.py", "w", encoding="utf-8") as f:
    f.write(code)
print("Done updating pi script.")

