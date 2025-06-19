<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style + layout_style">
            <form-title :value="props.value" :style="title_style"></form-title>
            <div class="content">
                <template v-if="form.type == 'radio-btns'">
                    <el-radio-group v-model="form.form_value" :class="['adaptive-height', { 'vertical-group' : form.arrangement == 'vertical' }]" @change="data_check(false, 'radio')">
                        <el-radio v-for="item in form.option_list" :key="item.value" :value="item.value">
                            <div class="flex-row gap-10 align-c">
                                <div :style="option_style(item)">{{ item.name }}</div>
                                <template v-if="form.form_value == 'outer' && form.form_value == item.value">
                                    <el-input v-model="form.outer_value" class="border-focus" :style="frame_style + style_container" placeholder="请填写内容"></el-input>
                                </template>
                            </div>
                        </el-radio>
                    </el-radio-group>
                </template>
                <template v-else-if="form.type == 'select'">
                    <div class="flex-col gap-10">
                        <el-select ref="selectRef" v-model="form.form_value" multiple :multiple-limit="1" filterable placeholder="" :popper-class="form.multicolour == '1' ? 'multicolour-select' : ''" class="flex-1 border-focus" :style="frame_style + style_container" @change="select_change">
                            <el-option v-for="item in form.option_list" :key="item.value" :value="item.value" :label="item.name" :class="['flex-row align-c select-option' , { 'selected-bg': form.form_value.includes(item.value) && form.multicolour == '1', 'selected-color': form.form_value.includes(item.value) && form.multicolour !== '1' }]" @click="select_click(item.value)"><div :style="option_style(item)">{{ item.name }}</div></el-option>
                            <template #tag>
                                <template v-if="isEmpty(form.form_value)">
                                    <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                                </template>
                                <template v-else>
                                    <div v-for="item in form.option_list.filter((item1: any) => form.form_value.includes(item1.value))" :key="item.value" :style="option_style(item)">{{ item.name }}</div>
                                </template>
                            </template>
                        </el-select>
                        <template v-if="form.form_value == 'outer'">
                            <el-input v-model="form.outer_value" class="border-focus" :style="frame_style + style_container" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" placeholder="请填写内容"></el-input>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <el-input v-model="form.form_value" class="border-focus" :style="frame_style + style_container" :placeholder="form.placeholder"  @blur="data_check(true)" @change="data_check(true)"></el-input>
                </template>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_border_left_right_size, get_format_checks, isEmpty } from "@/utils";
import { commonStore } from "@/store";
import type { ElSelect } from "element-plus";
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
const layout_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' && form.value.type == 'radio-btns' ? 'align-items:flex-start;' : '');
const title_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' && form.value.type == 'radio-btns'? 'margin-top:4px;' : '');

const data_check = (val: boolean = false, type: string = '') => {
    get_format_checks(form.value, val, type)
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
// 关闭下拉框
const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);
// 单选选择框为了兼容颜色设置，清空老数据并赋值新数据
const select_click = (val: any) => {
    if (!form.value.form_value.includes(val)) {
        form.value.form_value = val;
    }
    // 点击之后关闭下拉框的弹出框
    if (selectRef.value) {
        selectRef.value.blur();
    }
}
const select_change = (val: any) => {
    form.value.form_value = Array.isArray(val) ? val[0] : val;
    get_format_checks(form.value, false, 'select');
}
</script>
<style lang="scss" scoped>
.select-tag {
    color: #a8abb2;
}
.multi-select {
    :deep(.el-select__wrapper) {
        padding-left: 0.4rem;
    }
}
.select-option {
    cursor: pointer !important;
}
.selected-bg {
    background-color: #E6F8F5;
}
.selected-color {
    color: $cr-main;
}
</style>
