<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <custom-rate v-model="form.form_value" :max="form.total" :select-color="form.select_color" :type="form.score_type" :style="common_store.frame_style" @change="data_check"/>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import { cloneDeep } from "lodash"
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);
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
