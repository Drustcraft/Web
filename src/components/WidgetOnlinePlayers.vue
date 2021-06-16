<template>
  <div class="widget-online-players">
    <div class="card">
      <div class="card-content">
        <div class="online-content">
          <div class="online-status">
            <img src="/images/minecraft.png" class="online-image" />
            <div class="online-count">{{ onlineCount }}</div>
          </div>
          <div class="online-title">play.drustcraft.com.au</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  data: () => ({
    error: false,
    online: 0,
  }),
  mounted: function () {
    this.update();
  },
  computed: {
    onlineCount() {
      if (this.error) {
        return "...";
      } else {
        return this.online + " players online";
      }
    },
  },
  methods: {
    update() {
      this.$api
        .post("/online/minecraft")
        .then((response) => {
          if ("online" in response.data) {
            this.online = response.data.online;
            this.error = false;
          } else {
            this.error = true;

            // if ("error" in response.data) {
            //   console.log(response.data.error);
            // }
          }
        })
        .catch((/* e */) => {
          // console.log(e);
          this.error = true;
        });

      setTimeout(
        function () {
          this.update();
        }.bind(this),
        10000
      );
    },
  },
};
</script>

<style lang="scss">
.widget-online-players {
  .card {
    background-color: #000;
    background-image: url("/images/widget-online-players-background.png");
    font-family: minecraftfont, Poppins, -apple-system, BlinkMacSystemFont,
      "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    color: #fff;

    .card-content {
      padding: 0.8rem;

      .online-content {
        display: flex;
        flex-direction: column;

        .online-status {
          display: flex;
          // justify-content: center;
          align-items: center;

          .online-image {
            width: 32px;
            height: 32px;
          }

          .online-count {
            font-weight: 600;
            font-size: 1rem;
            padding-left: 0.5rem;
            color: #aaa;
          }

          .online-postfix {
            font-weight: normal;
          }
        }

        .online-title {
          font-size: 1rem;
          margin: 0.5rem 0 0.5rem 0;
          text-align: center;
        }
      }
    }
  }
}
</style>
