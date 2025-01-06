<template>
    <div class="settings">
        <el-scrollbar>
            <div v-if="isShowFormModel">
                <div class="flex-row jc-c pa-16 br-b-f8">
                    <el-radio-group v-model="type_value" class="radio-group" size="large" is-button @change="type_change">
                        <el-radio-button class="radio-item" value="default">常规模式</el-radio-button>
                        <el-radio-button class="radio-item" value="free">自由模式</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="ptb-20 plr-12">
                    <div v-if="type_value == 'default'" class="setting-content">
                        <div>default</div>
                    </div>
                    <div v-else class="setting-content">
                        <div>free</div>
                    </div>
                </div>
            </div>
            <div v-else class="ptb-20 plr-12">
                <div class="setting-content">
                    <template v-if="model_value.key == 'single-text'">
                        <model-input-setting :value="model_value.data"></model-input-setting>
                    </template>
                    <template v-else>
                        <div class="pa-16 cr-6 mt-40 pt-40 tc">暂无设置</div>
                    </template>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: () => 'default',
    },
    isShowFormModel: {
        type: Boolean,
        default: false,
    },
});
const type_value = ref(props.type);
const model_value = defineModel({ type: Object, default: () => ({}) });

const emits = defineEmits(['type']);
// 切换模式
const type_change = (val: any) => {
    emits('type', val);
};
</script>

<style scoped lang="scss">
.settings {
    width: 23.4rem;
    background-color: #fff;
    max-height: calc(100vh - 7rem);

    .radio-group {
        background: #f4f4f4;
        border-radius: 100rem;
        .el-radio-button {
            overflow: hidden;
            border-radius: 100rem;
            :deep(.el-radio-button__inner) {
                border: 0;
                background: #f4f4f4;
            }
            :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
                background: $cr-primary;
            }
        }
    }
}
</style>
