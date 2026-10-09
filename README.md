<div align="center">
  <img src="public/greetly-logo-transparent.png" width="112" alt="Greetly logo" />
  <h1>Greetly</h1>
  <p><strong>An edge-to-cloud attendance system.</strong></p>
  <p><a href="https://greetly.syahmiaof.my">Live dashboard</a> · <a href="https://syahmiaof.my/projects/greetly">Portfolio case study</a></p>
</div>

![Greetly edge device concept](https://raw.githubusercontent.com/syahmiaof/syahmiaof/main/public/images/greetly-device.webp)

> Active student project. The repository documents the current implementation and its limits; it is not an independently validated biometric product or performance benchmark.

## What it connects

~~~text
Camera → Raspberry Pi → OpenCV/LBPH → Supabase/PostgreSQL → Next.js Realtime UI
~~~

- Camera frames and face matching run on the Raspberry Pi.
- A per-person cooldown suppresses repeated attendance writes.
- Attendance events are sent through the Supabase client.
- The dashboard subscribes to database updates through Supabase Realtime.
- Device status, OLED feedback and buzzer feedback support the physical interaction.

## My role

I design and build the web dashboard, edge script integration, data flow, device feedback and deployment path. The project connects frontend work with local compute, networking, persistence and operations.

## Stack

| Layer | Technology |
|---|---|
| Edge | Raspberry Pi 3, Python, OpenCV |
| Hardware feedback | Camera, SSD1306 OLED, buzzer |
| Data | Supabase, PostgreSQL, Realtime |
| Interface | Next.js, React, TypeScript |
| Delivery | GitHub, Vercel, Cloudflare DNS, systemd kiosk service |

## Run the dashboard

~~~bash
npm install
npm run dev
~~~

Create a local environment file from the repository example and provide the required Supabase variables. Keep service-role credentials on the server or edge device; never expose them through public client variables.

## Run the edge node

~~~bash
pip install -r requirements.txt
python pi_scripts/recognize_attendance.py
~~~

The Raspberry Pi needs its own Supabase configuration, camera access and hardware-specific dependencies.

## Engineering notes

- The inspected edge implementation uses OpenCV LBPH recognition.
- Frames stay local during recognition; the dashboard receives attendance records rather than a continuous camera feed.
- Local queue and retry handling reduce delivery failures, but do not prove lossless delivery under every network condition.
- Biometric privacy, recognition evaluation, access control and failure recovery need further validation before institutional use.

More detailed architecture and source-linked decisions are documented in the [portfolio case study](https://syahmiaof.my/projects/greetly).

## Status

Active development. Public interfaces may use demonstration data. No accuracy percentage, time saving or availability guarantee is claimed.

## Author

[Muhammad Syahmi](https://syahmiaof.my) · [GitHub](https://github.com/syahmiaof) · [Email](mailto:syahmiaof123@gmail.com)
