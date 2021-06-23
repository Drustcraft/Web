<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/" class="brand-image"></router-link>
      <button class="hamburger hamburger-cancel" @click.prevent="showNavMenu">
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
  methods: {
    showNavMenu: function (e) {
      let slideUp = (target, duration = 500) => {
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.boxSizing = "border-box";
        target.style.height = target.offsetHeight + "px";
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
          target.style.display = "none";
          target.style.removeProperty("height");
          target.style.removeProperty("padding-top");
          target.style.removeProperty("padding-bottom");
          target.style.removeProperty("margin-top");
          target.style.removeProperty("margin-bottom");
          target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          //alert("!");
        }, duration);
      };

      let slideDown = (target, duration = 500) => {
        target.style.removeProperty("display");
        let display = window.getComputedStyle(target).display;
        if (display === "none") display = "block";
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = "border-box";
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
          target.style.removeProperty("height");
          target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
        }, duration);
      };

      var slideToggle = (target, duration = 500) => {
        if (window.getComputedStyle(target).display === "none") {
          e.target.classList.add("active");
          return slideDown(target, duration);
        } else {
          e.target.classList.remove("active");
          return slideUp(target, duration);
        }
      };

      let navmenu = document.querySelector(".nav-menu");
      slideToggle(navmenu);
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

  .brand {
    background-color: rgba(34, 34, 34, 1);
    display: block;
    text-align: center;
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
    width: 165px;
    height: 56px;
    margin-left: 1rem;
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
