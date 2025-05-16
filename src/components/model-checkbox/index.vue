<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <template v-if="form.type == 'checkbox'">
                    <el-checkbox-group v-model="form.form_value" :class="['adaptive-height', { 'vertical-group' : form.arrangement == 'vertical' }]">
                        <el-checkbox v-for="item in form.option_list" :key="item.value" :value="item.value"><div :style="option_style(item)">{{ item.name }}</div></el-checkbox>
                    </el-checkbox-group>
                </template>
                <template v-else-if="form.type == 'select-multi'">
                    <div class="flex-col gap-10">
                        <el-select v-model="form.form_value" multiple placeholder="" class="multi-select flex-1" :style="common_store.frame_style + style_container" @change="data_check">
                            <el-option v-for="item in form.option_list" :key="item.value" :value="item.value" :label="item.name"><div :style="option_style(item)">{{ item.name }}</div></el-option>
                            <template #tag>
                                <template v-if="isEmpty(form.form_value)">
                                    <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                                </template>
                                <template v-else>
                                    <template v-if="form.is_multicolour == '1'">
                                        <div v-for="item in form.option_list.filter((item1: any) => form.form_value.includes(item1.value))" :key="item.value" :style="option_style(item) + 'white-space: nowrap;'">{{ item.name }}</div>
                                    </template>
                                    <template v-else> 
                                        <div class="text-line-1" :style="common_styles">{{ selected_names }}</div>
                                    </template>
                                </template>
                            </template>
                        </el-select>
                    </div>
                </template>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import { isEmpty } from "lodash";
const common_store = commonStore();
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
const selected_names = computed(() => {
    const optionList = form.value?.option_list || [];
    const formValue = form.value?.form_value || [];

    const valueSet = new Set(formValue);
    return optionList
    .filter((item: { value: any; name: string }) => valueSet.has(item.value))
    .map((item: { name: string }) => item.name)
    .join(',');
});
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
.multi-select {
    :deep(.el-select__wrapper) {
        .el-select__selection {
            flex-wrap: nowrap;
            overflow: hidden;
        }
        .el-select__suffix {
            padding-left: 0.2rem;
        }
    }
}
</style>
