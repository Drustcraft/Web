<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/" class="brand-image"></router-link>
      <button class="hamburger hamburger-cancel" @click.prevent="toggleNavMenu">
        <span class="icon"></span>
      </button>
    </div>
    <div class="nav-menu">
      <div class="nav-group nav-group-center">
        <router-link class="nav-item" to="/forums/announcements"
          >News</router-link
        >
        <router-link class="nav-item" to="/forums">Forums</router-link>
        <router-link class="nav-item" to="/wiki">Wiki</router-link>
        <a class="nav-item" href="https://map.drustcraft.com.au/">Map</a>
        <a class="nav-item" href="#" @click.prevent="showModalContact"
          >Contact</a
        >

        <!-- <a class="nav-item">Education</a> -->
      </div>
      <div class="nav-group nav-group-right">
        <a
          v-if="$store.state.account_uuid == null"
          class="nav-item"
          @click.prevent="showModalRegister"
          >Register</a
        >
        <a
          v-if="$store.state.account_uuid == null"
          class="nav-item"
          @click.prevent="showModalLogin"
          >Login</a
        >
        <router-link
          v-if="$store.state.account_uuid != null"
          class="nav-item"
          to="/account"
          >Account</router-link
        >
        <a
          v-if="$store.state.account_uuid != null"
          class="nav-item"
          @click.prevent="logout"
          >Logout</a
        >
      </div>
    </div>
  </nav>
</template>

<script>
import { showComponentAsModal, logout } from "@/common.js";

export default {
  destroyed() {
    window.removeEventListener("scroll", this.scrollNavMenu);
    window.removeEventListener("click", this.clickOutsideNav);
    window.removeEventListener("touchstart", this.clickOutsideNav);
  },
  watch: {
    "$route.name": {
      handler: function (name) {
        let navbar = document.querySelector(".navbar");
        if (name === "home") {
          window.addEventListener("scroll", this.scrollNavMenu);
          if (navbar) {
            navbar.classList.add("floating");
          }
        } else {
          window.removeEventListener("scroll", this.scrollNavMenu);
          if (navbar) {
            navbar.classList.remove("floating");
          }
        }
      },
      immediate: true,
    },
  },
  mounted: function () {
    window.addEventListener("click", this.clickOutsideNav);
    window.addEventListener("touchstart", this.clickOutsideNav);
  },
  methods: {
    toggleNavMenu: function () {
      let hamburger = document.querySelector(".navbar .hamburger");
      let navmenu = document.querySelector(".navbar .nav-menu");

      if (
        window.getComputedStyle(navmenu).display === "none" &&
        !hamburger.classList.contains("active")
      ) {
        this.showNavMenu();
      } else {
        this.hideNavMenu();
      }
    },

    scrollNavMenu: function () {
      let navbar = document.querySelector(".navbar");
      let sticky = navbar.offsetTop - 20;

      if (window.pageYOffset > sticky && window.pageYOffset != 0) {
        navbar.classList.remove("floating");
      } else {
        navbar.classList.add("floating");
      }
    },

    showNavMenu: function () {
      let hamburger = document.querySelector(".navbar .hamburger");
      let navmenu = document.querySelector(".navbar .nav-menu");
      let duration = 500;

      if (
        window.getComputedStyle(navmenu).display === "none" &&
        !hamburger.classList.contains("active")
      ) {
        navmenu.style.removeProperty("display");
        let display = window.getComputedStyle(navmenu).display;
        if (display === "none") display = "block";
        navmenu.style.display = display;
        let height = navmenu.offsetHeight;
        navmenu.style.overflow = "hidden";
        navmenu.style.height = 0;
        navmenu.style.paddingTop = 0;
        navmenu.style.paddingBottom = 0;
        navmenu.style.marginTop = 0;
        navmenu.style.marginBottom = 0;
        navmenu.offsetHeight;
        navmenu.style.boxSizing = "border-box";
        navmenu.style.transitionProperty = "height, margin, padding";
        navmenu.style.transitionDuration = duration + "ms";
        navmenu.style.height = height + "px";
        navmenu.style.removeProperty("padding-top");
        navmenu.style.removeProperty("padding-bottom");
        navmenu.style.removeProperty("margin-top");
        navmenu.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
          navmenu.style.removeProperty("height");
          navmenu.style.removeProperty("overflow");
          navmenu.style.removeProperty("transition-duration");
          navmenu.style.removeProperty("transition-property");
        }, duration);

        hamburger.classList.add("active");
      }
    },

    hideNavMenu: function () {
      let hamburger = document.querySelector(".navbar .hamburger");
      let navmenu = document.querySelector(".navbar .nav-menu");
      let duration = 500;

      if (
        window.getComputedStyle(navmenu).display !== "none" &&
        hamburger.classList.contains("active")
      ) {
        navmenu.style.transitionProperty = "height, margin, padding";
        navmenu.style.transitionDuration = duration + "ms";
        navmenu.style.boxSizing = "border-box";
        navmenu.style.height = navmenu.offsetHeight + "px";
        navmenu.offsetHeight;
        navmenu.style.overflow = "hidden";
        navmenu.style.height = 0;
        navmenu.style.paddingTop = 0;
        navmenu.style.paddingBottom = 0;
        navmenu.style.marginTop = 0;
        navmenu.style.marginBottom = 0;
        window.setTimeout(() => {
          navmenu.style.display = "none";
          navmenu.style.removeProperty("height");
          navmenu.style.removeProperty("padding-top");
          navmenu.style.removeProperty("padding-bottom");
          navmenu.style.removeProperty("margin-top");
          navmenu.style.removeProperty("margin-bottom");
          navmenu.style.removeProperty("overflow");
          navmenu.style.removeProperty("transition-duration");
          navmenu.style.removeProperty("transition-property");
        }, duration);

        hamburger.classList.remove("active");
      }
    },

    clickOutsideNav: function (e) {
      if (
        document.querySelector(".navbar") &&
        (!document.querySelector(".navbar").contains(e.target) ||
          e.target.nodeName === "A")
      ) {
        this.hideNavMenu();
      }
    },

    /* Unused below */

    showModalContact: function () {
      showComponentAsModal(this, "ModalContactUs");
    },
    showModalRegister: function () {
      showComponentAsModal(this, "ModalRegister");
    },
    showModalLogin: function () {
      showComponentAsModal(this, "ModalLogin");
    },
    logout: function () {
      logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  transition-property: left, right, top;
  transition-duration: 0.2s;
  transition-timing-function: ease-out;
  background-color: transparent;
  z-index: 20;
  height: 3.25rem;

  .brand {
    background-color: rgba(34, 34, 34, 1);
    display: block;
    text-align: center;
    line-height: 0;
  }

  .hamburger {
    font-size: 1rem;
    display: inline-block;
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;

    width: 1rem;
    height: 1rem;
    padding: 0;

    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    vertical-align: middle;

    border: 0 none;
    background: transparent;

    &::-moz-focus-inner {
      padding: 0;
      border: 0 none;
    }

    &:focus {
      outline: 0;
    }

    &:before,
    &:after {
      content: "";
    }

    &:before,
    .icon,
    &:after {
      display: block;

      width: 100%;
      height: 0.2em;
      margin: 0 0 0.2em;

      transition: transform 0.2s ease-in-out;

      border-radius: 0.05em;
      background: #e2a233;
    }

    &.active:before,
    &.active .icon,
    &.active:after {
      background: #e2a233;
    }

    &.active .icon {
      transform: scale(0);
    }

    &.active:before {
      transform: translateY(0.4em) rotate(135deg);
    }

    &.active:after {
      transform: translateY(-0.4em) rotate(-135deg);
    }
  }

  .brand-image {
    display: inline-block;
    width: 153px;
    height: 52px;
    margin-left: 0rem;
    background-image: url("/images/brand.png");
    background-repeat: no-repeat;
    background-size: contain;
    transition: all 0.3s;
  }

  .nav-menu {
    display: none;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    background-color: rgba(51, 51, 51, 1);
  }

  .nav-item {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: -webkit-linear-gradient(
      top,
      #efd100,
      #e2a233 19%,
      #f0c328
    );
    font-family: Montserrat, "Open Sans", Arial, Helvetica, sans-serif;
    text-transform: uppercase;
    padding: 1rem 0.75rem;
    display: block;
    font-size: 0.8rem;
    transition: all 0.3s;
    text-align: center;

    &:hover {
      -webkit-text-fill-color: #fff;
      cursor: pointer;
    }
  }
}

@media only screen and (min-width: 770px) {
  .navbar {
    display: flex;
    background-color: rgba(34, 34, 34, 1);

    .hamburger {
      display: none;
    }

    .brand {
      max-width: 12rem;
      background-color: transparent;
    }

    .brand-image {
      position: absolute;
      margin-left: 1rem;
    }

    .nav-menu {
      display: flex !important;
      flex-grow: 1;
      background-color: transparent;
      border: 0;
    }

    .nav-group-center {
      flex-grow: 1;
      text-align: center;
      margin-left: 12rem;
    }

    .nav-group-right {
      width: 12rem;
      text-align: right;
      margin-right: 1rem;
    }

    .nav-item {
      display: inline-block;
    }
  }
}

@media only screen and (min-width: 960px) {
  .navbar {
    &.floating {
      position: absolute;
      top: 20px;
      left: 80px;
      right: 80px;
      margin-top: 30px;
      border-radius: 50px;
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;

      .nav-group-right {
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
