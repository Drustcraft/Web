<template>
  <h1>Logout</h1>
</template>

<script>
import router from './../router'

export default {
  created: function () {
    this.$parent.$parent.sessionId = ''
    router.push({ path: '/' })
  },
}
</script>
