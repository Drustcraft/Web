<template>
  <li>
    <router-link :to="item.url"><i :class="item.icon"></i> {{ item.title }}</router-link>
  </li>
</template>

<script>
export default {
  props: ['item'],
}
</script>
