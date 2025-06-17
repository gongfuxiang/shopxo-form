<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">标题<span class="required">*</span></div><div class="new_desc">富文本</div></div>
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
                <div class="new_title">默认内容</div>
                <el-button @click="open_dialog">编辑</el-button>
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
        <!-- 默认内容设置 -->
        <el-dialog v-model="dialogVisible" title="编辑" width="800px" style="height: 610px" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body draggable @close="cancel"> 
            <div class="w h ptb-20 oh">
                <editor-config v-model="old_value" :placeholder="form.placeholder" new-style="height: 450px;"></editor-config>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submit">确定</el-button>
                </span>
            </template>
        </el-dialog>
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
//#region 关于编辑弹窗的操作
const dialogVisible = ref(false);
const old_value = ref('');
// 打开弹出框
const open_dialog = () => {
    old_value.value = cloneDeep(form.value.form_value);
    dialogVisible.value = true;
};
// 关闭弹出框
const cancel = () => {
    dialogVisible.value = false;
};
//  提交弹出框
const submit = () => {
    form.value.form_value = old_value.value;
    dialogVisible.value = false;
};
//#endregion
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>
