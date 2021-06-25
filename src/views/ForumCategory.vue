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
          <div class="row-item row-item-author-head"><img class="player-head" :src="'https://mc-heads.net/avatar/' + thread.player_uuid + '/32/nohelm.png'"/></div>
          <div class="row-item row-item-title"><i v-if="thread.pinned" class="fas fa-thumbtack"></i><i v-if="thread.locked" class="fas fa-lock"></i>{{thread.title}}</div>
          <div class="row-item row-item-thread-info">
            <span class="row-item-author">{{thread.player_name}}</span>
            <span class="row-item-posted">{{relativeDate(thread.created)}}</span>
          </div>
          <div class="row-item row-item-posts"><span>Replies:</span>{{thread.post_count}}</div>
          <div class="row-item row-item-views"><span>Views:</span>{{thread.views}}</div>
          <div class="row-item row-item-latest">
            <span class="row-item-latest-posted">{{relativeDate(thread.latest_post.created)}}</span>
            <span class="row-item-latest-author">
              <img class="player-head" :src="'https://mc-heads.net/avatar/' + thread.latest_post.player_uuid + '/16/nohelm.png'"/>
              <span class="row-item-latest_author-name">{{thread.latest_post.player_name}}</span>
            </span>
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
      margin-top: 1rem;
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
    .category-row {
      display: grid;
      grid-template-columns: 4rem min-content auto;
      grid-template-rows: auto auto auto;
      border-top: 1px solid rgba(255, 255, 255, 0.2);

      &:last-of-type {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      &.category-item-pinned {
        .fa-thumbtack {
          color: #f33;
          display: inline-block;
        }
      }
    }

    .category-link {
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    
    .row-item {
      padding: 0.75rem;
      align-self: center;
    }

    .row-item,
    a {
      color: #bbb;
    }

    a:hover {
      transition: all 0.3s ease-in-out;
      
      a,
      .row-item {
        color: #fff;
      }
    }

    .row-item.not-found {
      grid-template-columns: auto;
      text-align: center;
    }

    .row-item-author-head {
      grid-column: 1 / span 1;
      grid-row: 1 / span 3;
      display: flex;
      justify-content: center;
    }

    .row-item-title {
      grid-column: 2 / span 2;
      grid-row: 1 / span 1;
      padding-bottom: 0;
      color: #fff;
    }
    
    .row-item-thread-info {
      grid-column: 2 / span 2;
      grid-row: 2 / span 1;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 80%;
      color: #666;
      
      .row-item-author:after {
        padding: 0 0.25rem;
        content: "·";
      }
    }
    
    .row-item-posts {
      grid-column: 2 / span 1;
      grid-row: 3 / span 1;
      padding-top: 0;
      padding-right: 0;
      
      &:after {
        padding: 0 0.25rem;
        content: "·";
      }
    }
    
    .row-item-views {
      display: none;
      grid-column: 3 / span 1;
      grid-row: 2 / span 1;
      padding-top: 0rem;
    }

    .row-item-posts, .row-item-views {
      font-size: 80%;
      white-space: nowrap;
      text-align: center;

      span {
        display: inline-block;
        margin-right: 0.25rem;
        color: #666;
      }      
    }
    
    .row-item-latest {
      grid-column: 3 / span 1;
      grid-row: 3 / span 1;
      padding-top: 0;
      padding-left: 0;
      font-size: 80%;
      display: block;
      flex-direction: column;
      align-items: center;
      
      .row-item-latest-author {
        display: none;
        align-items: center;
        margin-top: 0.25rem;
        
        .player-head {
          margin-right: 0.5rem;
        }
      }
    }    
  }
}

@media only screen and (min-width: 770px) {
  .thread {
    .section-body {
      .category-row {
        grid-template-columns: 4rem auto 9rem 9rem;
        grid-template-rows: auto auto;
      }
      
      .row-item-author-head {
        grid-column: 1 / span 1;
        grid-row: 1 / span 2;
      }

      .row-item-title {
        grid-column: 2 / span 1;
        grid-row: 1 / span 1;
      }

      .row-item-thread-info {
        grid-column: 2 / span 1;
        grid-row: 2 / span 1;     
        padding-bottom: 0.75rem;   
      }
      
      .row-item-posts {
        grid-column: 3 / span 1;
        grid-row: 1 / span 1;        
        padding-top: 0.75rem;
        padding-bottom: 0;
        padding-right: 0.75rem;

        &:after {
          padding: 0;
          content: "";
        }
      }

      .row-item-views {
        display: block;
      }

      .row-item-latest {
        grid-column: 4 / span 1;
        grid-row: 1 / span 2;
        padding-top: 0.75rem;
        padding-left: 0.75rem;
        display: flex;
        
        .row-item-latest-author {
          display: flex;
        }
      }
    }
  }
}
</style>
