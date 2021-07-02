<template>
  <div class="page-content forum">
    <AppBreadcrumbs prefix_path="/forums" prefix_name="Forums" />

    <b-notification
      v-if="error"
      type="is-danger"
      has-icon
      :closable="false"
      :message="error"
    >
    </b-notification>

    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <div
      v-for="(section, index) in sections"
      :class="'section animateSlideUp order' + (index + 1)"
      :key="section.slug"
    >
      <div class="section-head">
        <h3 class="section-title">{{ section.title }}</h3>
      </div>
      <div class="section-body">
        <router-link
          class="category-row category-item category-link"
          :to="'/forums/' + category.slug"
          v-for="category in section.categories"
          :key="category.slug"
        >
          <div class="row-item row-item-title">{{ category.title }}</div>
          <div class="row-item row-item-threads">
            <span>Threads</span>{{ category.thread_count }}
          </div>
          <div class="row-item row-item-posts">
            <span>Posts</span>{{ category.post_count }}
          </div>
          <div class="row-item row-item-latest" v-if="category.latest_post">
            <div class="latest-post-avatar">
              <img
                class="player-head"
                :src="
                  'https://mc-heads.net/avatar/' +
                  category.latest_post.player_uuid +
                  '/32/nohelm.png'
                "
              />
            </div>
            <div class="latest-post-thread">
              <router-link :to="'/thread/' + category.latest_post.slug">{{
                category.latest_post.title
              }}</router-link>
            </div>
            <div class="latest-post-details">
              <div class="latest-post-created">
                {{ relativeDate(category.latest_post.created) }}
              </div>
              <div class="latest-post-author">
                {{ category.latest_post.player_name }}
              </div>
            </div>
          </div>
          <div class="row-item row-item-latest-none" v-else>No Posts Found</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { relativeEpochDate } from "@/common.js";
import api from "@/api.js";

export default {
  metaInfo: {
    // title: 'My Example App',
  },
  data: function () {
    return {
      loading: true,
      session_id: "",
      error: "",
      sections: [],
    };
  },
  components: {
    AppBreadcrumbs,
  },
  watch: {
    "$store.state.account_uuid": function () {
      this.loadPage();
    },
  },
  mounted: function () {
    this.loadPage();
  },
  methods: {
    relativeDate(epoch) {
      return relativeEpochDate(epoch);
    },

    loadPage: debounce(async function () {
      this.sections = [];
      this.error = "";
      this.loading = true;

      try {
        const response = await api.get("/forums/sections");
        this.loading = false;

        if (response.data.sections.length > 0) {
          for (const section of response.data.sections) {
            try {
              const response = await api.post("/forums/categories/search", {
                section_slug: section.slug,
              });

              if (response) {
                section["categories"] = response.data.categories;
                this.sections.push(section);
              }
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          this.error =
            "There is currently no forums available. Please try again later.";
        }
      } catch (error) {
        console.log(error);
        this.error =
          "An unexpected error occured on the server. Please try again later.";

        if (error.response && error.response.status) {
          if (error.response.status == 404) {
            this.error =
              "No available forums where found. Please try again later.";
          }
        }
      }

      this.loading = false;
    }),
  },
};
</script>

<style lang="scss">
.forum {
  .section {
    padding: 1rem 1.5rem 3rem 1.5rem;
  }

  .section-body {
    .category-row {
      display: grid;
      grid-template-columns: min-content auto;
      grid-template-rows: auto auto auto;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .category-row {
      &:last-of-type {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    .category-link {
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .category-header {
      font-size: 0.9rem;
    }

    .header-item,
    .row-item {
      padding: 0.75rem;
      align-self: center;
    }

    .header-item-title,
    .row-item-title {
      flex-grow: 1;
    }

    .header-item-threads,
    .header-item-posts,
    .header-item-latest {
      justify-self: center;
    }

    .header-item-threads,
    .header-item-posts {
      display: none;
    }

    .row-item-threads,
    .row-item-posts {
      overflow: hidden;
      white-space: nowrap;
      font-size: 80%;
      padding-top: 0;

      span {
        display: inline-block;
        margin-right: 0.25rem;
        color: #666;

        &:after {
          content: ":";
        }
      }
    }

    .row-item,
    a {
      color: #bbb;
    }

    a:hover {
      a,
      .row-item {
        color: #fff;
      }
    }

    .header-item-title {
      grid-column: 1 / span 1;
      grid-row: 1 / span 1;
    }

    .row-item-title {
      grid-column: 1 / span 2;
      grid-row: 1 / span 1;
      padding-bottom: 0;
    }

    .row-item-threads {
      grid-column: 1 / span 1;
      grid-row: 2 / span 1;
      padding-right: 0;

      &:after {
        color: #666;
        padding: 0 0.5rem 0 0.25rem;
        content: "•";
      }
    }

    .row-item-posts {
      grid-column: 2 / span 1;
      grid-row: 2 / span 1;
      padding-left: 0;
    }

    .row-item-latest {
      grid-column: 1 / span 2;
      grid-row: 3 / span 1;

      display: grid;
      grid-template-columns: auto;
      grid-template-rows: 1.2rem 1.2rem;

      .latest-post-avatar {
        display: none;
        grid-column: 1 / span 1;
        grid-row: 1 / span 2;
        align-self: center;
      }

      .latest-post-thread {
        grid-area: 1 / 1 / 1 / 1;
        font-size: 0.8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .latest-post-details {
        grid-area: 2 / 1 / 2 / 1;
        display: flex;
        font-size: 0.8rem;
      }

      .latest-post-created {
        display: inline-block;
        color: #666;
        margin-right: 0.5rem;

        &:after {
          content: "•";
          padding-left: 0.5rem;
        }
      }

      .latest-post-author {
        display: inline-block;
      }
    }

    .row-item-latest-none {
      grid-column: 1 / span 2;
      grid-row: 3 / span 1;
      font-size: 0.8rem;
    }
  }
}

@media only screen and (min-width: 550px) {
  .forum {
    .section-body {
      .category-row {
        grid-template-columns: min-content auto 17rem;
        grid-template-rows: auto auto;
      }

      .row-item-latest {
        grid-column: 3 / span 1;
        grid-row: 1 / span 2;
        grid-template-columns: 2.5rem auto;

        .latest-post-avatar {
          display: block;
        }

        .latest-post-thread {
          grid-area: 1 / 2 / 1 / 2;
        }

        .latest-post-details {
          grid-area: 2 / 2 / 2 / 2;
        }
      }

      .row-item-latest-none {
        grid-column: 3 / span 1;
        grid-row: 1 / span 2;
        text-align: center;
      }
    }
  }
}

@media only screen and (min-width: 770px) {
  .forum {
    .section-body {
      .category-row,
      .category-header {
        grid-template-columns: auto 4.5rem 4.5rem 17rem;
        grid-template-rows: auto;
      }

      .header-item-threads {
        display: block;
      }

      .header-item-posts {
        display: block;
      }

      .row-item-title {
        grid-column: 1 / span 1;
        grid-row: 1 / span 1;
        padding-bottom: 0.75rem;
      }

      .row-item-threads {
        grid-column: 2 / span 1;
        grid-row: 1 / span 1;

        &:after {
          padding: 0;
          content: "";
        }
      }

      .row-item-posts {
        grid-column: 3 / span 1;
        grid-row: 1 / span 1;
      }

      .row-item-latest,
      .row-item-latest-none {
        grid-column: 4 / span 1;
        grid-row: 1 / span 1;
      }

      .row-item-threads,
      .row-item-posts {
        font-size: 100%;
        padding-top: 0.75rem;
        text-align: center;

        span {
          display: block;
          font-size: 80%;

          &:after {
            content: "";
          }
        }
      }
    }
  }
}
</style>
