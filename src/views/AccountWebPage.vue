<template>
  <div class="account-web-page">
    <h1>Web Pages</h1>

    <p>Errors: {{ errors }}</p>

    <div class="button-bar">
      <router-link to="/account/web-page/new-page" class="button"
        >Create New Page</router-link
      >
    </div>

    <sorted-table sort="server" :values="pages">
      <thead>
        <tr>
          <th><sort-link name="title">Title</sort-link></th>
          <th><sort-link name="path">Path</sort-link></th>
          <th>Actions</th>
        </tr>
      </thead>
      <template body="sort">
        <tbody v-if="pages.length > 0">
          <tr v-for="value in pages" :key="value.path">
            <td>{{ value.title }}</td>
            <td>{{ value.path }}</td>
            <td>
              <router-link :to="'/account/web-page/' + value.path"
                ><i class="fas fa-edit"></i
              ></router-link>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="3"><i>No pages found</i></td>
          </tr>
        </tbody>
      </template>
    </sorted-table>
  </div>
</template>

<script>
import { webPost } from "@/common.js";

// import Tiptap from "@/components/Tiptap.vue";

export default {
  data() {
    return {
      errors: {},
      pages: [],
    };
  },
  components: {
    // Tiptap,
  },
  mounted: function () {
    this.showPageList();
  },
  methods: {
    showPageList() {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      webPost("/admin/page-list", {}, (response) => {
        loadingComponent.close();

        if (Object.keys(response.errors).length === 0) {
          this.pages = response.pages;
        } else {
          this.errors = response.errors;
        }
      });
    },
  },
};
</script>
