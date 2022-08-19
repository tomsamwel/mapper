
<script>
import MappableTargetItem from "./mappable-target-item.vue";

export default {
  data() {
    return {
      selectedIndex: -1,
      newTargetName: "",
      newTargetType: "",
    };
  },

  components: {
    MappableTargetItem,
  },

  computed: {
    target() {
      return this.$store.getters["mapper/target"];
    },
    propTypes() {
      return this.$store.getters["mapper/propTypes"];
    },
  },

  methods: {
    addTarget() {
      this.$store.dispatch("mapper/addTarget", {
        targetName: this.newTargetName,
        targetType: this.newTargetType,
      });
      this.newTargetName = "";
      this.newTargetType = this.propTypes[0];
    },
  },

  watch: {
    target: {
      deep: true,
      handler() {
        this.$store.dispatch("mapper/customEvent", "settingMap.change");
      },
    },
    propTypes: {
      handler(){
        this.newTargetType = this.propTypes[0];
      }
    }
  },

};
</script>

<template>
  <div>
    <ul>
      <li v-for="(field, index) in target" :key="index">
        <MappableTargetItem
          @select="selectedIndex = index"
          @unselect="selectedIndex = -1"
          :field="field"
          :index="index"
          :isSelected="index === selectedIndex"
        />
      </li>
      <li>
        <div class="mappable-target mappable-add">
          <div class="mappable-header">
            <label
              >name
              <input
                class="mapper-input"
                v-model="newTargetName"
                placeholder="name"
                v-on:keyup.enter="addTarget"
              />
            </label>

            <label>
              prop type
              <select
                class="mapper-input source-select"
                v-model="newTargetType"
              >
                <option
                  v-for="propType in propTypes"
                  :key="propType"
                  :value="propType"
                >
                  {{ propType }}
                </option>
              </select>
            </label>

            <button class="mapper-input" @click="addTarget">Add</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
</style>