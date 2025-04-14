module.exports = {
  plugins: {
    // 自动补全浏览器前缀
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
        //'last 2 versions', // 所有主流浏览器最近2个版本
      ],
      grid: true
    },
    // 引用自适应
    "postcss-pxtorem": {
      rootValue: 192, // 换算的基数
      propList: ["*"]
      //exclude: /node_modules/
      //忽略转换正则匹配项。插件会转化所有的样式的px。转化第三方ui，例如iview。
      //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
    },
  }
};
