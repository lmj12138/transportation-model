import Vue from "vue";
import Vuex from "vuex";
import pluginPersist from "./pluginPersist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
  //这里使用
  plugins: [pluginPersist],
});
