<template>
  <AppModal ref="modal" title="Contact Us" @submit="onSubmit" :errors="errors">
    <InputValidation
      rules="required"
      type="text"
      label="Name"
      placeholder="Your name"
      v-model="name"
    />
    <InputValidation
      rules="required|email"
      type="email"
      label="Email"
      placeholder="Your email"
      v-model="email"
    />
    <InputValidation
      rules="required"
      type="textarea"
      label="Message"
      placeholder="Your message"
      v-model="message"
    />
    <vue-hcaptcha
      sitekey="3a8fe388-d04c-47ee-b78d-5183b0055ca0"
      ref="hCaptcha"
      size="invisible"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpire"
      @challengeExpired="onCaptchaExpire"
      @error="onCaptchaError"
    />

    <template v-slot:foot>
      <div class="button-group">
        <b-button label="Close" @click="$emit('close')" />
        <b-button native-type="submit" label="Send" class="yellow" />
      </div>
    </template>
  </AppModal>
</template>

<script>
import Vue from "vue";
import AppModal from "@/components/AppModal";
import InputValidation from "@/components/InputValidation";
import api from "@/api.js";
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";

export default {
  data: () => ({
    errors: {},
    name: "",
    email: "",
    message: "",
    captchaVerified: false,
    captchaToken: null,
    captchaEKey: null,
  }),
  components: {
    AppModal,
    InputValidation,
    VueHcaptcha,
  },
  methods: {
    onCaptchaVerify(token, ekey) {
      this.captchaToken = token;
      this.captchaEKey = ekey;
      this.captchaVerified = true;
      this.onSubmit();
    },
    onCaptchaExpire() {
      this.captchaToken = null;
      this.captchaEKey = null;
      this.captchaVerified = false;
    },
    onCaptchaError(error) {
      this.captchaToken = null;
      this.captchaEKey = null;
      this.error = error;
    },
    onSubmit() {
      if (this.captchaVerified) {
        const loadingComponent = this.$buefy.loading.open({
          container: this.$el,
        });

        let data = {
          name: this.name,
          email: this.email,
          message: this.message,
          captcha_token: this.captchaToken,
        };

        api
          .post("/contact", data)
          .then(() => {
            this.$buefy.toast.open({
              message: "Your message has been sent!",
              type: "is-success",
              duration: 5000,
              position: "is-top-right",
            });
            this.$emit("close");
          })
          .catch((error) => {
            if (error.response.data.errors) {
              error.response.data.errors.forEach((item) => {
                if ("data" in item) {
                  Vue.set(this.errors, item.data, item.detail);
                } else {
                  Vue.set(this.errors, 0, item.detail);
                }
              });
            }
          })
          .finally(() => {
            loadingComponent.close();
          });
      } else {
        //this.error = "You need to verify that you a human!";
        this.$refs.hCaptcha.execute();
      }
    },
    resetForm() {
      this.name = "";
      this.email = "";
      this.message = "";
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
  },
};
</script>
