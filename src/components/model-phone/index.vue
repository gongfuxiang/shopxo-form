<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w flex-1">
                <div class="flex-col gap-10" :style="frame_style + 'height: 100%;'">
                    <el-input v-model="form.form_value" class="border-focus" :style="frame_style + style_container" :placeholder="form.placeholder" @change="data_check">
                        <template #prefix>
                            <icon :name="form.icon_name" color="#999"></icon>
                        </template>
                    </el-input>
                    <div v-if="form.is_sms_verification == '1'" class="flex-row gap-10">
                        <el-input v-model="form.form_value_code" :disabled="isEmpty(form.form_value)" class="border-focus flex-1" :style="frame_style + style_container" placeholder="请输入短信验证码" @change="data_code_check"></el-input>
                        <el-button :style="frame_style + 'height:auto;width:100px;'" :disabled="isEmpty(form.form_value) || verify_disabled" @click="open_dialog">{{ verify_txt }}</el-button>
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
import { common_styles_computer, get_border_left_right_size, get_format_checks } from "@/utils";
import { commonStore } from "@/store";
import PhoneAPI from '@/api/phone';
import { cloneDeep, isEmpty } from "lodash";
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
const form = computed(() => props.value);
const frame_style = computed(() => common_store.frame_style + `${ props.isCustom ? `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);` : '' }`);
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
const verify_time_total = 60;
const temp_time = ref(60);
const temp_clear_time = ref<any>(null);
const verify_disabled = ref(false);
const verify_txt = ref('获取验证码');
// 获取手机验证码
const get_verification = () => {
    const params = {
        accounts: form.value.form_value, 
        type: 'sms', 
        verify: form.value.is_img_sms_verification == '1' ? dialog_value.value : ''
    };
    verify_disabled.value = true;
    PhoneAPI.getVerification(params).then((res:any) => {
        if (res.code == 0) {
            // 倒计时处理
            temp_time.value = cloneDeep(verify_time_total) - 1;
            // 默认直接执行一次
            verify_disabled.value = true;
            verify_txt.value = `剩余${temp_time.value}秒`;
            temp_clear_time.value = setInterval(function () {
                if (temp_time.value <= 1) {
                    clearInterval(temp_clear_time.value);
                    verify_disabled.value = false;
                    verify_txt.value = '获取验证码';
                } else {
                    temp_time.value--;
                    verify_disabled.value = true;
                    verify_txt.value = `剩余${temp_time.value}秒`;
                }
            }, 1000);
        } else {
            verify_disabled.value = false;
        }
    }).catch(() => {
        verify_disabled.value = false;
    });
}
onBeforeUnmount(() => {
    clearInterval(temp_clear_time.value);
});
//#endregion
// 手机号校验逻辑
const data_check = () => {
    if (form.value?.common_config) {
        form.value.common_config.format = form.value.is_telephone === '1' ? 'telephone-number' : 'phone-number';
    }
    get_format_checks(form.value, true);
};
const data_code_check = () => {
    if (form.value.is_required == '1' && isEmpty(form.value.form_value_code)) {
        // 是否报错显示
        form.value.common_config.is_error = '1';
        form.value.common_config.error_text = '短信验证码不能为空';
    } else {
        if (form.value?.common_config) {
            form.value.common_config.format = form.value.is_telephone === '1' ? 'telephone-number' : 'phone-number';
        }
        get_format_checks(form.value, true);
    }
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
