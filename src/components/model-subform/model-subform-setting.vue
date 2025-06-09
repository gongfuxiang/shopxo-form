<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<div class="new_desc">文本</div></div>
                <el-input v-model="form.title" placeholder="请输入标题" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">文本内容</div>
                <el-input v-model="form.form_value" type="textarea" :rows="6" placeholder="请输入文本内容" clearable></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">字体颜色</div>
                <color-picker v-model="form.text_color" default-color="#666" @operation_end="operation_end" />
            </div>
        </el-form-item>
        <el-button class="w custom-button size-14" size="large" @click="custom_edit"><icon name="edit" size="14"></icon>表单编辑</el-button>
        <subform-dialog :visible="subform_visible" :value="form.form_value" :subform-list="form.children"></subform-dialog>
        <help-config class="mb-18" :value="form.common_config" />
    </el-form>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash'
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    modelId: {
        type: String,
        default: '',
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = ref(props.value);// 判断配置项是否有误

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
const subform_visible = ref(false);
const custom_edit = () => {
    subform_visible.value = true;
};
</script>

<style scoped lang="scss"> 
.custom-button {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0; /* 固定在底部 */
  background-color: white; /* 设置背景色以避免按钮看不见 */
  z-index: 1000; /* 确保按钮在其他内容之上 */
  width: 100%; /* 确保按钮宽度占满父容器 */
  padding: 1rem; /* 添加一些内边距 */
}
:deep(.el-dialog) {
    margin-top: 0;
    padding: 0;
    overflow: hidden;
    .el-dialog__header {
        padding: 2.3rem 2rem;
        .el-dialog__title {
            font-size: 16px;
        }
        .el-dialog__headerbtn {
            font-size: 2.4rem;
            padding: 2rem;
            height: auto;
            width: auto;
        }
    }
    .el-dialog__body {
        background: #f5f5f5;
        height: calc(100% - 15rem);
    }
    .el-dialog__footer {
        padding: 2.4rem 3rem;
    }
}
</style>
