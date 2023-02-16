import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const latLongValue = defineStore("latlong", () => {
  let lat = ref({
    name: null,
    coords: null,
  });
  let long = ref({
    name: null,
    coords: null,
  });
  let focus = ref({
    where: null,
    whereto: null,
  });
  return { lat, long, focus };
});
