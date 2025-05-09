<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<div class="new_desc">多行文本</div></div>
                <el-input v-model="form.title" placeholder="请输入标题" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">格式</div>
                <el-select v-model="form.format" value-key="id" filterable placeholder="请选择输入格式" size="default" class="flex-1" @change="operation_end">
                    <el-option v-for="item in format_option" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
                <div class="flex-col gap-10">
                    <div class="flex-row align-c gap-10">
                        <el-checkbox v-model="form.is_decimal" label="保留小数位数" true-value="1" false-value="0" />
                        <el-input-number v-if="form.is_decimal == '1'" v-model="form.decimal_num" :min="0" :max="6" type="number" value-on-clear="min" class="w number-show" controls-position="right" @change="decimal_num_change"></el-input-number>
                    </div>
                    <div v-if="form.format == 'num'" class="flex-row align-c gap-10"><el-checkbox v-model="form.is_thousandths_symbol" label="显示千分符" true-value="1" false-value="0" /></div>
                    <div v-if="form.is_decimal == '1' || (form.format == 'num' && form.is_thousandths_symbol == '1')" class="num-preview">
                        {{ formatNumber('99999', form.format == 'num' && form.is_thousandths_symbol == '1')}}
                        <template v-if="form.format == 'percentage'">%</template>
                    </div>
                </div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">默认值</div>
                <el-input v-model="form.form_value" placeholder="请输入默认值" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
                <div><el-checkbox v-model="form.is_limit_num" label="限定数值范围" true-value="1" false-value="0" /></div>
                <template v-if="form.is_limit_num == '1'">
                    <div class="flex-row gap-10 w">
                        <el-input v-model="form.min_num" placeholder="不限" clearable size="small" @change="operation_end"></el-input>
                        <div class="flex-1">~</div>
                        <el-input v-model="form.max_num" placeholder="不限" clearable size="small" @change="operation_end"></el-input>
                    </div>
                </template>
            </div>
        </el-form-item>
        <border-config :value="form.common_config" />
        <help-config :value="form.common_config" />
    </el-form>
</template>
<script setup lang="ts">
import { formatNumber } from '@/utils/index'
import { isEmpty } from 'lodash';
/**
 * @description: 单行文本 （设置）
 * @param value{Object} 传过来的数据，用于数据渲染
 */
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    modelId: {
        type: String,
        default: '',
    }
});
const form = ref(props.value);// 判断配置项是否有误
// 校验类型选项
const format_option = [
    { name: '数值', value: 'num' },
    { name: '百分比', value: 'percentage' }
];

const decimal_num_change = () => {
    if (!isEmpty(form.value.form_value)) {
        form.value.form_value = Number(formatNumber(form.value.form_value, false)).toFixed(form.value.decimal_num).toString();
    }
}

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
.num-preview {
    background: #f5f6f8;
    border-radius: 3px;
    height: 50px;
    position: relative;
    text-align: center;
    color: #141E31;
    font-size: 18px;
    font-weight: 500;
    line-height: 50px;
}
.number-show {
    width: 7rem !important;
}
</style>
