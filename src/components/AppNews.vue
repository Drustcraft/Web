<template>
  <div class="news">
    <h1>Latest News</h1>
    <AppNewsItem
      :title="title"
      :content="content"
      :background="background"
      class="animateSlideUp"
    />
    <div class="columns">
      <div class="column">
        <AppNewsItem
          :title="title"
          :content="content"
          :background="background"
          class="animateSlideUp order2"
        />
        <AppNewsItem
          :title="title"
          :content="content"
          :background="background"
          class="animateSlideUp order4"
        />
      </div>
      <div class="column">
        <AppNewsItem
          :title="title"
          :content="content"
          :background="background"
          class="animateSlideUp order3"
        />
        <AppNewsItem
          :title="title"
          :content="content"
          :background="background"
          class="animateSlideUp order5"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppNewsItem from "@/components/AppNewsItem.vue";

export default {
  data: function () {
    return {
      title: "Voting Tweaks - More rewards, Personal Multipliers & More!",
      content: "nomadjimbob Today 12:15pm",
      background: "/forumimage/436.png",
    };
  },
  components: {
    AppNewsItem,
  },
};
</script>

<style lang="scss">
.news {
  color: #333;
  padding: 1rem;

  h1 {
    margin-bottom: 2rem;
  }
}
</style>
