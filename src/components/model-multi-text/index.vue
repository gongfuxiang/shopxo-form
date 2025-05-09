<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <el-input v-model="form.form_value" type="textarea" :style="common_store.frame_style + style_container + 'height:100%;'" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" :autosize="{ minRows: 4, maxRows: 8 }" :placeholder="form.placeholder" @change="data_check"></el-input>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
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

const data_check = () => {
    get_format_checks(form.value)
};
// 没有彩色时的公共样式
const common_styles = computed(() => `${ common_store.color_style };padding-left:0rem;padding-right:0rem;`);
const option_style = (val: any) => {
    if (form.value.is_multicolour == '1') {
        return `background:${ val.color };color:${ val.is_outer == '1' ? '#141E31' : '#fff'};border-radius:0.4rem;${ common_store.color_style }`;
    } else {
        return common_styles.value;
    }
}
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.content {
    pointer-events: none;
}
.select-tag {
    color: #a8abb2;
}
</style>
