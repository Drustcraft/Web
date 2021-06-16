<template>
  <div class="card welcome">
    <div class="card-content">
      <div class="columns is-vcentered animateScootRight">
        <div class="column">
          <h2 class="is-uppercase">Welcome to Drustcraft!</h2>
          Join <strong>{{ this.$store.state.session_id }}</strong> members in
          our Minecraft Community!
        </div>
        <div class="column has-text-right">
          <b-button type="is-light" outlined @click="increase"
            >Sign up</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    increase: function () {
      this.$store.commit("set_session", "something");
    },
  },
};
</script>

<style lang="scss">
.card.welcome {
  // background-image: url("/images/banner-welcome.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #35a9c0;

  .card-content {
    color: white;
  }
}
</style>
