import axios from "axios";
const END_POINT = "/report";

class BaseService {
  report_driver_rating() {
    return axios.get(END_POINT + "/driver_rating").then((res) => {
      return res;
    });
  }
}
export default new BaseService();
