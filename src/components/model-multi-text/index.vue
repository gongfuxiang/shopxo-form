<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style + layout_style">
            <form-title :value="props.value" :style="title_style"></form-title>
            <div class="content w flex-1">
                <el-input v-model="form.form_value" type="textarea" class="border-focus" :style="frame_style + style_container + 'height:100%;'" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" :show-word-limit="form.is_limit_num == '1' && form.max_num" :autosize="{ minRows: 4, maxRows: 8 }" :placeholder="form.placeholder" @blur="data_check" @change="data_check"></el-input>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_border_left_right_size, get_format_checks } from "@/utils";
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
const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);
const layout_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row'  ? 'align-items:flex-start;' : '');
const title_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' ? 'margin-top:4px;' : '');

const data_check = () => {
    get_format_checks(form.value)
};
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.select-tag {
    color: #a8abb2;
}
</style>
