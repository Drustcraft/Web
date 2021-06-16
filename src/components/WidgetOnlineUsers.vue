<template>
  <div class="news-item">
    <div class="card" :style="'background-image:url(' + background + ')'">
      <div class="card-content">
        <div class="forum-thread-info">
          <h3>{{ title }}</h3>
          <p>{{ content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
    background: String,
  },
};
</script>

<style lang="scss">
.news-item {
  .card {
    color: #fff;
    background-color: #666;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 15rem;
    display: flex;

    .card-content {
      background-color: rgba(0, 0, 0, 0.3);
      flex-grow: 1;
      display: flex;
      align-items: flex-end;
      -webkit-transition: all 0.5s ease;
      transition: all 0.5s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
</style>
