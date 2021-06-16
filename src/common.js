import {
  ModalProgrammatic as Modal,
  NotificationProgrammatic as Notification,
} from "buefy";
import api from "./api.js";
import router from "./router";
import store from "./store";

export function showComponentAsModal(parent, componentName, props = {}) {
  let width = "640px";
  if ("width" in props) {
    width = props.width;
  }

  Modal.open({
    parent: parent,
    hasModalCard: true,
    canCancel: false,
    props: props,
    width: width,
    component: () =>
      import(
        /* webpackChunkName: "[componentPath]" */ `@/components/${componentName}.vue`
      ),
    trapFocus: true,
  });
}

export function urlParams() {
  let paramStr = window.location.href.substring(
    window.location.href.indexOf("?") + 1,
    window.location.href.length
  );
  let paramArray = paramStr.split("&");
  let params = {};

  for (let i in paramArray) {
    let paramArrayItem = paramArray[i].split("=");
    if (paramArrayItem.length == 2) {
      params[decodeURIComponent(paramArrayItem[0])] = decodeURIComponent(
        paramArrayItem[1]
      );
    }
  }

  return params;
}

export function getUrlParam(name, def = null) {
  let params = urlParams();
  if (name in params) {
    return params[name];
  }

  return def;
}

export function logout() {
  if (store.state.token !== null) {
    api.delete("/auth/revoke/" + store.state.token);
  }

  store.dispatch("clearToken");

  if (
    router.currentRoute.path == "/logout" ||
    ("requiresAuth" in router.currentRoute.meta &&
      router.currentRoute.meta.requiresAuth == true)
  ) {
    router.push({ path: "/" });
  }

  Notification.open({
    duration: 5000,
    message: "You have been logged out",
    position: "is-top-right",
    type: "is-success",
    hasIcon: true,
    animation: "slidex",
  });
}

export function relativeEpochDate(epoch) {
  let d = new Date(0);
  d.setUTCSeconds(parseInt(epoch));

  let now = new Date();
  let dif = Math.round((now.getTime() - d.getTime()) / 1000);

  if (dif < 60) {
    // let v = dif;
    // return v + " sec" + (v != 1 ? "s" : "") + " ago";
    return "Just now";
  } else if (dif < 3600) {
    let v = Math.round(dif / 60);
    return v + " min" + (v != 1 ? "s" : "") + " ago";
  } else if (dif < 86400) {
    let v = Math.round(dif / 3600);
    return v + " hour" + (v != 1 ? "s" : "") + " ago";
  } else if (dif < 604800) {
    let v = Math.round(dif / 86400);
    return v + " day" + (v != 1 ? "s" : "") + " ago";
  } else if (dif < 2419200) {
    let v = Math.round(dif / 604800);
    return v + " week" + (v != 1 ? "s" : "") + " ago";
  }

  let monthString = Array(
    "Jan",
    "Fed",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  );
  return monthString[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

export function linkify(str) {
  // var newStr =  str.replace(/((http(s)?(:\/\/))?(www\.)?([a-zA-Z0-9-_./])*(\.[a-zA-Z]{2,3}\/?))([a-zA-Z0-9-_/?=&#])*(?!(.*a>)|('|"))/g,'<a href="$1">$1</a>');
  // var newStr = str;
  // return newStr;
  var re =
    /((?:href|src)=")?(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  str = str.replace(re, function (match, attr) {
    if (typeof attr != "undefined") {
      return match;
    }
    return '<a target="_blank" href="' + match + '">' + match + "</a>";
  });

  return str;
}

export function sortOnKey(arr, key, string, desc) {
  const sortOnKeyFunc = (key, string, desc) => {
    const caseInsensitive = string && string === "CI";
    return (a, b) => {
      a = caseInsensitive ? a[key].toLowerCase() : a[key];
      b = caseInsensitive ? b[key].toLowerCase() : b[key];
      if (string) {
        return desc ? b.localeCompare(a) : a.localeCompare(b);
      }
      return desc ? b - a : a - b;
    };
  };

  return arr.sort(sortOnKeyFunc(key, string, desc));
}

export function whichTransitionEvent() {
  var t,
    el = document.createElement("fakeelement");

  var transitions = {
    transition: "transitionend",
    OTransition: "oTransitionEnd",
    MozTransition: "transitionend",
    WebkitTransition: "webkitTransitionEnd",
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

export function checkAxiosErrorDefined(error) {
  try {
    return typeof error.response.data.errors !== "undefined";
  } catch (e) {
    return false;
  }
}
