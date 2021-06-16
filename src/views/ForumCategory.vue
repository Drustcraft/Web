<template>
  <div class="page-content thread">
    <AppBreadcrumbs
      prefix_path="/forums"
      prefix_name="Forums"
      :crumbs="crumbs"
    />

    <b-notification
      v-if="error"
      type="is-danger"
      has-icon
      :closable="false"
      :message="error"
    >
    </b-notification>

    <div v-else class="section">
      <h3 class="section-title">{{ category.title }}</h3>
      <p class="section-detail" v-if="category.detail != ''">
        {{ category.detail }}
      </p>

      <div class="toolbar">
        <router-link
          v-if="category.can_create"
          :to="'/forums/' + this.$route.params.category_slug + '/new-thread'"
          class="button"
          >New Thread</router-link
        >
      </div>

      <b-loading
        :is-full-page="false"
        v-model="loading"
        :can-cancel="false"
      ></b-loading>

      <div v-if="!loading" class="section-body">
        <div class="category-header">
          <div class="header-item header-item-title">Topic</div>
          <div class="header-item header-item-author">Author</div>
          <div class="header-item header-item-posts">Replies</div>
          <div class="header-item header-item-views">Views</div>
          <div class="header-item header-item-latest">Activity</div>
        </div>
        <div
          class="category-row category-item row-item not-found"
          v-if="threads.length == 0"
        >
          <div>No posts found</div>
        </div>
        <router-link
          :class="[
            'category-row',
            'category-item',
            'category-link',
            { 'category-item-pinned': thread.pinned },
          ]"
          :to="'/thread/' + thread.slug"
          v-for="thread in threads"
          :key="thread.slug"
        >
          <div class="row-item row-item-title">
            <i v-if="thread.pinned" class="fas fa-thumbtack"></i
            ><i v-if="thread.locked" class="fas fa-lock"></i>{{ thread.title }}
          </div>
          <div class="row-item row-item-author">
            <img
              class="player-head"
              :src="
                'https://mc-heads.net/avatar/' +
                thread.player_uuid +
                '/32/nohelm.png'
              "
            />
            {{ thread.player_name }}
          </div>
          <div class="row-item row-item-posts">{{ thread.post_count }}</div>
          <div class="row-item row-item-views">{{ thread.views }}</div>
          <div class="row-item row-item-latest">
            {{ relativeDate(latestActivity(thread)) }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { debounce } from "debounce";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { relativeEpochDate, checkAxiosErrorDefined } from "@/common.js";
import api from "@/api.js";

export default {
  data: function () {
    return {
      loading: true,
      error: "",

      category: {},
      threads: [],

      crumbs: [],
    };
  },
  components: {
    AppBreadcrumbs,
  },
  watch: {
    "$route.params": {
      handler() {
        this.loadPage();
      },
      immediate: true,
    },
    "$store.state.account_uuid": function () {
      this.loadPage();
    },
  },
  computed: {
    currentPage() {
      return 1;
    },
  },
  methods: {
    relativeDate(epoch) {
      return relativeEpochDate(epoch);
    },

    latestActivity: function (item) {
      if (item.post_count == 0) {
        return item.created;
      }

      return item.latest_post.created;
    },

    loadPage: debounce(async function () {
      this.category = {};
      this.threads = [];
      this.error = "";
      this.loading = true;

      try {
        const category_response = await api.post("/forums/categories/search", {
          category_slug: this.$route.params.category_slug,
        });
        this.category = category_response.data.categories[0];
        Vue.set(this.crumbs, 0, {
          path: "/forums/" + this.category.slug,
          name: this.category.title,
        });

        const thread_response = await api.post("/forums/threads/search", {
          category_slug: this.$route.params.category_slug,
        });
        this.threads = thread_response.data.threads;
      } catch (error) {
        if (checkAxiosErrorDefined(error)) {
          this.error = error.data.errors[0].detail;
        } else {
          try {
            switch (error.response.status) {
              case 403:
                this.error =
                  "You do not have permission to view this forum category";
                break;
              case 404:
                this.error =
                  "This forum category was not found, has been deleted or you do not have permission to view";
                break;
              default:
                throw null;
            }
          } catch {
            this.error = "An unexpected error occurred, Please try again later";
            console.log(error);
          } finally {
            Vue.set(this.crumbs, 0, {
              path: "/forums/",
              name: "Error",
            });
          }
        }
      } finally {
        this.loading = false;
      }
    }),
  },
};
</script>

<style lang="scss">
.thread {
  // position: relative;
  // margin-top: 3.25rem;
  // width: 100%;

  .error {
    display: flex;
    align-items: center;
    margin: 4rem auto;
    padding: 2rem;
    max-width: 40rem;
    border-left: 5px solid #f14668;
    border-radius: 0.5rem;
    background-color: #fcd4dc;

    .error-icon {
      font-size: 3rem;
      margin-right: 1rem;
      color: #cc0f35;
    }

    .error-text {
      color: #cc0f35;
    }
  }

  .section {
    padding: 1rem 1.5rem 3rem 1.5rem;

    .toolbar {
      margin-bottom: 1rem;
      text-align: right;
    }
  }

  .section-title {
    margin-bottom: 0;
  }

  .section-detail {
    margin-bottom: 1.5rem;
    font-size: 90%;
    color: rgba(255, 255, 255, 0.8);
  }

  .section-body {
    .category-row,
    .category-header {
      display: grid;
      grid-template-columns: auto 14rem 4.5rem 4.5rem 9rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .category-row {
      &:last-of-type {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      &.category-item-pinned {
        // background-color: rgba(255, 255, 0, 0.1);

        .fa-thumbtack {
          color: #f33;
          display: inline-block;
          // transform: rotate(45deg);
        }
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

    .row-item.not-found {
      grid-template-columns: auto;
      text-align: center;
    }

    .header-item-title,
    .row-item-title {
      flex-grow: 1;

      i {
        margin-right: 0.75rem;
      }
    }

    .row-item-author,
    .row-item-posts,
    .row-item-views,
    .row-item-latest {
      font-size: 0.8rem;
    }

    .row-item-author {
      display: flex;
      align-items: center;
      img {
        padding-right: 0.5rem;
      }
    }

    // .header-item-threads, .header-item-posts, .header-item-latest, .row-item-threads, .row-item-posts {
    .header-item-author,
    .header-item-posts,
    .header-item-views,
    .header-item-latest,
    .row-item-author,
    .row-item-posts,
    .row-item-views,
    .row-item-latest {
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
  }
}
</style>
