import paramiko

hostname = '192.168.137.47'
username = 'syahmiaof123'
password = 'Abcd_1234'

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password, timeout=10)
    
    python_cmd = """
import os
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime
load_dotenv('.env.local')
supabase = create_client(os.environ.get('NEXT_PUBLIC_SUPABASE_URL'), os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY'))
try:
    res = supabase.table('hardware_telemetry').upsert({'id': 1, 'last_ping': datetime.utcnow().isoformat() + 'Z', 'temperature': 45.0, 'cpu_load': 15.0}).execute()
    print('Success:', res.data)
except Exception as e:
    print('Error:', e)
"""
    
    stdin, stdout, stderr = ssh.exec_command(f"python3 -c \"{python_cmd}\"")
    print("STDOUT:", stdout.read().decode())
    print("STDERR:", stderr.read().decode())
    ssh.close()
except Exception as e:
    print(f"Error: {e}")
