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
import { get_container_location, location_compute } from '@/utils';
import { cloneDeep } from 'lodash'
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
    }
});
// 默认值
const state = reactive({
    diy_data: props.value
});
// 如果需要解构，确保使用toRefs
const { diy_data } = toRefs(state);
const form = ref(diy_data.value.com_data);

const size_location_change = (location: { x: number, y: number, record_x: number, record_y: number, staging_y: number }) => {
    const { custom_width, custom_height} = common_store.form_config;
    let width = 0;
    let height = 0;
    if (form.value.line_type === 'horizontal') {
        height = form.value.line_size + 10;
    } else {
        width = form.value.line_size + 10;
    }

    diy_data.value.location.x = location_compute(width, location.x, custom_width);
    diy_data.value.location.y = location_compute(height, location.y, custom_height);

    diy_data.value.location.record_x = location_compute(width, location.record_x, custom_width);
    diy_data.value.location.record_y = location_compute(height, location.record_y, custom_height);
    diy_data.value.location.staging_y = location_compute(height, location.staging_y, custom_height);
    
    form.value.com_width = width == 0 ? form.value.com_width : width;
    form.value.com_height = height == 0 ? form.value.com_height : height;
}

// 监听数据变化
watch(() => diy_data.value, (val) => {
    size_location_change(val.location);
},{ immediate: true, deep: true });

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss"> 
</style>
