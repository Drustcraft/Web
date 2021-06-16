<template>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <router-link to="/"><i class="far fa-home"></i></router-link>
      </li>
      <li v-for="(crumb, i) in computedCrumbs" :key="i">
        <router-link v-if="i < computedCrumbs.length - 1" :to="crumb.path">{{
          crumb.name
        }}</router-link>
        <span class="is-active" v-else>{{ crumb.name }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    prefix_path: {
      type: String,
      default: "",
    },
    prefix_name: {
      type: String,
      default: "",
    },
    crumbs: {
      type: Array,
      default: null,
    },
  },

  computed: {
    computedCrumbs() {
      if (this.prefix_path.length > 0 && this.prefix_name.length > 0) {
        let prefix = [
          {
            path: this.prefix_path,
            name: this.prefix_name,
          },
        ];

        if (this.crumbs !== null) {
          return prefix.concat(this.crumbs);
        }

        return prefix;
      }

      if (this.crumbs !== null) {
        return this.crumbs;
      }

      return Array();
    },
  },
};
</script>

<style lang="scss">
.breadcrumb {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 2rem;
  font-size: 0.8rem;
  position: relative;
  z-index: 19;
  margin: -1rem;

  &,
  a {
    color: #bbb;
  }

  a {
    padding: 0 2rem 0 0;
    transition: all 0.5s ease;

    &:hover {
      color: #fff;
    }
  }

  ul {
    align-items: baseline;

    li {
      position: relative;
    }

    li:first-of-type:before {
      display: none;
    }

    li:before {
      content: "";
      position: absolute;
      border-right: 2px solid #ddd;
      border-bottom: 2px solid #ddd;
      width: 8px;
      height: 8px;
      top: calc(50%);
      left: -1.3rem;
      transform: translateY(-50%) rotate(-45deg);
    }
  }
  .is-active {
    // font-weight: 700;
    color: #fff;
  }
  //
  //   ul {
  //     list-style: none;
  //
  //     li {
  //       // position: relative;
  //     }
  //   }

  // ul li:before{
  //    content: '';
  //    position: absolute;
  //    border-right:2px solid #fff;
  //    border-bottom:2px solid #fff;
  //    width:10px;
  //    height:10px;
  //    // top: calc(50% - 4px);
  //    // left: -20px;
  //    // transform: translateY(-50%) rotate(-45deg);
  // }
}
</style>
