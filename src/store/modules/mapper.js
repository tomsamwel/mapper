import Api from "./../../api";
import Vue from "vue";

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

// state
const state = {
  backendUrl: "https://suiteux.com/__api/DataMapper.php",
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
      reducer: null,
    },
    {
      name: "Example",
      type: "varchar",
      composed: ["Example"],
      formatter: null,
      reducer: null,
    },
  ],
  target: [
    {
      name: "herpade123",
      type: "bigint",
      composed: [],
      formatter: null,
      reducer: null,
    },
    {
      name: "Example",
      type: "varchar",
      composed: [],
      formatter: null,
      reducer: null,
    },
    {
        name: "Example",
        type: "varchar",
        composed: [],
        formatter: null,
        reducer: null,
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
  tag(state) {
    return state.tag;
  },
  source(state) {
    return state.source;
  },

  target(state) {
    return state.target;
  },
};

/*
API Request Syntax
{
    command : "someClassFunction",
    support : {
        argument_1 : "value",
        argument_2 : 1234
    }
}

API Commands:
ListDatasets            ( expects nothing )
FetchDatasetHeader      ( expects support == {"dataset" : "dataset_name" } )
PushBinding             ( expects support == {"dataset" : "dataset_name", "tag": "tag_string", "binding" : "{jsonblob}" } )
FetchCurrentBinding     ( expects support == {"dataset" : "dataset_name", "tag": "tag_string"} )
*/

// actions
const actions = {
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

  fetchTarget({ commit, state }) {
    let body = {
      command: "FetchCurrentBinding",
      support: {
        dataset: state.activeTargetDataset,
        tag: state.tag,
      },
    };

    Api.post(state.backendUrl, body).then((json) => {
      commit("setTarget", json.payload);
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

  setReducerByIndex({ commit }, payload) {
    commit("setReducerByIndex", payload);
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

  save({ state }) {
    let body = {
      command: "PushBinding",
      support: {
        dataset: state.activeTargetDataset,
        tag: state.tag,
        binding: state.target,
      },
    };

    Api.post(state.backendUrl, body)
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        alert("something went wrong saving" + err);
      });
  },

  autoMatchLevenshtein({ state, commit, getters }, minRatio = 0.7) {
    state.source.forEach((source) => {

        //check if its already bound
        if(getters["target"].find((target) => {
            if (target.composed.find((composed) => 
                composed.field === source.name
            )) return 1;
        })) return 1;

      state.target.every((target) => {
        
        let lev = levenshtein(source.name, target.name)
        let ratio = (source.name.length - lev)/source.name.length
        // alert(source.name+ "  <-->  "+target.name +"\nlev: " + lev + "\nratio: " + ratio);
        if (ratio >= minRatio) {
            let payload = {
                name: source.name,
                index: state.target.indexOf(target),
                confirmed: false,
              };
        
              commit("appendToComposedByIndex", payload);
              return false;
        }
        return true;

      });

    //   if (!match) return;

    //   if (
    //     match.composed.find(
    //       (composed) =>
    //         composed.field === match.name &&
    //         composed.source === state.activeSourceDataset
    //     )
    //   )
    //     return;

      
    });
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

  setReducerByIndex(state, payload) {
    state.target[payload.targetIndex].reducer = payload.reducer;
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
