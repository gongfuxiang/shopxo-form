<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">标题<span class="required">*</span></div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">类型<div class="new_desc">{{ form.type == 'rect' ? '矩形' : '圆形'}}</div></div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">边框样式</div>
                <el-radio-group v-model="form.border_style" @change="operation_end">
                    <el-radio value="dashed"><div class="border-style-item" style="border: 1px dashed #979797"></div></el-radio>
                    <el-radio value="solid"><div class="border-style-item" style="border: 1px solid #979797"></div></el-radio>
                    <el-radio value="dotted"><div class="border-style-item" style="border: 1px dotted #979797"></div></el-radio>
                </el-radio-group>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">边框粗细</div>
                <slider v-model="form.border_size" :max="1000"></slider>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">边框颜色</div>
                <color-picker v-model="form.border_color" @operation_end="operation_end" />
            </div>
        </el-form-item>
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import { location_compute } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash'
import { commonStore } from "@/store";
const common_store = commonStore();
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
});
const form = ref(props.value);
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
.border-style-item {
    width: 3rem;
    height: 2rem;
}
</style>
