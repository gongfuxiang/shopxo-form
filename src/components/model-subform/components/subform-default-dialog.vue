<template>
    <el-dialog v-model="dialogVisible" title="显隐规则" width="800px" style="height: 600px" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body draggable @close="cancel"> 
        <div class="content flex-col gap-10 mtb-20">
            
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
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
watch(() => props.value, (val) => {
    form.value = val;
}, {immediate: true, deep: true});
const dialogVisible = defineModel('visible', { type: Boolean, default: false });
const cancel = () => {
    
};

const submit = () => {
    
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
</style>
