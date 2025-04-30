<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <div class="mb-10 fw">内容设置</div>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题 
                    <el-select v-model="form.type" value-key="id" size="small" class="select-type" fit-input-width :teleported="false" popper-class="select-type" placement="bottom" @change="type_change">
                        <el-option v-for="item in form_type_option.filter(item => item.value !== form.type)" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <template v-if="form.type == 'single-text'">
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">格式</div>
                    <el-select v-model="form.format" value-key="id" filterable placeholder="请选择输入格式" size="default" class="flex-1" @change="operation_end">
                        <el-option v-for="item in format_option" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">默认值</div>
                    <el-input v-model="form.form_value" placeholder="请输入默认值" @change="operation_end"></el-input>
                </div>
            </el-form-item>
        </template>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">校验</div>
                <el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" />
            </div>
        </el-form-item>
        <border-config :value="form.common_config" />
        <help-config :value="form.common_config" />
    </el-form>
</template>
<script setup lang="ts">
/**
 * @description: 单行文本 （设置）
 * @param value{Object} 传过来的数据，用于数据渲染
 */
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
// 选项成本选项
const form_type_option = [
    { name: '单行文本', value: 'single-text' },
    { name: '下拉框', value: 'radio-btns' },
    { name: '单选按钮组', value: 'select' },
];
// 校验类型选项
const format_option = [
    { name: '无', value: 'none' },
    { name: '手机号码', value: 'phone-number' },
    { name: '电话号码', value: 'telephone-number' },
    { name: '邮政编码', value: 'postal-code' },
    { name: '身份证号码', value: 'id-no' },
    { name: '邮箱', value: 'email' },
];

const type_change = (val: string) => {
    form.value.form_value = '';
};

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
.select-type {
    width: 9rem;
    height: 1.8rem;
    :deep(.el-select__wrapper) {
        box-shadow: none !important;
        font-size: 1rem;
        background: #F6F6F6;
        border-radius: 2px;
    }
}
:deep(.select-type .el-select-dropdown__item) {
    padding: 0 1rem !important;
    font-size: 1.2rem;
    color: #333333;
}
</style>
