
import paramiko
import time

hostname = "192.168.137.47"
username = "syahmiaof123"
password = "Abcd_1234"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password, timeout=10)
    
    # Kill the currently running script on the Pi
    print("Killing existing Python script on Pi...")
    ssh.exec_command("pkill -9 -f recognize_attendance")
    time.sleep(2)
    
    # Run the new script in the background
    print("Starting new Python script on Pi...")
    ssh.exec_command("cd /home/syahmiaof123/project01 && nohup python /home/syahmiaof123/project01/recognize_attendance.py > run.log 2>&1 &")
    
    ssh.close()
    print("Deployment successful! The script is now running in the background on the Pi.")
except Exception as e:
    print(f"Deployment failed: {e}")

