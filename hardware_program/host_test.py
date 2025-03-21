import socket

HOST = "0.0.0.0"
PORT = 12345

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen(5)

print(f"Server listening on {HOST}:{PORT}")

while True:
    client, addr = server.accept()
    print(f"Connection from {addr}")
    try:
        while True:
            data = client.recv(1024).decode("utf-8")
            if not data:
                break
            print(f"Received: {data}")
            client.sendall("ACK\n".encode("utf-8"))
    except:
        pass
    print("Client disconnected")
