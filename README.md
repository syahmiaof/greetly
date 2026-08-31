# Greetly - Smart Attendance Ecosystem

Developed by syahmiaof. **Greetly** is a next-generation, enterprise-grade attendance management ecosystem designed to streamline check-ins, monitor hardware health, and provide real-time insights with unparalleled performance and aesthetics. Built for deep-tech environments, Greetly offers a seamless blend of IoT capabilities and modern web technologies.

## 🚀 Tech Stack

Greetly leverages a cutting-edge modern tech stack to ensure reliability, scale, and performance:

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework for the web
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **Backend as a Service**: [Supabase](https://supabase.com/) - Open source Firebase alternative
  - **Auth**: Secure, enterprise-grade user authentication
  - **Database**: PostgreSQL with Row Level Security (RLS)
  - **Realtime**: Live updates for dashboard metrics and IoT statuses
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful and consistent iconography

## ✨ Key Features

- **Real-time Dashboard**: Instantly monitor attendance metrics, system vitals, and recent activity with live Supabase Realtime updates.
- **IoT Kiosk (Hardware Monitor)**: Track the status and health of remote IoT attendance kiosks globally, ensuring maximum uptime.
- **Settings Configurator**: Granular control over application behavior, access permissions, and user preferences.
- **Theme Switcher**: Multiple premium themes including **Aurora**, **Deep Tech**, and more to match your organizational branding.
- **Secure Auth**: Robust user authentication and session management powered by Supabase Auth.

## 🛠️ Setup Instructions

Follow these steps to get Greetly running locally on your machine.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm
- A [Supabase](https://supabase.com/) project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and populate it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---
*Developed with precision for modern enterprises.*
