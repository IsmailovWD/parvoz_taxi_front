import { io } from "socket.io-client";
const BASE_URL = `http://92.255.104.120:3010`
// const BASE_URL = `http://localhost:3010`;
class SocketioService {
  socket;
  constructor() {}
  connect() {
    this.socket = io(BASE_URL, {
      query: {
        token_user: localStorage.getItem("token"),
      },
    });
  }
}

export default new SocketioService();
