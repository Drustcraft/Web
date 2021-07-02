<template>
  <div id="front">
    <video
      class="front-video"
      src="media/front.mp4"
      data-src="media/front.mp4"
      loop="loop"
      muted="muted"
      autoplay="autoplay"
      playsinline="playsinline"
    ></video>

    <div class="front-banner">
      <h1>Your story starts here!</h1>
      <p>
        The world of Azentina awaits and your adventure from Ironport begins
        shortly. Face deadly foes, earn new rewards, raid dungeons, command a
        guild, or just settle down on your own plot. The choice is yours!
      </p>
      <p>
        Schools, Libraries and other Organisations can also get involved using
        special tools and learning materials and expand on the world. Educate
        your participants on game design, story telling or put their creativity
        to the test.
      </p>
      <div class="button-group">
        <a href="#" class="button" @click.prevent="showModalContact">Contact</a>
        <a
          href="#"
          class="button yellow"
          @click.prevent="showModalRegister"
          v-if="!userLoggedIn"
          >Register</a
        >
      </div>
    </div>

    <div class="front-news">
      <div class="news-title">
        <h5>Latest News & Updates</h5>
        <router-link to="/forums/announcements">View All</router-link>
      </div>
      <div class="news-item">
        <router-link
          :to="'/thread/' + getNewsItem(0, 'slug')"
          class="news-item-box"
          :style="{
            backgroundImage:
              'url(\'https://files.drustcraft.com.au/' +
              getNewsItem(0, 'banner') +
              '\')',
          }"
        >
          <div class="news-item-info">
            <div class="news-item-date">{{ getNewsItem(0, "created") }}</div>
            <div class="news-item-title">{{ getNewsItem(0, "title") }}</div>
          </div>
        </router-link>
      </div>
      <div class="news-item">
        <router-link
          :to="'/thread/' + getNewsItem(1, 'slug')"
          class="news-item-box"
          :style="{
            backgroundImage:
              'url(\'https://files.drustcraft.com.au/' +
              getNewsItem(1, 'banner') +
              '\')',
          }"
        >
          <div class="news-item-info">
            <div class="news-item-date">{{ getNewsItem(1, "created") }}</div>
            <div class="news-item-title">{{ getNewsItem(1, "title") }}</div>
          </div>
        </router-link>
      </div>
      <div class="news-item">
        <router-link
          :to="'/thread/' + getNewsItem(2, 'slug')"
          class="news-item-box"
          :style="{
            backgroundImage:
              'url(\'https://files.drustcraft.com.au/' +
              getNewsItem(2, 'banner') +
              '\')',
          }"
        >
          <div class="news-item-info">
            <div class="news-item-date">{{ getNewsItem(2, "created") }}</div>
            <div class="news-item-title">{{ getNewsItem(2, "title") }}</div>
          </div>
        </router-link>
      </div>
      <div class="news-item">
        <router-link
          :to="'/thread/' + getNewsItem(3, 'slug')"
          class="news-item-box"
          :style="{
            backgroundImage:
              'url(\'https://files.drustcraft.com.au/' +
              getNewsItem(3, 'banner') +
              '\')',
          }"
        >
          <div class="news-item-info">
            <div class="news-item-date">{{ getNewsItem(3, "created") }}</div>
            <div class="news-item-title">{{ getNewsItem(3, "title") }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api.js";
import {
  showComponentAsModal,
  getUrlParam,
  logout,
  relativeEpochDate,
} from "@/common.js";

export default {
  data: function () {
    return {
      news: [],
    };
  },
  computed: {
    userLoggedIn() {
      return this.$store.state.account_uuid !== null;
    },
  },
  mounted: function () {
    if (this.$route.path == "/contact") {
      showComponentAsModal(this, "ModalContactUs");
    } else if (this.$route.path == "/login") {
      if (this.$store.state.account_uuid == null) {
        showComponentAsModal(this, "ModalLogin");
      } else {
        let page = getUrlParam("page");
        if (page != null) {
          this.$router.push({ path: page });
        } else {
          this.$router.push({ path: "/" });
        }
      }
    } else if (this.$route.path == "/register") {
      showComponentAsModal(this, "ModalRegister");
    } else if (this.$route.path == "/logout") {
      logout();
    }

    api
      .post("/forums/threads/search", {
        category_slug: "announcements",
        has_banner: true,
        order: "created",
        limit: 4,
      })
      .then((response) => {
        this.news = response.data.threads;
      })
      .catch((/*error*/) => {
        // alert("ERR: " + JSON.stringify(error));
      });
  },
  methods: {
    getNewsItem: function (index, item) {
      if (this.news.length > index) {
        if (item == "created") {
          var months = Array(
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          );
          var d = new Date(0);
          d.setUTCSeconds(this.news[index]["created"]);

          return (
            months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
          );
        }

        return this.news[index][item];
      }

      return "";
    },
    showModalContact: function () {
      showComponentAsModal(this, "ModalContactUs");
    },
    showModalRegister: function () {
      showComponentAsModal(this, "ModalRegister");
    },
    relativeDate: function (epoch) {
      return relativeEpochDate(epoch);
    },
  },
};
</script>

<style lang="scss" scoped>
#front {
  position: relative;
  background-image: none;
  background-position: top center;
  background-size: auto 900px;
  background-repeat: no-repeat;
  padding: 2rem;
  overflow: hidden;
  flex-grow: 1;

  .front-video {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-height: 900px;
    min-width: 100%;
    object-fit: cover;
    -webkit-mask-image: linear-gradient(to bottom, black 75%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 75%, transparent 100%);
  }

  .front-banner {
    position: relative;
    margin: 13rem 0;
    padding: 1rem 2rem 0 2rem;
    max-width: 800px;
    min-height: 350px;

    h1 {
      color: #fff;
      margin-bottom: 1rem;
    }

    p {
      color: #eee;
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .button-group {
      justify-content: flex-start;
    }

    .button {
      margin-top: 1.5rem;
      margin-bottom: 2rem;
    }
  }

  .front-news,
  .front-news-mobile {
    position: relative;
    display: grid;
    grid-template-columns: 24rem 24rem 24rem;
    grid-template-rows: auto auto;
    grid-gap: 0.5rem;
    justify-content: center;

    .news-title {
      grid-column: 1 / span 4;
      grid-row: 1 / span 1;
      padding-left: 1rem;
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);

      h5 {
        color: #fff;
        margin-bottom: 0;
        text-align: left;
        margin-right: 1rem;
        display: inline-block;
      }

      a {
        color: #e2a233;
        font-size: 90%;
        transition: all 0.3s;

        &:hover {
          color: #eee;
          text-decoration: underline;
        }
      }
    }

    .news-item {
      width: 100%;
      padding-top: 56.25%;
      position: relative;

      &:nth-of-type(2) {
        grid-column: 1 / span 1;
        grid-row: 2 / span 1;
      }

      &:nth-of-type(3) {
        grid-column: 2 / span 1;
        grid-row: 2 / span 1;
      }

      &:nth-of-type(4) {
        grid-column: 3 / span 1;
        grid-row: 2 / span 1;
      }

      &:nth-of-type(5) {
        display: none;
      }
    }

    .news-item-box {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: inline-block;
      border: 1px solid #666;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
      justify-content: flex-end;
      overflow: hidden;
      transition: all 0.3s;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);

      &:hover {
        border-color: #e2a233;
      }

      .news-item-info {
        background-color: rgba(0, 0, 0, 0.7);
        box-shadow: 0 -5px 5px 5px rgba(0, 0, 0, 0.7);
      }

      .news-item-date {
        color: #ddd;
        font-size: 0.9rem;
        padding: 0 1.5rem;
      }

      .news-item-title {
        color: #e2a233;
        font-weight: bold;
        font-size: 1.2rem;
        padding: 0 1.5rem 1rem 1.5rem;
      }
    }
  }
}

@media only screen and (max-width: 1240px) {
  #front {
    .front-news {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto;
      grid-gap: 1rem;

      .news-title {
        grid-column: 1 / span 2;
        grid-row: 1 / span 1;
      }

      .news-item {
        &:nth-of-type(2) {
          grid-column: 1 / span 1;
          grid-row: 2 / span 1;
        }

        &:nth-of-type(3) {
          grid-column: 2 / span 1;
          grid-row: 2 / span 1;
        }

        &:nth-of-type(4) {
          grid-column: 1 / span 1;
          grid-row: 3 / span 1;
        }

        &:nth-of-type(5) {
          grid-column: 2 / span 1;
          grid-row: 3 / span 1;
          display: flex;
        }
      }
    }
  }
}

@media only screen and (max-width: 780px) {
  #front {
    background-image: url("/images/front.png");

    .front-video {
      display: none;
    }

    .front-banner {
      position: relative;
      margin: 8rem 0;
            
      .button {
        margin: 0.5rem 0 0.5rem 0;
      }
    }

    .front-news {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
