<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w">
                <div class="flex-col gap-10" :style="common_store.frame_style + 'height: 100%;'">
                    <el-input v-model="form.form_value" :style="common_store.frame_style + style_container" :placeholder="form.placeholder" @change="data_check">
                        <template #prefix>
                            <icon :name="form.icon_name" color="#999"></icon>
                        </template>
                    </el-input>
                    <div v-if="form.is_sms_verification == '1'" class="flex-row gap-10 align-c">
                        <el-input v-model="form.form_value_code" :disabled="isEmpty(form.form_value)" :style="common_store.frame_style + style_container" placeholder="请输入短信验证码" @change="data_check"></el-input>
                        <el-button :style="common_store.frame_style + 'width:100px;'" :disabled="isEmpty(form.form_value)" @click="open_dialog">获取验证码</el-button>
                    </div>
                </div>
                <!-- 默认内容设置 -->
                <el-dialog v-model="dialogVisible" title="编辑" width="300px" style="height: 200px" align-center :close-on-click-modal="false" :close-on-press-escape="false" append-to-body draggable @close="cancel"> 
                    <div class="w h ptb-20 oh">
                        <el-input v-model="dialog_value">
                            <template #suffix>
                                <el-image v-if="!isEmpty(img_verification)" :src="img_verification" @click="get_img_verification"></el-image>
                            </template>
                        </el-input>
                    </div>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="cancel">取消</el-button>
                            <el-button type="primary" @click="submit">确定</el-button>
                        </span>
                    </template>
                </el-dialog>
                <form-error v-if="form.common_config.is_error == '1'" v-model="form.common_config.error_text"></form-error>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { common_styles_computer, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import PhoneAPI from '@/api/phone';
import { isEmpty } from "lodash";
const common_store = commonStore();
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});
const form = computed(() => props.value);
//#region 图片验证码内容
const dialogVisible = ref(false);
const dialog_value  = ref('');
const img_verification = ref<any>('');
onBeforeMount(()=> {
    get_img_verification();
})
// 图片验证码的图片数据
const get_img_verification = () => {
    PhoneAPI.getImageVerification().then((res) => {
        img_verification.value = res;
    })
}
// 图片验证码的取消按钮
const cancel = () => {
    dialog_value.value = '';
    dialogVisible.value = false;
}
// 图片验证码的确认按钮
const submit = () => {
    dialogVisible.value = false;
    get_verification();
}
// 获取验证码的按钮
const open_dialog = () => {
    // 如果打开了图片验证码，就打开弹出框，否则的话就直接调用获取验证码接口
    if (form.value.is_img_sms_verification == '1') {
        dialogVisible.value = true;
    } else {
        get_verification();
    }
}
// 获取手机验证码
const get_verification = () => {
    const params = {
        accounts: form.value.form_value, 
        type: 'sms', 
        verify: form.value.is_img_sms_verification == '1' ? dialog_value.value : '2255'
    };
    PhoneAPI.getVerification(params).then((res) => {
        console.log(res);
    })
}
//#endregion
// 手机号校验逻辑
const data_check = () => {
    if (form.value.is_telephone == '1') {
        form.value.common_config.format = 'telephone-number';
    } else {
        form.value.common_config.format = 'phone-number';
    }
    get_format_checks(form.value, true);
};
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
</script>
<style lang="scss" scoped>
.pc-disable {
    cursor: all-scroll;
    background: rgba(5, 30, 80, 0.04);
    opacity: 0.4;
}
</style>
