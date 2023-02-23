import axios from "axios";
const END_POINT = "/order";

class BaseService {
  all(data) {
    return axios.get(END_POINT + "/all", { params: data }).then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/create", data).then((res) => {
      return res;
    });
  }
  completed_all(data) {
    return axios
      .get(END_POINT + "/completed/all", { params: data })
      .then((res) => {
        return res;
      });
  }
  keshbak_update(data) {
    return axios
      .get(END_POINT + "/keshbek/" + data)
      .then((res) => {
        return res;
      });
  }
}
export default new BaseService();
