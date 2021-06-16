<template>
  <div :class="['header', { maintenance: this.maintenance.content }]">
    <div v-if="maintenance.content" class="maintenance">
      <template v-if="maintenance.url != ''">
        <router-link :to="maintenance.url">
          <i class="far fa-exclamation-triangle"></i>{{ maintenance.content }}
        </router-link>
      </template>
      <template v-else>
        <i class="far fa-exclamation-triangle"></i>{{ maintenance.content }}
      </template>
      <a
        href="#"
        @click.prevent="closeMaintenanceBar"
        class="is-pulled-right mr-3"
        ><i class="fas fa-times"></i
      ></a>
    </div>
    <AppNavBar />
  </div>
</template>

<script>
import AppNavBar from "@/components/AppNavBar.vue";
import api from "@/api.js";

export default {
  data() {
    return {
      maintenance: {
        content: "",
        url: "",
      },
    };
  },
  components: {
    AppNavBar,
  },
  mounted: function () {
    api
      .get("/maintenance/current")
      .then((response) => {
        this.maintenance = response.data.maintenance;
      })
      .catch(() => {});
  },
  methods: {
    closeMaintenanceBar: function () {
      this.maintenance.content = "";
    },
  },
};
</script>

<style lang="scss">
.header {
  .maintenance {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background-color: #f1d437;
    padding: 0.5rem;
    text-align: center;
    color: #333;
    box-shadow: 0 1px 1px #333;
    font-size: 0.9rem;

    .far {
      margin-right: 0.25rem;
    }

    a {
      color: #333;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .maintenance + .navbar {
    top: 38px;
  }

  @keyframes flash {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
