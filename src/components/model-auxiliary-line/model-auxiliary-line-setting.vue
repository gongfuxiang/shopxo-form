<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">线条设置</div>
                <div class="flex-col gap-10">
                    <div v-if="isCustom" class="flex-row align-c gap-10">
                        <span class="desc-title">线条类型</span>
                        <el-radio-group v-model="form.line_type" @change="operation_end">
                            <el-radio value="horizontal">横线</el-radio>
                            <el-radio value="vertical">竖线</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="flex-row align-c gap-10">
                        <span class="desc-title">线条样式</span>
                        <el-radio-group v-model="form.line_style" @change="operation_end">
                            <el-radio value="dashed">
                                <icon name="line-point" class="re top-2" size="32"></icon>
                            </el-radio>
                            <el-radio value="solid">
                                <icon name="line" class="re top-2" size="32"></icon>
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <template v-if="!isCustom">
                        <div class="flex-row align-c gap-10">
                            <span class="desc-title">线条宽度(%)</span>
                            <slider v-model="form.line_width" :min="1" :max="100"></slider>
                        </div>
                        <div class="flex-row align-c gap-10">
                            <span class="desc-title">线条位置</span>
                            <el-radio-group v-model="form.line_location" @change="operation_end">
                                <el-radio value="flex-start">居左</el-radio>
                                <el-radio value="center">居中</el-radio>
                                <el-radio value="flex-end">居右</el-radio>
                            </el-radio-group>
                        </div>
                    </template>
                    <div class="flex-row align-c gap-10">
                        <span class="desc-title">线条粗细</span>
                        <slider v-model="form.line_size" :min="1" :max="100"></slider>
                    </div>
                    <div class="flex-row align-c gap-10">
                        <span class="desc-title">线条颜色</span>
                        <color-picker v-model="form.line_color" default-color="#000" @operation_end="operation_end" />
                    </div>
                </div>
            </div>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash'
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
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
</script>

<style scoped lang="scss"> 
</style>
