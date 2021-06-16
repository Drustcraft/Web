<template>
  <div class="account-web-page">
    <h1>Edit Web Page</h1>

    <b-message type="is-danger" has-icon v-if="0 in errors">{{
      errors[0]
    }}</b-message>

    <InputValidation
      ref="title"
      rules="required"
      type="text"
      label="Page Title"
      placeholder="Title"
      v-model="fields.title"
      :show-success="false"
    />
    <InputValidation
      ref="path"
      rules="required"
      type="text"
      label="Page Path"
      placeholder="path"
      v-model="fields.path"
      :show-success="false"
    />

    <div class="field">
      <label class="label">Page Content</label>
      <tiptap :value="fields.content" />
    </div>

    <button class="button" @click="save">Save</button>
  </div>
</template>

<script>
import { webPost } from "@/common.js";
import InputValidation from "@/components/InputValidation";
import Tiptap from "@/components/Tiptap.vue";

export default {
  data() {
    return {
      errors: {},
      path: "",
      fields: {
        path: "",
        title: "",
        content: "",
      },
    };
  },
  components: {
    InputValidation,
    Tiptap,
  },
  mounted: function () {
    if (this.$route.params.path !== "new-page") {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      let data = {
        path: this.$route.params.path,
      };

      webPost("/admin/page-load", data, (response) => {
        loadingComponent.close();

        if (Object.keys(response.errors).length === 0) {
          this.path = response.path;
          this.fields.path = response.path;
          this.fields.title = response.title;
          this.fields.content = response.content;
        } else {
          this.errors = response.errors;
        }
      });
    }
  },
  watch: {
    errors() {
      if (0 in this.errors) {
        this.$refs.each((ref) => {
          if (ref.clearSuccess) {
            ref.clearSuccess();
          }
        });
      }

      this.errors.each((value, key) => {
        if (key in this.$refs) {
          this.$refs[key].applyResult({
            errors: [value],
            valid: false,
            failedRules: {},
          });
        }
      });
    },
  },
  methods: {
    save() {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      let data = {
        "old-path": this.path,
        "new-path": this.fields.path,
        title: this.fields.title,
        content: this.fields.content,
      };

      this.$buefy.dialog.confirm({
        title: "Page already exists",
        message:
          "A page at the path <strong>asd</strong> already exists. Do you want to replace it?",
        cancelText: "Cancel",
        confirmText: "Replace",
        type: "yellow",
        onConfirm: () => this.$buefy.toast.open("User agreed"),
      });

      webPost("/admin/page-save", data, (response) => {
        console.log(JSON.stringify(response));
        loadingComponent.close();

        if (Object.keys(response.errors).length === 0) {
          this.$buefy.toast.open({
            duration: 5000,
            message: "Page Saved",
            type: "is-primary",
          });
        } else {
          this.errors = response.errors;
        }
      });
    },
  },
};
</script>
