<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<div class="new_desc">图片</div></div>
                <el-input v-if="!isCustom" v-model="form.title" placeholder="请输入标题" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">图片上传</div>
                <upload v-model="form.img_src" :limit="1" @update:model-value="operation_end"></upload>
            </div>
        </el-form-item>
        <template v-if="!isCustom">
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">图片宽度</div>
                    <slider v-model="form.img_width" :min="1" :max="500"></slider>
                </div>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">图片比例</div>
                    <el-radio-group v-model="form.img_scale_type" @change="operation_end">
                        <el-radio value="0">16:9</el-radio>
                        <el-radio value="1">1:1</el-radio>
                        <el-radio value="2">4:3</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <help-config class="mb-18" :value="form.common_config" />
        </template>
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
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
    },
    isSubform: {
        type: Boolean,
        default: false,
    },
});
const form = ref(props.value);// 判断配置项是否有误

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>
