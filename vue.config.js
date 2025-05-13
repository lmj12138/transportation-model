module.exports = {
  runtimeCompiler: true,
  publicPath: "./",
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "./src/assets/styles/global.scss";`,
      },
    },
    // requireModuleExtension: true,
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://49.52.4.26:18000",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  productionSourceMap: false,
};
