<template>
  <AppModal
    ref="modal"
    title="Reset Password"
    @submit="onSubmit"
    :errors="errors"
  >
    <transition :name="transition" mode="out-in">
      <fieldset v-if="step === 1" key="step1">
        <b-field label="Get you Reset Code" />
        <b-notification type="is-info" :closable="false"
          >Login into the Drustcraft Minecraft server and in chat, type the
          command <strong>/resetpassword</strong> to receive your reset
          code.</b-notification
        >
        <InputValidation
          rules="required|length:6"
          type="text"
          label="Reset code"
          placeholder="Your reset code"
          v-model="reset_code"
          key="resetCode"
          ref="reset_code"
        />
      </fieldset>

      <fieldset v-if="step !== 1" key="step2">
        <InputValidation
          rules="required"
          type="password"
          name="password"
          label="New password"
          placeholder="Your new password"
          v-model="password"
          key="password"
          ref="password"
        />
        <InputValidation
          rules="required|confirmed:password"
          type="password"
          label="Confirm password"
          placeholder="Confirm new password"
          v-model="password_confirm"
          key="password_confirm"
        />
      </fieldset>
    </transition>

    <template v-slot:foot>
      <p></p>
      <div class="button-group">
        <b-button :label="prevLabel" @click="onPrevStep()" />
        <b-button
          native-type="submit"
          :label="nextLabel"
          type="is-info"
          class="yellow"
        />
      </div>
    </template>
  </AppModal>
</template>

<script>
import Vue from "vue";
import AppModal from "@/components/AppModal";
import InputValidation from "@/components/InputValidation";
import api from "@/api.js";

export default {
  data: () => ({
    transition: "slideNext",
    errors: {},
    reset_code: "",
    password: "",
    password_confirm: "",
    step: 1,
    maxSteps: 2,
  }),
  components: {
    AppModal,
    InputValidation,
  },
  computed: {
    prevLabel() {
      if (this.step == 1) {
        return "Close";
      }

      return "Prev";
    },
    nextLabel() {
      if (this.step == this.maxSteps) {
        return "Reset Password";
      }

      return "Next";
    },
  },
  onTransitionLeave() {
    this.$nextTick(function () {
      this.$refs.modal.setFocus();
    });
  },
  methods: {
    onPrevStep() {
      if (this.step <= 1) {
        this.$emit("close");
      } else {
        this.transition = "slidePrev";
        this.step--;
      }
    },
    onSubmit() {
      this.transition = "slideNext";
      this.errors = {};

      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      if (this.step == 1) {
        api
          .get("/accounts/reset/" + this.reset_code)
          .then((response) => {
            if ("errors" in response.data) {
              this.errors = response.data.errors;
            }

            if (Object.keys(this.errors).length === 0) {
              this.step++;
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status == 404) {
              Vue.set(
                this.errors,
                "reset_code",
                "This reset code could not be found"
              );
            } else {
              console.log(error);
              Vue.set(
                this.errors,
                0,
                "Your request could not be completed due to a server error"
              );
            }
          })
          .finally(() => {
            loadingComponent.close();
          });
      } else {
        const data = {
          reset_code: this.reset_code,
          password: this.password,
        };

        api
          .post("/accounts/reset", data)
          .then((response) => {
            if ("errors" in response.data) {
              this.errors = response.data.errors;
            }

            if (Object.keys(this.errors).length === 0) {
              this.$buefy.toast.open({
                duration: 5000,
                message:
                  "Your password has been reset " +
                  response.data.player_name +
                  "!",
                type: "is-primary",
              });

              this.$emit("close");
            }
          })
          .catch((error) => {
            if (error.response.status == 404) {
              Vue.set(
                this.errors,
                "reset_code",
                "This reset code could not be found"
              );
            } else {
              Vue.set(this.errors, 0, error.response.data.errors[0].detail);
            }
          })
          .finally(() => {
            loadingComponent.close();
          });
      }
    },
  },
};
</script>
