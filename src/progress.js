import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Progress = {
  started: false,
  timeout: null,

  start: function () {
    if (!this.started) {
      NProgress.start();
      this.started = true;
    }
  },

  end: function () {
    if (this.started) {
      let self = this;

      if (this.timeout !== null) {
        window.clearTimeout(this.timeout);
      }

      this.timeout = window.setTimeout(function () {
        self.timeout = null;
        self.started = false;
        NProgress.done(true);
      }, 300);

      NProgress.inc();
    }
  },
};

export default Progress;
