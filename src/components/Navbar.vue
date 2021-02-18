<template>
  <div class="navbar navbar-expand-lg navbar-dark d-flex">
    <div class="container-fluid">
      <div class="mr-auto col-sm-2 col-lg-3">
        <router-link class="navbar-brand mr-auto" to="/"></router-link>
      </div>
      <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse collapse col-lg-6">
        <ul class="navbar-nav mx-auto text-center center" v-for="item in navitems" :key="item.id">
          <navbar-item :item="item" />
        </ul>
      </div>

      <div class="navbar-collapse collapse col-lg-3">
        <ul class="navbar-nav ml-auto text-right">
          <li v-if="this.$parent.sessionId == ''">
            <router-link to="/login">Login</router-link>
          </li>
          <li>X={{ this.$parent.sessionId }}</li>
          <li v-if="this.$parent.sessionId != ''">
            <router-link to="/logout">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarItem from '@/components/NavbarItem'

export default {
  data: function () {
    return {
      navitems: [],
    }
  },
  components: {
    NavbarItem,
  },
  created: function () {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idle: 'Rough' }),
    }
    fetch('http://drustcraftq.test/api/navbar', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.navitems = data
      })
  },
}
</script>

<style lang="scss">
.navbar {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid #666;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.navbar-brand {
  width: 192px;
  height: 33px;
  display: inline-block;
  background-image: url('/img/navbar-brand.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
