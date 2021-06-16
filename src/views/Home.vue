<template>
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
</template>

<script>
export default {
  mounted: async function () {
    await this.$store.dispatch("verifyToken");
  },
};
</script>

<style lang="scss"></style>
