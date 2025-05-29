<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <number-input v-model="form.form_value" :decimal-num="form.is_decimal == '1' ? form.decimal_num : 0" :money-sign="form.is_display_money == '1' ? form.money_sign : ''" :format="form.format" :is-thousandths-symbol="form.is_thousandths_symbol" :is-percentage="form.format == 'percentage'" :placeholder="form.placeholder" :style="common_store.frame_style + style_container" @blur="data_check" @change="data_check"></number-input>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);

const data_check = () => {
    get_format_checks(form.value, true, 'number');
};
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.select-tag {
    color: #a8abb2;
}
</style>
