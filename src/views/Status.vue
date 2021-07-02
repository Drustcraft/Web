<template>
  <div class="page-content container">
    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <h3>Network Status</h3>
    <p>
      Below is the live status of the Drustcraft network. Servers restart at 4am
      every day for maintenance.
    </p>

    <table v-if="servers" class="table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Server</th>
          <th>Type</th>
          <th>Population</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="server in servers" :key="server.name">
          <td v-html="statusIcon(server.status)"></td>
          <td>{{ server.name }}</td>
          <td>{{ server.type }}</td>
          <td>{{ server.population }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "@/api.js";

export default {
  data: function () {
    return {
      loading: true,
      servers: [],
    };
  },
  methods: {
    statusIcon(type) {
      switch (type) {
        case "error":
          return '<i class="fas fa-exclamation-circle"></i>';
        case "ok":
          return '<i class="fas fa-check-circle"></i>';
        default:
          return '<i class="fas fa-exclamation-triangle"></i>';
      }
    },
  },
  mounted: function () {
    this.loading = true;

    api
      .get("status")
      .then((response) => {
        this.servers = response.data.servers;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style lang="scss">
.page-content {
  h3 {
    margin-top: 2rem;
    margin-bottom: 0;
  }

  .table {
    margin-top: 2rem;
    width: 100%;
  }

  .fa-check-circle {
    color: #48c774;
  }

  .fa-exclamation-triangle {
    color: #ffdd57;
  }

  .fa-exclamation-circle {
    color: #f14668;
  }
}
</style>
