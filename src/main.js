import Vue from "vue";
import store from "./store";

import TheMapper from "./components/the-mapper.vue";

Vue.config.productionTip = false;

window.Bus = new Vue();

new Vue({
    store,
    render: (h) => h(TheMapper),
}).$mount("#token-mapper");
