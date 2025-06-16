<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<div class="new_desc">地址</div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">类型</div>
                <el-select v-model="form.address_type" value-key="id" filterable placeholder="请选择类型" @change="address_type_change">
                    <el-option v-for="item in format_option.filter(item => !isSubform || (isSubform && item.value == 'noDetailed'))" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">默认值</div>
                <el-cascader v-model="form.form_value" :options="common_store.address_list" :props="{ 'value': 'id', 'label': 'name', 'children': 'items' }" filterable />
                <template v-if="form.address_type == 'detailed'">
                    <el-input v-model="form.detailed_value" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入详细地址"></el-input>
                </template>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
            </div>
        </el-form-item>
        <border-config class="mb-18" :value="form.common_config" />
        <help-config class="mb-18" :value="form.common_config" />
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import { commonStore } from '@/store';
import { isEmpty, cloneDeep } from 'lodash';
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    modelId: {
        type: String,
        default: '',
    },
    isSubform: {
        type: Boolean,
        default: false,
    },
});
const form = ref(props.value);// 判断配置项是否有误
//#region 标题更新时的修改
const old_title = ref(cloneDeep(props.value.title));
const title_change = () => {
    if (isEmpty(form.value.title)) {
        form.value.title = old_title.value;
    }
};
//#endregion
// 校验类型选项
const format_option = [
    { name: '省-市-区', value: 'noDetailed' },
    { name: '省-市-区-详细地址', value: 'detailed' }
];
// 切换类型的时候情况详细地址
const address_type_change = (val: any) => {
    form.value.detailed_value = '';
};
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>
