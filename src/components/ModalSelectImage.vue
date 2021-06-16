<template>
  <AppModal
    ref="modal"
    title="Select Image"
    @submit="onSubmit"
    :width="width"
    :errors="errors"
    overflow="scroll"
  >
    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <template v-slot:head>
      <p v-if="!loading && images.length > 0" class="has-text-centered">
        {{ images.length }} images
      </p>
    </template>

    <div v-if="!loading" class="image-list">
      <div v-if="images.length == 0" class="image-row-none">
        No images found
      </div>
      <template v-else>
        <a
          v-if="allowNone"
          class="image-row"
          href="#"
          @click.prevent="selectImage('')"
        >
          <span class="image-mark">
            <i
              v-if="selected_image == ''"
              class="far fa-check-circle fa-2x"
            ></i>
          </span>
          <span class="image-container">
            <i class="fas fa-ban fa-3x"></i>
          </span>
          <span class="image-name">No image</span>
          <span class="image-uploaded"></span>
        </a>
        <a
          href="#"
          :class="['image-row']"
          v-for="image in images"
          :key="image.name"
          @click.prevent="selectImage(image.name)"
        >
          <span class="image-mark">
            <i
              v-if="selected_image == image.name"
              class="far fa-check-circle fa-2x"
            ></i>
          </span>
          <span class="image-container">
            <img
              class="image"
              :src="'https://files.drustcraft.com.au/' + image.name"
            />
          </span>
          <span class="image-name">{{ image.name }}</span>
          <span class="image-uploaded">{{ relativeDate(image.uploaded) }}</span>
        </a>
      </template>
    </div>

    <template v-slot:foot>
      <div class="button-group">
        <b-button label="Upload" @click.prevent="uploadImage" />
      </div>
      <div class="button-group">
        <b-button label="Cancel" @click.prevent="$emit('close')" />
        <b-button native-type="submit" label="Update" class="yellow" />
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from "@/components/AppModal";
import api from "@/api.js";
import { relativeEpochDate, checkAxiosErrorDefined } from "@/common.js";
import fileDialog from "file-dialog";

export default {
  props: {
    selected: {
      type: String,
      default: "",
    },
    width: {
      type: String,
    },
    close: {
      type: Function,
      default: null,
    },
    allowNone: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: true,
    errors: {},
    images: [],
    selected_image: "",
  }),
  components: {
    AppModal,
  },
  mounted: function () {
    this.selected_image = this.selected;
    this.loadImages();
  },
  methods: {
    loadImages: function () {
      this.loading = true;

      api
        .get("/images")
        .then((response) => {
          this.images = response.data.images;
        })
        .catch((error) => {
          let message = "An unexpected error occurred, Please try again later";

          if (checkAxiosErrorDefined(error)) {
            message = error.data.errors[0].detail;
          } else {
            try {
              if (error.response.status == 404) {
                this.images = Array();
                return;
              } else {
                throw null;
              }
            } catch {
              this.error =
                "An unexpected error occurred, Please try again later";
              console.log(error);
            }
          }

          this.$buefy.notification.open({
            duration: 5000,
            message: message,
            type: "is-danger",
          });

          this.$emit("close");
          if (this.close !== null) {
            this.close("");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onSubmit: function () {
      this.$emit("close");
      if (this.close !== null) {
        this.close(this.selected_image);
      }
    },

    uploadImage: function () {
      fileDialog({ accept: "image/*" }).then(async (file) => {
        let formData = new FormData();
        formData.append("file", file[0]);
        const headers = { "Content-Type": "multipart/form-data" };

        api
          .post("/images/upload", formData, { headers: headers })
          .then((response) => {
            this.selected_image = response.data.name;
            this.loadImages();
          })
          .catch((error) => {
            let message =
              "An unexpected error occurred, Please try again later";

            if (checkAxiosErrorDefined(error)) {
              message = error.data.errors[0].detail;
            } else {
              try {
                if (error.response.detail == 403) {
                  message = "You do not have permission to upload this file";
                }
              } catch (error) {
                console.log(error);
              }
            }

            this.$buefy.notification.open({
              duration: 5000,
              message: message,
              type: "is-danger",
            });
          });
      });
    },

    selectImage: function (name) {
      this.selected_image = name;
    },

    relativeDate: function (epoch) {
      return relativeEpochDate(epoch);
    },
  },
};
</script>

<style lang="scss">
// .image-list {
//   // margin: 2rem 0;
// }

.image-row {
  display: grid;
  align-items: center;
  height: 96px;
  color: #bbb;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  grid-template-columns: 3rem 144px auto 9rem;
  padding: 0.5rem;
  box-sizing: content-box;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .image-container {
    width: 128px;
    height: 96px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .image-mark,
  .image,
  .image-uploaded {
    justify-self: center;
  }

  .fa-check-circle {
    color: #48c774;
  }

  .fa-ban {
    color: #f14668;
  }

  &:first-of-type {
    border-top: 0;
  }

  &.selected {
    background-color: #ffc;
  }

  &:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
