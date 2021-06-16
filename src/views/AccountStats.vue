<template>
  <div class="account-stats">
    <h1>Player Stats</h1>

    <b-loading
      :is-full-page="false"
      v-model="loading"
      :can-cancel="false"
    ></b-loading>

    <b-notification
      v-if="error"
      type="is-danger"
      has-icon
      :closable="false"
      :message="error"
    >
    </b-notification>

    <template v-if="player_uuid">
      <div class="panel-section">
        <div class="panel-column has-text-centered">
          <img
            class="p-mb-3"
            :src="'https://www.mc-heads.net/body/' + this.player_uuid + '/80'"
          />
        </div>
        <div class="panel-column">
          <div class="panel-item">
            <i
              :class="[
                'fas',
                'fa-circle',
                { 'col-red': !this.online, 'col-green': this.online },
              ]"
            ></i>
            {{ this.online_str }}
          </div>
          <div class="panel-item mb-4">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-gavel col-brown"></i> Times Kicked:</div>
              <div>{{ this.kicked_count }}</div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-crosshairs col-red"></i> Player Kills:</div>
              <div class="has-text-weight-bold">
                {{ this.player_kills_count }}
              </div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-crosshairs col-green"></i> Mob Kills:</div>
              <div class="has-text-weight-bold">{{ this.mob_kills_count }}</div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-skull"></i> Deaths:</div>
              <div class="has-text-weight-bold">{{ this.deaths_count }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="far fa-clock col-green"></i> Total Playtime:</div>
              <div>{{ this.to_duration(this.sessions_total) }}</div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="far fa-clock col-green"></i> Total Active:</div>
              <div>
                {{ this.to_duration(this.sessions_total - this.afk_total) }}
              </div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="far fa-clock"></i> Total AFK:</div>
              <div>{{ this.to_duration(this.afk_total) }}</div>
            </div>
          </div>
        </div>
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div>
                <i class="far fa-calendar-check col-teal"></i> Sessions:
              </div>
              <div>{{ this.sessions_count }}</div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="far fa-clock col-teal"></i> Longest Session:</div>
              <div>{{ this.to_duration(this.sessions_max) }}</div>
            </div>
          </div>
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="far fa-clock col-teal"></i> Session Average:</div>
              <div>{{ this.to_duration(this.sessions_avg) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-signal col-amber"></i> Average Ping:</div>
              <div>{{ parseFloat(this.ping_avg).toFixed(2) }}ms</div>
            </div>
          </div>
        </div>
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-signal col-amber"></i> Best Ping:</div>
              <div>{{ this.ping_min }}ms</div>
            </div>
          </div>
        </div>
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div><i class="fas fa-signal col-amber"></i> Worst Ping:</div>
              <div>{{ this.ping_max }}ms</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div class="has-text-weight-bold">
                <i class="fas fa-user-plus col-lime"></i> Registered:
              </div>
              <div>{{ this.registered_str }}</div>
            </div>
          </div>
        </div>
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div class="has-text-weight-bold">
                <i class="far fa-calendar col-teal"></i> Last Seen:
              </div>
              <div>{{ this.last_seen_str }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div class="has-text-weight-bold">
                <i class="fas fa-barcode col-lime"></i> Player UUID:
              </div>
              <div>{{ this.player_uuid }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-column">
          <div class="panel-item">
            <div class="is-flex is-justify-content-space-between">
              <div class="has-text-weight-bold flex-shrink-0 no-wrap mr-3">
                <i class="fas fa-users col-teal"></i> Groups:
              </div>
              <div class="has-text-right" v-html="groups"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from "@/api.js";
import { checkAxiosErrorDefined } from "@/common.js";

export default {
  data() {
    return {
      loading: true,
      error: "",
      player_uuid: "",

      last_seen: -1,
      online: false,
      kicked_count: 0,
      player_kills_count: 0,
      mob_kills_count: 0,
      deaths_count: 0,
      registered: 0,
      sessions_count: 0,
      sessions_avg: 0,
      sessions_max: 0,
      sessions_total: 0,
      afk_total: 0,
      ping_avg: 0,
      ping_max: 0,
      ping_min: 0,
    };
  },
  mounted: async function () {
    this.loading = true;
    this.error = "";

    try {
      const account_info = await api.get(
        "/accounts/" + this.$store.state.account_uuid
      );
      this.player_uuid = account_info.data.player_uuid;

      const response = await api.get("/players/" + this.player_uuid + "/stats");

      this.last_seen = response.data.last_seen;
      this.online = response.data.online;
      this.kicked_count = response.data.kicked_count;
      this.player_kills_count = response.data.player_kills_count;
      this.mob_kills_count = response.data.mob_kills_count;
      this.deaths_count = response.data.deaths_count;
      this.registered = response.data.registered;
      this.sessions_count = response.data.sessions_count;
      this.sessions_avg = response.data.sessions_avg;
      this.sessions_max = response.data.sessions_max;
      this.sessions_total = response.data.sessions_total;
      this.afk_total = response.data.afk_total;
      this.ping_avg = response.data.ping_avg;
      this.ping_max = response.data.ping_max;
      this.ping_min = response.data.ping_min;
    } catch (error) {
      this.player_uuid = "";
      if (checkAxiosErrorDefined(error)) {
        this.error = error.response.data.errors[0].detail;
      } else {
        this.error = "An unexpected error occured, Please try again later";
        console.log(error);
      }
    } finally {
      this.loading = false;
    }
  },
  computed: {
    online_str: function () {
      if (this.online) {
        return "Online";
      }
      return "Offline";
    },
    registered_str: function () {
      var d = new Date(0);
      d.setUTCSeconds(this.registered);
      return d.toLocaleString();
    },
    last_seen_str: function () {
      if (this.last_seen == -1) {
        return "Online now";
      }

      var d = new Date(0);
      d.setUTCSeconds(this.last_seen);
      return d.toLocaleString();
    },
    groups: function () {
      if (this.$store.state.account_groups !== null) {
        let groups = Array();

        for (let key in this.$store.state.account_groups) {
          if (!this.$store.state.account_groups[key].inherited) {
            if (this.$store.state.account_groups[key].owner) {
              groups.push(
                '<span class="group-owner">' +
                  this.$store.state.account_groups[key].title +
                  "</span>"
              );
            } else {
              groups.push(
                '<span class="group">' +
                  this.$store.state.account_groups[key].title +
                  "</span>"
              );
            }
          } else {
            groups.push(
              '<span class="group-inherited">' +
                this.$store.state.account_groups[key].title +
                "</span>"
            );
          }
        }

        return groups.join(", ");
      }

      return "none";
    },
  },
  methods: {
    to_duration: function (time) {
      let t = time;
      let s = "";

      const weeks = t >= 604800 ? Math.floor(t / 604800) : 0;
      t = t - weeks * 604800;
      const days = t >= 86400 ? Math.floor(t / 86400) : 0;
      t = t - days * 86400;
      const hours = t >= 3600 ? Math.floor(t / 3600) : 0;
      t = t - hours * 3600;
      const mins = t >= 60 ? Math.floor(t / 60) : 0;
      t = t - mins * 60;

      if (weeks > 0) s = s + weeks + "w ";
      if (days > 0) s = s + days + "d ";
      if (hours > 0) s = s + hours + "h ";
      if (mins > 0) s = s + mins + "m ";
      s = s + t + "s";

      return s;
    },
  },
};
</script>

<style lang="scss">
.panel-section {
  display: flex;
  align-items: center;
  max-width: 40rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;

  &:last-of-type {
    border-bottom: 0;
  }
}

.panel-column {
  flex: 1;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  &:first-of-type {
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }
}

.panel-item {
  font-size: 90%;
  margin-bottom: 0.5rem;

  .fas,
  .far {
    font-size: 100%;
  }
}

.is-flex {
  display: flex;
}

.has-text-weight-bold {
  font-weight: bold;
}

.group {
  color: rgba(204, 204, 204);
}

.group-inherited {
  font-style: italic;
}

.group-owner {
  color: rgba(204, 204, 204);
  font-weight: bold;
}
</style>
