<template>
  <AppModal
    ref="modal"
    :title="title()"
    @submit="onSubmit"
    :width="width"
    :errors="errors"
  >
    <tiptap ref="editor" />

    <template v-slot:foot>
      <div class="button-group">
        <b-button label="Cancel" @click="$emit('close')" />
        <b-button native-type="submit" label="Update" class="yellow" />
      </div>
    </template>
  </AppModal>
</template>

<script>
// import Vue from "vue";
import AppModal from "@/components/AppModal";
import Tiptap from "@/components/Tiptap.vue";
import api from "@/api.js";
// import { linkify } from "@/common.js";
// import { toHTML } from "@/components/Tiptap.vue";

export default {
  props: {
    type: {
      type: String,
      default: "post",
    },
    id: {
      type: Number,
      default: 0,
    },
    close: {
      type: Function,
      default: null,
    },
    width: {
      type: String,
    },
  },
  data: () => ({
    errors: {},
  }),
  components: {
    AppModal,
    Tiptap,
  },
  mounted: function () {
    api
      .get("/forums/posts/" + this.id)
      .then((response) => {
        this.$refs.editor.editor.commands.setContent(
          JSON.parse(response.data.content)
        );
      })
      .catch((error) => {
        let message = "An unexpected error occured";

        if ("detail" in error.response) {
          message = error.response.detail;
        } else {
          switch (error.response.status) {
            case 403:
              message =
                "You do not have permission to delete this " + this.type;
              break;
          }
        }

        this.$buefy.toast.open({
          duration: 5000,
          message: message,
          type: "is-danger",
        });

        this.$emit("close");
      });
  },
  methods: {
    onSubmit() {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      api
        .put("/forums/posts/" + this.id, {
          content: this.$refs["editor"].editor.getJSON(),
        })
        .then(() => {
          this.$buefy.toast.open({
            message: "Your post has been updated!",
            type: "is-success",
            duration: 5000,
          });

          this.$emit("close");
          if (this.close !== null) {
            this.close();
          }
        })
        .catch((error) => {
          let message = "An unexpected error occured";

          if ("detail" in error.response) {
            message = error.response.detail;
          } else {
            switch (error.response.status) {
              case 403:
                message =
                  "You do not have permission to delete this " + this.type;
                break;
            }
          }

          this.$buefy.toast.open({
            duration: 5000,
            message: message,
            type: "is-danger",
          });
        })
        .finally(() => {
          loadingComponent.close();
        });
    },

    title: function () {
      return "Edit Post";
    },
  },
};
</script>
