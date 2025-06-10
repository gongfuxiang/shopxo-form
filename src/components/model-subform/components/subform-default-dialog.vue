<template>
    <el-dialog v-model="dialogVisible" title="设置默认值" width="800px" style="height: 600px" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body draggable @close="cancel"> 
        <div class="content flex-col gap-10 mtb-20">
            <subform-handle :value="form"></subform-handle>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { cloneDeep } from "lodash";
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref<any>({});
watch(() => props.value, (val) => {
    form.value = val;
}, {immediate: true, deep: true});
const dialogVisible = defineModel('visible', { type: Boolean, default: false });
const cancel = () => {
    dialogVisible.value = false;
};
const emit = defineEmits(['submit'])
const submit = () => {
    emit('submit', form.value.form_value);
    dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.setting {
    width: 30rem;
    background-color: #fff;
    max-height: calc(100vh - 7rem);
    overflow-y: auto;
}
.main-style {
    max-width: calc(100% - 30rem);
}
.content {
    height: 44rem;
    overflow-y: auto;
}
</style>
