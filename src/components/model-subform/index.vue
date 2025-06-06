<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { commonStore } from "@/store";
import { get_border_left_right_size } from "@/utils";
import { isEmpty } from "lodash";
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
const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);
// 用于样式显示
</script>
<style lang="scss" scoped>
.content {
    pointer-events: auto !important;
}
</style>
