import Vue from "vue";
import Vuex from "vuex";

// modules
import mapper from "./modules/mapper";


// load vuex
Vue.use(Vuex);

// create store
export default new Vuex.Store({
    modules: {
        mapper,
    },
});
