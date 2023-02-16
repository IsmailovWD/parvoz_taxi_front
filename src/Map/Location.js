import ymaps from 'vue-yandex-maps'

class newLocation {
  location(e) {
    return e.get('coords')
  }
}
export default new newLocation();