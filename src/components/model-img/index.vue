<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
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
});
const form = computed(() => props.value);

const img_style = computed(() => {
    const { img_width, img_scale_type } = form.value;
    const height = img_scale_type === '1' ? img_width : img_scale_type == '0' ? (img_width * 9) / 16 : (img_width * 3) / 4;
    return {
        width: `${form.value.img_width}px`,
        height: `${ height }px`,
    };
});
</script>
<style lang="scss" scoped>
.rich-text-content {
    position: relative;
    z-index: 999;
    .editor {
        position: relative;
        height: 30rem !important;
        overflow-y: hidden;
        * {
            max-width: 100%;
        }
    }
}
</style>
