import Api from "./../../api";
import Vue from "vue";

// state
const state = {
  backendUrl: "https://suiteux.com/__api/TokenMapper.php",
  datasets: [],
  activeSourceDataset: "test",
  activeTargetDataset: "test",
  tag: "",
  source: [
    {
      name: "herpaderp1",
      type: "bigint",
      composed: ["id"],
      formatter: null,
      transformer: null,
      default: null,
    },
    {
      name: "Example",
      type: "varchar",
      composed: ["Example"],
      formatter: null,
      transformer: null,
      default: null,
    },
  ],
  target: [
    {
      name: "herpade123",
      type: "bigint",
      composed: [],
      formatter: null,
      transformer: null,
      default: null,
    },
    {
      name: "Example",
      type: "varchar",
      composed: [],
      formatter: null,
      transformer: null,
      default: null,
    },
    {
      name: "Example",
      type: "varchar",
      composed: [],
      formatter: null,
      transformer: null,
      default: null,
    },
  ],
};

// getters
const getters = {
  datasets(state) {
    return state.datasets;
  },
  activeSourceDataset(state) {
    return state.activeSourceDataset;
  },
  activeTargetDataset(state) {
    return state.activeTargetDataset;
  },
  source(state) {
    return state.source;
  },

  target(state) {
    return state.target;
  },

  backendUrl(state) {
    return state.backendUrl;
  },

  tag(state) {
    return state.tag;
  },
};

// actions
const actions = {
  customEvent({state}, eventName){
    //dispatch event for other tools
    try {
      let event = new CustomEvent(eventName, {
        detail: state.target,
      });

      document.dispatchEvent(event);
      console.log(state.target);
    } catch (error) {
      console.log("something went wrong firing: " + eventName);
      console.log(error);
    }
  },

  fetchDatasets({ commit, state }) {
    let body = {
      command: "ListDatasets",
    };

    Api.post(state.backendUrl, body).then((json) => {
      commit("setDatasets", json.payload);
      commit("setActiveSourceDataset", json.payload[0]);
      commit("setActiveTargetDataset", json.payload[0]);
    });
  },

  fetchSource({ commit, state }) {
    let body = {
      command: "FetchDatasetHeader",
      support: {
        dataset: state.activeSourceDataset,
      },
    };

    Api.post(state.backendUrl, body).then((json) => {
      commit("setSource", json.payload);
    });
  },

  fetchTarget({ commit, state, dispatch }) {
    let body = {
      command: "FetchCurrentBinding",
      support: {
        dataset: "component::" + state.activeTargetDataset,
        tag: state.tag,
      },
    };

    Api.post(state.backendUrl, body).then((json) => {
      commit("setTarget", json.payload);

      dispatch("customEvent", "tokenMap.load");
    });

  },

  setActiveSourceDataset({ commit, dispatch }, dataset) {
    commit("setActiveSourceDataset", dataset);
    dispatch("fetchSource");
  },

  setActiveTargetDataset({ commit, dispatch }, dataset) {
    commit("setActiveTargetDataset", dataset);
    dispatch("fetchTarget");
  },

  setTag({ commit }, tag) {
    commit("setTag", tag);
  },

  setTransformerByIndex({ commit }, payload) {
    commit("setTransformerByIndex", payload);
  },

  setDefaultByIndex({ commit }, payload) {
    commit("setDefaultByIndex", payload);

    //dispatch event for other tools
    // try {
    //   let event = new CustomEvent("tokenMap.token.change", {
    //     detail: state.target,
    //   });

    //   document.dispatchEvent(event);
    // } catch (error) {
    //   console.log("something went wrong firing tokenMap.change event");
    //   console.log(error);
    // }
  },

  appendToComposedByIndex({ commit }, payload) {
    commit("appendToComposedByIndex", payload);
  },

  removeComposedByIndex({ commit }, payload) {
    commit("removeComposedByIndex", payload);
  },

  confirmComposedByIndex({ commit }, payload) {
    commit("confirmComposedByIndex", payload);
  },

  moveComposed({ commit, state }, payload) {
    let newIndex = payload.composedIndex + payload.delta;
    if (
      newIndex < 0 ||
      newIndex == state.target[payload.targetIndex].composed.length
    )
      return;
    //Already at the top or bottom.
    else {
      let indexes = [payload.composedIndex, newIndex].sort((a, b) => a - b); //Sort the indexes (fixed)
      commit("moveComposed", {
        targetIndex: payload.targetIndex,
        indexes: indexes,
      });
    }
  },

  save({ state, dispatch }) {
    let body = {
      command: "PushBinding",
      support: {
        dataset: "component::" + state.activeTargetDataset,
        binding: state.target,
        tag: state.tag,
      },
    };

    Api.post(state.backendUrl, body)
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        alert("something went wrong saving to api" + err);
      });

    //dispatch event for other tools
    // try {
    //   let event = new CustomEvent("tokenMap.save", {
    //     detail: state.target,
    //   });

    //   document.dispatchEvent(event);
    // } catch (error) {
    //   console.log("something went wrong firing tokenMap.save event");
    //   console.log(error);
    // }

    dispatch("customEvent", "tokenMap.save");
  },

  autoMatch({ state, commit }) {
    state.source.forEach((source) => {
      let match = state.target.find((target) => target.name === source.name);

      if (!match) return;

      if (
        match.composed.find(
          (composed) =>
            composed.field === match.name &&
            composed.source === state.activeSourceDataset
        )
      )
        return;

      let payload = {
        name: match.name,
        index: state.target.indexOf(match),
        confirmed: true,
      };

      commit("appendToComposedByIndex", payload);
    });
  },

  deleteTargetByIndex({ commit }, payload) {
    commit("deleteTargetByIndex", payload);
  },

  addTarget({ commit }, payload) {
    let newTargetItem = {
      name: payload.targetName,
      type: "",
      composed: [],
      formatter: null,
      transformer: null,
      default: null,
    };

    commit("addTarget", newTargetItem);
  },

  setBackendUrl({ commit }, url) {
    commit("setBackendUrl", url);
  },
};

// mutations
const mutations = {
  setDatasets(state, datasets) {
    state.datasets = datasets;
  },

  setSource(state, source) {
    state.source = source;
  },

  setTarget(state, target) {
    state.target = target;
  },

  setActiveSourceDataset(state, dataset) {
    state.activeSourceDataset = dataset;
  },

  setActiveTargetDataset(state, dataset) {
    state.activeTargetDataset = dataset;
  },

  setTag(state, tag) {
    state.tag = tag;
  },

  setTransformerByIndex(state, payload) {
    state.target[payload.targetIndex].transformer = payload.transformer;
  },

  setDefaultByIndex(state, payload) {
    state.target[payload.targetIndex].default = payload.default;
  },

  appendToComposedByIndex(state, payload) {
    let composed = {
      source: state.activeSourceDataset,
      field: payload.name,
      meta: {
        confirmed: payload.confirmed,
      },
    };
    state.target[payload.index].composed.push(composed);
  },

  removeComposedByIndex(state, payload) {
    state.target[payload.targetIndex].composed.splice(payload.composedIndex, 1);
  },

  confirmComposedByIndex(state, payload) {
    let composed =
      state.target[payload.targetIndex].composed[payload.composedIndex];
    Object.assign(composed, {
      meta: {
        confirmed: true,
      },
    });
    Vue.set(
      state.target[payload.targetIndex].composed,
      payload.composedIndex,
      composed
    );
  },

  moveComposed(state, payload) {
    state.target[payload.targetIndex].composed.splice(
      payload.indexes[0],
      2,
      state.target[payload.targetIndex].composed[payload.indexes[1]],
      state.target[payload.targetIndex].composed[payload.indexes[0]]
    ); //Replace from lowest index, two elements, reverting the order
  },

  deleteTargetByIndex(state, payload) {
    state.target.splice(payload.targetIndex, 1);
  },

  addTarget(state, newTargetItem) {
    state.target.push(newTargetItem);
  },

  setBackendUrl(state, url) {
    state.backendUrl = url;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
