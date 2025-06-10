<template>
    <el-dialog v-model="dialogVisible" :title="title" :fullscreen="true" :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body="false" destroy-on-close :before-close="handleClose">
        <div class="flex-row w h">
            <subform-main ref="draglist" class="flex-1 main-style" :diy-data="form.children" :value="form.form_value" @update-setting="update_setting"></subform-main>
            <div class="setting ptb-20 plr-12">
                <right-side-parameter-config :key="key" v-model="diy_data_item" :is-custom="true" :is-subform="true"></right-side-parameter-config>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" class="plr-28 ptb-10" @click="accomplish">完成</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import subformMain from './subform-main.vue'
const props = defineProps({
    title: {
        type: String,
        default: '编辑自定义',
    },
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref(props.value);
watch(() => props.value, (val) => {
    form.value = val;
}, { deep: true});

const diy_data_item = ref({});
const key = ref('');
// 更新设置
const update_setting = (data: any, diy: any[], is_custom: boolean = false) => {
    diy_data_item.value = data;
    // 生成随机id
    key.value = Math.random().toString(36).substring(2);
};
const dialogVisible = defineModel('visible', { type: Boolean, default: false });
const handleClose = () => {
    dialogVisible.value = false;
};
const emits = defineEmits(['accomplish']);
const draglist = ref<any | null>(null);
const accomplish = () => {
    // 如果没有数据，直接返回
    if (!draglist.value) {
        return;
    } else {
        emits('accomplish', draglist.value.diy_data, draglist.value.table_list);    
    }
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
</style>
