<template>
  <div class="widget-online-discord">
    <div class="card">
      <div class="card-content">
        <img
          alt="Discord"
          src="https://discordapp.com/assets/35d75407bd75d70e84e945c9f879bab8.svg"
          class="discord-image"
        />
        <div class="online-content">
          <div class="online-status">
            <div class="online-count">{{ onlineCount }}</div>
            <div class="online-postfix">Members online</div>
          </div>
          <a
            aria-label="Discord"
            href="https://discord.gg/yNzk4x7mpD"
            target="_blank"
            rel="noopener"
            class="online-redirect-icon"
          >
            <i class="fa--xf far fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        return this.online;
      }
    },
  },
  methods: {
    update() {
      this.$api
        .post("/online/discord")
        .then((response) => {
          if ("online" in response.data) {
            this.online = response.data.online;
            this.error = false;
          } else {
            this.error = true;

            if ("error" in response.data) {
              // console.log(response.data.error);
            }
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
.widget-online-discord {
  .card {
    background-color: #738bd7;
    color: #fff;

    .card-content {
      padding: 0.8rem;
      line-height: 1.5rem;

      .discord-image {
        width: 110px;
      }

      .online-content {
        display: flex;
        justify-content: space-between;

        .online-status {
          .online-count {
            font-weight: 600;
            font-size: 1.5rem;
          }

          .online-postfix {
            font-size: 90%;
          }
        }

        .online-redirect-icon {
          align-self: flex-end;
          width: 30px;
          height: 30px;
          text-align: center;
          background: #fff;
          border-radius: 100%;
          line-height: 1;
          color: #738bd7;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          margin-bottom: 0;

          &:hover {
            text-decoration: none;
            margin-top: 0;
            margin-bottom: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
