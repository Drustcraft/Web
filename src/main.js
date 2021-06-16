import Vue from "vue";

// DEV TOOLS
if (process.env.NODE_ENV === "development") {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "http://localhost:8098";
  document.head.appendChild(s);
}

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./validation";
import api from "./api.js";
import VueMeta from "vue-meta";
import Buefy from "buefy";
import axios from "axios";
import SortedTablePlugin from "vue-sorted-table";
import Progress from "./progress.js";

Vue.config.productionTip = false;

Vue.use(SortedTablePlugin, {
  ascIcon: '<i class="fas fa-chevron-down"></i>',
  descIcon: '<i class="fas fa-chevron-up"></i>',
});
Vue.use(VueMeta);
Vue.use(Buefy, {
  defaultIconPack: "fas",
});

/* Intercept axios send */
api.interceptors.request.use(
  (config) => {
    Progress.start();

    // add authorization header if we have a token
    let token = store.getters.token;
    if (token !== null) {
      config.headers.Authorization = token;
    }

    // add cancel token to store
    let source = axios.CancelToken.source();
    config.cancelToken = source.token;
    store.commit("addCancelToken", source);

    // console.log("SEND " + config.url + " " + JSON.stringify(config.data));
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/* Intercept POST receive */
api.interceptors.response.use(
  (response) => {
    Progress.end();

    if (response.data && "errors" in response.data) {
      response.data.errors.forEach((item) => {
        let code = item.code.toUpperCase();
        if (
          code === "ACCESS_TOKEN_EXPIRED" ||
          code === "ACCESS_TOKEN_REVOKED"
        ) {
          store.dispatch("clearToken");
        }
      });
    }

    if (store.state.token != null) {
      store.dispatch("extendToken");
    }

    // console.log("RECV " + response.config.url + " " + JSON.stringify(response.data));
    return response;
  },
  (error) => {
    Progress.end();
    throw error;
  }
);

Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

/* Polyfills */
if (!Object.prototype.each) {
  Object.defineProperty(Object.prototype, "each", {
    value: function (callback, thisArg) {
      if (this == null) {
        throw new TypeError("Not an object");
      }
      thisArg = thisArg || window;
      for (var key in this) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          callback.call(thisArg, this[key], key, this);
        }
      }
    },
  });
}

if (!Object.prototype.every) {
  Object.defineProperty(Object.prototype, "every", {
    value: function (callback, thisArg) {
      if (this == null) {
        throw new TypeError("Not an object");
      }
      thisArg = thisArg || window;
      for (var key in this) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          if (callback.call(thisArg, this[key], key, this) !== false) {
            break;
          }
        }
      }
    },
  });
}
