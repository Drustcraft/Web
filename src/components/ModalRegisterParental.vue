<template>
  <AppModal
    ref="modal"
    title="Create Parental Account"
    @submit="onSubmit"
    :errors="errors"
    :width="width"
  >
    <transition
      :name="transition"
      @after-enter="onTransitionLeave"
      mode="out-in"
    >
      <fieldset v-if="step === 1" key="step1">
        <b-notification
          type="is-info is-light has-text-centered"
          :closable="false"
          >Parental accounts allow you to monitor your children's activity on
          the Drustcraft network and participate in the forums and web
          activities.</b-notification
        >
        <InputValidation
          rules="required|email"
          type="email"
          label="Email address"
          placeholder="Your Email address"
          v-model="email"
          ref="email"
        />
      </fieldset>

      <fieldset v-if="step !== 1" key="step2">
        <p>
          Howdy <strong>{{ playername }}</strong
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
      <p style="line-height: 1.5rem">
        Already have an account?
        <a href="#" @click.prevent="showModalLogin">Login</a><br />
        Looking to create a
        <a href="#" @click.prevent="showModalRegister">Player account</a>?<br />
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
import { showComponentAsModal, whichTransitionEvent } from "@/common.js";
import api from "@/api.js";

export default {
  props: {
    width: {
      type: String,
      default: "640px",
    },
  },
  data: function () {
    return {
      transition: "slideNextT",
      errors: {},
      step: 1,
      maxSteps: 2,
      email: "",
      agree_terms: "false",
      password: "",
      password_confirm: "",
      playername: "",
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
      this.transition = "slideNextT";
      this.errors = {};

      const loadingComponent = this.$buefy.loading.open({
        container: this.$el,
      });

      if (this.step == 1) {
        api;
        //           .get("/accounts/register/" + this.linking_code)
        //           .then((response) => {
        //             if ("errors" in response.data) {
        //               this.errors = response.data.errors;
        //             }
        //
        //             if (Object.keys(this.errors).length === 0) {
        this.step++;
        // }
        // })
        // .catch((error) => {
        //   console.log(error);
        //   if (error.response.status == 404) {
        //     Vue.set(
        //       this.errors,
        //       "linking_code",
        //       "This linking code could not be found"
        //     );
        //   } else {
        //     console.log(error);
        //     Vue.set(
        //       this.errors,
        //       0,
        //       "Your request could not be completed due to a server error"
        //     );
        //   }
        // })
        // .finally(() => {
        loadingComponent.close();
        // });
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
            if (error.response.status == 404) {
              Vue.set(
                this.errors,
                "linking_code",
                "This linking code could not be found"
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
    showModalLogin() {
      this.$emit("close");
      showComponentAsModal(this, "ModalLogin");
    },
    showModalRegister() {
      this.$emit("close");
      showComponentAsModal(this, "ModalRegister");
    },
  },
};
</script>

<style lang="scss">
fieldset {
  transition: all 0.3s ease-out;
}

.slideNextT-enter-active {
  transform: translatex(110%);
}

.slideNextT-leave-to {
  transform: translatex(-110%);
}

.slidePrev-enter-active {
  transform: translatex(-110%);
}

.slidePrev-leave-to {
  transform: translatex(110%);
}
</style>
