<script>
export default {
  props: { field: Object, index: Number, isSelected: Boolean },

  data() {
    return {
      newIcon: "",
    };
  },

  computed: {
    hasUnconfirmed() {
      return this.field.composed.find((composed) => !composed.meta.confirmed);
    },
    isEmpty() {
      return this.field.composed.length ? false : true;
    },
  },

  methods: {
    click() {
      this.removeHighlights();

      if (!this.isSelected) {
        this.highlightComposedOf();
        this.$emit("select");
      } else {
        this.$emit("unselect");
      }
    },

    removeHighlights() {
      let highlighted = document.querySelectorAll(
        ".mapper__source .highlighted"
      );

      if (highlighted && highlighted.length) {
        highlighted.forEach((el) => {
          el.classList.remove("highlighted");
        });
      }
    },

    highlightComposedOf() {
      this.field.composed.forEach((composed) => {
        let item = document.getElementById(
          Object.keys(composed)[0] + "__" + composed[Object.keys(composed)[0]]
        );

        if (item) {
          item.classList.add("highlighted");
        }
      });
    },

    drop($event, index) {
      this.$store.dispatch("mapper/appendToComposedByIndex", {
        index: index,
        name: $event.dataTransfer.getData("name"),
        confirmed: true,
      });

      this.$emit("select");
    },

    moveDown(composedIndex) {
      this.$store.dispatch("mapper/moveComposed", {
        targetIndex: this.index,
        composedIndex: composedIndex,
        delta: 1,
      });
    },

    moveUp(composedIndex) {
      this.$store.dispatch("mapper/moveComposed", {
        targetIndex: this.index,
        composedIndex: composedIndex,
        delta: -1,
      });
    },

    removeComposed(composedIndex) {
      return this.$store.dispatch("mapper/removeComposedByIndex", {
        targetIndex: this.index,
        composedIndex: composedIndex,
      });
    },

    confirm(composedIndex) {
      return this.$store.dispatch("mapper/confirmComposedByIndex", {
        targetIndex: this.index,
        composedIndex: composedIndex,
      });
    },

    deleteTarget() {
      return this.$store.dispatch("mapper/deleteTargetByIndex", {
        targetIndex: this.index,
      });
    },

    moveIconDown(toolbarIconIndex) {
      this.$store.dispatch("mapper/moveIcon", {
        targetIndex: this.index,
        toolbarIconIndex: toolbarIconIndex,
        delta: 1,
      });
    },

    moveIconUp(toolbarIconIndex) {
      this.$store.dispatch("mapper/moveIcon", {
        targetIndex: this.index,
        toolbarIconIndex: toolbarIconIndex,
        delta: -1,
      });
    },

    removeIcon(toolbarIconIndex) {
      return this.$store.dispatch("mapper/removeIconByIndex", {
        targetIndex: this.index,
        toolbarIconIndex: toolbarIconIndex,
      });
    },

    addIcon(){
      this.$store.dispatch("mapper/addIconByIndex", {
        targetIndex: this.index,
        toolbarIcon: this.newIcon
      });

      this.newIcon = "";
    }
  },
  watch: {
    field: {
      deep: true,
      handler() {
        this.removeHighlights();
        this.highlightComposedOf();
      },
    },
  },
};
</script>

<template>
  <div
    @drop="drop($event, index)"
    @dragover.prevent
    @dragenter.prevent
    :class="{
      selected: isSelected,
      unconfirmed: hasUnconfirmed,
      empty: isEmpty,
      confirmed: !hasUnconfirmed && !isEmpty,
    }"
    class="mappable-target"
  >
    <div @click="click" class="mappable-header">
      {{ field.name }}
      {{ field.composed && field.composed.length ? field.composed.length : "" }}
      |
      {{ field.type }}
      <button class="mappable-delete" @click="deleteTarget">x</button>
    </div>

    <div v-show="isSelected" class="mappable-body">
      <div>
        <label>
          formatter
          <input v-model="field.formatter" class="mapper-input" />
        </label>
      </div>

      <div>
        <label>
          sanitizer
          <input v-model="field.sanitizer" class="mapper-input" />
        </label>
      </div>

      <div>
        <label>
          default
          <input v-model="field.default" class="mapper-input" />
        </label>
      </div>

      <div>
        <label>
          label
          <input v-model="field.label" class="mapper-input" />
        </label>
      </div>

      <div>
        <label>
          disabled
          <input
            type="checkbox"
            v-model="field.disabled"
            class="mapper-input"
          />
        </label>
      </div>

      <div>
        <label>
          hidden
          <input type="checkbox" v-model="field.hidden" class="mapper-input" />
        </label>
      </div>

      <div>
        <label>
          group number
          <input type="number" v-model="field.groupNumber" class="mapper-input" />
        </label>
      </div>

      <div>
        <label>
          required
          <input
            type="checkbox"
            v-model="field.required"
            class="mapper-input"
          />
        </label>
      </div>

      <div>
        <label>
          toolbar
          <input type="checkbox" v-model="field.toolbar" class="mapper-input" />
        </label>
      </div>

      <div v-if="field.toolbar" class="composed">
        <label>
          toolbar icon 
          <input v-model="newIcon" class="mapper-input" />
          <button class="mapper-input" @click="addIcon">Add</button>
        </label>

        <div
          v-for="(toolbarIcon, toolbarIconIndex) of field.toolbarIcons"
          :key="toolbarIconIndex"
          class="toolbar-icon composed-item confirmed"
        >
          {{ toolbarIcon }}
          <div class="composed-controls">
            <button @click="moveIconDown(toolbarIconIndex)" class="composed__move">
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </button>
            <button @click="moveIconUp(toolbarIconIndex)" class="composed__move">
              <i class="fa fa-chevron-up" aria-hidden="true"></i>
            </button>

            <button
              @click="removeIcon(toolbarIconIndex)"
              class="composed__delete"
            >
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>

      </div>

      <div>
        <label>
          source
          <input v-model="field.source" class="mapper-input" />
        </label>
      </div>

      <div v-if="field.composed && field.composed.length" class="composed">
        <div
          v-for="(composed, composedIndex) of field.composed"
          :key="composedIndex"
          :class="{ confirmed: composed.meta.confirmed }"
          class="composed-item"
        >
          {{ composed.source }} : {{ composed.field }}
          <div class="composed-controls">
            <button @click="moveDown(composedIndex)" class="composed__move">
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </button>
            <button @click="moveUp(composedIndex)" class="composed__move">
              <i class="fa fa-chevron-up" aria-hidden="true"></i>
            </button>
            <button
              v-if="!composed.meta.confirmed"
              @click="confirm(composedIndex)"
              class="composed__confirm"
            >
              <i class="fa fa-check" aria-hidden="true"></i>
            </button>
            <button
              @click="removeComposed(composedIndex)"
              class="composed__delete"
            >
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mappable-target {
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &.unconfirmed {
    .mappable-header {
      background-color: #fff49f;

      &:hover {
        background-color: #fff397;
      }
    }

    &.selected {
      -webkit-box-shadow: 0px 0px 4px 2px#fff397;
      -moz-box-shadow: 0px 0px 4px 2px#fff397;
      box-shadow: 0px 0px 4px 2px#fff397;

      .mappable-header {
        background-color: #fff397;
      }
    }
  }

  &.confirmed {
    .mappable-header {
      background-color: #b6fcaf;

      &:hover {
        background-color: #90ff85;
      }
    }

    &.selected {
      -webkit-box-shadow: 0px 0px 4px 2px#90ff85;
      -moz-box-shadow: 0px 0px 4px 2px#90ff85;
      box-shadow: 0px 0px 4px 2px#90ff85;

      .mappable-header {
        background-color: #90ff85;
      }
    }
  }

  &.empty {
    .mappable-header {
      background-color: #ffbf9f;

      &:hover {
        background-color: #ffaa80;
      }
    }

    .mappable-body {
      background: repeating-linear-gradient(
        -55deg,
        #fff,
        #fff 1rem,
        #f8f8f8 1rem,
        #f8f8f8 2rem
      );
    }

    &.selected {
      -webkit-box-shadow: 0px 0px 4px 2px#ffaa80;
      -moz-box-shadow: 0px 0px 4px 2px#ffaa80;
      box-shadow: 0px 0px 4px 2px#ffaa80;

      .mappable-header {
        background-color: #ffaa80;
      }
    }
  }

  &.selected {
    -webkit-box-shadow: 0px 0px 4px 2px rgba(173, 221, 230, 1);
    -moz-box-shadow: 0px 0px 4px 2px rgba(173, 221, 230, 1);
    box-shadow: 0px 0px 4px 2px rgba(173, 221, 230, 1);

    .mappable-header {
      background-color: #a0dbe6;
    }
  }

  .mappable-header {
    padding: 1rem;
    cursor: pointer;
    transition: 300ms;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &:hover {
      background-color: #a0dbe6;
    }
  }

  .mappable-body {
    padding: 1rem 1.5rem 1rem 1.5rem;
  }

  .composed-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    color: red;

    &.confirmed {
      color: unset;
    }

    .composed-controls {
      display: flex;
      button {
        border: 0;
        background-color: inherit;
        padding: 0.5rem;

        &:hover {
          cursor: pointer;
          color: blue;
        }
      }

      .composed__delete {
        font-size: 125%;

        &:hover {
          color: red;
        }
      }
    }
  }
}
</style>
