# Real-time Student Attendance Monitoring Dashboard

## Overview

This project is a real-time dashboard for monitoring student attendance. It uses Next.js for the frontend and Supabase for the backend, providing live updates via Supabase's realtime features.

## Setup Instructions

### Environment Variables

To run this project, you need to configure your Supabase credentials in a `.env.local` file at the root of your project. Create a `.env.local` file and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema Requirements

The application requires an `attendance` table in your Supabase database. Ensure you create a table with the following schema:

- `id`: `uuid` (Primary Key, Default: `uuid_generate_v4()`)
- `student_id`: `varchar` or `text` (The ID of the student)
- `student_name`: `varchar` or `text` (The name of the student)
- `status`: `varchar` or `text` (E.g., 'Present', 'Absent', 'Late')
- `timestamp`: `timestamptz` (Default: `now()`)

**Important**: Ensure that you have Realtime enabled for the `attendance` table in your Supabase project settings.

### Running the Development Server

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing Supabase Realtime Data Stream

To test the realtime data stream:
1. Ensure your `.env.local` is correctly configured and the development server is running.
2. Open the dashboard in your browser ([http://localhost:3000](http://localhost:3000)).
3. Go to your Supabase project dashboard, navigate to the Table Editor, and select the `attendance` table.
4. Insert a new row, update an existing row, or delete a row.
5. Observe the dashboard in your browser; the attendance list should update automatically in real-time without needing a page refresh.
