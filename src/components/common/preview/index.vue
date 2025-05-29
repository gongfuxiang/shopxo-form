<template>
    <el-dialog v-model="dialogVisible" class="layout-dialog form-dialog" :close-on-press-escape="false" close-on-click-modal :append-to-body="false" :before-close="handleClose">
        <template #header>
            <el-radio-group v-model="type_value" class="custom-radio-group">
                <el-radio-button value="computer"><icon name="computer" size="14"></icon></el-radio-button>
                <el-radio-button value="mobile"><icon name="phone" size="14"></icon></el-radio-button>
            </el-radio-group>
        </template>
        <div class="flex-row h w bg-f8 pt-30">
            <div v-if="type_value == 'computer'" class="dialog-main"> 
                <div class="main-content pa-16" :style="{ height: (form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1') ? 'calc(100% - 7.6rem)' : '100%'}">
                    <div v-for="(item) in diy_data" :key="item.id" :class="['component-style', { 'required-error': item.com_data.common_config.is_error == '1' }]">
                        <component-show :value="item"></component-show>
                    </div>
                </div>
                <div v-if="form_config.is_show_submit == '1' || form_config.is_show_save_draft == '1'" class="main-footer flex-row align-c jc-e gap-20 right-0">
                    <el-button v-if="form_config.is_show_save_draft == '1'" plain @click="save_draft">{{ form_config.submit_title }}</el-button>
                    <el-button v-if="form_config.is_show_submit == '1'" dark :color="form_config.style_settings.computer.submit_color" @click="submit"><span style="color:#fff;">{{ form_config.save_draft_title }}</span></el-button>
                </div>
           </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
});
const diy_data = ref(props.value);
watch(() => props.value, () => {
    diy_data.value = props.value;
});
const type_value = ref('computer');
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['handleClose']);
const handleClose = () => {
    type_value.value = 'computer';
    dialogVisible.value = false;
    emit('handleClose');
};
const form_config = computed(() => common_store.form_config)
//#region 表单操作逻辑
// 保存草稿
const save_draft = () => {

};
const submit = () => {

}
//#endregion
</script>

<style lang="scss" scoped>
.custom-radio-group {
    width: 17rem;
    height: 4.4rem;
    background: #F3F3F3;
    border-radius: 4px;
    padding: 0.2rem;
    .el-radio-button {
        width: 50%;
    }
    .el-radio-button.is-active {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff !important;;
        :deep(.el-radio-button__inner) {
            color: #2A94FF !important;;
        }
    }
    :deep(.el-radio-button__inner) {
        border: 0;
        color: #000 !important;
        box-shadow: none !important;
        background-color: transparent !important;
    }
}
</style>