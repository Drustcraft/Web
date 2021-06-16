<template>
  <AppModal
    ref="modal"
    :title="title()"
    @submit="onSubmit"
    :width="width"
    :errors="errors"
  >
    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <InputValidation
      ref="title"
      rules="required"
      type="text"
      label="Title"
      v-model="fields.title"
      :show-success="false"
    />

    <template v-slot:foot>
      <div class="button-group">
        <b-button label="Cancel" @click="$emit('close')" />
        <b-button native-type="submit" label="Update" class="yellow" />
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from "@/components/AppModal";
import api from "@/api.js";
import InputValidation from "@/components/InputValidation";

export default {
  props: {
    type: {
      type: String,
      default: "post",
    },
    slug: {
      type: String,
      default: "",
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
    loading: true,
    errors: {},
    fields: {
      title: "",
    },
  }),
  components: {
    AppModal,
    InputValidation,
  },
  mounted: function () {
    if (this.slug == "") {
      this.$buefy.notification.open({
        duration: 5000,
        message: "Cannot open the editor as the thread slug is missing",
        type: "is-danger",
      });

      this.$emit("close");
      return;
    }

    api
      .get("/forums/threads/" + this.slug)
      .then((response) => {
        this.fields = response.data;
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

        this.$buefy.notification.open({
          duration: 5000,
          message: message,
          type: "is-danger",
        });

        this.$emit("close");
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    onSubmit() {
      this.loading = true;

      api
        .put("/forums/threads/" + this.slug, {
          title: this.fields.title,
        })
        .then(() => {
          this.$buefy.notification.open({
            message: "Your thread has been updated!",
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
                message = "You do not have permission to edit this thread";
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
          this.loading = false;
        });
    },

    title: function () {
      return "Edit Post";
    },
  },
};
</script>
