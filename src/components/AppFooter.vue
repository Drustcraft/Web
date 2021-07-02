<template>
  <div id="footer">
    <div class="social">
      <div class="social-row">
        <a href="https://www.twitter.com/drustcraft" title="Twitter"
          ><i class="fab fa-twitter"></i
        ></a>
        <a href="https://www.facebook.com/drustcraft" title="Facebook"
          ><i class="fab fa-facebook-f"></i
        ></a>
        <a href="https://www.instagram.com/drustcraft" title="Instagram"
          ><i class="fab fa-instagram"></i
        ></a>
      </div>
      <div class="social-row">
        <a
          href="https://www.youtube.com/channel/UCUZLUu9b87ylDEai_rnUvKA"
          title="Youtube"
          ><i class="fab fa-youtube"></i
        ></a>
        <a href="https://discord.gg/yNzk4x7mpD" title="Discord"
          ><i class="fab fa-discord"></i
        ></a>
        <a href="https://www.reddit.com/r/drustcraft" title="Reddit"
          ><i class="fab fa-reddit"></i
        ></a>
        <a href="http://github.com/drustcraft" title="Github"
          ><i class="fab fa-github"></i
        ></a>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-image"></div>

      <ul class="footer-links mb-6 is-uppercase">
        <!-- <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/careers">Careers</router-link></li> -->
        <li><router-link to="/rules">Rules</router-link></li>
        <!-- <li><router-link to="/support">Support</router-link></li>
        <li><router-link to="/education">Education</router-link></li> -->
        <li><router-link to="/stats">Stats</router-link></li>
        <li><a href="#" @click.prevent="showModalContact">Contact</a></li>
        <li><router-link to="/status">Status</router-link></li>
      </ul>

      <div class="copyright">
        <p class="mb-0">
          Copyright &copy; 2021, Drustcraft. All rights reserved.
        </p>
        <p class="mb-0">
          NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH
          MOJANG.
        </p>
        <p class="mb-0">
          All trademarks are the properties of their respective owners.
        </p>
        <ul>
          <li><router-link to="/privacy">Privacy</router-link></li>
          <li><router-link to="/terms">Terms</router-link></li>
          <!-- <li><router-link to="/privacy">Cookies</router-link></li> -->
        </ul>
        <p><br />ABN 90 649 231 818<br />PO Box 36, Edmonton QLD 4869</p>
        <p>
          Thanks to <a href="http://mc-heads.net">MCHeads</a> for providing
          Minecraft avatars
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { showComponentAsModal } from "@/common.js";

export default {
  methods: {
    showModalContact: function () {
      showComponentAsModal(this, "ModalContactUs");
    },
  },
};
</script>

<style lang="scss" scoped>
#footer {
  text-align: center;
  margin-bottom: 4rem;

  .social {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0.5rem 1rem 1rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    margin-bottom: 4rem;
    font-size: 2rem;

    a {
      margin: 0 1rem;
      color: #d9911e;

      &:hover {
        color: #f8da44;
      }
    }

    .social-row {
      margin-top: 0.5rem;
    }
  }

  .footer-bottom {
    .footer-image {
      display: inline-block;
      width: 165px;
      height: 56px;
      // margin-left: 1rem;
      background-image: url("/images/brand.png");
      background-repeat: no-repeat;
      background-size: contain;
      margin-bottom: 2rem;
    }

    .copyright {
      font-size: 0.8rem;
    }

    ul {
      margin-top: 0.2rem;

      li + li::before {
        content: "";
        display: inline-block;
        height: 10px;
        width: 1px;
        background-color: rgba(255, 255, 255, 0.3);
        margin: 0 0.3rem;
        pointer-events: none;
      }
    }
  }

  li {
    display: inline-block;
  }

  a {
    display: inline-block;
    color: inherit;
    transition: all 0.2s;
    color: rgba(255, 255, 255, 0.75);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }

  .footer-links a {
    margin: 0 1rem;
  }
}

@media only screen and (min-width: 770px) {
  .social-row {
    display: inline-block;
  }
}
</style>
