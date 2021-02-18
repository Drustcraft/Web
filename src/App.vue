<template>
  <Navbar />
  <router-view />
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer,
  },
  data: function () {
    return {
      sessionId: '',
    }
  },
  methods: {
    setSessionId(id) {
      this.sessionId = id
    },
  },
}
</script>

<style lang="scss">
@import 'node_modules/bootswatch/dist/darkly/variables';
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootswatch/dist/darkly/bootswatch';
</style>
