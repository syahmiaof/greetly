from datetime import datetime
import os
import time
import threading
from dotenv import load_dotenv
import cv2
import numpy as np
from supabase import Client, create_client
import RPi.GPIO as GPIO
import Adafruit_SSD1306
from PIL import Image, ImageDraw, ImageFont

# ==========================================
# 1. SETUP HARDWARE (BUZZER & OLED)
# ==========================================
BUZZER_PIN = 12 
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

# HACK IoT: Gunakan teknik "Open-Drain"
# Set pin sebagai INPUT (terapung/High-Z) supaya 5V dari buzzer tak dapat mengalir ke Ground. Ini akan paksa buzzer senyap.
GPIO.setup(BUZZER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_OFF)

try:
    disp = Adafruit_SSD1306.SSD1306_128_64(rst=None, i2c_address=0x3C)
    disp.begin()
    disp.clear()
    disp.display()
    oled_font = ImageFont.load_default()
    oled_active = True
except Exception as e:
    print(f"[-] OLED Error: {e}")
    oled_active = False

def update_oled(line1, line2):
    if not oled_active: return
    try:
        image = Image.new('1', (disp.width, disp.height))
        draw = ImageDraw.Draw(image)
        draw.rectangle((0, 0, disp.width - 1, disp.height - 1), outline=255, fill=0)
        draw.text((10, 15), line1, font=oled_font, fill=255)
        draw.text((10, 35), line2, font=oled_font, fill=255)
        disp.image(image)
        disp.display()
    except: pass

def clear_oled():
    if not oled_active: return
    try:
        disp.clear()
        disp.display()
    except: pass

def trigger_buzzer(duration=0.5):
    try:
        print(f"[debug] Sounding buzzer for {duration}s")
        # Tukar ke OUTPUT dan LOW (0V) untuk bagi elektrik mengalir dan bunyikan buzzer
        GPIO.setup(BUZZER_PIN, GPIO.OUT)
        GPIO.output(BUZZER_PIN, GPIO.LOW)
        time.sleep(duration)
        # Tukar balik ke INPUT untuk terapungkan pin dan matikan bunyi
        GPIO.setup(BUZZER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_OFF)
    except Exception as e:
        print(f"Buzzer Error: {e}")

update_oled("ATTENDANCE SYSTEM", "Status: STANDBY...")

# ==========================================
# 2. SETUP SUPABASE & WEB
# ==========================================
load_dotenv(".env.local")
supabase = None
if os.environ.get("NEXT_PUBLIC_SUPABASE_URL"):
    supabase = create_client(os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"))

HARDWARE_CONFIG = {"cooldown_seconds": 120, "buzzer_duration": 0.5, "gate_locked": False}
stop_threads = False

def sync_hardware_config():
    global HARDWARE_CONFIG, stop_threads
    last_test_state = False
    sync_counter = 0
    while not stop_threads:
        if supabase:
            try:
                sync_counter += 1
                # Sync hardware config from DB
                res = supabase.table("hardware_config").select("*").eq("id", 1).execute()
                if len(res.data) > 0:
                    HARDWARE_CONFIG["cooldown_seconds"] = res.data[0].get("cooldown_seconds", 120)
                    HARDWARE_CONFIG["buzzer_duration"] = res.data[0].get("buzzer_duration", 0.5)
                    HARDWARE_CONFIG["gate_locked"] = res.data[0].get("gate_locked", False)
                    HARDWARE_CONFIG["kiosk_active"] = res.data[0].get("kiosk_active", True)
                    
                    kiosk_reset = res.data[0].get("kiosk_reset", 30)
                    if kiosk_reset == -1:
                        print("[!] Web Triggered Test Buzzer!")
                        threading.Thread(target=trigger_buzzer, args=(float(HARDWARE_CONFIG.get("buzzer_duration", 0.5)),), daemon=True).start()
                        try: supabase.table("hardware_config").update({"kiosk_reset": 30}).eq("id", 1).execute()
                        except: pass
                    elif kiosk_reset == -99:
                        print("[!] Web Triggered SHUTDOWN!")
                        update_oled("SYSTEM SHUTDOWN", "Goodbye.")
                        trigger_buzzer(2.0) # Bunyi buzzer 2 saat
                        try: supabase.table("hardware_config").update({"kiosk_reset": 30}).eq("id", 1).execute()
                        except: pass
                        os.system("sudo halt")
                        stop_threads = True

                # Every 10 seconds, sync local student folders with the database
                if sync_counter % 5 == 0:
                    res_students = supabase.table("students").select("student_name").execute()
                    if res_students.data is not None:
                        valid_names = [s["student_name"] for s in res_students.data]
                        profiles_changed = False
                        if os.path.exists(PROFILES_DIR):
                            for folder_name in os.listdir(PROFILES_DIR):
                                if folder_name not in valid_names:
                                    print(f"[!] Deleting orphaned profile folder: {folder_name}")
                                    import shutil
                                    shutil.rmtree(os.path.join(PROFILES_DIR, folder_name), ignore_errors=True)
                                    profiles_changed = True
                        if profiles_changed:
                            print("[!] Retraining model after profile deletion...")
                            global recognizer, label_map
                            recognizer, label_map = train_face_recognizer()

                # Update Telemetry so Web shows "Online"
                cpu_temp = 45.0
                try:
                    with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
                        cpu_temp = round(float(f.read()) / 1000.0, 1)
                except:
                    pass
                try:
                    cpu_load = round(os.getloadavg()[0] / os.cpu_count() * 100, 1)
                except:
                    cpu_load = 15.0
                
                supabase.table("hardware_telemetry").upsert({
                    "id": 1,
                    "last_ping": datetime.utcnow().isoformat() + "Z",
                    "temperature": cpu_temp,
                    "cpu_load": cpu_load
                }).execute()

                # Fetch Remote Registration
                res_reg = supabase.table("students").select("*").eq("status", "pending_camera").execute()
                if len(res_reg.data) > 0:
                    HARDWARE_CONFIG["pending_student"] = res_reg.data[0]
                else:
                    HARDWARE_CONFIG["pending_student"] = None

            except Exception as e: 
                print(f"[-] Config Sync Error: {e}")
        time.sleep(2)

threading.Thread(target=sync_hardware_config, daemon=True).start()

# ==========================================
# 3. FACE RECOGNITION SETUP
# ==========================================
PROFILES_DIR = "profiles"
face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
recognizer = cv2.face.LBPHFaceRecognizer_create()

def train_face_recognizer():
    faces, labels, label_map, current_id = [], [], {}, 0
    if not os.path.exists(PROFILES_DIR): return None, None
    for student_name in os.listdir(PROFILES_DIR):
        student_path = os.path.join(PROFILES_DIR, student_name)
        if not os.path.isdir(student_path): continue
        label_map[current_id] = student_name
        for img_name in os.listdir(student_path):
            gray_img = cv2.imread(os.path.join(student_path, img_name), cv2.IMREAD_GRAYSCALE)
            if gray_img is not None:
                faces.append(gray_img)
                labels.append(current_id)
        current_id += 1
    if faces: recognizer.train(faces, np.array(labels))
    return recognizer, label_map

recognizer, label_map = train_face_recognizer()
if not label_map: exit(print("[-] No student profiles found."))

cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc("M", "J", "P", "G"))
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

print("\n[+] System READY.")
last_scanned_time = {}
last_scanned_name = None
success_message_time = 0
gate_was_locked = False

# ==========================================
# 4. MAIN LOOP
# ==========================================
try:
    window_open = False
    while True:
        # Handle Camera Standby (Sleep Mode) - Window Disappears
        if not HARDWARE_CONFIG.get("kiosk_active", True):
            if cap.isOpened():
                cap.release()
                update_oled("CAMERA OFFLINE", "Paused via Web.")
            if window_open:
                cv2.destroyAllWindows()
                window_open = False
            time.sleep(1) # Sleep to save CPU!
            continue
        else:
            if not cap.isOpened():
                print("[+] Re-opening camera...")
                update_oled("ATTENDANCE SYSTEM", "Camera Waking Up...")
                cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
                cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc("M", "J", "P", "G"))
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                time.sleep(1) # Let camera warm up
                continue

        ret, frame = cap.read()
        if not ret or frame is None: continue

        # Handle Gate Locked - Live Camera Feed with Red Text
        if HARDWARE_CONFIG.get("gate_locked", False):
            if not gate_was_locked:
                update_oled("SYSTEM LOCKED!", "Scanner Disabled.")
                gate_was_locked = True
            cv2.putText(frame, "GATE LOCKED", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.imshow("Kiosk Mode", frame)
            window_open = True
            if cv2.waitKey(1) & 0xFF == ord("q"): break
            continue
        elif gate_was_locked:
            update_oled("ATTENDANCE SYSTEM", "Status: STANDBY...")
            gate_was_locked = False

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))
        current_time = time.time()
        window_open = True

        # Remote Registration Logic
        if HARDWARE_CONFIG.get("pending_student") is not None:
            student = HARDWARE_CONFIG["pending_student"]
            student_name = student["student_name"]
            student_id = student["id"]
            
            update_oled("REGISTERING...", student_name)
            student_folder = os.path.join(PROFILES_DIR, student_name)
            if not os.path.exists(student_folder):
                os.makedirs(student_folder)
            
            count = len(os.listdir(student_folder))
            if count < 20:
                for x, y, w, h in faces:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 255, 0), 2)
                    if not hasattr(sync_hardware_config, "frame_delay"): sync_hardware_config.frame_delay = 0
                    sync_hardware_config.frame_delay += 1
                    if sync_hardware_config.frame_delay > 10:
                        face_img = gray[y:y+h, x:x+w]
                        cv2.imwrite(os.path.join(student_folder, f"img_{count}.jpg"), face_img)
                        print(f"Captured {count+1}/20 for {student_name}")
                        sync_hardware_config.frame_delay = 0
                cv2.putText(frame, f"Registering: {count}/20", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
                cv2.imshow("Kiosk Mode", frame)
                if cv2.waitKey(1) & 0xFF == ord("q"): break
                continue
            else:
                update_oled("TRAINING...", "Please wait.")
                try:
                    supabase.table("students").update({"status": "Active"}).eq("id", student_id).execute()
                    HARDWARE_CONFIG["pending_student"] = None
                    recognizer, label_map = train_face_recognizer()
                    update_oled("SUCCESS!", f"{student_name} registered.")
                    time.sleep(2)
                except Exception as e:
                    print("Failed to complete registration:", e)
                continue

        if last_scanned_name and (current_time - success_message_time < 3.0):
            cv2.putText(frame, f"PRESENT: {last_scanned_name}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 3)
        else:
            if last_scanned_name:
                last_scanned_name = None
                update_oled("ATTENDANCE SYSTEM", "Status: STANDBY...")

            for x, y, w, h in faces:
                face_roi = gray[y : y + h, x : x + w]
                label_id, confidence = recognizer.predict(face_roi)

                if confidence < 70:
                    student_name = label_map.get(label_id, "Unknown")
                    if current_time - last_scanned_time.get(student_name, 0) > HARDWARE_CONFIG["cooldown_seconds"]:
                        last_scanned_time[student_name] = current_time
                        last_scanned_name = student_name
                        success_message_time = current_time
                        
                        update_oled("RECORDED", f"Name: {student_name}")
                        buz_dur = float(HARDWARE_CONFIG.get("buzzer_duration", 0.5))
                        threading.Thread(target=trigger_buzzer, args=(buz_dur,), daemon=True).start()

                        if supabase:
                            try:
                                res = supabase.table("students").select("id").eq("student_name", student_name).execute()
                                if len(res.data) > 0:
                                    log_data = {"student_id": res.data[0]['id'], "status": "Present", "confidence_score": float(round(confidence, 1))}
                                    supabase.table("attendance_logs").insert(log_data).execute()
                                    print(f"[+] Synced to cloud: {student_name}")
                            except Exception as e: 
                                print(f"[-] Cloud Sync Error: {e}")
                        box_color = (0, 255, 0)
                    else:
                        box_color = (255, 165, 0)
                else:
                    student_name, box_color = "Unknown", (0, 0, 255)

                cv2.rectangle(frame, (x, y), (x + w, y + h), box_color, 2)
                cv2.putText(frame, student_name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, box_color, 2)

        cv2.imshow("Kiosk Mode", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"): break

except KeyboardInterrupt:
    print("\n[!] Script stopped manually (Ctrl+C).")
finally:
    stop_threads = True
    clear_oled()
    # Letak pin buzzer ke INPUT sebelum exit untuk elak ia menjerit
    GPIO.setup(BUZZER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_OFF)
    # GPIO.cleanup()
    cap.release()
    cv2.destroyAllWindows()
    print("[+] Cleanup complete. Hardware reset.")
