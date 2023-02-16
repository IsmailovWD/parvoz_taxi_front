import axios from 'axios'
const END_POINT = '/custom_location'

class BaseService {
  all(data) {
    return axios.get(END_POINT + '/all', {params: data}).then((res) => {
      return res
    })
  }
  create(data) {
    return axios.post(END_POINT + '/create', data).then((res) => {
      return res
    })
  }
  update(data) {
    return axios.patch(END_POINT + '/update', data).then((res) => {
      return res
    })
  }
  filter(data) {
    return axios.get(END_POINT + '/filter', {params: data}).then((res) => {
      return res
    })
  }
}
export default new BaseService()