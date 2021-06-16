<template>
  <div class="card welcome">
    <div class="card-content">
      <div class="columns is-vcentered animateScootRight">
        <div class="column">
          <h2 class="is-uppercase">Want to play Minecraft?</h2>
          Join and start playing on our Minecraft server!
        </div>
        <div class="column has-text-right">
          <b-button type="is-light" outlined @click="increase"
            >Lets Go!</b-button
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
  background-image: url("/images/banner-welcome.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;

  .card-content {
    color: white;
  }
}
</style>
