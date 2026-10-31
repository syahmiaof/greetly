import paramiko
import time

hostname = '192.168.137.47'
username = 'syahmiaof123'
password = 'Abcd_1234'

try:
    print(f"Connecting to {hostname}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password, timeout=10)
    print("Connected successfully!")
    
    commands = [
        "cd /home/syahmiaof123/project01 && git pull origin main",
        "cd /home/syahmiaof123/project01 && cp pi_scripts/recognize_attendance.py ./recognize_attendance.py"
    ]
    
    for cmd in commands:
        print(f"Executing: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        print("STDOUT:", stdout.read().decode())
        print("STDERR:", stderr.read().decode())
        
    ssh.close()
    print("Done!")
except Exception as e:
    print(f"Error: {e}")
