import { createApp, reactive } from "vue";
import App from "./App.vue";
import router from "./router";

import VueSweetalert2 from "vue-sweetalert2";
import "../src/assets/@sweetalert2/theme-dark/dark.css";
import VueNumber from "vue-number-animation";
import humanizeDuration from "humanize-duration";

const app = createApp(App);

import {
  getRandomInt,
  makeid,
  truncate,
  send,
  alertSweet,
  sleep,
} from "../src/defaults/default";

app.config.globalProperties.$user = reactive({
  info: {
    nick: `Nieznajomy`,
    avatar: "default.png",
    role: "USER",
    wallets: {},
  },
});

app.config.globalProperties.$profile = reactive({ name: false });

app.config.globalProperties.avatar = function avatar(req) {
  return require(`../public/avatars/${req}`);
};

//Functions global
app.config.globalProperties.randomInt = getRandomInt;

app.config.globalProperties.makeid = makeid;
app.config.globalProperties.truncate = truncate;
app.config.globalProperties.$send = send;
app.config.globalProperties.$alert = alertSweet;
app.config.globalProperties.$sleep = sleep;

app.config.globalProperties.$domain = `http://localhost:2137`;

app.use(VueSweetalert2);
app.use(router);
app.use(VueNumber);
app.use(humanizeDuration);
app.mount("#app");
