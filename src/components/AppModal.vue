<template>
  <ValidationObserver ref="observer" tag="form" @submit.prevent="onSubmit()">
    <div class="modal-card" ref="modal">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <slot name="head"></slot>
      </header>
      <section class="modal-card-body" :style="[{ overflow: overflow }]">
        <b-message type="is-danger" has-icon v-if="0 in errors">{{
          errors[0]
        }}</b-message>
        <slot></slot>
      </section>
      <footer class="modal-card-foot">
        <slot name="foot"></slot>
      </footer>
      <b-loading
        :is-full-page="true"
        v-model="loading"
        :can-cancel="false"
      ></b-loading>
    </div>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from "vee-validate";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    errors: {
      type: Object,
      default: function () {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "640px",
    },
    overflow: {
      type: String,
      default: "visible",
    },
  },
  components: {
    ValidationObserver,
  },
  mounted() {
    this.setFocus();
  },
  watch: {
    errors() {
      if (0 in this.errors) {
        this.$parent.$refs.each((ref) => {
          if (ref && typeof ref.clearSuccess === "function") {
            ref.clearSuccess();
          }
        });
      }

      this.errors.each((value, key) => {
        if (key in this.$parent.$refs) {
          this.$parent.$refs[key].applyResult({
            errors: [value],
            valid: false,
            failedRules: {},
          });
        }
      });
    },
  },
  methods: {
    async onSubmit() {
      const isValid = await this.$refs.observer.validate();
      if (isValid) {
        this.$emit("submit");
      } else {
        // abort!!!
      }
    },
    setFocus() {
      this.$nextTick(function () {
        let elem = this.$el.querySelector(
          "input[type=email],input[type=password],input[type=text],textarea"
        );
        elem && elem.focus && elem.focus();
      });
    },
  },
};
</script>

<style lang="scss">
.modal-card {
  overflow: auto;

  .modal-card-head {
    // border-bottom: 1px solid #444;
  }

  .modal-card-body {
    // padding: 2rem;
  }

  .modal-card-foot {
    
    a {
      // width: 100%;
    }
  }
}

@media only screen and (min-width: 770px) {
  .modal-card {
    min-width: 640px;
    margin: 0 auto !important;
  }
}
</style>
