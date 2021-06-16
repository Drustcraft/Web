<template>
  <div id="app">
    <AppHeader />
    <div id="page">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import { setInteractionMode } from "vee-validate";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  mounted: function () {
    setInteractionMode("passive");
  },
};
</script>

<style lang="scss">
@import "styles/normalize.css";
@import "~bulma/sass/utilities/_all";
@import "styles/variables.scss";
@import "~bulma";
@import "styles/global.scss";
@import "~buefy/src/scss/buefy";
@import "styles/animation.scss";
</style>
