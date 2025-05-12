<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <number-input v-model="form.form_value" :decimal-num="form.is_decimal == '1' ? form.decimal_num : 0" :money-sign="form.is_display_money == '1' ? form.money_sign : ''" :format="form.format" :is-thousandths-symbol="form.is_thousandths_symbol" :is-percentage="form.format == 'percentage'" :style="common_store.frame_style + style_container" @blur="blur"></number-input>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import { isEmpty } from 'lodash';
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

const blur = () => {
    // 判断是否是必填字段,并且没有值
    if (form.value.is_required == '1' && isEmpty(form.value)) {
        // 是否报错显示
        form.value.common_config.is_error = '1';
        form.value.common_config.error_text = '必填字段不能为空';
    } else {
        // 否就清除报错显示
        form.value.common_config.is_error = '0';
        form.value.common_config.error_text = '';
        range_handle();
    }
};
const range_handle = () => {
    const { form_value, min_num = '',  max_num = '', format = 'num'} = form.value;
    const num = Number(form_value);
    const minNum = Number(min_num);
    const maxNum = Number(max_num); 
    if ((!isEmpty(min_num) && num < minNum) || (!isEmpty(max_num) && num > maxNum)) {
        // 是否报错显示
        form.value.common_config.is_error = '1';
        form.value.common_config.error_text = `请输入${ min_num }${ format == 'num' ? '': '%'}~${ max_num }${ format == 'num' ? '': '%'}之间的数`;
    } else {
        // 否就清除报错显示
        form.value.common_config.is_error = '0';
        form.value.common_config.error_text = '';
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
