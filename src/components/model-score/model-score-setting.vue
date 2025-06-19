<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">FROM名称<span class="required">*</span></div><div class="new_desc">评分</div></div>
                <form-name :value="all_form_value.form_name" :model-id="all_form_value.id" :is-subform="isSubform" :subform-list="subformList" @name_change="name_change"></form-name>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">标题<span class="required">*</span></div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">评分设置</div>
                <div class="flex-row align-b gap-10">
                    <span class="desc-title">评分样式</span>
                    <el-radio-group v-model="form.score_type" class="flex-col gap-10 align-s">
                        <el-radio value="0"><custom-rate v-model="form.form_value" :max="5" disaled :select-color="form.select_color" type="0" /></el-radio>
                        <el-radio value="1"><custom-rate v-model="form.form_value" :max="5" disaled :select-color="form.select_color" type="1" /></el-radio>
                        <el-radio value="2"><custom-rate v-model="form.form_value" :max="5" disaled :select-color="form.select_color" type="2" /></el-radio>
                    </el-radio-group>
                </div>
                <div class="flex-row align-c gap-10">
                    <span class="desc-title">选中颜色</span>
                    <color-picker v-model="form.select_color" default-color="#FFD22A" @operation_end="operation_end" />
                </div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">默认内容</div>
                <div class="flex-row align-c gap-10 w h">
                    <span class="desc-title" style="width: 4.8rem;">总数量</span>
                    <input-number v-model="form.total" placeholder="请输入总数量" class="flex-1  w h"  :min="1" :max="20" @change="handle_min_max_blur('min_num')"></input-number>
                    <span class="desc-title">个</span>
                </div>
                <div class="flex-row align-c gap-10 w h">
                    <span class="desc-title">选中数量</span>
                    <input-number v-model="form.form_value" placeholder="请输入选中数量" class="w h" :min="0" :max="20" @change="handle_min_max_blur('min_num')"></input-number>
                    <span class="desc-title">个</span>
                </div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col w h">
                <div class="new_title mb-10">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
            </div>
        </el-form-item>
        <help-config class="mb-18" :value="form.common_config" />
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import { commonStore } from '@/store';
import { parse_and_format } from '@/utils';
const common_store = commonStore();
import { cloneDeep, isEmpty } from 'lodash';
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isSubform: {
        type: Boolean,
        default: false,
    },
    subformList: {
        type: Array,
        default: () => ([]),
    },
    allValue: {
        type: Object,
        default: () => {},
    }
});
const all_form_value = ref(props.allValue);
const form = ref(props.value);// 判断配置项是否有误

//#region 标题更新时的修改
const old_title = ref(cloneDeep(form.value.title));
const title_change = () => {
    if (isEmpty(form.value.title)) {
        form.value.title = old_title.value;
    }
};
//#endregion
/**
 * 处理最小值和最大值输入框失焦事件
 * 该函数旨在确保最小值和最大值符合规定的十进制数，并防止最小值大于最大值
 * 当最小值大于最大值时，将两个值设置为相等
 * 
 * @param {string} triggerField - 触发该函数的字段，只能是 'min_num' 或 'max_num'
 */
 const handle_min_max_blur = (triggerField: 'min_num' | 'max_num') => {
    // 从表单中提取当前的最小值、最大值和小数位数
    const { form_value, total } = form.value;

    // 解析并格式化最小值和最大值
    const min = parse_and_format(form_value, 0);
    const max = parse_and_format(total, 0);

    // 确保最小值不大于最大值，如果违反，则将两个值设置为相等
    if (min !== null && max !== null && min > max) {
        if (triggerField === 'min_num') {
            form.value.total = form.value.form_value;
        } else {
            form.value.form_value = form.value.total;
        }
    }
};

const name_change = (val: string) => {
    all_form_value.value.form_name = val;
}

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss">
:deep(.el-radio__label) {
    height: 100%;
}
</style>
