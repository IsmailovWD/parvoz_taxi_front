import { createApp } from "vue";
import { createPinia } from "pinia";
import NaiveUI from "naive-ui";
import VWave from "v-wave";
import axios from "axios";
import Provider from "./components/Provider.vue";
import router from "./router";
const app = createApp(Provider);
app.use(createPinia());
import { useErrorStore } from "./stores/errors";
const error_store = useErrorStore();
let BASE_URL = import.meta.env.VITE_BASE_URL + "/api";
axios.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ` + localStorage.getItem("token");
    config.headers["number"] = localStorage.getItem("number");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response.status == 401) {
      error_store.error_text = error.response.data.message;
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

axios.defaults.baseURL = BASE_URL;

app.use(router);
app.use(NaiveUI);
app.use(VWave, {
  color: "#fff",
  initialOpacity: 0.3,
  duration: 0.5,
  easing: "ease-in",
});
app.mount("#app");
