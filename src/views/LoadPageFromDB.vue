<template>
  <div :class="classList" v-html="content"></div>
</template>

<script>
import api from "@/api.js";

export default {
  data: function () {
    return {
      error: false,
      content: "",
    };
  },
  computed: {
    classList: function () {
      return {
        "page-content": true,
        container: !this.error,
        "container-error": this.error,
      };
    },
  },
  mounted() {
    const loadingComponent = this.$buefy.loading.open({
      container: this.$el,
    });

    let path = this.$route.params.pathMatch
      .substr(1)
      .replace(/[^a-zA-Z0-9_]/g, "-");

    api
      .get("/pages/" + path)
      .then((response) => {
        console.log(response);
        if ("page" in response.data) {
          window.document.title = response.data.page.title;
          this.content = response.data.page.content;
        }
      })
      .catch((error) => {
        if (error.response && error.response.status == 404) {
          this.error = true;
          this.content = '<div class="dark-background">';
          this.content += "<h2>Sorry, page not found</h2>";
          this.content +=
            "<p>We tried to find the page that you wanted and bam, the server told us that we took a wrong turn.</p>";
          this.content += "</div>";
        } else {
          console.log("Error", error.message);
        }
      })
      .finally(() => {
        loadingComponent.close();
      });
  },
};
</script>

<style lang="scss">
.container-error {
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
    background-color: rgba(0, 0, 0, 0.9);
    padding: 1rem 2rem;
    margin: 0 2rem;
    border-radius: 1rem;
  }
}
</style>
