<template>
  <div :class="['header', { maintenance: this.maintenance.content }]">
    <div v-if="maintenance.content" class="maintenance">
      <template v-if="maintenance.url != ''">
        <span class="only-desktop"><router-link :to="maintenance.url"><i class="far fa-exclamation-triangle"></i>{{maintenance.content}}</router-link></span>
        <span class="only-mobile"><router-link :to="maintenance.url"><i class="far fa-exclamation-triangle"></i>Important Notice</router-link></span>
      </template>
      <template v-else>
        <span class="only-desktop"><i class="far fa-exclamation-triangle"></i>{{maintenance.content}}</span>
        <span class="only-mobile"><a href="#" @click.prevent="show_maintenance_notice"><i class="far fa-exclamation-triangle"></i>Important Notice</a></span>
      </template>
      <a
        href="#"
        @click.prevent="closeMaintenanceBar"
        class="is-pulled-right mr-3"
        ><i class="fas fa-times"></i
      ></a>
    </div>
    <AppNavBar />
  </div>
</template>

<script>
import AppNavBar from "@/components/AppNavBar.vue";
import api from "@/api.js";

export default {
  data() {
    return {
      maintenance: {
        content: "",
        url: "",
      },
    };
  },
  components: {
    AppNavBar,
  },
  mounted: function () {
    api
      .get("/maintenance/current")
      .then((response) => {
        this.maintenance = response.data.maintenance;
      })
      .catch(() => {});
  },
  methods: {
    closeMaintenanceBar: function () {
      this.maintenance.content = "";
    },
    
    show_maintenance_notice: function() {
      const ModalForm = {
        props: ['message'],
        template: `
          <form action="">
            <div class="modal-card" style="width: auto">
              <section class="modal-card-head">
                <p class="modal-card-title">Important Notice</p>
              </section>
              <section class="modal-card-body">
                <p class="mb-0 is-size-5">{{message}}</p>
              </section>
              <footer class="modal-card-foot">
                <b-button label="Close" @click="$emit('close')" />
              </footer>
            </div>
          </form>
        `,
      };
      
      let self = this;
      this.$buefy.modal.open({
        props: {
          message: this.maintenance.content,
        },
        parent: this,
        component: ModalForm,
        hasModalCard: true,
        trapFocus: true,
        autoFocus: true,
      });          
    },
  },
};
</script>

<style lang="scss">
.header {
  .maintenance {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background-color: #f1d437;
    padding: 0.5rem;
    text-align: center;
    color: #333;
    box-shadow: 0 1px 1px #333;
    font-size: 0.9rem;
    
    span {
      flex: 1;

      .far {
        margin-right: 0.25rem;
      }
      
      .is-pulled-right {
        justify-content: flex-end;
      }
    }
  }

  a {
    color: #333;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .maintenance + .navbar {
    top: 38px;
  }

  @keyframes flash {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
