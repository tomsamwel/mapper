
<script>
import MappableSourceItem from "./mappable-source-item.vue";

export default {
	components: {
		MappableSourceItem
	},

	computed: {
		source() {
			return this.$store.getters["mapper/source"];
		}
	}
};
</script>

<template>
	<div>
		<ul>
			<li v-for="(field, index) in source" :key="index">
				<MappableSourceItem :field="field" />
			</li>
		</ul>
	</div>
</template>

<style>
</style>