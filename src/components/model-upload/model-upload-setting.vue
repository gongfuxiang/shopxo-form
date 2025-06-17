<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">标题<span class="required">*</span></div><div class="new_desc">上传{{ name }}</div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col w h">
                <div class="new_title mb-10">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
                <div class="flex-col gap-10">
                    <el-checkbox v-model="form.is_limit_num" :label="`最多${name}数`" true-value="1" false-value="0" />
                    <div v-if="form.is_limit_num == '1'" class="flex-row gap-10"><input-number v-model="form.limit" :min="1" :max="100" /><span class="desc-title">{{ props.acceptType == 'img' ? '张' : '个' }}</span></div>
                </div>
                <div class="flex-col gap-10">
                    <el-checkbox v-model="form.is_limit_size" :label="`设置单个${name}大小上限`" true-value="1" false-value="0" />
                    <div v-if="form.is_limit_size == '1'" class="flex-row gap-10"><input-number v-model="form.upload_size" :min="1" :max="1000" /><span class="desc-title">MB</span></div>
                </div>
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
import { cloneDeep, isEmpty } from 'lodash';
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
    acceptType: {
        type: String,
        default: 'img',
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
const name = computed(() => props.acceptType == 'img' ? '图片' : props.acceptType == 'video' ? '视频' : '文件');

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss">
</style>
