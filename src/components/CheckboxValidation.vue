<template>
  <ValidationProvider
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
    v-slot="{ errors, valid }"
  >
    <b-field
      :type="{ 'is-danger': errors[0], 'is-success': valid }"
      :message="errors"
    >
      <b-checkbox
        v-model="innerValue"
        true-value="true"
        false-value="false"
        v-bind="$attrs"
      >
        <slot />
      </b-checkbox>
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
    // must be included in props
    value: {
      type: String,
    },
  },
  data: () => ({
    innerValue: "false",
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
};
</script>
