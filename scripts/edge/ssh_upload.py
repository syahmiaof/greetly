import paramiko
import os

hostname = '192.168.137.47'
username = 'syahmiaof123'
password = 'Abcd_1234'
local_path = 'pi_scripts/recognize_attendance.py'
remote_path = '/home/syahmiaof123/project01/recognize_attendance.py'

try:
    print(f"Connecting to {hostname}...")
    transport = paramiko.Transport((hostname, 22))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)
    print("Upload complete!")
    
    sftp.close()
    transport.close()
except Exception as e:
    print(f"Error: {e}")
