import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 防止重复跳转
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    name: "交通大模型",
    component: () =>
      import("../views/transportationModel/TransportationModel.vue"),
  },
];

export const asyncRouterMap = [];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;

// 修复动态添加错误
router.$addRoutes = (params) => {
  router.matcher = new VueRouter({
    routes,
  }).matcher;
  router.matcher.addRoutes(params);
};
