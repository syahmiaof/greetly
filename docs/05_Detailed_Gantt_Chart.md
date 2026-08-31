# Greetly: Detailed Technical & Commercialization Gantt Chart

Jadual perancangan (Gantt Chart) ini meliputi fasa teknikal (FYP), validasi pasaran (Pertandingan Inovasi), dan pengkomersilan penuh (Startup/VC).

```mermaid
gantt
    title Greetly Master Project Timeline (12 Months)
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Phase 1: Ideation & Feasibility
    Requirements Gathering           :done,    p1, 2026-08-01, 14d
    Competitor Analysis (TimeTec)    :done,    p2, after p1, 7d
    Hardware Components Sourcing     :done,    p3, 2026-08-15, 10d
    
    section Phase 2: Technical Development (FYP Core)
    Supabase DB & Schema Setup       :done,    t1, 2026-08-25, 5d
    Next.js Dashboard UI Build       :done,    t2, 2026-08-28, 14d
    Python Raspberry Pi CV Script    :active,  t3, 2026-09-01, 14d
    Hardware Breadboard Assembly     :active,  t4, 2026-09-05, 14d
    Edge-Cloud Integration Testing   :         t5, after t3, 10d
    
    section Phase 3: Advanced Optimization
    Anti-Spam (Sudah Hadir) Logic    :         o1, 2026-09-20, 7d
    UI Theme Switcher (Deep Tech)    :         o2, 2026-09-25, 5d
    OTA Hardware Telemetry Sync      :         o3, 2026-09-27, 7d
    Security Audit & PDPA Rules      :         o4, 2026-10-01, 7d

    section Phase 4: Pilot & Academic (FYP)
    Pilot Test 1 (TVET MARA Besut)   :         a1, 2026-10-15, 30d
    Data Collection (Accuracy/Bandwidth):      a2, 2026-10-20, 30d
    Thesis/Academic Report Writing   :         a3, 2026-10-10, 45d
    FYP Final Presentation           :milestone, a4, 2026-11-25, 0d

    section Phase 5: Innovation Pitch & IP
    Marketing Video Production (CapCut):       i1, 2026-11-01, 14d
    MyIPO Voluntary Notification     :         i2, 2026-11-10, 14d
    Patent Agent Drafting            :         i3, 2026-11-25, 30d
    International Innovation Expo    :milestone, i4, 2026-12-15, 0d

    section Phase 6: Commercialization (Startup)
    Custom Kiosk 3D Printing (V1)    :         c1, 2026-12-01, 20d
    Investor & Grant Pitching        :         c2, 2027-01-01, 45d
    OEM Sourcing (Alibaba/PCBWay)    :         c3, 2027-02-15, 30d
    Mass Production (Batch 1)        :         c4, 2027-03-15, 45d
    B2B Launch (School deployment)   :milestone, c5, 2027-05-01, 0d
```
