-- ==============================================================================
-- GREETLY DATABASE BACKUP: SCHEMA & ARCHITECTURE (01_schema.sql)
-- Generated for: Greetly - Real-time AI Facial Attendance System
-- Original Project Ref: czgcacpkdjmuomryceqs
-- Target: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. TABLE: students
-- Stores all registered students, their facial recognition labels & status
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(255) NOT NULL,
    grade_class VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup during camera facial matching
CREATE INDEX IF NOT EXISTS idx_students_student_name ON public.students(student_name);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_class ON public.students(grade_class);

-- ------------------------------------------------------------------------------
-- 3. TABLE: attendance_logs
-- Stores real-time attendance logs fired by Raspberry Pi / Camera
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- 'Present', 'Late', 'Absent'
    confidence_score NUMERIC(5, 2),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning fast dashboard aggregation & date filtering
CREATE INDEX IF NOT EXISTS idx_attendance_logs_timestamp ON public.attendance_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_student_id ON public.attendance_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_status ON public.attendance_logs(status);

-- ------------------------------------------------------------------------------
-- 4. TABLE: hardware_config
-- Bidirectional control bridge between Next.js Web Dashboard & Raspberry Pi
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hardware_config (
    id INT PRIMARY KEY DEFAULT 1,
    cooldown_seconds INT NOT NULL DEFAULT 120,
    buzzer_duration NUMERIC(4, 2) NOT NULL DEFAULT 0.50,
    kiosk_reset INT NOT NULL DEFAULT 30, -- -1: trigger buzzer, -98: restart Pi, -99: shutdown Pi
    gate_locked BOOLEAN NOT NULL DEFAULT false,
    kiosk_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT single_row_config CHECK (id = 1)
);

-- ------------------------------------------------------------------------------
-- 5. TABLE: hardware_telemetry
-- Real-time hardware health metrics (CPU load, Temp, Last Ping) from Raspberry Pi
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hardware_telemetry (
    id INT PRIMARY KEY DEFAULT 1,
    last_ping TIMESTAMPTZ NOT NULL DEFAULT now(),
    temperature NUMERIC(4, 1) DEFAULT 45.0,
    cpu_load NUMERIC(4, 1) DEFAULT 15.0,
    CONSTRAINT single_row_telemetry CHECK (id = 1)
);

-- ------------------------------------------------------------------------------
-- 6. VIEW & RULE: attendance (Backward-compatibility for legacy queries)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.attendance AS
SELECT 
    al.id,
    al.student_id,
    al.status,
    al.confidence_score,
    al.timestamp AS created_at,
    al.timestamp,
    s.student_name,
    s.student_id AS student_matric,
    s.grade_class
FROM public.attendance_logs al
LEFT JOIN public.students s ON al.student_id = s.id;

-- Rule to allow updating status directly through the attendance view
CREATE OR REPLACE RULE attendance_update AS 
ON UPDATE TO public.attendance DO INSTEAD 
UPDATE public.attendance_logs 
SET status = NEW.status 
WHERE id = OLD.id;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Enables open access for Edge IoT device & Next.js dashboard via anon key
-- ------------------------------------------------------------------------------
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware_telemetry ENABLE ROW LEVEL SECURITY;

-- Students policy
DROP POLICY IF EXISTS "Allow public all operations on students" ON public.students;
CREATE POLICY "Allow public all operations on students" 
ON public.students FOR ALL 
TO public, anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Attendance logs policy
DROP POLICY IF EXISTS "Allow public all operations on attendance_logs" ON public.attendance_logs;
CREATE POLICY "Allow public all operations on attendance_logs" 
ON public.attendance_logs FOR ALL 
TO public, anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Hardware config policy
DROP POLICY IF EXISTS "Allow public all operations on hardware_config" ON public.hardware_config;
CREATE POLICY "Allow public all operations on hardware_config" 
ON public.hardware_config FOR ALL 
TO public, anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Hardware telemetry policy
DROP POLICY IF EXISTS "Allow public all operations on hardware_telemetry" ON public.hardware_telemetry;
CREATE POLICY "Allow public all operations on hardware_telemetry" 
ON public.hardware_telemetry FOR ALL 
TO public, anon, authenticated 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 8. SUPABASE REALTIME REPLICATION
-- Adds tables to the realtime publication so live changes stream to the web UI
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_logs;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.hardware_config;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.hardware_telemetry;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;
