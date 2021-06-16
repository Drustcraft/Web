<template>
  <div class="pagenotfound">
    <div class="dark-background">
      <h2>Sorry, page not found</h2>
      <p>
        We tried to find the page that you wanted and bam, the server told us
        that we took a wrong turn.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagenotfound {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  margin-top: 3.25rem;
  padding: 1rem;
  background-image: url("/images/pagenotfound-background.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  min-height: 75vh;

  h2 {
    text-shadow: 0 0 4px black;
    color: #fff;
  }

  p {
    color: #eee;
    text-shadow: 0 0 4px black;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .dark-background {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.95);
    padding: 1rem 2rem;
    margin: 0 2rem;
    border-radius: 1rem;
  }
}
</style>
