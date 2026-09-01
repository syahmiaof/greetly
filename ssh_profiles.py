import paramiko
hostname = '192.168.137.47'
username = 'syahmiaof123'
password = 'Abcd_1234'
try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password, timeout=10)
    stdin, stdout, stderr = ssh.exec_command("ls -la /home/syahmiaof123/project01/profiles")
    print(stdout.read().decode())
    ssh.close()
except Exception as e:
    print(f"Error: {e}")
