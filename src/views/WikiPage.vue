<template>
  <div class="content">
    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <template v-if="!loading">
      <template v-if="!editing">
        <template v-if="page">
          <h3 class="wiki-title">{{ page.title }}</h3>
          <div
            class="wiki-content"
            @click.prevent="clickContent($event)"
            v-html="output(page.content)"
          ></div>
          <ul class="wiki-footer">
            <li>{{ footerInfo }}</li>
            <li>
              <a
                v-if="$store.getters.inAccountGroup('developer')"
                href="#"
                @click.prevent="editPage"
                >Edit this page</a
              >
            </li>
          </ul>
        </template>
        <template v-else>
          <h3 class="wiki-title">Page doesn't exist</h3>
          <div class="wiki-content">This wiki page doesn't yet exist!</div>
          <ul class="wiki-footer">
            <li>
              <a
                v-if="$store.getters.inAccountGroup('developer')"
                href="#"
                @click.prevent="editPage"
                >Create this page</a
              >
            </li>
          </ul>
        </template>
      </template>
      <template v-else>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <b-message type="is-danger" has-icon v-if="0 in errors">{{
              errors[0]
            }}</b-message>

            <InputValidation
              ref="thread_title"
              rules="required"
              type="text"
              label=""
              placeholder="Title"
              v-model="page.title"
              :show-success="false"
            />

            <tiptap id="editor" ref="editor" placeholder="Write your page…" />
            <div class="post-buttons">
              <b-button label="Cancel" @click="cancelEdit" />
              <b-button class="yellow" native-type="submit" label="Save Page" />
            </div>
          </form>
        </ValidationObserver>
      </template>
    </template>
  </div>
</template>

<script>
import api from "@/api.js";
import Tiptap from "@/components/Tiptap.vue";
import { ValidationObserver } from "vee-validate";
import InputValidation from "@/components/InputValidation";
import { toHTML } from "@/components/Tiptap.vue";
import { linkify, relativeEpochDate } from "@/common.js";

export default {
  data: function () {
    return {
      loading: true,
      editing: false,
      page: null,
      errors: {},
    };
  },
  components: {
    ValidationObserver,
    InputValidation,
    Tiptap,
  },
  computed: {
    footerInfo: function () {
      return "Lasted edited " + relativeEpochDate(this.page.created) + " by ";
    },
  },
  mounted: function () {
    this.loadPage();
  },
  methods: {
    loadPage: function () {
      if (this.$route.path.substring(0, 5) == "/wiki") {
        let path = this.$route.path.substring(6);

        api
          .get("/wiki/page/" + path)
          .then((response) => {
            this.page = response.data;
          })
          .catch(() => {
            // this.content = JSON.stringify(error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.content = "Incorrect path";
      }
    },

    editPage: function () {
      if(!this.page) {
        this.page = {
          title: '',
          content: ''
        };
      }
      
      this.editing = true;
      
      this.$nextTick(function() {
        if(this.page.content != '') {
          this.$refs["editor"].editor.commands.setContent(
            JSON.parse(this.page.content)
          );
        }
      });
    },

    cancelEdit: function () {
      this.editing = false;
      
      if(this.page.title == '' && this.page.content == '') {
        this.page = null;
      }
    },

    onSubmit: function () {
      this.loading = true;

      api
        .put("/wiki/page/" + this.$route.path.substring(6), {
          title: this.page.title,
          content: this.$refs["editor"].editor.getJSON(),
        })
        .then(() => {
          this.editing = false;
          this.loadPage();

          this.$buefy.notification.open({
            message: "This page has been saved",
            type: "is-success",
            duration: 5000,
            position: "is-top-right",
          });
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    clickContent: function (event) {
      if (event.target.href) {
        const url_domain =
          window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":" + window.location.port : "");

        if (event.target.href.substring(0, url_domain.length) == url_domain) {
          this.$router.push(event.target.href.substring(url_domain.length));
        }
      }
    },

    output: function (json) {
      if(json != '') {
        let html = linkify(toHTML(json));
  
        html = html.replace(/\[\[(.+?)\]\]/g, function (match, contents) {
          return '<a href="/wiki/' + contents + '">' + contents + "</a>";
        });
  
        return html;
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss">
.content {
  min-height: 30rem;
  position: relative;

  .wiki-title {
    color: #eee;
  }

  .wiki-footer {
    margin: 2rem 0;
    padding-top: 0.5rem;
    border-top: 1px solid #333;
    font-size: 80%;

    li {
      list-style-type: none;
      display: inline-block;
      padding: 0;

      &:after {
        content: "|";
        color: #333;
        padding: 0 1rem;
      }

      &:last-child:after {
        content: "";
      }
    }
  }
}
</style>
