<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content">
                <template v-if="form.type == 'radio-btns'">
                    <el-radio-group v-model="form.form_value" :class="['adaptive-height', { 'vertical-group' : form.arrangement == 'vertical' }]">
                        <el-radio v-for="item in form.option_list" :key="item.value" :value="item.value">
                            <div class="flex-row gap-10 align-c">
                                <div :style="option_style(item)">{{ item.name }}</div>
                                <template v-if="form.form_value == 'outer' && form.form_value == item.value">
                                    <el-input v-model="form.outer_value" :style="common_store.frame_style + style_container" placeholder="请填写内容"></el-input>
                                </template>
                            </div>
                        </el-radio>
                    </el-radio-group>
                </template>
                <template v-else-if="form.type == 'select'">
                    <div class="flex-col gap-10">
                        <el-select v-model="form.form_value" multiple :multiple-limit="1" filterable placeholder="" class="multi-select flex-1" :style="common_store.frame_style + style_container" @change="data_check">
                            <el-option v-for="item in form.option_list" :key="item.value" :value="item.value" :label="item.name"><div :style="option_style(item)">{{ item.name }}</div></el-option>
                            <template #tag>
                                <template v-if="isEmpty(form.form_value)">
                                    <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                                </template>
                                <template v-else>
                                    <div v-for="item in form.option_list.filter((item1: any) => form.form_value == item1.value)" :key="item.value" :style="option_style(item)">{{ item.name }}</div>
                                </template>
                            </template>
                        </el-select>
                        <template v-if="form.form_value == 'outer'">
                            <el-input v-model="form.outer_value" :style="common_store.frame_style + style_container" placeholder="请填写内容"></el-input>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <el-input v-model="form.form_value" :style="common_store.frame_style + style_container" :placeholder="form.placeholder" @blur="data_check(true)" @change="data_check(true)"></el-input>
                </template>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks, isEmpty } from "@/utils";
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);

const data_check = (val: boolean = false) => {
    get_format_checks(form.value, val)
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
    width: 100%;
    pointer-events: none;
}
.select-tag {
    color: #a8abb2;
}
.multi-select {
    :deep(.el-select__wrapper) {
        padding-left: 0.4rem;
    }
}
</style>
