// WebSocketService.js

class WebSocketService {
    constructor() {
      this.socket = null;
    }
  
    connect() {
        console.log("connecting to Socket")
      this.socket = new WebSocket('ws://localhost:8080'); // Replace with your server URL
    }
  
    disconnect() {
      if (this.socket) {
        console.log("disconnecting socket")
        this.socket.close();
      }
    }
  
    subscribeToMessages(callback) {
      if (!this.socket) {
        throw new Error('WebSocket connection not established.');
      }
  
      this.socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        callback(message);
      });
    }
  
    sendMessage(message) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
          // If the socket is not open yet, wait for the connection to be established
          setTimeout(() => {
            this.sendMessage(message);
          }, 1000); // Retry after 1 second
          return;
        }
      
        this.socket.send(JSON.stringify(message));
      }
      
  }
  
  const webSocketService = new WebSocketService();
  export default webSocketService;
  