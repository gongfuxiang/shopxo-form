<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<div class="new_desc">多行文本</div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
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
                <div class="new_title">默认值</div>
                <el-input v-model="form.form_value" placeholder="请输入默认值" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col w h">
                <div class="new_title mb-10">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
                <div><el-checkbox v-model="form.is_limit_num" label="限制字数" true-value="1" false-value="0" /></div>
                <template v-if="form.is_limit_num == '1'">
                    <div class="flex-row gap-10 w mt-10">
                        <el-input v-model="form.min_num" placeholder="不限" clearable size="small" @change="operation_end"></el-input>
                        <div class="flex-1">~</div>
                        <el-input v-model="form.max_num" placeholder="不限" clearable size="small" @change="operation_end"></el-input>
                    </div>
                </template>
                <desensitization v-model:value="form.desensitization_value" v-model:show="form.is_desensitization"></desensitization>
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
import { cloneDeep, isEmpty } from 'lodash'
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
const old_title = ref(cloneDeep(form.value.title));
const title_change = () => {
    if (isEmpty(form.value.title)) {
        form.value.title = old_title.value;
    }
};
//#endregion
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>
