<template>
  <div class="social-bar">
    <div class="columns">
      <div class="column">
        <div class="social-box discord">
          <h4>DISCORD SERVER</h4>
          <span class="status">{{ discord_count_str }}</span>
          <span class="icon"><img src="/images/icon-discord.png" /></span>
        </div>
      </div>
      <div class="column">
        <div class="social-box minecraft">
          <h4>play.drustcraft.com.au</h4>
          <span class="status">{{ minecraft_count_str }}</span>
          <span class="icon"><img src="/images/icon-minecraft.png" /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  data: function () {
    return {
      discord_user_count: -1,
      minecraft_user_count: -1,
    };
  },
  mounted: function () {
    this.update_counts();
  },
  computed: {
    discord_count_str: function () {
      if (this.discord_user_count == -1) {
        return "Loading...";
      } else if (this.discord_user_count == 0) {
        return "No members online";
      } else if (this.discord_user_count == 1) {
        return this.discord_user_count + " member online";
      } else if (this.discord_user_count > 1) {
        return this.discord_user_count + " members online";
      } else {
        return "An error occurred";
      }
    },
    minecraft_count_str: function () {
      if (this.minecraft_user_count == -1) {
        return "Loading...";
      } else if (this.minecraft_user_count == 0) {
        return "No members online";
      } else if (this.minecraft_user_count == 1) {
        return this.minecraft_user_count + " member online";
      } else if (this.minecraft_user_count > 1) {
        return this.minecraft_user_count + " members online";
      } else {
        return "An error occurred";
      }
    },
  },
  methods: {
    update_counts() {
      //       setTimeout(() => {
      //         this.update_counts();
      //       }, 30000);
      //
      //       axios.post("https://drustcraft.com.au/api/v1/online/discord").then((response) => {
      //         if('online' in response.data) {
      //           this.discord_user_count = response.data.online;
      //         } else {
      //           this.discord_user_count = -2;
      //         }
      //       })
      //       .catch(() => {
      //         this.discord_user_count = -2;
      //       });
      //
      //       axios.post("https://drustcraft.com.au/api/v1/online/minecraft").then((response) => {
      //         if('online' in response.data) {
      //           this.minecraft_user_count = response.data.online;
      //         } else {
      //           this.minecraft_user_count = -2;
      //         }
      //       })
      //       .catch(() => {
      //         this.minecraft_user_count = -2;
      //       });
    },
  },
};
</script>

<style lang="scss">
.social-bar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  .columns {
    margin-top: 0;

    &:last-child {
      margin-bottom: 0;
    }

    .column {
      padding: 0;
    }
  }
}

.social-box {
  display: grid;
  color: #999;
  transition: all 0.2s ease-in-out;
  margin: 1rem 2rem;

  &:hover {
    color: #fff;
    cursor: pointer;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }

  &.discord {
    justify-content: flex-start;

    h4 {
      grid-column-start: 1;
      text-align: right;
    }

    .status {
      grid-column-start: 1;
      text-align: right;
    }

    .icon {
      grid-column-start: 2;
    }
  }

  &.minecraft {
    justify-content: flex-end;

    h4 {
      grid-column-start: 2;
      text-align: left;
    }

    .status {
      grid-column-start: 2;
      text-align: left;
    }

    .icon {
      grid-column-start: 1;
    }
  }

  h4 {
    grid-column-end: span 1;
  }

  .status {
    grid-column-end: span 1;
    font-size: 80%;
    font-weight: bold;
  }

  .icon {
    align-items: center;
    justify-items: center;
    grid-column-end: span 1;
    grid-row-start: 1;
    grid-row-end: span 2;
    background-color: #f7c055;
    height: 45px;
    width: 45px;
    border-radius: 4px;
    margin: 0 1rem;
  }
}

@media only screen and (max-width: 768px) {
  .social-box {
    display: none;
  }
}
</style>
