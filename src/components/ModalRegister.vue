<template>
  <AppModal ref="modal" title="Register" @submit="onSubmit" :errors="errors">
    <transition
      :name="transition"
      @after-enter="onTransitionLeave"
      mode="out-in"
    >
      <fieldset v-if="step === 1" key="step1">
        <b-notification type="is-info" :closable="false"
          >Login into the Drustcraft Minecraft server at
          <strong>play.drustcraft.com.au</strong> (port
          <strong>20132</strong> for Bedrock/Tablet players) to receive your 6
          digit linking code.</b-notification
        >
        <InputValidation
          rules="required|length:6"
          type="text"
          label="Linking Code"
          placeholder="Your Linking Code"
          v-model="linking_code"
          ref="linking_code"
        />
      </fieldset>

      <fieldset v-if="step !== 1" key="step2">
        <p class="has-text-centered">
          Howdy <strong>{{ player_name }}</strong
          >!, lets finish off creating your website account
        </p>
        <CheckboxValidation
          rules="checkboxChecked"
          v-model="agree_terms"
          key="agree_terms"
          >I agree to the <a href="/rules" target="_blank">Rules</a> and
          <a href="/terms" target="_blank">Terms of Use</a></CheckboxValidation
        >
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
      <p>
        Already have an account?
        <a href="#" @click.prevent="showModalLogin">Login</a><br />
        <!-- Looking to create a <a href="#" @click.prevent="showModalRegisterParental">Parental account</a>?<br> -->
      </p>
      <div class="button-group">
        <b-button :label="prevLabel" @click="onPrevStep()" />
        <b-button native-type="submit" :label="nextLabel" class="yellow" />
      </div>
    </template>
  </AppModal>
</template>

<script>
import Vue from "vue";
import AppModal from "@/components/AppModal";
import InputValidation from "@/components/InputValidation";
import CheckboxValidation from "@/components/CheckboxValidation";
import {
  showComponentAsModal,
  whichTransitionEvent,
  checkAxiosErrorDefined,
} from "@/common.js";
import api from "@/api.js";

export default {
  data: function () {
    return {
      transition: "slideNext",
      errors: {},
      step: 1,
      maxSteps: 2,
      linking_code: "",
      agree_terms: "false",
      password: "",
      password_confirm: "",
      player_name: "",
    };
  },
  components: {
    AppModal,
    CheckboxValidation,
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
        return "Register";
      }

      return "Next";
    },
  },
  mounted: function () {
    if (this.$store.state.account_uuid !== null) {
      this.$buefy.toast.open({
        duration: 5000,
        message: "You are already registered!",
        type: "is-danger",
      });

      this.$emit("close");
    }
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
    onTransitionLeave(elem) {
      var transitionEvent = whichTransitionEvent();
      var self = this;
      this.$nextTick(function () {
        elem.addEventListener(transitionEvent, function () {
          self.$refs.modal.setFocus();
        });
      });
    },
    onSubmit() {
      this.transition = "slideNext";
      this.errors = {};

      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      if (this.step == 1) {
        api
          .get("/accounts/register/" + this.linking_code)
          .then((response) => {
            if ("errors" in response.data) {
              this.errors = response.data.errors;
            }

            if (Object.keys(this.errors).length === 0) {
              this.player_name = response.data.player_name;
              this.step++;
            }
          })
          .catch((error) => {
            let message = "An unexpected error occured";

            if ("detail" in error.response) {
              message = error.response.detail;
            } else {
              switch (error.response.status) {
                case 404:
                  message = "This linking code could not be found";
                  break;
              }
            }

            Vue.set(this.errors, 0, message);
          })
          .finally(() => {
            loadingComponent.close();
          });
      } else {
        const data = {
          linking_code: this.linking_code,
          password: this.password,
          login: true,
        };

        api
          .post("/accounts/register", data)
          .then((response) => {
            if ("errors" in response.data) {
              this.errors = response.data.errors;
            }

            if (Object.keys(this.errors).length === 0) {
              if ("access_token" in response.data) {
                this.$store.dispatch("setToken", {
                  token_value: response.data.access_token,
                  token_type: response.data.token_type,
                  account_uuid: response.data.account_uuid,
                });
                this.$store.commit("account_groups", response.data.groups);
              }

              this.$buefy.toast.open({
                duration: 5000,
                message:
                  "Welcome to Drustcraft " + response.data.player_name + "!",
                type: "is-primary",
              });

              this.$emit("close");
            }
          })
          .catch((error) => {
            if (checkAxiosErrorDefined(error)) {
              error.response.data.errors.each((error_data) => {
                if ("data" in error_data) {
                  Vue.set(this.errors, error_data.data, error_data.detail);
                } else {
                  Vue.set(this.errors, 0, error_data.detail);
                }
              });
            } else {
              Vue.set(
                this.errors,
                0,
                "An unexpected error occured, Please try again later"
              );
              console.log(error);
            }
            // if("errors")

            //             let message = "An unexpected error occured";
            //
            //             if ("detail" in error.response) {
            //               message = error.response.detail;
            //             } else {
            //               switch (error.response.status) {
            //                 case 404:
            //                   message = "This linking code could not be found";
            //                   break;
            //               }
            //             }
            //
            //             Vue.set(this.errors, 0, message);
            /**/
            // if (error.response.status == 404) {
            //   Vue.set(
            //     this.errors,
            //     "linking_code",
            //     "This linking code could not be found"
            //   );
            // } else {
            // if(typeof error.response.data.errors !== "undefined") {
            //   Vue.set(this.errors, 0, error.response.data.errors[0].detail);
            // }
            // }
          })
          .finally(() => {
            loadingComponent.close();
          });
      }
    },
    showModalLogin() {
      this.$emit("close");
      showComponentAsModal(this, "ModalLogin");
    },
    showModalRegisterParental() {
      this.$emit("close");
      showComponentAsModal(this, "ModalRegisterParental");
    },
  },
};
</script>

<style lang="scss">
fieldset {
  transition: all 0.3s ease-out;
}

.slideNext-enter-active {
  transform: translatex(110%);
}

.slideNext-leave-to {
  transform: translatex(-110%);
}

.slidePrev-enter-active {
  transform: translatex(-110%);
}

.slidePrev-leave-to {
  transform: translatex(110%);
}
</style>
