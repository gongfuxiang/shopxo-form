<template>
	<div class="flex-row align-c gap-6 flex-wrap" :class="disaled ? 'is-disable' : 'no-disable'">
		<div v-for="(item, index) in Array(props.max)" :key="index" class="rate-item">
			<template v-if="props.type !== '2'">
				<template v-if="index < new_selected">
					<icon :name="props.type == '0' ? 'pointed' : 'heart'" size="16" class="w h" :color="props.selectColor" @mousemove="mousemove(index + 1)" @mouseleave="mouseleave(index + 1)" @click="icon_click(index + 1)"></icon>
				</template>
				<template v-else>
					<icon :name="props.type == '0' ? 'five-pointed' : 'the-heart'" size="16" class="w h" color="#ccc" @mousemove="mousemove(index + 1)" @mouseleave="mouseleave(index + 1)" @click="icon_click(index + 1)"></icon>
				</template>
			</template>
			<template v-else>
				<template v-if="index + 1 == new_selected">
					<span class="rate-divide-name nowrap" :style="`color:${ props.selectColor };font-size:${ size }px;`" @click="icon_click(index + 1)">{{ index + 1 }}分</span>
				</template>
				<template v-else>
					<span class="rate-divide-name nowrap" :style="`font-size:${ size }px;`" @click="icon_click(index + 1)">{{ index + 1 }}分</span>
				</template>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
const props = defineProps({
	max: {
		type: Number,
		default: 5,
	},
	type: {
		type: String,
		default: '0',
	},
	selectColor: {
		type: String,
		default: '#f7ba2a'
	},
	disaled: {
		type: Boolean,
		default: false
	},
    size: {
        type: String,
        default: '10'
    }
});
const selected = defineModel({ type: Number, default: 1 });
const new_selected = ref(0);
watch(() => selected.value, (val: number) => {
  	new_selected.value = cloneDeep(val);
}, {immediate: true, deep: true});
const mousemove = (index: number) => {
	if (!props.disaled) {
		new_selected.value = index;
	}
}
const mouseleave = (index: number) => {
	if (!props.disaled) {
		new_selected.value = cloneDeep(selected.value);
	}
}
const emit = defineEmits(['change']);
// 点击事件触发
const icon_click = (index: number) => {
	if (!props.disaled) {
		if (index == selected.value) {
			new_selected.value = 0;
			selected.value = 0;
		} else {
			new_selected.value = index;
			selected.value = index;
		}
		emit('change', selected.value);
	}
}
</script>

<style lang="scss" scoped>
.rate-item {
    // width: 1.6rem;
    height: 1.6rem;
}
.is-disable {
	cursor: auto;
	i.iconfont:hover {
		opacity: 1;
	}
}
.no-disable {
	cursor: pointer;
	i.iconfont:hover {
		opacity: 1;
	}
}
.rate-divide-name {
	font-weight: 400;
	font-size: 1rem;
	color: #666666;
	line-height: 1.4rem;
	text-align: right;
	font-style: normal;
}
</style>