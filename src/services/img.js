import axios from 'axios'
const END_POINT = 'driver/images'

class BaseService {
  one(id) {
    return axios.get(END_POINT + '/one?id=' + id).then((res) => {
      return res
    })
  }
}
export default new BaseService()