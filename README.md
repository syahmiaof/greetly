# Real-Time Facial Recognition Attendance System (Greetly)

## 1. Project Overview & Architecture

**Greetly** is a real-time, facial recognition-based student attendance monitoring system. It leverages a modern tech stack to provide seamless attendance tracking, live dashboard monitoring, and hardware status telemetry.

### Architecture Components
- **Frontend Dashboard:** Built with **Next.js** and styled with Tailwind CSS, offering a responsive UI for admins to view attendance logs in real-time, manage student profiles, and monitor hardware metrics.
- **Backend & Database:** Powered by **Supabase** (PostgreSQL), which handles data storage and provides realtime subscriptions (via WebSockets) to update the frontend instantly when new attendance records are logged.
- **Edge Device (Hardware):** A **Raspberry Pi** running a Python script uses **OpenCV** and the `face_recognition` library to process video feeds, detect faces, and identify students. 
- **Feedback Mechanisms:** The Pi interfaces with an I2C OLED display (SSD1306) and an active-low buzzer for immediate physical feedback (e.g., green box/beep for success).

---

## 2. Hardware Setup

The physical attendance kiosk runs on a Raspberry Pi with the following peripherals:

- **Raspberry Pi Camera:** Captures the live video feed for facial recognition. Ensure the camera module is enabled via `raspi-config`.
- **SSD1306 OLED Display:** Connected via I2C (`SDA`, `SCL`). Used to display system status, time, and immediate feedback (e.g., student name upon successful scan).
- **Active-Low Buzzer:** Connected to **BCM 4** (GPIO 4). Provides audio feedback (a short beep) when a face is successfully recognized and logged.

*Note: Since it's an active-low buzzer, driving the pin `LOW` turns the buzzer on, and `HIGH` turns it off.*

---

## 3. Software Setup & Database Schema

The system relies on Supabase. Below are the core tables required:

### 1. `students`
Stores student profiles and their facial encoding references.
- `id`: `uuid` (Primary Key)
- `matric_no`: `varchar` (Unique identifier, e.g., Student ID)
- `name`: `varchar`
- `image_url`: `text` (URL to the reference image in Supabase Storage)

### 2. `attendance_logs`
Stores the actual attendance punches.
- `id`: `uuid` (Primary Key)
- `student_id`: `uuid` (Foreign Key -> `students.id`)
- `status`: `varchar` (e.g., 'present')
- `timestamp`: `timestamptz` (Default: `now()`)

### 3. `hardware_config`
Allows remote configuration of the Pi from the web dashboard.
- `id`: `integer` (Primary Key)
- `cooldown_seconds`: `integer` (Default: 60)
- `gate_locked`: `boolean` (Default: false)

### 4. `hardware_telemetry`
Used by the Pi to report its health status to the dashboard.
- `id`: `integer` (Primary Key)
- `cpu_temp`: `numeric`
- `cpu_usage`: `numeric`
- `memory_usage`: `numeric`
- `last_ping`: `timestamptz`

---

## 4. Running the Web Dashboard

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup Instructions
1. Clone the repository and navigate to the root directory.
2. Create a `.env.local` file based on `.env.local.example` and add your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser. The dashboard will automatically subscribe to Supabase real-time changes.

---

## 5. Running the Pi Script (Hardware Node)

The Python script (`pi_scripts/recognize_attendance.py`) handles face detection and Supabase communication.

### Prerequisites
- Python 3
- OpenCV (`cv2`)
- `face_recognition`
- `supabase-py`
- I2C enabled on the Pi (for the OLED)

### Setup
1. Navigate to the `pi_scripts` folder.
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Export your Supabase credentials:
   ```bash
   export SUPABASE_URL="your_supabase_url"
   export SUPABASE_KEY="your_supabase_service_role_key"
   ```

### Running as a Systemd Service (Kiosk Mode)
To ensure the script runs automatically on boot and recovers from crashes, set it up as a systemd service:

1. Create a service file: `sudo nano /etc/systemd/system/greetly.service`
2. Add the following configuration:
   ```ini
   [Unit]
   Description=Greetly Face Recognition Service
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/project01/pi_scripts
   Environment="SUPABASE_URL=your_url"
   Environment="SUPABASE_KEY=your_key"
   ExecStart=/usr/bin/python3 recognize_attendance.py
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```
3. Enable and start the service:
   ```bash
   sudo systemctl enable greetly.service
   sudo systemctl start greetly.service
   ```

---

## 6. Key Design Decisions

During the development of Greetly, several critical design decisions were made to ensure robustness and a seamless user experience:

### 1. Auto-Delete Profiles Sync
We implemented a robust synchronization mechanism for student profiles. If a student is deleted from the web dashboard, their corresponding facial encodings and reference images are automatically purged from the Raspberry Pi's local cache (and Supabase Storage) via realtime listener triggers. This ensures the edge device doesn't waste memory or processing power trying to match faces of students who are no longer in the system, maintaining strict data privacy.

### 2. The 'Sudah Hadir' (Already Present) Logic & Cooldown
To prevent rapid-fire, duplicate attendance logs (which would spam the database if a student stands in front of the camera for a few seconds), we introduced a **Cooldown Mechanism**. 
- When a student's face is recognized and logged, their `matric_no` is stored in a local dictionary with a timestamp.
- If the camera detects them again within the configured `cooldown_seconds` (managed via the `hardware_config` table), the system displays **"Sudah Hadir"** (or "COOLDOWN") on the UI/OLED. 
- It intentionally skips the database insert and bypasses the buzzer beep, providing silent visual feedback without generating redundant data.
