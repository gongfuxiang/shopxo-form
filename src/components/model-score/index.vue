<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <custom-rate v-model="form.form_value" :max="form.total" :select-color="form.select_color" :type="form.score_type" :style="frame_style" @change="data_check"/>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_border_left_right_size, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import { cloneDeep } from "lodash"
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
// 手机号校验逻辑
const data_check = () => {
    get_format_checks(form.value, false);
};

const is_show = ref(true);
// 用于样式显示
</script>
<style lang="scss" scoped>
.pc-disable {
    cursor: all-scroll;
    background: rgba(5, 30, 80, 0.04);
    opacity: 0.4;
}
</style>
