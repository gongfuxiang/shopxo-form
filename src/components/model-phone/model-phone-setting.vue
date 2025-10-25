<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">FROM名称<span class="required">*</span></div><div class="new_desc">手机</div></div>
                <form-name :value="all_form_value.form_name" :model-id="all_form_value.id" @name_change="name_change"></form-name>
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
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">图标</div>
                <upload v-model:icon-value="form.icon_name" is-icon type="icon" :limit="1" size="50"></upload>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col w h">
                <div class="new_title mb-10">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
                <div><el-checkbox v-model="form.is_telephone" label="支持固定电话" true-value="1" false-value="0" /></div>
                <div><el-checkbox v-model="form.is_sms_verification" label="短信验证码" true-value="1" false-value="0" /></div>
                <div v-if="form.is_sms_verification == '1'"><el-checkbox v-model="form.is_img_sms_verification" label="图片验证码" true-value="1" false-value="0" /></div>
            </div>
        </el-form-item>
        <border-config class="mb-18" :value="form.common_config" />
        <help-config class="mb-18" :value="form.common_config" />
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

// 校验类型选项
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
