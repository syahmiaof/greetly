
with open("pi_scripts/recognize_attendance.py", "r", encoding="utf-8") as f:
    c = f.read()

# Replace BUZZER_PIN = 12 with BUZZER_PIN = 4
c = c.replace("BUZZER_PIN = 12", "BUZZER_PIN = 4")

# Revert to standard Active-Low logic for setup
old_setup = """# HACK IoT: Gunakan teknik "Open-Drain"
# Set pin sebagai INPUT (terapung/High-Z) supaya 5V dari buzzer tak dapat mengalir ke Ground. Ini akan paksa buzzer senyap.
GPIO.setup(BUZZER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_OFF)"""
new_setup = """# Set pin ke OUTPUT dan HIGH (matikan Active-Low buzzer)
GPIO.setup(BUZZER_PIN, GPIO.OUT)
GPIO.output(BUZZER_PIN, GPIO.HIGH)"""
c = c.replace(old_setup, new_setup)

# Revert to standard Active-Low logic for trigger
old_trigger = """def trigger_buzzer(duration=0.5):
    try:
        print(f"[debug] Sounding buzzer for {duration}s")
        # Tukar ke OUTPUT dan LOW (0V) untuk bagi elektrik mengalir dan bunyikan buzzer
        GPIO.setup(BUZZER_PIN, GPIO.OUT, initial=GPIO.LOW)
        time.sleep(duration)
        # Tukar balik ke INPUT untuk terapungkan pin dan matikan bunyi
        GPIO.setup(BUZZER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_OFF)
    except Exception as e:
        print(f"Buzzer Error: {e}")"""
new_trigger = """def trigger_buzzer(duration=0.5):
    try:
        print(f"[debug] Sounding buzzer for {duration}s")
        GPIO.output(BUZZER_PIN, GPIO.LOW)  # ON
        time.sleep(duration)
        GPIO.output(BUZZER_PIN, GPIO.HIGH) # OFF
    except Exception as e:
        print(f"Buzzer Error: {e}")"""
c = c.replace(old_trigger, new_trigger)

# Revert to standard Active-Low logic for cleanup
old_cleanup = """    # Letak pin buzzer ke INPUT sebelum exit untuk elak ia menjerit
    GPIO.setup(BUZZER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_OFF)"""
new_cleanup = """    GPIO.output(BUZZER_PIN, GPIO.HIGH)"""
c = c.replace(old_cleanup, new_cleanup)

with open("pi_scripts/recognize_attendance.py", "w", encoding="utf-8") as f:
    f.write(c)

