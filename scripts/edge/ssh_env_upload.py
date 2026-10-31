import paramiko

hostname = '192.168.137.47'
username = 'syahmiaof123'
password = 'Abcd_1234'
local_path = '.env.local'
remote_path = '/home/syahmiaof123/project01/.env.local'

try:
    transport = paramiko.Transport((hostname, 22))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    sftp.put(local_path, remote_path)
    sftp.close()
    transport.close()
    print("Env upload complete!")
except Exception as e:
    print(f"Error: {e}")
