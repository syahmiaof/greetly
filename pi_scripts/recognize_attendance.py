import cv2
import time
import os
from supabase import create_client, Client
from datetime import datetime, timezone
import face_recognition
import numpy as np

# --- Configuration ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "your-anon-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- State ---
last_attendance_times = {}
hardware_config = {"cooldown_seconds": 60, "gate_locked": False}
last_config_fetch = 0
CONFIG_FETCH_INTERVAL = 10  # fetch config every 10 seconds

def update_hardware_config():
    """Fetches the hardware config periodically to avoid lagging the video feed."""
    global hardware_config, last_config_fetch
    current_time = time.time()
    if current_time - last_config_fetch > CONFIG_FETCH_INTERVAL:
        try:
            response = supabase.table("hardware_config").select("*").limit(1).execute()
            if response.data:
                hardware_config = response.data[0]
                last_config_fetch = current_time
        except Exception as e:
            print(f"Error fetching hardware config: {e}")

def get_student_id_by_matric(matric_no):
    """Retrieves the UUID of a student from the students table using their matric_no."""
    try:
        response = supabase.table("students").select("id").eq("matric_no", matric_no).execute()
        if response.data:
            return response.data[0]["id"]
    except Exception as e:
        print(f"Error fetching student ID for {matric_no}: {e}")
    return None

def log_attendance(student_id):
    """Inserts an attendance record for the given student UUID."""
    try:
        data = {
            "student_id": student_id,
            "status": "present",
            # "timestamp": datetime.now(timezone.utc).isoformat()  # Uncomment if timestamp is not auto-generated
        }
        supabase.table("attendance_logs").insert(data).execute()
        print(f"Successfully logged attendance for student_id: {student_id}")
    except Exception as e:
        print(f"Error logging attendance: {e}")

def load_known_faces():
    """
    Placeholder for loading known faces.
    In a production system, you would load images/encodings from a local directory or Supabase Storage.
    """
    known_encodings = []
    known_matric_nos = []
    
    # Example:
    # image = face_recognition.load_image_file("known_faces/123456.jpg")
    # encoding = face_recognition.face_encodings(image)[0]
    # known_encodings.append(encoding)
    # known_matric_nos.append("123456")
    
    print("Loaded known faces (placeholder).")
    return known_encodings, known_matric_nos

def main():
    known_encodings, known_matric_nos = load_known_faces()
    
    video_capture = cv2.VideoCapture(0)
    print("Starting face recognition...")

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to grab frame")
            break
            
        update_hardware_config()
        
        # Check if gate is locked
        if hardware_config.get("gate_locked", False):
            cv2.putText(frame, "GATE LOCKED", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.imshow("Attendance System", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            time.sleep(0.5)
            continue
            
        cooldown = hardware_config.get("cooldown_seconds", 60)

        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_encodings, face_encoding)
            matric_no = "Unknown"

            if known_encodings:
                face_distances = face_recognition.face_distance(known_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    matric_no = known_matric_nos[best_match_index]

            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Draw a box around the face
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, matric_no, (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 1)

            if matric_no != "Unknown":
                current_time = time.time()
                last_time = last_attendance_times.get(matric_no, 0)
                
                # Check cooldown before logging attendance again
                if current_time - last_time > cooldown:
                    student_id = get_student_id_by_matric(matric_no)
                    if student_id:
                        log_attendance(student_id)
                        last_attendance_times[matric_no] = current_time
                        cv2.putText(frame, "LOGGED", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
                    else:
                        cv2.putText(frame, "ID NOT FOUND", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 255), 2)
                else:
                    cv2.putText(frame, "COOLDOWN", (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 255), 2)

        cv2.imshow("Attendance System", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
