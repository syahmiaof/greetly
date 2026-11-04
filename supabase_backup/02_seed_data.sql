-- ==============================================================================
-- GREETLY DATABASE BACKUP: SEED & INITIAL DATA (02_seed_data.sql)
-- Restores initial state, default student records, and baseline hardware rows
-- ==============================================================================

-- 1. Initialize Hardware Configuration (Single Row id=1)
INSERT INTO public.hardware_config (id, cooldown_seconds, buzzer_duration, kiosk_reset, gate_locked, kiosk_active, updated_at)
VALUES (1, 120, 0.50, 30, false, true, now())
ON CONFLICT (id) DO UPDATE 
SET cooldown_seconds = EXCLUDED.cooldown_seconds,
    buzzer_duration = EXCLUDED.buzzer_duration,
    kiosk_reset = EXCLUDED.kiosk_reset,
    gate_locked = EXCLUDED.gate_locked,
    kiosk_active = EXCLUDED.kiosk_active,
    updated_at = now();

-- 2. Initialize Hardware Telemetry (Single Row id=1)
INSERT INTO public.hardware_telemetry (id, last_ping, temperature, cpu_load)
VALUES (1, now(), 44.5, 12.0)
ON CONFLICT (id) DO UPDATE 
SET last_ping = EXCLUDED.last_ping,
    temperature = EXCLUDED.temperature,
    cpu_load = EXCLUDED.cpu_load;

-- 3. Core Student Records
INSERT INTO public.students (student_id, student_name, grade_class, status)
VALUES 
    ('S001', 'Syahmi Aof', '4 Sains', 'Active'),
    ('S002', 'Abu Bakar', '4 Sains', 'Active'),
    ('S003', 'Nur Aina Farhana', '4 Sains', 'Active'),
    ('S004', 'Muhammad Danial', '4 Amanah', 'Active'),
    ('S005', 'Siti Sarah', '4 Amanah', 'Active'),
    ('S006', 'Ahmad Faiz', '5 Sains', 'Active'),
    ('S007', 'Farah Nabilah', '5 Sains', 'Active'),
    ('S008', 'Khairul Anuar', '5 Amanah', 'Active'),
    ('S009', 'NURIZMA', 'Fakulti IT', 'Active'),
    ('S010', 'Haikal Zikri', '4 Cekap', 'Active')
ON CONFLICT (student_id) DO NOTHING;

-- 4. Initial Sample Attendance Logs
DO $$
DECLARE
    v_syahmi_id UUID;
    v_abu_id UUID;
    v_aina_id UUID;
    v_danial_id UUID;
    v_sarah_id UUID;
BEGIN
    SELECT id INTO v_syahmi_id FROM public.students WHERE student_id = 'S001' LIMIT 1;
    SELECT id INTO v_abu_id FROM public.students WHERE student_id = 'S002' LIMIT 1;
    SELECT id INTO v_aina_id FROM public.students WHERE student_id = 'S003' LIMIT 1;
    SELECT id INTO v_danial_id FROM public.students WHERE student_id = 'S004' LIMIT 1;
    SELECT id INTO v_sarah_id FROM public.students WHERE student_id = 'S005' LIMIT 1;

    IF v_syahmi_id IS NOT NULL THEN
        INSERT INTO public.attendance_logs (student_id, status, confidence_score, timestamp)
        VALUES 
            (v_syahmi_id, 'Present', 96.50, now() - INTERVAL '2 hours'),
            (v_syahmi_id, 'Present', 95.80, now() - INTERVAL '1 day 2 hours');
    END IF;

    IF v_abu_id IS NOT NULL THEN
        INSERT INTO public.attendance_logs (student_id, status, confidence_score, timestamp)
        VALUES (v_abu_id, 'Present', 91.20, now() - INTERVAL '1 hour 45 minutes');
    END IF;

    IF v_aina_id IS NOT NULL THEN
        INSERT INTO public.attendance_logs (student_id, status, confidence_score, timestamp)
        VALUES (v_aina_id, 'Late', 88.40, now() - INTERVAL '30 minutes');
    END IF;

    IF v_danial_id IS NOT NULL THEN
        INSERT INTO public.attendance_logs (student_id, status, confidence_score, timestamp)
        VALUES (v_danial_id, 'Present', 93.70, now() - INTERVAL '2 hours 10 minutes');
    END IF;

    IF v_sarah_id IS NOT NULL THEN
        INSERT INTO public.attendance_logs (student_id, status, confidence_score, timestamp)
        VALUES (v_sarah_id, 'Absent', NULL, now() - INTERVAL '3 hours');
    END IF;
END $$;
