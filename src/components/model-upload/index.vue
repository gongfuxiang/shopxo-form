<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style + layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <upload-setting :value="form.form_value" :accept-type="acceptType" :file-size-limit="form.is_limit_size == '1' ? form.upload_size : ''" :limit="form.is_limit_num == '1' ? form.limit : ''" :upload-style="frame_style + style_container" @change="change" />
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_border_left_right_size, get_format_checks, get_math } from "@/utils";
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    acceptType: {
        type: String,
        default: 'img',
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = computed(() => props.value);
const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);
const layout_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' ? 'align-items:baseline;' : '');
// 校验逻辑
const change = (value: any) => {
    form.value.form_value = value;
    get_format_checks(form.value, false);
};
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>

.pc-disable {
    cursor: all-scroll;
    background: rgba(5, 30, 80, 0.04);
    opacity: 0.4;
}
</style>
