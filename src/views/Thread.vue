<template>
  <div class="page-content posts">
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

    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <div v-if="thread && Object.keys(thread).length !== 0" class="section">
      <div
        :class="['thread-header', { 'thread-header-banner': thread.banner }]"
        :style="[
          thread.banner
            ? {
                backgroundImage:
                  'url(\'https://files.drustcraft.com.au/' +
                  thread.banner +
                  '\')',
              }
            : {},
        ]"
      >
        <div class="thread-banner-text">
          <div>
            <h3>{{ thread.title }}</h3>
          </div>
          <div>
            <ul class="thread-info">
              <li>
                <img
                  :src="
                    'https://mc-heads.net/avatar/' +
                    thread.player_uuid +
                    '/16/nohelm.png'
                  "
                />
                {{ thread.player_name }}
              </li>
              <li>
                <i class="fas fa-clock"></i>{{ relativeDate(thread.created) }}
              </li>
              <li v-if="thread.locked">
                <i class="fas fa-lock"></i>Thread is Locked
              </li>
              <li v-if="thread.pinned">
                <i class="fas fa-thumbtack"></i>Thread is Pinned
              </li>
            </ul>
          </div>
        </div>

        <div class="thread-options">
          <b-dropdown
            v-if="
              ($store.state.account_groups !== null &&
                'moderator' in $store.state.account_groups) ||
              thread.account_uuid == $store.state.account_uuid
            "
            position="is-bottom-left"
            aria-role="list"
          >
            <template #trigger="{ active }">
              <b-button
                label="..."
                :icon-right="active ? 'caret-up' : 'caret-down'"
                size="is-small"
              />
            </template>

            <b-dropdown-item
              v-if="
                !thread.locked &&
                $store.getters.inAccountGroup('moderator') &&
                thread.account_uuid == $store.state.account_uuid
              "
              aria-role="listitem"
              @click="lockThread(true)"
              >Lock Thread</b-dropdown-item
            >
            <b-dropdown-item
              v-if="
                thread.locked &&
                $store.getters.inAccountGroup('moderator') &&
                thread.account_uuid == $store.state.account_uuid
              "
              aria-role="listitem"
              @click="lockThread(false)"
              >Unlock Thread</b-dropdown-item
            >
            <b-dropdown-item
              v-if="
                !thread.pinned &&
                $store.getters.inAccountGroup('moderator') &&
                thread.account_uuid == $store.state.account_uuid
              "
              aria-role="listitem"
              @click="pinThread(true)"
              >Pin Thread</b-dropdown-item
            >
            <b-dropdown-item
              v-if="
                thread.pinned &&
                $store.getters.inAccountGroup('moderator') &&
                thread.account_uuid == $store.state.account_uuid
              "
              aria-role="listitem"
              @click="pinThread(false)"
              >Unpin Thread</b-dropdown-item
            >
            <b-dropdown-item
              v-if="
                thread.account_uuid == $store.state.account_uuid &&
                $store.getters.inAccountGroup('administrator')
              "
              aria-role="listitem"
              @click="editBanner"
              >Edit Banner</b-dropdown-item
            >
            <b-dropdown-item
              v-if="thread.account_uuid == $store.state.account_uuid"
              aria-role="listitem"
              @click="threadEdit"
              >Edit Thread</b-dropdown-item
            >
            <!-- <b-dropdown-item v-if="thread.account_uuid == $store.state.account_uuid" aria-role="listitem" @click="moveThread"
              >Move Thread</b-dropdown-item
            > -->
            <b-dropdown-item
              v-if="thread.account_uuid == $store.state.account_uuid"
              aria-role="listitem"
              @click="threadDelete"
              >Delete Thread</b-dropdown-item
            >
          </b-dropdown>
        </div>
      </div>

      <div
        class="post"
        v-for="(post, index) in thread.posts"
        :key="post.post_id"
      >
        <div class="post-side">
          <div class="post-author-image">
            <img
              :src="
                'https://mc-heads.net/avatar/' +
                post.player_uuid +
                '/64/nohelm.png'
              "
            />
          </div>
          <div class="post-author-name">{{ post.player_name }}</div>
          <div class="post-author-posts">
            Posts: {{ post.player_post_count }}
          </div>
          <div class="post-author-groups">
            <div
              v-for="player_group in directGroups(post.player_groups)"
              :class="postGroupClasses(player_group.id)"
              :key="player_group.id"
            >{{player_group.title}}
            </div>
          </div>
        </div>
        <div class="post-main">
          <div class="post-info">
            <div class="post-created">
              <i class="fas fa-clock"></i>{{ relativeDate(post.created) }}
            </div>
            <div class="post-url">
              <a :id="post.post_id" :href="$route.path + '#post-' + post.id"
                ><i class="far fa-share-alt"></i
              ></a>
            </div>
            <div class="post-index">#{{ index + 1 }}</div>
          </div>
          <div class="post-content" v-html="output(post.content)"></div>
          <ul v-if="$store.state.account_uuid !== null" class="post-options">
            <!-- <li>
              <a
                class="toolbar-item"
                href="#"
                title="Edit Post"
                @click.prevent="postEdit(post.id)"
                >Report</a
              >
            </li> -->
            <li v-if="$store.state.account_uuid == post.account_uuid">
              <a
                class="toolbar-item"
                href="#"
                title="Edit Post"
                @click.prevent="postEdit(post.id)"
                >Edit</a
              >
            </li>
            <!-- <li>
              <a
                class="toolbar-item"
                href="#"
                title="Edit Post"
                @click.prevent="postEdit(post.id)"
                >History</a
              >
            </li> -->
            <li v-if="$store.state.account_uuid == post.account_uuid">
              <a
                class="toolbar-item"
                href="#"
                title="Delete Post"
                @click.prevent="postDelete(post.id)"
                >Delete</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="post-reply">
        <template v-if="thread.can_reply">
          <h4>Reply</h4>
          <tiptap
            id="editor"
            ref="post-reply-editor"
            placeholder="Write your reply…"
          />
          <div class="post-reply-buttons">
            <button class="button yellow" @click="postReply">Post Reply</button>
          </div>
        </template>
        <template v-else>
          <div class="post-reply-cannot">
            <i class="fas fa-info-circle"></i> {{ post_cannot_reply_reason }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";
import Vue from "vue";
import api from "@/api.js";
import {
  relativeEpochDate,
  linkify,
  showComponentAsModal,
  checkAxiosErrorDefined,
} from "@/common.js";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import Tiptap from "@/components/Tiptap.vue";
import { toHTML } from "@/components/Tiptap.vue";

export default {
  data: function () {
    return {
      error: "",
      crumbs: [],
      loading: true,
      thread: {},
    };
  },
  components: {
    AppBreadcrumbs,
    Tiptap,
  },
  watch: {
    "$store.state.account_uuid": function () {
      this.loadThread();
    },
  },
  computed: {
    post_cannot_reply_reason: function () {
      if (this.$store.state.account_uuid == null) {
        return "You are required to login to reply";
      }

      if ("can_reply" in this.thread) {
        if (this.thread.can_reply) {
          return "";
        } else {
          if (this.thread.locked) {
            return "You cannot post in this thread because it is locked";
          } else {
            return "You do not have permission to post in this thread";
          }
        }
      } else {
        return "You cannot reply to this post as an unexpected error occurred";
      }
    },
    threadBanner: function () {
      if (this.thread.banner != "" && this.thread.banner != null) {
        return {
          backgroundImage:
            "https://files.drustcraft.com.au/" + this.thread.banner,
        };
      } else {
        return {};
      }
    },
  },
  mounted: function () {
    this.loadThread();
  },
  methods: {
    postGroupClasses: function(group_name) {
      let classes = {
        'post-author-group-item': true,
        'post-author-group-default': (group_name.indexOf('default') !== -1),
        'post-author-group-guild': (group_name.indexOf('_guild') !== -1),
        'post-author-group-builder': (group_name.indexOf('_builder') !== -1),
        'post-author-group-moderator': (group_name.indexOf('moderator') !== -1),
        'post-author-group-leader': (group_name.indexOf('leader') !== -1),
        'post-author-group-staff': (group_name.indexOf('staff') !== -1),
        'post-author-group-administrator': (group_name.indexOf('administrator') !== -1),
      };

      return classes;
    },

    relativeDate(epoch) {
      return relativeEpochDate(epoch);
    },

    directGroups: function (groupList) {
      let sortedList = [];
      const sortOrder = ['administrator', 'staff', 'leader', 'moderator', '_builder', '_guild', 'default'];
      const ignored = ['builder'];
      
      Object.keys(groupList).forEach((key) => {
        if(ignored.indexOf(key) == -1) {
          if(!groupList[key].inherited) {
            let itemData = groupList[key];
            itemData['id'] = key;
            
            sortedList.push(itemData);
          }
        }
      });
      
      sortedList = sortedList.sort((a, b) => {
        let a_value = 0;
        sortOrder.forEach((value, key) => {
          if(a['id'].indexOf(value) !== -1) {
            a_value = key;
          }
        });

        let b_value = 0;
        sortOrder.forEach((value, key) => {
          if(b['id'].indexOf(value) !== -1) {
            b_value = key;
          }
        });
          
        return a_value - b_value;
      });
      
      if(sortedList.length > 1 && sortedList[sortedList.length -1]['id'] == 'default') {
        sortedList.pop();
      }

      return sortedList;
    },

    lockThread: function (state) {
      const locked_str = state ? "lock" : "unlock";

      api
        .put("/forums/threads/" + this.thread.slug, { locked: state })
        .then(() => {
          Vue.set(this.thread, "locked", state);

          this.$buefy.notification.open({
            message: "This thread is now " + locked_str + "ed",
            type: "is-success",
            duration: 5000,
            position: "is-top-right",
          });

          this.loadThread();
        })
        .catch((error) => {
          let message = "An unexpected error occured";

          if (error.response) {
            if (error.response.detail) {
              message = error.response.detail;
            } else if (error.response.status) {
              switch (error.response.status) {
                case 403:
                  message =
                    "You do not have permission to " +
                    locked_str +
                    " this post";
                  break;
              }
            }
          }

          this.$buefy.notification.open({
            duration: 5000,
            message: message,
            type: "is-danger",
          });
        });
    },

    pinThread: function (state) {
      const pinned_str = state ? "pin" : "unpin";

      api
        .put("/forums/threads/" + this.thread.slug, { pinned: state })
        .then(() => {
          Vue.set(this.thread, "pinned", state);

          this.$buefy.notification.open({
            message: "This thread is now " + pinned_str + "ed",
            type: "is-success",
            duration: 5000,
            position: "is-top-right",
          });

          this.loadThread();
        })
        .catch((error) => {
          if (checkAxiosErrorDefined(error)) {
            error.response.data.errors.each((error_data) => {
              if ("data" in error_data) {
                Vue.set(this.errors, error_data.data, error_data.detail);
              } else {
                Vue.set(this.errors, 0, error_data.detail);
              }
            });
          } else {
            Vue.set(
              this.errors,
              0,
              "An unexpected error occured, Please try again later"
            );
            console.log(error);
          }

          let message = "An unexpected error occured";

          if (error.response) {
            if (error.response.detail) {
              message = error.response.detail;
            } else if (error.response.status) {
              switch (error.response.status) {
                case 403:
                  message =
                    "You do not have permission to " +
                    pinned_str +
                    " this post";
                  break;
              }
            }
          }

          this.$buefy.notification.open({
            duration: 5000,
            message: message,
            type: "is-danger",
          });
        });
    },

    threadEdit: debounce(function () {
      showComponentAsModal(this, "ModalThreadEdit", {
        type: "post",
        slug: this.thread.slug,
        close: () => {
          this.loadThread();
        },
      });
    }),

    threadMove: function () {},

    threadDelete: debounce(function () {
      let title = "Delete Thread";
      let message =
        "Are you sure you want to <b>delete</b> your thread? This action cannot be undone.";

      this.$buefy.dialog.confirm({
        title: title,
        message: message,
        confirmText: title,
        type: "is-danger",
        hasIcon: true,
        focusOn: "",
        onConfirm: () => {
          api
            .delete("/forums/threads/" + this.thread.slug)
            .then(() => {
              this.$buefy.notification.open({
                duration: 5000,
                message: "The thread was deleted",
                type: "is-success",
              });

              this.$router.push({ path: "/forums" });
            })
            .catch((error) => {
              let message =
                "An unexpected error occurred, Please try again later";

              if (checkAxiosErrorDefined(error)) {
                message = error.response.data.errors[0].detail;
              } else {
                try {
                  switch (error.response.status) {
                    case 403:
                      message =
                        "You do not have permission to delete this thread";
                      break;
                    case 404:
                      message = "This thread was not found or has been deleted";
                      break;
                    default:
                      throw null;
                  }
                } catch {
                  console.log(error);
                }
              }

              this.$buefy.notification.open({
                duration: 5000,
                message: message,
                type: "is-danger",
              });
            });
        },
      });
    }),

    editBanner: function () {
      showComponentAsModal(this, "ModalSelectImage", {
        width: "960px",
        selected: this.thread.banner,
        allowNone: true,
        close: (path) => {
          api
            .put("/forums/threads/" + this.thread.slug, { banner: path })
            .then(() => {
              Vue.set(this.thread, "banner", path);

              this.$buefy.notification.open({
                message: "This thread banner has been updated",
                type: "is-success",
                duration: 5000,
                position: "is-top-right",
              });

              this.loadThread();
            })
            .catch((error) => {
              if (checkAxiosErrorDefined(error)) {
                error.response.data.errors.each((error_data) => {
                  if ("data" in error_data) {
                    Vue.set(this.errors, error_data.data, error_data.detail);
                  } else {
                    Vue.set(this.errors, 0, error_data.detail);
                  }
                });
              } else {
                Vue.set(
                  this.errors,
                  0,
                  "An unexpected error occured, Please try again later"
                );
                console.log(error);
              }

              let message = "An unexpected error occured";

              if (error.response) {
                if (error.response.detail) {
                  message = error.response.detail;
                } else if (error.response.status) {
                  switch (error.response.status) {
                    case 403:
                      message =
                        "You do not have permission to edit the banner of this thread";
                      break;
                  }
                }
              }

              this.$buefy.notification.open({
                duration: 5000,
                message: message,
                type: "is-danger",
              });
            });
        },
      });
    },

    loadThread: debounce(function () {
      this.loading = true;
      this.error = "";
      this.thread = {};
      this.crumbs = [];

      api.get("/forums/threads/" + this.$route.params.thread_slug + "/view");

      api
        .get("/forums/threads/" + this.$route.params.thread_slug)
        .then((response) => {
          Vue.set(this.crumbs, 0, {
            path: "/forums/" + response.data.category_slug,
            name: response.data.category_title,
          });

          Vue.set(this.crumbs, 1, {
            path: "/threads/" + response.data.slug,
            name: response.data.title,
          });

          this.thread = response.data;
        })
        .catch((error) => {
          if (checkAxiosErrorDefined(error)) {
            this.error = error.data.errors[0].detail;
          } else {
            try {
              switch (error.response.status) {
                case 403:
                  this.error = "You do not have permission to view this thread";
                  break;
                case 404:
                  this.error = "This thread was not found or has been deleted";
                  break;
                default:
                  throw null;
              }
            } catch {
              this.error =
                "An unexpected error occurred, Please try again later";
              console.log(error);
            } finally {
              Vue.set(this.crumbs, 0, {
                path: "/forums/",
                name: "Error",
              });
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }),

    postReply: debounce(function () {
      let postReplyData = this.$refs["post-reply-editor"].editor.getJSON();

      if (
        ("content" in postReplyData && postReplyData.content.length == 0) ||
        (postReplyData.content.length == 1 &&
          !("content" in postReplyData.content[0]))
      ) {
        // No content
      } else {
        api
          .post("/forums/posts", {
            thread_slug: this.thread.slug,
            content: postReplyData,
          })
          .then(() => {
            this.$refs["post-reply-editor"].editor.commands.clearContent();
            this.loadThread();
          })
          .catch((error) => {
            if (checkAxiosErrorDefined(error)) {
              this.error = error.data.errors[0].detail;
            } else {
              try {
                switch (error.response.status) {
                  case 403:
                    this.error = "You do not have permission to post a reply";
                    break;
                  case 404:
                    this.error =
                      "This thread was not found or has been deleted";
                    break;
                  default:
                    throw null;
                }
              } catch {
                this.error =
                  "An unexpected error occurred, Please try again later";
                console.log(error);
              }
            }
          });
      }
    }),

    postEdit: debounce(function (post_id) {
      showComponentAsModal(this, "ModalPostEdit", {
        type: "post",
        id: parseInt(post_id),
        width: "960px",
        close: () => {
          this.loadThread();
        },
      });
    }),

    postDelete: debounce(function (post_id) {
      let title = "Delete Post";
      let message =
        "Are you sure you want to <b>delete</b> your post? This action cannot be undone.";
      let type = "post";
      let redirect = false;

      if (post_id == this.thread.posts[0].id) {
        title = "Delete Thread";
        message =
          "Are you sure you want to <b>delete</b> your post? This will delete the <b>entire thread</b> and cannot be undone.";
        type = "thread";
        redirect = true;
      }

      this.$buefy.dialog.confirm({
        title: title,
        message: message,
        confirmText: title,
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          api
            .delete("/forums/posts/" + post_id)
            .then(() => {
              this.$buefy.notification.open({
                duration: 5000,
                message: "The " + type + " was deleted",
                type: "is-success",
              });

              if (redirect) {
                this.$router.push({ path: "/forums" });
              } else {
                this.loadThread();
              }
            })
            .catch((error) => {
              let message =
                "An unexpected error occurred, Please try again later";

              if (checkAxiosErrorDefined(error)) {
                message = error.response.data.errors[0].detail;
              } else {
                try {
                  switch (error.response.status) {
                    case 403:
                      message =
                        "You do not have permission to delete this thread";
                      break;
                    case 404:
                      message = "This thread was not found or has been deleted";
                      break;
                    default:
                      throw null;
                  }
                } catch {
                  console.log(error);
                }
              }

              this.$buefy.notification.open({
                duration: 5000,
                message: message,
                type: "is-danger",
              });
            });
        },
      });
    }),

    output(json_str) {
      return linkify(toHTML(json_str));
    },
  },
};
</script>

<style lang="scss">
#page {
  .posts {
    .section {
      padding: 1rem 1.5rem 3rem 1.5rem;
    }
  
    h3 {
      margin-bottom: 0;
      color: #fff;
    }
  
    .thread-header {
      h3,
      .thread-info {
        display: inline-block;
      }
    }
  
    .thread-header-banner {
      margin: -2.5rem -2.5rem 0 -2.5rem;
      padding: 20rem 2.5rem 1.5rem 2.5rem;
      background-position: center;
      background-size: cover;
      border-bottom: 1px solid #999;

      .thread-banner-text {
        // border: 1px solid red;
        display: inline-block;
        border-top-right-radius: 10rem;
        border-bottom-right-radius: 10rem;
        margin-left: -2.5rem;
        padding: 0.25rem 8rem 0 4rem;
        background-color: rgba(0, 0, 0, 0.8);
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.8);
      }
  
      // h3,
      // .thread-info {
      //   background-color: rgba(0, 0, 0, 0.7);
      //   border-radius: 1rem;
      //   box-shadow: -20px 0 10px 8px rgba(0, 0, 0, 0.7),
      //     20px 0 10px 8px rgba(0, 0, 0, 0.7);
      // }
    }
  
    .thread-info {
      font-size: 80%;
      margin-bottom: 0.5rem;
  
      img {
        vertical-align: middle;
      }
  
      img,
      .fas,
      .far {
        margin-right: 0.25rem;
      }
  
      li {
        display: inline-block;
  
        &:before {
          content: "\2022";
          margin: 0 0.5rem;
        }
  
        &:first-child:before {
          content: "";
          margin: 0;
        }
      }
    }
  
    .thread-options {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
      column-gap: 0.25rem;
    }
  
    .post-toolbar {
      display: flex;
      justify-content: space-between;
    }
  
    .post {
      // border-top: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      padding-top: 2rem;
  
      .post-side {
        width: 8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
        font-size: 0.8rem;
  
        .post-author-name {
          color: rgba(255, 255, 255, 1);
        }
  
        .post-author-image {
          margin-bottom: 0.5rem;
  
          img {
            border-radius: 4px;
          }
        }
  
        .post-author-groups {
          text-align: center;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          width: 100%;
  
          .post-author-group-item {
            white-space: nowrap;
            font-weight: bold;
            display: flex;
            border-radius: 0.2rem;
            margin: 0.2rem 0.5rem;
            padding: 0.3rem 0.5rem;
            font-size: 80%;
            background-color: #008000;
            color: #fff;
            text-transform: capitalize;
            text-align: left;
            align-items: center;
          }
  
          .post-author-group-administrator {
            background-color: #d80000;
  
            &::before {
              content: "";
              display: inline-block;
              background-image: url("/images/Diamond_Sword.png");
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.4rem;
            }
          }
  
          .post-author-group-staff {
            background-color: #800080;
  
            &::before {
              content: "";
              display: inline-block;
              // background-image: url("/images/Iron_Pickaxe.png");
              // background-image: url("/images/Diamond_Sword.png");
              background-image: url("/images/Diamond.png");
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.4rem;
            }
          }
  
          .post-author-group-builder {
            background-color: #e2a233;
            color: #000;
  
            &::before {
              content: "";
              display: inline-block;
              background-image: url("/images/Iron_Pickaxe.png");
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.4rem;
            }
          }
  
          .post-author-group-leader {
            background-color: #4495d4;
  
            &::before {
              content: "";
              display: inline-block;
              background-image: url("/images/Emerald.png");
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.4rem;
            }
          }
  
          .post-author-group-moderator {
            background-color: #4495d4;
  
            &::before {
              content: "";
              display: inline-block;
              background-image: url("/images/Diamond.png");
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.4rem;
            }
          }
  
          .post-author-group-default {
            &::before {
              content: "";
              display: inline-block;
              background-image: url("/images/Grass_Block.png");
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.4rem;
            }
          }
        }
      }
  
      .post-main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin-left: 2rem;
        margin-bottom: 2rem;
        margin-right: 2rem;
  
        .post-info {
          display: flex;
          font-size: 80%;
          padding-bottom: 0.25rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          column-gap: 0.25rem;
  
          i {
            margin-right: 0.25rem;
          }
  
          a {
            color: rgba(255, 255, 255, 0.5);
  
            &:hover {
              color: rgba(255, 255, 255, 0.8);
            }
          }
  
          .post-url {
            margin-left: auto;
          }
        }
  
        .post-content {
          color: #fff;
          flex-grow: 1;
  
          img {
            display: block;
            margin: 2rem auto;
          }
          
          p {
            margin-bottom: 2rem;
          }
        }
  
        .post-options {
          li {
            display: inline-block;
            font-size: 80%;
            margin: 0 0.5rem;
  
            &:first-of-type {
              margin-left: 0;
            }
  
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }
    }
  
    .post-reply {
      margin-top: 2rem;
      padding: 1.5rem;
      border-top: 1px solid #333;
  
      .notification {
        display: inline-block;
      }
  
      #editor {
        margin-bottom: 1rem;
      }
  
      .post-reply-buttons {
        display: flex;
        justify-content: flex-end;
      }
  
      .post-reply-cannot {
        text-align: center;
        margin-top: 1rem;
        font-size: 90%;
        color: #666;
  
        i {
          margin-right: 0.25rem;
        }
      }
    }
  }
}
</style>
