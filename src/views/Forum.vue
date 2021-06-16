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
        <div class="category-header">
          <div class="header-item header-item-title">Category</div>
          <div class="header-item header-item-threads">Threads</div>
          <div class="header-item header-item-posts">Posts</div>
          <div class="header-item header-item-latest">Latest</div>
        </div>
        <router-link
          class="category-row category-item category-link"
          :to="'/forums/' + category.slug"
          v-for="category in section.categories"
          :key="category.slug"
        >
          <div class="row-item row-item-title">{{ category.title }}</div>
          <div class="row-item row-item-threads">
            {{ category.thread_count }}
          </div>
          <div class="row-item row-item-posts">{{ category.post_count }}</div>
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
  // position: relative;
  // margin-top: 3.25rem;
  // width: 100%;

  .section {
    padding: 1rem 1.5rem 3rem 1.5rem;
  }

  .section-body {
    .category-row,
    .category-header {
      display: grid;
      grid-template-columns: auto 4.5rem 4.5rem 17rem;
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
    .header-item-latest,
    .row-item-threads,
    .row-item-posts {
      justify-self: center;
      overflow: hidden;
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

    .row-item-latest {
      display: grid;
      grid-template-columns: 2.5rem auto;
      grid-template-rows: 1.2rem 1.2rem;

      .latest-post-avatar {
        grid-column: 1 / span 1;
        grid-row: 1 / span 2;
        align-self: center;
      }

      .latest-post-thread {
        grid-area: 1 / 2 / 1 / 2;
        font-size: 0.8rem;
      }

      .latest-post-details {
        grid-area: 2 / 2 / 2 / 2;
        display: flex;
        // justify-content: space-between;
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
      font-size: 0.8rem;
      text-align: center;
    }
  }
}
</style>
