# Architecture Notes

## Real-time Student Attendance Monitoring Dashboard

### Tech Stack
- **Frontend**: Next.js (React Framework)
- **Styling**: Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL)
- **Realtime Updates**: Supabase Realtime (WebSockets)

### Data Flow
1. **Initial Load**: When the dashboard loads, it fetches the current list of attendance records from the Supabase `attendance` table via a standard REST API call using the Supabase client.
2. **Realtime Subscriptions**: A Supabase realtime subscription is established on the `attendance` table.
3. **Event Handling**: 
    - On `INSERT`: New records are appended to the dashboard list.
    - On `UPDATE`: Existing records in the dashboard list are updated to reflect status changes.
    - On `DELETE`: Removed records are filtered out of the dashboard list.

### Component Structure
The UI components are kept in the `src/` directory. The main dashboard view subscribes to Supabase channels and manages the local React state based on incoming changes.
