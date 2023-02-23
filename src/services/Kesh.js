import axios from "axios";
const END_POINT = "/kesh";

class BaseService {
  all() {
    return axios.get(END_POINT + "/all").then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/create", data).then((res) => {
      return res;
    });
  }
}
export default new BaseService();
