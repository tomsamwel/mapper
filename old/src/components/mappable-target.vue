
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
  },

  methods: {
    addTarget() {
      this.$store.dispatch("mapper/addTarget", {
        targetName: this.newTargetName,
        targetType: this.newTargetType,
      });
      this.newTargetName = "";
      this.newTargetType = "";

    },
  },
  
  watch: {
    target: {
      deep: true,
      handler() {
        this.$store.dispatch("mapper/customEvent", "settingMap.change");
      },
    },
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
            <input
              class="mapper-input"
              v-model="newTargetName"
              placeholder="name"
            />
            <input
              class="mapper-input"
              v-model="newTargetType"
              placeholder="type"
            />
            <button class="mapper-input" @click="addTarget">Add</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
</style>