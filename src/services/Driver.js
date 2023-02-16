import axios from "axios";
const END_POINT = "/driver";

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
  one(data) {
    return axios.get(END_POINT + "/one/" + data).then((res) => {
      return res;
    });
  }
  active_admin(id, data) {
    return axios.patch(END_POINT + "/active_admin/" + id, data).then((res) => {
      return res;
    });
  }
  summa(data) {
    return axios.get(END_POINT + "/summa", { params: data }).then((res) => {
      return res;
    });
  }
}
export default new BaseService();
