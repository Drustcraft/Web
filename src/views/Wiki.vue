<template>
  <div class="page-content-sidebar show-sidebar" ref="page">
    <span class="hamburger-outer"
      ><a
        href="#"
        class="hamburger hamburger-cancel"
        @click.prevent="showSidebar"
        ><span class="icon"></span></a
    ></span>
    <div class="sidebar">
      <div class="sidebar-close-outer">
        <a class="sidebar-close" href="#" @click.prevent="hideSidebar"
          ><span class="icon"></span
        ></a>
      </div>
      <NodeList
        v-if="pages && pages.length"
        :list="pages"
        propId="path"
        propTitle="title"
        propUrl="path"
        propUrlPrefix="/wiki"
        propChildren="pages"
      />
    </div>
    <transition name="fade" mode="out-in">
      <router-view :key="$route.path" />
    </transition>
  </div>
</template>

<script>
import api from "@/api.js";
import NodeList from "@/components/NodeList.vue";

export default {
  data: function () {
    return {
      pages: [],
    };
  },
  components: {
    NodeList,
  },
  mounted: function () {
    api
      .get("/wiki/list")
      .then((response) => {
        this.pages = {};

        let tree = {
          title: "",
          slug: "",
          path: "/",
          pages: Array(),
        };

        response.data.pages.forEach(function (item) {
          let dirs = item.path.split("/").slice(1);

          let iterate = function (idx, dirs, node) {
            if (idx == dirs.length - 1) {
              let search = node.pages.findIndex(function (search_item) {
                return search_item.slug == dirs[idx];
              });

              if (search != -1) {
                node.pages[search].title = item.title;
              } else {
                node.pages.push({
                  title: item.title,
                  slug: dirs[idx],
                  path: "/" + dirs.slice(0, idx + 1).join("/"),
                  pages: Array(),
                });
              }
            } else {
              let search = node.pages.findIndex(function (search_item) {
                return search_item.slug == dirs[idx];
              });

              if (search != -1) {
                iterate(idx + 1, dirs, node.pages[search]);
              } else {
                node.pages.push({
                  title: dirs[idx],
                  slug: dirs[idx],
                  path: "/" + dirs.slice(0, idx + 1).join("/"),
                  pages: Array(),
                });

                iterate(idx + 1, dirs, node.pages[node.pages.length - 1]);
              }
            }
          };

          iterate(0, dirs, tree);
        });

        this.pages = tree.pages;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    showSidebar() {
      this.$refs.page.classList.add("show-sidebar");
    },
    hideSidebar() {
      this.$refs.page.classList.remove("show-sidebar");
    },
  },
};
</script>

<style lang="scss">
.page-content-sidebar {
  background-color: #111;
}
</style>
