<template>
  <div class="page-content-sidebar show-sidebar" ref="account">
    <span class="hamburger-outer"
      ><a
        href="#"
        class="hamburger hamburger-cancel"
        @click.prevent="showSidebar"
        ><span class="icon"></span></a
    ></span>
    <div class="sidebar">
      <div class="sidebar-close-outer">
        <a class="sidebar-close" href="#" @click.prevent="hideSidebar"
          ><span class="icon"></span
        ></a>
      </div>
      <ul>
        <li class="nav-header">Account</li>
        <li class="nav-item">
          <router-link to="/account/dashboard"
            ><i class="fas fa-home"></i> Dashboard</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/account/stats"
            ><i class="far fa-chart-bar"></i> Player Stats</router-link
          >
        </li>

        <li v-if="$store.getters.inAccountGroup('staff')" class="nav-header">
          Site
        </li>
        <li v-if="$store.getters.inAccountGroup('staff')" class="nav-item">
          <router-link to="/account/site-warning"
            ><i class="far fa-exclamation-triangle"></i> Warning</router-link
          >
        </li>
        <li v-if="$store.getters.inAccountGroup('staff')" class="nav-item">
          <router-link to="/account/site-email"
            ><i class="far fa-exclamation-triangle"></i> Email</router-link
          >
        </li>
        <!-- <li class="nav-item">
          <router-link to="/account/settings"
            ><i class="far fa-cog"></i> Settings</router-link
          >
        </li>

        <li class="nav-header">Groups</li>
        <li class="nav-item">
          <router-link to="/account/group-players"
            ><i class="far fa-users"></i> Players</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/account/group-report"
            ><i class="far fa-chart-bar"></i> Reports</router-link
          >
        </li>

        <li class="nav-header">Players</li>
        <li class="nav-item">
          <router-link to="/account/players-list"
            ><i class="far fa-users"></i> List</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/account/players-list-warns"
            ><i class="far fa-exclamation-triangle"></i> Warnings</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/account/players-list-bans"
            ><i class="far fa-exclamation-circle"></i> Bans</router-link
          >
        </li>
      
        <li class="nav-header">Website</li>
        <li class="nav-item">
          <router-link to="/account/web-settings"
            ><i class="far fa-cog"></i> Settings</router-link
          >
        </li>
        <li v-if="$store.getters.inAccountGroup('staff')" class="nav-item">
          <router-link to="/account/web-forums"
            ><i class="far fa-comments-alt"></i> Forums</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/account/web-page"
            ><i class="far fa-browser"></i> Pages</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/account/web-analytics"
            ><i class="far fa-chart-bar"></i> Analytics</router-link
          >
        </li> -->
      </ul>
    </div>
    <div class="content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showSidebar() {
      this.$refs.account.classList.add("show-sidebar");
    },
    hideSidebar() {
      this.$refs.account.classList.remove("show-sidebar");
    },
  },
};
</script>

<style lang="scss">
.select select,
.taginput .taginput-container.is-focusable,
.textarea,
.input {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
}

.account {
  // margin-top: 3.25rem;
  // display: flex;
  // flex-direction: row;
  // flex-grow: 1;

  &.show-sidebar {
    .hamburger-outer {
      left: -3rem;
      transition-delay: 0s;
    }

    .sidebar {
      flex-shrink: 0;
      width: 15rem;
      transition-delay: 0.5s;
    }

    .sidebar-close-outer {
      visibility: visible;
      transition-delay: 0.6s;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  td {
    color: #ddd;
  }

  .button-bar {
    margin-bottom: 1rem;
    text-align: right;
  }
}

// .content {
//   padding: 3rem;
//   background-color: #111;
//   flex-grow: 1;
// }
</style>
