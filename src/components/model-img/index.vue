<template>
    <div class="rendering-area w h">
        <div class="form-group w h" :style="common_store.layout_style + layout_style">
            <!-- <form-title v-if="!isCustom" :value="props.value" :style="title_style"></form-title> -->
            <div class="content w h flex-1">
                <image-empty v-model="form.img_src[0]" :style="img_style"></image-empty>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = computed(() => props.value);
const layout_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row'  ? 'align-items:flex-start;' : '');
const title_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' ? 'margin-top:4px;' : '');

const img_style = computed(() => {
    if (!props.isCustom) {
        const { img_width, img_scale_type } = form.value;
        const height = img_scale_type === '1' ? img_width : img_scale_type == '0' ? (img_width * 9) / 16 : (img_width * 3) / 4;
        return {
            width: `${ img_width }px`,
            height: `${ height }px`,
        };
    } else {
        return {
            width: '100%',
            height: '100%',
        };
    }
});
</script>
<style lang="scss" scoped>
</style>
