<template>
    <el-dialog v-model="dialogVisible" class="layout-dialog form-dialog preview-dialog" fullscreen :close-on-press-escape="false" close-on-click-modal :append-to-body="false" :before-close="handleClose">
        <div class="re w h">
            <icon name="close-line" class="abs preview-dialog-abs" @click="handleClose"></icon>
            <div class="flex-row iframe-content oh w h z-i">
                <iframe :key="key" :src="new_link + '&key=' + key" width="100%" height="100%" frameborder="0"></iframe>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
import {get_cookie, get_id, get_math, set_cookie } from "@/utils";
const common_store = commonStore();
interface DiyItem {
    id: number | string;
    key: string;
    is_enable: string;
    com_data: any;
}
const props = defineProps({
    value: {
        type: Object,
        default: () => { },
    },
    scale: {
        type: Number,
        default: 1
    }
});
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['handleClose']);
const handleClose = () => {
    dialogVisible.value = false;
    emit('handleClose');
};
// #region iframe 样式
// 如果是本地则使用静态tonken如果是线上则使用cookie的token
const cookie = get_cookie('admin_info') || '';
const token = ref('');
const key = ref(0);
onMounted(async () => {
    if (import.meta.env.VITE_APP_BASE_API == '/dev-api') {
        let temp_data = await import(import.meta.env.VITE_APP_BASE_API == '/dev-api' ? '../../../../temp.d.ts' : '../../../../temp_pro.d');
        token.value = '&token=' + temp_data.default.temp_token;
    } else {
        if (cookie && cookie !== null && cookie !== 'null') {
            token.value = '&token=' + JSON.parse(cookie).token;
        }
    }
});
const new_link = computed(() => {
    let uuid_val = '';
    if (get_cookie('uuid_name')) {
        uuid_val = get_cookie('uuid_name');
    } else {
        uuid_val = get_math();
        set_cookie('uid_name', uuid_val);
    }
    let url = common_store.common.config.preview_url;
    // 判断是否包含? 如果包含？的话就是添加参数，否则就是添加？后添加参数
    return url + (url.includes('?') ? '&id=' : '?id=') + get_id() + token.value + '&uuid=' + uuid_val;
});
// 监听dialog_visible
watch(
    () => dialogVisible.value,
    (newVal) => {
        key.value = new Date().getTime();
    }
);
// #endregion
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
        background: #fff !important;

        :deep(.el-radio-button__inner) {
            color: #2A94FF !important;
        }
    }

    :deep(.el-radio-button__inner) {
        border: 0;
        color: #000 !important;
        box-shadow: none !important;
        background-color: transparent !important;
    }
}
.preview-dialog-abs {
    position: absolute;
    top: 2rem;
    right: 2rem;
    z-index: 2;
    font-size: 2rem;
    cursor: pointer;
}
</style>