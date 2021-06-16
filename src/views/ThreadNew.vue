<template>
  <div class="posts">
    <AppBreadcrumbs
      prefix_path="/forums"
      prefix_name="Forums"
      :crumbs="crumbs"
    />

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="section">
          <b-message type="is-danger" has-icon v-if="0 in errors">{{
            errors[0]
          }}</b-message>

          <h3>Create new Thread</h3>

          <!-- <b-dropdown v-model="label">
              <template #trigger>
                <b-button :label="label" icon-right="caret-down" />
              </template>

              <b-dropdown-item value="open_issues">Open Issues and Pull Requests</b-dropdown-item>
              <b-dropdown-item value="your_issues">Your Issues</b-dropdown-item>
              <b-dropdown-item value="pull_requests">Your Pull Requests</b-dropdown-item>
              <b-dropdown-item value="everything">Everything</b-dropdown-item>
            </b-dropdown> -->

          <InputValidation
            ref="thread_title"
            rules="required"
            type="text"
            label=""
            placeholder="Title"
            v-model="fields.title"
            :show-success="false"
          />

          <tiptap
            id="editor"
            ref="thread-content"
            placeholder="Write your post…"
          />
          <div class="post-buttons">
            <b-button
              class="yellow"
              native-type="submit"
              label="Create Thread"
            />
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import Vue from "vue";
import { ValidationObserver } from "vee-validate";
import InputValidation from "@/components/InputValidation";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import Tiptap from "@/components/Tiptap.vue";
import api from "@/api.js";
import { debounce } from "debounce";

export default {
  data: function () {
    return {
      label: "CCC",
      errors: {},
      crumbs: [],
      category: {},

      fields: {
        title: "",
      },
    };
  },
  components: {
    AppBreadcrumbs,
    ValidationObserver,
    InputValidation,
    Tiptap,
  },
  mounted: function () {
    this.loadThread();
  },
  methods: {
    loadThread: debounce(function () {
      api
        .post("/forums/categories/search", {
          category_slug: this.$route.params.category_slug,
        })
        .then((response) => {
          this.category = response.data.categories[0];

          Vue.set(this.crumbs, 0, {
            path: "/forums/" + this.category.slug,
            name: this.category.title,
          });

          Vue.set(this.crumbs, 1, {
            path: "/forums/" + this.category.slug + "/new-post",
            name: "New Thread",
          });
        });
    }),

    onSubmit: function () {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      api
        .post("/forums/threads/", {
          category_slug: this.$route.params.category_slug,
          title: this.fields.title,
          content: this.$refs["thread-content"].editor.getJSON(),
        })
        .then((response) => {
          this.$router.push({
            path: "/thread/" + response.data.slug,
          });
        })
        .catch((error) => {
          if (error.response.status == 403) {
            Vue.set(
              this.errors,
              0,
              "You do not have permission to post a thread in this forum category"
            );
          } else {
            Vue.set(this.errors, 0, "An unexpected error occured");
          }
        })
        .finally(() => {
          loadingComponent.close();
        });
    },
  },
};
</script>

<style lang="scss">
.posts {
  position: relative;
  margin-top: 3.25rem;
  width: 100%;

  .section {
    padding: 1rem 1.5rem 3rem 1.5rem;
  }

  .post-buttons {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
