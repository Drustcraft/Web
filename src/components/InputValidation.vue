<template>
  <ValidationProvider
    ref="provider"
    :vid="vid"
    :name="$attrs.name || $attrs.label"
    :rules="rules"
    v-slot="{ errors, valid }"
  >
    <b-field
      v-bind="$attrs"
      :type="
        showSuccess
          ? { 'is-danger': errors[0], 'is-success': valid }
          : { 'is-danger': errors[0] }
      "
      :message="errors"
    >
      <b-input v-model="innerValue" v-bind="$attrs"></b-input>
    </b-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationProvider,
  },
  props: {
    vid: {
      type: String,
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    showSuccess: {
      type: Boolean,
      default: true,
    },
    // must be included in props
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: "",
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
  methods: {
    applyResult(data) {
      this.$refs.provider.applyResult(data);
    },
    reset() {
      this.$refs.provider.reset();
    },
    setFlags(flags) {
      this.$refs.provider.setFlags(flags);
    },
    clearSuccess() {
      this.$refs.provider.setFlags({
        valid: false,
      });
    },
  },
};
</script>
