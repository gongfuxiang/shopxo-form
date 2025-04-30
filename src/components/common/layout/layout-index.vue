<template>
    <layout-dialog v-model:visible="dialogVisible" :title="configType == 'layout' ? '表单布局' : '表单样式'" @close_event="close_event">
        <div class="flex-row h w">
           <div class="main flex-1 bg-f8">

           </div>
            <div class="flex-col bg-f" style="width: 234px;">
                <div class="flex-row jc-c pa-16 br-b-f8">
                    <el-radio-group v-model="type_value" class="radio-group" size="large" is-button>
                        <el-radio-button class="radio-item" value="computer">电脑端</el-radio-button>
                        <el-radio-button class="radio-item" value="mobile">移动端</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="ptb-20 plr-12">
                    <layout-right :config-type="configType" :port-type="type_value" :value="type_value == 'computer' ? form.computer : form.mobile" />
                </div>
            </div>
        </div>
    </layout-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
    // 配置类型，layout：表单布局，style：表单样式
    configType: {
        type: String,
        default: 'layout',
    },
    value: {
        type: Object,
        default: () => {},
    },
});
const form = ref(props.value);
watch(() => props.value, () => {
    form.value = props.value;
});
const type_value = ref('computer');
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false })
const close_event = () => {
    type_value.value = 'computer';
    dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.radio-group {
    background: #f4f4f4;
    border-radius: 100rem;
    .el-radio-button {
        overflow: hidden;
        border-radius: 100rem;
        :deep(.el-radio-button__inner) {
            width: 10rem;
            border: 0;
            background: #f4f4f4;
        }
        :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
            background: $cr-primary;
        }
    }
}
.title-location-icon {
    padding: 1rem;
    background: #FFFFFF;
    border-radius: 0.4rem;
    border: 0.1rem solid #EEEEEE;
    .location-icon {
        width: 100%;
        height: 1.5rem;
        background: #F4F4F4;
        border-radius: 2px;
    }
    .location-icon-1 {
        width: 2.6rem;
        background: #E4EEF4;
    }
    .location-height {
        height: 3.5rem;
    }
}
.title-location-icon.active {
    border: 0.1rem solid #2A94FF;
}
</style>