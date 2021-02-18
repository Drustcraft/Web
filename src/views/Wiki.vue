<template>
  <h1 v-if="title != ''">This is the wiki page - {{ title }}</h1>
  <not-found v-else />
</template>

<script>
import NotFound from '@/views/NotFound'

export default {
  components: { NotFound },
  data: function () {
    return {
      title: '',
    }
  },
  created: function () {
    if (this.$route.params.pageid == undefined) {
      this.title = 'Home!'
    } else {
      if (this.$route.params.pageid == 'james') {
        this.title = ''
      } else {
        this.title = this.$route.params.pageid
      }
    }
  },
}
</script>
