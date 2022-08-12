
<script>
import MappableTargetItem from "./mappable-target-item.vue";

export default {
	data() {
		return {
			selectedIndex: -1
		};
	},

	components: {
		MappableTargetItem
	},

	computed: {
		target() {
			return this.$store.getters["mapper/target"];
		}
	}
};
</script>

<template>
	<div>
		<ul>
			<li v-for="(field, index) in target" :key="index">
				<MappableTargetItem
					@select="selectedIndex = index"
					@unselect="selectedIndex=-1"
					:field="field"
					:index="index"
					:isSelected="index ===selectedIndex"
				/>
			</li>
		</ul>
	</div>
</template>

<style>
</style>