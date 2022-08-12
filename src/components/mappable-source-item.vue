
<script>
export default {
	props: { field: Object },

	computed: {
		activeSourceDataset() {
			return this.$store.getters["mapper/activeSourceDataset"];
		},

		id() {
			return this.activeSourceDataset + "__" + this.field.name;
		},

		isMapped(){
			if(this.$store.getters["mapper/target"].find((target) => {
				if (target.composed.find((composed) => 
					composed.field === this.field.name
				)) return 1;
			})) return 1;

			return 0;
		}
	},

	methods: {
		dragstart($event, name) {
			$event.dataTransfer.setData("name", name);
		}
	}
};
</script>

<template>
	<div 
	@dragstart="dragstart($event, field.name)" 
	:id="id" 
	:class="{unmapped: !isMapped}"
	class="mappable-source" 
	draggable="true">
		<slot>
			{{field.name}}
			<small>{{field.type}}</small>
		</slot>
	</div>
</template>

<style lang="scss">
.mappable-source {
	padding: 1rem;
	margin-bottom: 0.5rem;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	cursor: grab;
	transition: 300ms;

	&.unmapped{
		background-color: #ffbf9f;
	}

	&.highlighted {
		background-color: #a0dbe6;
	}
}
</style>