import socket
from threading import Thread
from routes import app, queue

def one_client_connection(client):
    while True:
        try:
            client.sendall(str(queue.get_nowait()).encode("utf-8"))
        except:
            pass

def run_pager_socket(queue):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 12345))
    server.listen()

    while True:
        client, addr = server.accept()
        print(f"Connection from {addr}")
        Thread(target=one_client_connection, args=(client,), daemon=True).start()

Thread(target=run_pager_socket, args=(queue,), daemon=True).start()

app.run(host="0.0.0.0", port=5000)