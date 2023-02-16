import { io } from "socket.io-client";
const BASE_URL = `http://85.193.87.147:3010`
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
