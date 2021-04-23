<template>
  <Navbar />
  <router-view />
</template>

<script>
// Test here
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
    fetch: function (path, options, callback) {
      let requestOptions = {
        method: 'POST',
      }

      if (options != null) {
        requestOptions['headers'] = { 'Content-Type': 'application/json' }
        requestOptions['body'] = JSON.stringify(options)
      }

      fetch('http://drustcraftq.test/api/' + path, requestOptions)
        .then(response => response.json())
        .then(data => {
          callback(data)
        })
        .catch(function () {
          callback(null)
        })
    },
  },
}
</script>

<style lang="scss">
@import 'node_modules/bootswatch/dist/darkly/variables';
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootswatch/dist/darkly/bootswatch';
</style>
