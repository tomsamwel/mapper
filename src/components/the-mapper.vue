<script>
import MappableSource from "./mappable-source.vue";
import MappableTarget from "./mappable-target.vue";

export default {
  name: "TheMapper",

  components: {
    MappableSource,
    MappableTarget,
  },

  data() {
    return {
      showBound: true,
      showEmpty: true,
    };
  },

  computed: {
    datasets() {
      return this.$store.getters["mapper/datasets"];
    },

    tag: {
			get() {
				return this.$store.getters["mapper/tag"];
			},
			set(val) {
				return this.$store.dispatch("mapper/setTag", val);
			}
		},

    backendUrl: {
      get() {
        return this.$store.getters["mapper/backendUrl"];
      },
      set(url) {
        return this.$store.dispatch("mapper/setBackendUrl", url);
      },
    },
  },

  methods: {
    setSource(dataset) {
      this.$store.dispatch("mapper/setActiveSourceDataset", dataset);
    },

    setTarget(dataset) {
      this.$store.dispatch("mapper/setActiveTargetDataset", dataset);
    },

    setTargetByEvent(event) {
      this.$store.dispatch("mapper/setActiveTargetDataset", event.detail.name);
    },

    setTag() {
			this.$store.dispatch("mapper/fetchTarget");
		},

    save() {
      return this.$store.dispatch("mapper/save");
    },

    autoMatch() {
      return this.$store.dispatch("mapper/autoMatch");
    },
  },

  mounted() {
    this.$store.dispatch("mapper/fetchDatasets");

    document.addEventListener("ComponentSelector.change", this.setTargetByEvent);
  },
};
</script>

<template>
  <div id="app" class="mapper">
    <div :class="{ bound: !showBound }" class="mapper__source">
      <div class="source-controls">
        <label>
          source
          <select
            @change="setSource($event.target.value)"
            class="mapper-input source-select"
          >
            <option v-for="dataset in datasets" :key="dataset" :value="dataset">
              {{ dataset }}
            </option>
          </select>
        </label>

        <button @click="autoMatch" class="mapper-input auto-match">
          auto match
        </button>

        <button
          @click="showBound = !showBound"
          class="mapper-input toggle-bound"
        >
          {{ showBound ? "hide bound" : "show bound" }}
        </button>
      </div>

      <MappableSource />
    </div>
    <div :class="{ empty: !showEmpty }" class="mapper__target">
      <div class="target-controls">
        <!-- <input class="mapper-input" type="text" v-model="backendUrl" /> -->

        <label>
					tag
					<input  v-model="tag" class="mapper-input" />
				<button @click="setTag" class="mapper-input load-tag">load tag</button>

				</label>

        <button @click="save" class="mapper-input target-sav">save</button>

        <button
          @click="showEmpty = !showEmpty"
          class="mapper-input toggle-empty"
        >
          {{ showEmpty ? "empty only" : "show all" }}
        </button>
      </div>

      <MappableTarget />
    </div>
    <!-- <svg>
			<line stroke-width="1px" stroke="#000000" x1="0" y1="0" x2="100" y2="100" id="mySVG" />
		</svg>-->
  </div>
</template>


<style lang="scss">
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
}

html {
  font-size: 100%;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
small {
  font-size: 90%;
}

.mapper {
  display: flex;
  justify-content: space-between;

  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
    }
  }

  &__source,
  &__target {
    width: 50%;
    max-height: 100%;
    overflow-y: scroll;
    ul {
      padding: 0.2rem;
    }
  }

  &__source.bound {
    .mappable-source {
      display: none;
    }
    .mappable-source.unmapped {
      display: block;
    }
  }

  &__target.empty {
    .mappable-target {
      display: none;
    }
    .mappable-target.empty {
      display: block;
    }
  }

  .target-controls,
  .source-controls {
    padding: 1rem 0;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
}
.mapper-input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.5rem;

  &[type="text"],
  select {
    flex-grow: 2;
  }

  &:last-child {
    margin-right: 0;
  }
}

/*!
 *  Font Awesome v4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
 *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
 */
@import url("//use.fontawesome.com/releases/v4.6.3/css/font-awesome-css.min.css");
/* FONT PATH
 * -------------------------- */
@font-face {
  font-family: "FontAwesome";
  src: url("//use.fontawesome.com/releases/v4.6.3/fonts/fontawesome-webfont.eot");
  src: url("//use.fontawesome.com/releases/v4.6.3/fonts/fontawesome-webfont.eot?#iefix")
      format("embedded-opentype"),
    url("//use.fontawesome.com/releases/v4.6.3/fonts/fontawesome-webfont.woff2")
      format("woff2"),
    url("//use.fontawesome.com/releases/v4.6.3/fonts/fontawesome-webfont.woff")
      format("woff"),
    url("//use.fontawesome.com/releases/v4.6.3/fonts/fontawesome-webfont.ttf")
      format("truetype"),
    url("//use.fontawesome.com/releases/v4.6.3/fonts/fontawesome-webfont.svg#fontawesomeregular")
      format("svg");
  font-weight: normal;
  font-style: normal;
}
/*
Embed code 91cc4ee1af
*/
</style>
