<template>
  <h1>Login</h1>
</template>

<script>
import router from './../router'

export default {
  created: function () {
    this.$parent.$parent.sessionId = '123'
    router.push({ path: '/' })
  },
}
</script>
