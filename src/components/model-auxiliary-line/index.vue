<template>
    <div class="rendering-area w">
        <div class="form-group" :style="common_store.layout_style">
            <div class="content w flex-1 flex-row" :style="frame_style + 'height: 100%;' + line_location">
                <div :style="border_style"></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { commonStore } from "@/store";
import { get_border_left_right_size } from "@/utils";
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
const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);
const form = computed(() => props.value);
const line_location = computed(() => `justify-content: ${ form.value.line_location };`);
const border_style = computed(() => {
    if (!props.isCustom) {
        return `width: ${ form.value.line_width }%;border-bottom: ${ form.value.line_size }px ${ form.value.line_style } ${ form.value.line_color };`;
    } else {
        if (form.value.line_type === 'horizontal') {
            return `${ set_count() }margin: 5px 0;border-bottom: ${form.value.line_size }px ${form.value.line_style} ${form.value.line_color};`;
        } else {
            return `${ set_count() } margin: 0 5px;border-right: ${form.value.line_size }px ${form.value.line_style} ${form.value.line_color};`;
        }
    }
});
// 不同地方下的宽度显示
const set_count = () => {
    if (form.value.line_type === 'horizontal') {
        return `width: ${form.value.com_width}px;`;
    } else {
        return `height: ${form.value.com_height}px;`;
    }
};
</script>
<style lang="scss" scoped>
.rich-text-content {
    position: relative;
    z-index: 9;
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
