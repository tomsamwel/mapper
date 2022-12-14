
<script>
export default {
  props: { field: Object, index: Number, isSelected: Boolean },

  computed: {
    reducer: {
      get() {
        return this.field.reducer;
      },
      set(val) {
        return this.$store.dispatch("mapper/setReducerByIndex", {
          targetIndex: this.index,
          reducer: val,
        });
      },
    },
    hasUnconfirmed() {
      return this.field.composed.find((composed) => !composed.meta.confirmed);
    },
    isEmpty() {
      return this.field.composed.length ? false : true;
    }
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
    :class="{ selected: isSelected, unconfirmed: hasUnconfirmed, empty: isEmpty, confirmed: !hasUnconfirmed && !isEmpty }"
    class="mappable-target"
  >
    <div @click="click" class="mappable-header">
      {{ field.name }}
      {{ field.composed && field.composed.length ? field.composed.length : "" }}
    </div>

    <div v-show="isSelected" class="mappable-body">
      <div v-if="field.composed && field.composed.length" class="composed">
        <div class="composed-reducer">
          <label>
            reducer
            <input v-model="reducer" class="mapper-input" />
          </label>
        </div>
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
      <div v-else class="composed__empty">Empty</div>
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

    &:hover {
      background-color: #a0dbe6;
    }
  }

  .mappable-body {
    .composed {
      padding: 1rem 1.5rem 1rem 1.5rem;
    }
  }

  .composed__empty {
    padding: 1rem 1.5rem 1rem 1.5rem;

    background: repeating-linear-gradient(
      -55deg,
      #fff,
      #fff 1rem,
      #f8f8f8 1rem,
      #f8f8f8 2rem
    );
  }

  .composed-item {
    display: flex;
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