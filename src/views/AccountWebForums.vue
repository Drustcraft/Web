<template>
  <div class="account-web-forums">
    <h1>Web Forums</h1>

    <div class="sections">
      <div
        v-for="(section, index) in sections"
        :key="section.slug"
        class="section-group"
      >
        <div class="section-row">
          <div class="section-title"><b-input :value="section.title" /></div>
          <div class="section-permission-read">
            <b-select value="administrator"
              ><option value="all">all</option>
              <option value="administrator">administrator</option></b-select
            >
          </div>
          <div class="section-permission-write">
            <b-select value="administrator"
              ><option value="all">all</option>
              <option value="administrator">administrator</option></b-select
            >
          </div>
          <div class="section-tools">
            <div class="section-edit">
              <a href="#" @click.prevent="onEditTitle(index)"
                ><i class="fas fa-pencil-alt"></i
              ></a>
            </div>
            <div class="section-edit">
              <a href="#"><i class="fas fa-chevron-up"></i></a>
            </div>
            <div class="section-edit">
              <a href="#"><i class="fas fa-chevron-down"></i></a>
            </div>
            <div class="section-edit">
              <a href="#"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>

        <div
          v-for="(category, index) in section.categories"
          :key="category.slug"
          class="category-row"
        >
          <div class="category-title"><b-input :value="category.title" /></div>
          <div class="category-permission-read">
            <b-select value="administrator"
              ><option value="all">all</option>
              <option value="administrator">administrator</option></b-select
            >
          </div>
          <div class="category-permission-write">
            <b-select value="administrator"
              ><option value="all">all</option>
              <option value="administrator">administrator</option></b-select
            >
          </div>
          <div class="category-tools">
            <div class="section-edit">
              <a href="#" @click.prevent="onEditTitle(index)"
                ><i class="fas fa-pencil-alt"></i
              ></a>
            </div>
            <div class="section-edit">
              <a href="#"><i class="fas fa-chevron-up"></i></a>
            </div>
            <div class="section-edit">
              <a href="#"><i class="fas fa-chevron-down"></i></a>
            </div>
            <div class="section-edit">
              <a href="#"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-for="category in section.categories" :key="category.slug">
          <h4>{{category.title}}</h4>
        </div> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import api from "@/api.js";

export default {
  data() {
    return {
      sections: [],
    };
  },
  mounted: function () {
    const loadingComponent = this.$buefy.loading.open({
      container: this.$el,
    });

    this.sections = [];

    api
      .get("/forums/sections")
      .then((response) => {
        if (response.data.sections.length > 0) {
          response.data.sections.forEach((section) => {
            api
              .post("/forums/categories/search", {
                section_slug: section.slug,
              })
              .then((response) => {
                section["categories"] = response.data.categories;
                this.sections.push(section);
              })
              .catch((error) => {
                if (error.response.status == 404) {
                  section["categories"] = Array();
                  this.sections.push(section);
                }
              });
          });
        } else {
          // TODO no forums found
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        loadingComponent.close();
        this.debounce_refresh = null;
      });
  },
  methods: {
    onKeyPress: function (event, index) {
      if (event.key === "Escape" || event.key === "Esc") {
        Vue.set(this.sections[index], "edit", false);
      }

      if (event.key === "Enter") {
        if (event.target.value.length > 0) {
          this.updateSectionTitle(index, event.target.value);
        }
        Vue.set(this.sections[index], "edit", false);
      }
    },

    onBlur: function (event, index) {
      if (event.target.value.length > 0) {
        this.updateSectionTitle(index, event.target.value);
      }
      Vue.set(this.sections[index], "edit", false);
    },

    onEditTitle: function (index) {
      Vue.set(this.sections[index], "edit", true);
    },

    updateSectionTitle: function (index, title) {
      this.sections[index].title = title;
    },
  },
};
</script>

<style lang="scss">
.sections {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .section-group {
    margin-bottom: 2rem;
  }

  .section-row,
  .category-row {
    margin-bottom: 0.5rem;
    align-items: center;

    div {
      margin: 0 0.2rem;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .section-tools,
    .category-tools {
      a {
        margin: 0 0.2rem;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .section-row {
    display: flex;

    .section-title {
      flex-grow: 1;
    }

    .section-tools {
      display: flex;
    }
  }

  .category-row {
    display: flex;
    padding-left: 2rem;

    .category-title {
      flex-grow: 1;
    }

    .category-tools {
      display: flex;
    }
  }
}
</style>
