<template>
  <AppModal
    ref="modal"
    title="Welcome Back"
    @submit="onSubmit"
    :errors="errors"
    :loading="loading"
  >
    <template v-slot:head>
      <p>It's so exciting to see you again!</p>
    </template>

    <InputValidation
      ref="player_name"
      rules="required"
      type="text"
      :label="label_name"
      :placeholder="placeholder_name"
      v-model="fields.player_name"
      :show-success="false"
    />
    <InputValidation
      ref="password"
      rules="required"
      type="password"
      label="Password"
      placeholder="Your password"
      v-model="fields.password"
      :show-success="false"
    />
    <div class="field-footer">
      <a href="#" class="field-link" @click.prevent="showModalResetPassword"
        >Reset Password</a
      >
    </div>

    <b-field label="Account Type">
      <b-radio
        v-model="fields.account_type"
        name="account_type"
        native-value="java"
        >Java</b-radio
      >
      <b-radio
        v-model="fields.account_type"
        name="account_type"
        native-value="bedrock"
        >Bedrock</b-radio
      >
      <!-- <b-radio v-model="fields.account_type" name="account_type" native-value="parental"
        >Parental</b-radio
      > -->
    </b-field>

    <template v-slot:foot>
      <a href="#" @click.prevent="showModalRegister">Need to register?</a>
      <div class="button-group">
        <b-button label="Close" @click="$emit('close')" />
        <b-button native-type="submit" label="Login" class="yellow" />
      </div>
    </template>
  </AppModal>
</template>

<script>
import Vue from "vue";
import AppModal from "@/components/AppModal";
import InputValidation from "@/components/InputValidation";
import { showComponentAsModal, getUrlParam } from "@/common.js";
import api from "@/api.js";

export default {
  data: function () {
    return {
      errors: {},
      loading: false,
      label_name: "Player name",
      placeholder_name: "Your player name",
      fields: {
        player_name: "",
        password: "",
        account_type: this.$store.state.platform,
      },
    };
  },
  components: {
    AppModal,
    InputValidation,
  },
  watch: {
    "fields.account_type": function (value) {
      if (value === "parental") {
        this.label_name = "Email address";
        this.placeholder_name = "Your email address";
      } else {
        this.label_name = "Player name";
        this.placeholder_name = "Your player name";
      }

      this.$store.commit("platform", value);
    },
  },
  mounted: function () {
    if (this.$store.state.account_uuid !== null) {
      this.$buefy.toast.open({
        duration: 5000,
        message: "You are already logged in!",
        type: "is-danger",
      });

      this.$emit("close");
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.errors = {};

      let data = {
        player_name: this.fields.player_name,
        password: this.fields.password,
      };

      if (this.$store.state.platform === "bedrock") {
        data.player_name = "*" + data.player_name;
      }

      api
        .post("/auth/authenticate", data)
        .then((response) => {
          this.$store.dispatch("setToken", {
            token_value: response.data.access_token,
            token_type: response.data.token_type,
            account_uuid: response.data.account_uuid,
          });
          this.$store.commit("account_groups", response.data.groups);
          this.$emit("close");

          this.$buefy.notification.open({
            duration: 5000,
            message: "Welcome back " + response.data.player_name + "!",
            position: "is-top-right",
            type: "is-success",
            hasIcon: true,
            animation: "slidex",
          });

          let page = getUrlParam("page");
          if (page != null) {
            this.$router.push({ path: page });
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            "errors" in error.response.data
          ) {
            if (error.response.status == 403) {
              Vue.set(
                this.errors,
                "player_name",
                "The player name or password is incorrect"
              );
              Vue.set(
                this.errors,
                "password",
                "The player name or password is incorrect"
              );
            } else {
              error.response.data.errors.forEach((item) => {
                if ("data" in item) {
                  Vue.set(this.errors, item.data, item.detail);
                } else {
                  Vue.set(this.errors, 0, item.detail);
                }
              });
            }
          } else {
            Vue.set(this.errors, 0, "An unexpected error has occurred");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showModalResetPassword() {
      this.$emit("close");
      showComponentAsModal(this, "ModalResetPassword");
    },
    showModalRegister() {
      this.$emit("close");
      showComponentAsModal(this, "ModalRegister");
    },
  },
};
</script>
