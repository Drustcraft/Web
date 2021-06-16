import Vue from "vue";
import Vuex from "vuex";
import cookies from "vue-cookies";
import api from "../api.js";
import uuidv4 from "uuid";

Vue.use(Vuex);
Vue.use(cookies);

function getPlatformValue() {
  const value = localStorage.getItem("platform");
  if (value != "java" && value != "bedrock") return "java";

  return value;
}

function getTokenValue() {
  let token = Vue.$cookies.get("token");

  if (token !== null && token.length > 0) {
    let splitIndex = token.indexOf(" ");
    if (splitIndex != -1) {
      return token.substring(splitIndex + 1);
    }
  }

  return null;
}

function getTokenType() {
  let token = Vue.$cookies.get("token");

  if (token !== null && token.length > 0) {
    let splitIndex = token.indexOf(" ");
    if (splitIndex != -1) {
      return token.substring(0, splitIndex);
    }
  }

  return null;
}

export default new Vuex.Store({
  state: {
    token: getTokenValue(),
    token_type: getTokenType(),
    token_timeout: null,
    account_uuid: null,
    account_groups: null,
    platform: getPlatformValue(),
    cancelTokens: [],
    debounce: [],
    analytics_token: uuidv4(),
  },

  mutations: {
    token(state, payload) {
      state.token = payload;
    },

    token_type(state, payload) {
      state.token_type = payload;
    },

    token_timeout(state, payload) {
      state.token_timeout = payload;
    },

    account_uuid(state, payload) {
      state.account_uuid = payload;
    },

    account_groups(state, payload) {
      state.account_groups = payload;
    },

    platform(state, payload) {
      state.platform = payload;
      if (payload == "") {
        localStorage.removeItem("platform");
      } else {
        localStorage.setItem("platform", payload);
      }
    },

    addCancelToken(state, payload) {
      state.cancelTokens.push(payload);
    },

    clearCancelTokens(state) {
      state.cancelTokens = [];
    },
  },
  actions: {
    setToken(context, token_data) {
      Vue.$cookies.set(
        "token",
        token_data.token_type + " " + token_data.token_value,
        "1h"
      );
      context.commit("token", token_data.token_value);
      context.commit("token_type", token_data.token_type);
      context.commit("account_uuid", token_data.account_uuid);
    },

    clearToken({ commit, state }) {
      Vue.$cookies.remove("token");
      commit("token", null);
      commit("token_type", null);
      commit("account_uuid", null);
      commit("account_groups", null);

      if (state.token_timeout !== null) {
        window.clearTimeout(state.token_timeout);
        commit("token_timeout", null);
      }

      // logout();
    },

    async verifyToken({ commit, state, dispatch }) {
      if (state.token !== null) {
        await api
          .get("/auth/" + state.token)
          .then((response) => {
            commit("token", response.data.access_token);
            commit("token_type", response.data.token_type);
            commit("account_uuid", response.data.account_uuid);
            commit("account_groups", response.data.groups);
          })
          .catch(() => {
            dispatch("clearToken");
          });
      }
    },

    extendToken({ commit, state, dispatch }) {
      if (
        state.token !== null &&
        state.token_type !== null &&
        state.token_type === "bearer"
      ) {
        Vue.$cookies.set("token", state.token_type + " " + state.token, "1h");
        if (state.token_timeout !== null) {
          window.clearTimeout(state.token_timeout);
          commit("token_timeout", null);
        }

        commit(
          "token_timeout",
          window.setTimeout(function () {
            dispatch("clearToken");
          }, 3600000)
        );
      }
    },

    cancelPendingRequests(context) {
      context.state.cancelTokens.forEach((request) => {
        if (request.cancel) {
          request.cancel();
        }
      });

      context.commit("clearCancelTokens");
    },
  },
  getters: {
    token: (state) => {
      if (state.token !== null && state.token_type !== null) {
        return state.token_type + " " + state.token;
      }

      return null;
    },

    token_timeout: (state) => {
      return state.token_timeout;
    },

    account_uuid: (state) => {
      return state.account_uuid;
    },

    account_groups: (state) => {
      return state.account_groups;
    },

    platform: (state) => {
      return state.platform;
    },

    cancelTokens: (state) => {
      return state.cancelTokens;
    },

    analytics_token: (state) => {
      return state.analytics_token;
    },

    inAccountGroup: (state) => (groupname) => {
      if (state.account_groups) {
        return groupname in state.account_groups;
      }

      return false;
    },
  },
});
