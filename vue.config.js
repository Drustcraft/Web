module.exports = {
  configureWebpack: {
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
    devServer: {
      hot: false,
      liveReload: false,
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Drustcraft";
      return args;
    });
  },
};
