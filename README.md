<div align="center">
  <img src="public/greetly-logo-transparent.png" width="120" alt="Greetly Logo" />
  <h1>Real-Time Facial Recognition Attendance System (Greetly)</h1>
</div>

Developed by syahmiaof. **Greetly** is a cloud-integrated, real-time facial recognition student attendance monitoring system. It leverages a modern tech stack (Next.js 15, Tailwind CSS v4, Supabase Auth/Realtime, Python Edge Node) to provide seamless attendance tracking, live dashboard monitoring, hardware telemetry, and an automated CI/CD pipeline for rapid deployments.

---

## 1. System Architecture & CI/CD Pipeline

To ensure high availability, secure data transfer, and automated deployments, Greetly is architected using best-in-class cloud and edge technologies.

### A. Core Workflow Diagram

```mermaid
graph TD
    %% Edge Device Layer
    subgraph Edge["Hardware Edge (Raspberry Pi 3)"]
        Cam[Camera Module] -->|Live Video Feed| CV[OpenCV & face_recognition]
        CV -->|Visual Feedback| OLED[SSD1306 OLED]
        CV -->|Audio Feedback| Buzz[Active-Low Buzzer]
        CV -->|Ping 3s| Telemetry[Hardware Telemetry]
    end

    %% Cloud Database Layer
    subgraph CloudDB["Supabase (PostgreSQL BaaS)"]
        DB[(PostgreSQL DB)]
        Storage[Image Buckets]
        Realtime[WebSockets / Realtime]
        
        CV -->|1. Match & Insert Log| DB
        CV -->|2. Sync Profiles| Storage
        DB -->|3. Broadcast Changes| Realtime
    end

    %% Web Dashboard Layer
    subgraph WebApp["Admin Dashboard (Next.js)"]
        UI[React UI Components]
        Hooks[useAttendance Hook]
        
        Realtime -->|Listen for Inserts| Hooks
        Hooks -->|Update State| UI
    end
    
    %% User Action
    Admin((System Admin)) -->|Views| UI
```

### B. CI/CD Pipeline (Deployment Architecture)

We utilize a zero-downtime deployment strategy. Any code pushed to the `main` branch automatically triggers a build process.

```mermaid
flowchart LR
    Dev([Developer / Local]) -->|git push origin main| GitHub[(GitHub Repository)]
    GitHub -->|Webhook Trigger| Vercel[Vercel Edge Network]
    
    subgraph Vercel Pipeline
        Vercel --> Build[npm run build]
        Build --> TypeCheck[npx tsc]
        TypeCheck --> Deploy[Serverless Deployment]
    end
    
    Deploy --> CF[Cloudflare DNS]
    CF -->|greetly.syahmiaof.my| EndUser([End Users])
```

- **GitHub:** Acts as the single source of truth for version control.
- **Vercel:** PaaS platform that automatically intercepts GitHub webhooks, runs the Next.js build, and deploys the application to an edge network.
- **Cloudflare:** Manages DNS routing (`greetly.syahmiaof.my`) and provides DDoS protection, while Vercel handles the SSL termination.

---

## 2. Sequence Diagram (Data & Hardware Flow)

This diagram explains exactly how the hardware modules (Camera, OLED, Buzzer) interact with the Raspberry Pi 3, and how the entire system syncs bi-directionally with your Web Dashboard.

```mermaid
sequenceDiagram
    participant Hardware as =ô+/=ô Hardware (Cam/OLED/Buzzer)
    participant Python as =ìô Raspberry Pi 3 (Python)
    participant Supabase as Gÿün+Å Supabase (Cloud Database)
    participant NextJS as =Æ+ Web Dashboard (Next.js)

    Note over Hardware, Python: 1. Hardware Polling & Adjustment
    NextJS->>Supabase: Admin changes Settings (e.g., Cooldown)
    Supabase->>Supabase: Updates `hardware_config` table
    Python->>Supabase: Background Thread polls config every 3 seconds
    Supabase-->>Python: Returns new settings (e.g., cooldown=120)
    Python->>Python: Applies settings to local variables instantly!

    Note over Hardware, Python: 2. Face Detection Phase
    Hardware->>Python: Camera sends raw video frames
    Python->>Python: OpenCV detects face & compares to trained profiles
    
    alt Face Recognized
        Python->>Python: Identify as "Syahmi Aof"
        
        Note over Hardware, Python: 3. Hardware Reaction
        Python->>Hardware: Send I2C Data to OLED -> "HADIR: Syahmi Aof"
        Python->>Hardware: Trigger Open-Drain GPIO -> Buzzer "Beep!"
        
        Note over Python, Supabase: 4. Cloud Sync Layer
        Python->>Supabase: Query ID: SELECT id FROM students WHERE name='Syahmi Aof'
        Supabase-->>Python: Returns UUID
        Python->>Supabase: INSERT log (student_id, status: "Present")
        Supabase-->>Python: Success (Data saved in cloud)
    end

    Note over Supabase, NextJS: 5. Real-time Frontend Layer
    Supabase->>NextJS: Webhook / Realtime Channel triggers "INSERT" event
    NextJS->>NextJS: useAttendance.ts hook detects new record
    NextJS->>NextJS: React deduplicates & Updates Live Dashboard UI
```

---



### 3. Registration vs. Attendance Workflow (Perbandingan)

```mermaid
sequenceDiagram
    autonumber
    
    box rgb(30, 41, 59) Registration Mode (Daftar Pelajar Baru)
    participant Admin (Web)
    participant Supabase DB
    participant Raspberry Pi
    end

    Note over Admin (Web): Module: Students -> Remote Registration
    Admin (Web)->>Supabase DB: 1. Masukkan nama & set status = 'pending_camera'<br/>2. Paksa Kiosk = ON (Auto)
    Supabase DB-->>Raspberry Pi: Realtime Trigger
    Raspberry Pi->>Raspberry Pi: Kesan ada pendaftaran tertunggak
    Raspberry Pi->>Raspberry Pi: Tangkap 20 muka (Training)
    Raspberry Pi->>Supabase DB: Update status pelajar = 'active'
    Supabase DB-->>Admin (Web): Pop-up Success di Web UI!
    
    box rgb(6, 78, 59) Attendance Mode (Imbas Kehadiran Harian)
    participant Student
    participant Pi Camera
    participant Dashboard
    end

    Note over Pi Camera: Module: Hardware -> Kiosk Running
    Student->>Pi Camera: Berdiri depan kamera
    Pi Camera->>Pi Camera: Pengesanan Muka AI
    Pi Camera->>Supabase DB: Hantar data kehadiran (Present/Late) & Semak Cooldown
    Supabase DB-->>Dashboard: Loceng Notifikasi berbunyi & Data masuk table!
```

## 4. Hardware Setup

The physical attendance kiosk runs on a Raspberry Pi 3 with the following peripherals:

- **Raspberry Pi Camera:** Captures the live video feed. Enabled via `raspi-config`.
- **SSD1306 OLED Display:** Connected via I2C (`SDA`, `SCL`). Displays system status, time, and immediate feedback.
- **Active-Low Buzzer:** Connected to **BCM 4** (GPIO 4). Provides audio feedback (a short beep) when a face is successfully recognized. 
  > [!CAUTION]
  > **CRITICAL HARDWARE WARNING**
  > 1. The Active-Low Buzzer is connected directly between the Pi's 5V pin and BCM 4 (GPIO 4).
  > 2. Because of this 5V to 3.3V mismatch, you CANNOT use standard GPIO.OUT with GPIO.HIGH to turn the buzzer off. Doing so causes a 1.7V drop across the buzzer, making it scream continuously.
  > 3. The ONLY way to silence the buzzer is to use the "High-Z Open-Drain Hack": you MUST set the pin to `GPIO.IN` (with `pull_up_down=GPIO.PUD_OFF`) to float the pin and stop all current from flowing to Ground. 
  > 4. To sound the buzzer, you set the pin to `GPIO.OUT` with `initial=GPIO.LOW` to complete the circuit to Ground.
  > 5. NEVER remove this hack from `pi_scripts/recognize_attendance.py`, or the user will go deaf.

---

## 5. Database Schema (Supabase)

### `students`
Stores student profiles and facial encoding references.
- `id`: `uuid` (Primary Key)
- `matric_no`: `varchar` (Unique identifier)
- `name`: `varchar`
- `image_url`: `text`

### `attendance_logs`
Stores the actual attendance punches.
- `id`: `uuid` (Primary Key)
- `student_id`: `uuid` (Foreign Key -> `students.id`)
- `status`: `varchar`
- `timestamp`: `timestamptz` (Default: `now()`)

### `hardware_telemetry`
Used by the Pi to report its health status (Ping every 3 seconds).
- `id`: `integer` (Primary Key)
- `cpu_temp`: `numeric`
- `cpu_usage`: `numeric`
- `last_ping`: `timestamptz`

---

## 5B. Next-Gen Dashboard Features

- **Dynamic Theme Switcher:** Choose between Deep Tech, Emerald Zamrud, and Amethyst Galaxy.
- **Secure Auth Middleware:** Route protection via Supabase Server-Side Rendering (SSR).
- **Live Hardware Telemetry:** Ping tracking and remote cooling/shutdown commands for edge devices.

## 6. Running the Web Dashboard Locally

1. Create a `.env.local` file and add your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

---

## 7. Running the Pi Script (Hardware Node)

The Python script (`pi_scripts/recognize_attendance.py`) handles face detection and Supabase communication.

1. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
2. Export your Supabase credentials:
   ```bash
   export SUPABASE_URL="your_supabase_url"
   export SUPABASE_KEY="your_supabase_service_role_key"
   ```

### Running as a Systemd Service (Kiosk Mode)
To ensure the script runs automatically on boot and recovers from crashes:
1. Create `sudo nano /etc/systemd/system/kiosk.service`
2. Enable and start:
   ```bash
   sudo systemctl enable kiosk.service
   sudo systemctl start kiosk.service
   ```

---

## 8. Key Engineering Decisions

### 1. Auto-Delete Profiles Sync
If a student is deleted from the web dashboard, their corresponding facial encodings and reference images are automatically purged from the Raspberry Pi 3's local cache via realtime listener triggers. This prevents the edge device from wasting processing power trying to match deleted faces.

### 2. The 'Sudah Hadir' (Already Present) Logic & Cooldown
To prevent rapid-fire duplicate logs, we introduced a **Cooldown Mechanism**. 
- When a student's face is recognized, their ID is stored locally with a timestamp.
- If detected again within the cooldown window, the UI/OLED displays **"Sudah Hadir"**.
- It skips the database insert and bypasses the buzzer beep, providing silent visual feedback without generating redundant data.

### 3. Local Storage Admin Profile Sync
The admin settings page uses a highly optimized `useAdminProfile` React Hook integrated with browser `localStorage`. When the admin updates their Name, Role, or uploads an Avatar (converted to Base64), a CustomEvent (`profile-updated`) is dispatched, instantly syncing the UI across the entire dashboard without requiring a page refresh or backend database roundtrip.

---

## 9. Pitching & Value Proposition

Greetly solves critical operational and administrative bottlenecks in modern educational institutions. Below are 10 core value propositions tailored for potential investors and stakeholders:

### GÅ¦n+Å 1. Recovering Lost Instruction Time (General)
- **Problem:** Manual attendance taking consumes approximately 10-15 minutes of precious lecture time per class.
- **Solution:** Greetly's zero-touch biometric scanning processes a student in under 1.5 seconds, recovering up to **90% of lost instruction time**, allowing educators to focus purely on teaching.

### =Ä» 2. Eliminating Fraudulent Records (General)
- **Problem:** Buddy punching and forged manual signatures lead to inaccurate truancy records.
- **Solution:** Utilizing precise facial encodings ensures 100% true identity verification, reducing truancy mapping errors by **100%** compared to traditional paper or ID card systems.

### =ôë 3. Drastic Reduction in Administrative Workload (General)
- **Problem:** Administrators spend countless hours manually keying in paper attendance sheets into central school databases.
- **Solution:** GreetlyGÇÖs real-time Supabase cloud sync eliminates manual data entry completely, reducing the administrative attendance workload by **80%** and freeing staff for higher-value tasks.

### =æün+Å 4. Instant Visibility for Stakeholders (General)
- **Problem:** Parents and school management often only discover absenteeism patterns at the end of the semester.
- **Solution:** The Next.js live dashboard provides instant, real-time visibility. Stakeholders can immediately intervene when a student is flagged as absent for consecutive days.

### =ÜÇ 5. Blazing Fast Edge Computing (Technical)
- **Problem:** Sending raw video feeds to the cloud for processing consumes massive internet bandwidth, causing severe lag and high server costs.
- **Solution:** Greetly utilizes Edge Computing on the Raspberry Pi 3. OpenCV processes the video locally, and only lightweight text data (a UUID) is transmitted to the cloud, making it blazing fast even on unstable 3G networks.

### =öö 6. Tri-Feedback Hardware Loop (Technical)
- **Problem:** Users are often unsure if a biometric system successfully registered their presence, causing traffic bottlenecks as they scan multiple times.
- **Solution:** Greetly features a proprietary tri-feedback system: a bounding box on the screen, a custom OLED name display, and an active-low buzzer beep. This guarantees immediate, satisfying confirmation for the user.

### =¢ín+Å 7. Anti-Spam "Sudah Hadir" Cooldown Engine (Technical)
- **Problem:** Traditional facial systems spam the database with duplicate logs if a person lingers in front of the camera.
- **Solution:** We engineered a custom local caching cooldown loop. If a student is detected twice within the configured window, it provides visual feedback ("Sudah Hadir") without triggering a database writeGÇösaving cloud storage costs and preventing API rate limits.

### =öä 8. Zero-Downtime OTA Deployment (Technical)
- **Problem:** Updating software on IoT devices scattered across a campus usually requires manual USB flashing or SSH, leading to high maintenance costs.
- **Solution:** Greetly is hooked to a Vercel CI/CD pipeline, and the Supabase `hardware_config` table acts as an Over-The-Air (OTA) remote control. Admins can lock gates or tweak scanner settings globally from a single browser tab.

### =öÆ 9. Strict Data Privacy & Dynamic Sync (Technical)
- **Problem:** Deleted students' biometric data often lingers on legacy hardware devices, violating PDPA (Personal Data Protection Act) laws.
- **Solution:** Our Supabase Realtime triggers ensure that deleting a student on the web dashboard instantly purges their facial encodings from the Raspberry Pi's local memory, maintaining strict compliance.

### =Æ¦ 10. Cost-Effective Enterprise Scalability (General)
- **Problem:** Enterprise attendance systems require proprietary, expensive hardware and hefty on-premise server licensing.
- **Solution:** By combining affordable off-the-shelf components (Raspberry Pi 3, SSD1306) with Serverless PaaS architectures (Supabase/Vercel), Greetly achieves enterprise-grade performance at a fraction of the traditional cost, making it highly scalable for any institution.

---

## 10. Troubleshooting

### Temporary Failure in Name Resolution (Dashboard Shows Offline / Time Stuck)
**Symptoms:** 
- The Raspberry Pi turns on, the OLED works, but the web dashboard shows the camera as "Offline" and CPU load as 0%.
- Checking Pi logs shows: `Exception: [Errno -3] Temporary failure in name resolution`.
- The Pi's system clock is stuck at the time it was last shut down.

**Cause:** 
When the Pi connects to a Windows Mobile Hotspot, the default DNS configuration may fail to route domain names properly. This breaks the Pi's ability to reach `supabase.co` and `pool.ntp.org` (causing the system clock to freeze).

**Permanent Solution:**
We forced the `NetworkManager` to permanently use Google's DNS for the hotspot profile. To do this again if it resets, run the following on the Pi via SSH:
```bash
sudo nmcli connection modify preconfigured ipv4.dns "8.8.8.8 8.8.4.4"
sudo nmcli connection modify preconfigured ipv4.ignore-auto-dns yes
sudo nmcli connection up preconfigured
```

---

## 11. Marketing & AI Video Generation

To create the 3D 'exploded-view' animation of the Greetly hardware for the landing page or investor pitch videos, use **Luma Dream Machine** or **Runway Gen-3** with the following prompt:

> *"Cinematic 360-degree orbit product reveal. At the peak of the rotation, the hardware begins an elegant exploded-view breakdown. The outer casing detaches and floats outward, revealing the internal motherboard, camera module, and wiring. Soft volumetric lighting, highly detailed."*

### Steps for buttery-smooth landing page animation:
1. Upload the base 3D render of the Greetly hardware as an image reference.
2. Generate a 5-second video using the prompt above.
3. Convert the resulting .mp4 into an image sequence.
4. Extract **150 to 250 frames** to ensure a high frame-rate scroll experience.
5. Replace the files in public/greetly.web/ezgif-6d4320075cf41310-jpg with the new frames and update the rameCount in index.html accordingly.


 
 # #   1 2 .   >��  A I   C o p i l o t   ( S y n t h i a )   &   G e m i n i   A P I   L i m i t s 
 
 T h e   * * G r e e t l y   C o p i l o t   ( S y n t h i a ) * *   i s   i n t e g r a t e d   u s i n g   t h e   V e r c e l   A I   S D K   a n d   G o o g l e   G e m i n i   A P I   ( ` g e m i n i - 3 . 5 - f l a s h ` ) .   I t   a c t s   a s   a n   i n t e l l i g e n t   a s s i s t a n t   c a p a b l e   o f   q u e r y i n g   t h e   S u p a b a s e   d a t a b a s e   a n d   u n d e r s t a n d i n g   h a r d w a r e   m e t r i c s   i n   r e a l - t i m e . 
 
 # # #   G e m i n i   A P I   F r e e   T i e r   R e s t r i c t i o n s 
 I f   y o u   a r e   u s i n g   t h e   G o o g l e   G e m i n i   A P I   * * F r e e   T i e r * * ,   p l e a s e   b e   a w a r e   o f   t h e   f o l l o w i n g   s t r i c t   r a t e   l i m i t s : 
 -   * * 1 5   R e q u e s t s   P e r   M i n u t e   ( R P M ) * * 
 -   * * 1   M i l l i o n   T o k e n s   P e r   M i n u t e   ( T P M ) * * 
 -   * * 1 , 5 0 0   R e q u e s t s   P e r   D a y   ( R P D ) * * 
 
 I f   y o u   e x c e e d   1 5   q u e s t i o n s   w i t h i n   a   s i n g l e   m i n u t e ,   t h e   A P I   w i l l   r e t u r n   a   * * 4 2 9   T o o   M a n y   R e q u e s t s * *   e r r o r .   T h e   V e r c e l   A I   S D K   h a n d l e s   t h i s   b y   a b o r t i n g   t h e   s t r e a m .   
 O u r   f r o n t e n d   g r a c e f u l l y   c a t c h e s   t h i s   e r r o r   a n d   d i s p l a y s   a   c u s t o m   f a l l b a c k   m e s s a g e :   * " A l a m a k !   S y n t h i a   s e d a n g   b e r e h a t   s e k e j a p   s e b a b   t e r l a l u   b a n y a k   s o a l a n .   C u b a   l a g i   d a l a m   3 0   s a a t   y a ! " * 
 
 # # #   H o w   t o   r e s o l v e   R a t e   L i m i t s : 
 1 .   * * W a i t * * :   T h e   l i m i t   o p e r a t e s   o n   a   r o l l i n g   w i n d o w .   Y o u   o n l y   n e e d   t o   w a i t   a b o u t   * * 3 0   t o   6 0   s e c o n d s * *   b e f o r e   y o u   c a n   a s k   q u e s t i o n s   a g a i n . 
 2 .   * * U p g r a d e * * :   I f   G r e e t l y   i s   d e p l o y e d   t o   a   s c h o o l   w i t h   h e a v y   t r a f f i c ,   y o u   m u s t   u p g r a d e   t o   t h e   * * P a y - a s - y o u - g o   T i e r * *   i n   G o o g l e   A I   S t u d i o ,   w h i c h   r a i s e s   t h e   l i m i t   t o   * * 1 , 0 0 0   R P M * * .  
 