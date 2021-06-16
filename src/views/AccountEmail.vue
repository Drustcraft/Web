<template>
  <div class="account-dashboard">
    <h1>Email</h1>
    <a href="#" @click.prevent="sendmail">Send</a>
  </div>
</template>

<script>
import api from "@/api.js";

export default {
  data: function () {
    return {};
  },
  methods: {
    sendmail: function () {
      api.get("/test");
    },
  },
};
</script>
