import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";
import Progress from "../progress.js";
import api from "../api.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        alias: ["/register", "/login", "/logout", "/contact"],
        name: "home",
        component: () => import("../views/Front.vue"),
        meta: {
          title: "Community driven MMORPG Minecraft",
          requiresAuth: false,
        },
      },
      {
        path: "/forums",
        component: () =>
          import(/* webpackChunkName: "forum" */ "../views/Forum.vue"),
        meta: { title: "Forums", requiresAuth: false },
      },
      {
        path: "/forums/:category_slug",
        component: () =>
          import(
            /* webpackChunkName: "forum-category" */ "../views/ForumCategory.vue"
          ),
        meta: { title: "Forums", requiresAuth: false },
      },
      {
        path: "/forums/:category_slug/new-thread",
        component: () =>
          import(/* webpackChunkName: "thread-new" */ "../views/ThreadNew.vue"),
        meta: { title: "New Thread", requiresAuth: true },
      },
      {
        path: "/thread/:thread_slug",
        component: () =>
          import(/* webpackChunkName: "thread" */ "../views/Thread.vue"),
        meta: { title: "Forums", requiresAuth: false },
      },
      {
        path: "/stats",
        component: () =>
          import(/* webpackChunkName: "stats" */ "../views/Stats.vue"),
        meta: { title: "Stats", requiresAuth: false },
      },
      {
        path: "/wiki",
        component: () =>
          import(/* webpackChunkName: "wiki" */ "../views/Wiki.vue"),
        meta: { title: "Wiki", requiresAuth: false },
        children: [
          {
            path: "(.*)?",
            component: () =>
              import(
                /* webpackChunkName: "wiki-page" */ "../views/WikiPage.vue"
              ),
          },
        ],
      },
      {
        path: "/status",
        component: () =>
          import(/* webpackChunkName: "status" */ "../views/Status.vue"),
        meta: { title: "Network Status", requiresAuth: false },
      },
    ],
  },
  {
    path: "/discord",
    name: "Discord",
    component: () =>
      import(/* webpackChunkName: "redirector" */ "../views/Redirecting.vue"),
    beforeEnter() {
      location.href = "https://discord.gg/yNzk4x7mpD";
    },
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/purchase",
    name: "purchase",
    component: () =>
      import(/* webpackChunkName: "purchase" */ "../views/Payment.vue"),
    meta: {
      title: "Purchase",
      requiresAuth: false,
    },
  },
  {
    path: "/faqs",
    name: "FAQs",
    component: () => import(/* webpackChunkName: "faqs" */ "../views/FAQs.vue"),
    meta: {
      title: "FAQs",
      requiresAuth: false,
    },
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () =>
      import(/* webpackChunkName: "privacy" */ "../views/Privacy.vue"),
    meta: {
      title: "Privacy Policy",
      requiresAuth: false,
    },
  },
  {
    path: "/terms",
    name: "Terms",
    component: () =>
      import(/* webpackChunkName: "terms" */ "../views/Terms.vue"),
    meta: {
      title: "Terms and Conditions",
      requiresAuth: false,
    },
  },
  {
    path: "/mods",
    name: "mods",
    component: () => import(/* webpackChunkName: "mods" */ "../views/Mods.vue"),
    meta: {
      title: "Mods",
      requiresAuth: false,
    },
  },
  {
    path: "/bedrock-update",
    name: "Bedrock Update",
    component: () =>
      import(
        /* webpackChunkName: "bedrock-update" */ "../views/BedrockUpdate.vue"
      ),
    meta: {
      title: "Bedrock Update",
      requiresAuth: false,
    },
  },
  {
    path: "/account",
    component: () =>
      import(/* webpackChunkName: "mods" */ "../views/Account.vue"),
    children: [
      { path: "/", redirect: "dashboard" },
      {
        path: "dashboard",
        name: "account",
        component: () => import("../views/AccountDashboard.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "stats",
        component: () => import("../views/AccountStats.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "web-forums",
        component: () => import("../views/AccountWebForums.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "web-page",
        component: () => import("../views/AccountWebPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "web-page/:path",
        component: () => import("../views/AccountWebPageEdit.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "site-warning/",
        component: () => import("../views/AccountWarning.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "site-email",
        component: () => import("../views/AccountEmail.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "*",
    name: "LoadPageFromDB",
    component: () =>
      import(
        /* webpackChunkName: "LoadPageFromDB" */ "../views/LoadPageFromDB.vue"
      ),
    meta: { requiresAuth: false },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.name) {
    Progress.start();
  }

  // cancel all pending POSTs on route change
  store.dispatch("cancelPendingRequests");

  // reset scroll
  window.scrollTo(0, 0);

  // update session id
  await store.dispatch("verifyToken");

  // check if auth required
  if ("requiresAuth" in to.meta && to.meta.requiresAuth == true) {
    if (store.getters.account_uuid == null) {
      next({ path: "/login?page=" + to.path });
      return;
    }
  }

  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = "Drustcraft - " + nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = "Drustcraft - " + previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

router.afterEach((to) => {
  /* End progress bar */
  if (to.name) {
    Progress.end();
  }

  /* Analytics */
  let analytics_token = store.getters.analytics_token;
  api
    .post("/analytics/" + analytics_token, {
      event: "PAGE",
      event_data: to.path,
    })
    .catch(() => {
      /* ignore */
    });
});

export default router;
