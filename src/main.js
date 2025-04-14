import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import router from "./router";
import VueI18n from "vue-i18n";
import api from "./api/api";
import util from "./util/util";
// 引入华泉自带依赖
import hqitPlugin from "hqit-plugin";
// 引入华泉权限路由
import { asyncRouterMap } from "./router";
// 引入page切割panel组件

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueVirtualScroller from "vue-virtual-scroller";
Vue.use(VueVirtualScroller);

Vue.prototype.$copySuccess = () => {
  Message.success("复制成功！");
};
Vue.prototype.$copyError = () => {
  Message.warning("复制失败！");
};

Vue.use(hqitPlugin, {
  baseSize: 192,
//   router,
//   asyncRouterMap,
});

Vue.config.productionTip = false;
router.afterEach((to) => {
  document.title = to.name;
});

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: sessionStorage.getItem("language")
    ? sessionStorage.getItem("language")
    : "zh", //默认语言
  messages: {
    zh: require("./lang/zh.js"),
    en: require("./lang/en.js"),
  },
  silentTranslationWarn: true,
});
/* 引入多语言 结束*/

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
