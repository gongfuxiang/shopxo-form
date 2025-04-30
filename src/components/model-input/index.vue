<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content">
                <el-input v-model="form.value" :style="common_store.frame_style + style_container" :placeholder="form.placeholder" @change="data_check"></el-input>
                <form-error v-if="form.common_config.is_error == '1'" v-model="error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
const common_store = commonStore();
/**
 * @description: 视频 （渲染）
 * @param value{Object} 传过来的数据，用于数据渲染
 */
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);

const error_text = computed(() => {
    return form.value.common_config.is_error == '1' ? '此项为必填项' : '';
    
});
const data_check = () => {
    get_format_checks(form.value)
};
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.content {
    pointer-events: none;
}
</style>
