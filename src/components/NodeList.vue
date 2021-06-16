<template>
  <ul class="node-list">
    <li v-for="item in list" :key="item[propId]" class="nav-item">
      <router-link :to="propUrlPrefix + item[propUrl]">{{
        item[propTitle]
      }}</router-link>
      <NodeList
        v-if="item[propChildren] && item[propChildren].length"
        :list="item[propChildren]"
        :propId="propId"
        :propTitle="propTitle"
        :propUrl="propUrl"
        :propUrlPrefix="propUrlPrefix"
        :propChildren="propChildren"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: "NodeList",
  props: {
    list: {
      type: Array,
    },
    propId: {
      type: String,
      default: "id",
    },
    propTitle: {
      type: String,
      default: "title",
    },
    propUrl: {
      type: String,
      default: "url",
    },
    propUrlPrefix: {
      type: String,
      default: "",
    },
    propChildren: {
      type: String,
      default: "children",
    },
  },
  data: function () {
    return {
      pages: [],
    };
  },
};
</script>
