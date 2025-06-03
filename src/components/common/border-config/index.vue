<template>
    <div class="flex-col gap-10 w h">
        <div class="new_title flex-row jc-sb align-c">边框设置<el-switch v-model="form.border_is_show" active-value="1" inactive-value="0" @change="operation_end"></el-switch></div>
        <template v-if="form.border_is_show == '1'">
            <el-form-item label="颜色">
                <color-picker v-model="form.border_color" @operation_end="operation_end" />
            </el-form-item>
            <el-form-item label="样式">
                <el-radio-group v-model="form.border_type" @change="operation_end">
                    <el-radio value="dashed"><div class="border-style-item" style="border: 1px dashed #979797"></div></el-radio>
                    <el-radio value="solid"><div class="border-style-item" style="border: 1px solid #979797"></div></el-radio>
                    <el-radio value="dotted"><div class="border-style-item" style="border: 1px dotted #979797"></div></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="圆角">
                <radius :value="form.border_radius" @operation_end="operation_end"></radius>
            </el-form-item>
            <el-form-item label="边距">
                <padding :value="form.border_size" :max="100" @operation_end="operation_end"></padding>
            </el-form-item>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>
<style lang="scss" scoped>
.border-style-item {
    width: 3rem;
    height: 2rem;
}
</style>