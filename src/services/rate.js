import axios from "axios";
const END_POINT = "/rate";

class BaseService {
  getAll() {
    return axios.get(END_POINT + "/all").then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/create", data).then((res) => {
      return res;
    });
  }
  one(data) {
    return axios.get(END_POINT + "/change/" + data).then((res) => {
      return res;
    });
  }
  update(data, id) {
    return axios.patch(END_POINT + "/update/" + id, data).then((res) => {
      return res;
    });
  }
}
export default new BaseService();
