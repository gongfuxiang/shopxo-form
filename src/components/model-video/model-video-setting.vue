<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <!-- <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">FROM名称<span class="required">*</span></div><div class="new_desc">视频</div></div>
                <form-name :value="all_form_value.form_name" :model-id="all_form_value.id"  @name_change="name_change"></form-name>
            </div>
        </el-form-item> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">标题<span class="required">*</span></div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">视频上传</div>
                <upload v-model="form.video" :limit="1" type="video" @update:model-value="operation_end"></upload>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">视频封面</div>
                <upload v-model="form.video_img" :limit="1" @update:model-value="operation_end"></upload>
            </div>
        </el-form-item>
        <template v-if="!isCustom">
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">视频宽度</div>
                    <slider v-model="form.video_width" :min="1" :max="500"></slider>
                </div>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="flex-col gap-10 w h">
                    <div class="new_title">视频比例</div>
                    <el-radio-group v-model="form.video_scale_type" @change="operation_end">
                        <el-radio value="0">16:9</el-radio>
                        <el-radio value="1">1:1</el-radio>
                        <el-radio value="2">4:3</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
        </template>
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
    isCustom: {
        type: Boolean,
        default: false,
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
const name_change = (val: string) => {
    all_form_value.value.form_name = val;
}
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>
