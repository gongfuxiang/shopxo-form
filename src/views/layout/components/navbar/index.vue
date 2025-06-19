<template>
    <!-- 顶部导航栏 -->
    <div class="navbar">
        <div class="nav-left">
            <!-- <icon name="arrow-left" color="f">返回</icon> -->
            <div class="flex-row align-c">
                <div class="name">
                    <div class="flex-row align-c gap-10 c-pointer" @click="dialog_visible = true">
                        <image-empty v-if="modelValue.logo" :src="modelValue.logo" class="round img" error-img-style="width: 2.2rem;height: 2.2rem;" />
                        <div>{{ modelValue.name }}</div>
                        <icon name="edit" color="#7DBEFF"></icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="nav-center">
            <div class="nav-tabs active">表单设计</div>
            <div class="nav-tabs">表单发布</div>
        </div>
        <div class="nav-right">
            <el-dropdown @visible-change="visible_change">
                <el-button plain type="primary" class="nav-right-dropdown-button"><span class="mr-4">更多</span><icon :name="is_dropdown_show ? 'arrow-top' : 'arrow-bottom'" size="8" color="primary" /></el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                    <el-dropdown-item @click="import_click">导入</el-dropdown-item>
                    <el-dropdown-item @click="export_click">导出</el-dropdown-item>
                    <el-dropdown-item @click="clear_click">清空</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-button plain type="primary" @click="form_config_event">表单配置</el-button>
            <el-button plain type="primary" @click="preview_event">预览</el-button>
            <el-button plain type="primary" :class="saveDisabled ? 'disabled' : ''" :disabled="saveDisabled" @click="save_event">仅保存</el-button>
            <el-button type="primary" :class="saveDisabled ? 'disabled' : ''" :disabled="saveDisabled" @click="save_close_event">保存关闭</el-button>
        </div>
    </div>
    <el-dialog v-model="dialog_visible" class="radius-lg" width="650" draggable :close-on-click-modal="false" append-to-body>
        <template #header>
            <div class="title re">
                <div class="middle size-16 fw">基础信息</div>
            </div>
        </template>
        <div class="content pa-20">
            <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="50" status-icon @submit.prevent>
                <el-form-item label="封面">
                    <upload v-model="form.logo" :limit="1"></upload>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称" clearable @keyup.enter="confirm_event(ruleFormRef)" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.describe" placeholder="请输入描述" :rows="4" type="textarea" clearable @keyup.enter="confirm_event(ruleFormRef)" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.is_enable" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="plr-28 ptb-10" @click="dialog_visible = false">取消</el-button>
                <el-button class="plr-28 ptb-10" type="primary" @click="confirm_event(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
const props = defineProps({
    saveDisabled: {
        type: Boolean,
        default: false,
    },
});
const modelValue = defineModel({ type: Object, default: {} });
// #region 变量 --------------------start
const dialog_visible = ref(false);
watch(dialog_visible, (val) => {
    if (val) {
        form.value = {
            logo: modelValue.value.logo.length > 0 ? [{ url: modelValue.value.logo }] : [],
            name: modelValue.value.name,
            describe: modelValue.value.describe,
            is_enable: modelValue.value.is_enable.toString(),
        };
    }
});
const form = ref({
    logo: [] as any[],
    name: '',
    describe: '',
    is_enable: '',
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
    name: [
        { required: true, trigger: 'blur', message: '请输入模版名称' },
        { min: 1, max: 60, message: '名称长度1~60个字符', trigger: 'blur' },
    ],
});
// #endregion 变量 --------------------end

const emit = defineEmits(['formConfig', 'preview', 'save', 'saveClose', 'export', 'import', 'clear']);

// * 点击表单配置时的事件处理函数。
const form_config_event = () => {
    emit('formConfig');
};
//  * 点击预览时的事件处理函数。
const preview_event = () => {
    emit('preview');
};
// 点击仅保存时的事件处理函数。
const save_event = () => {
    emit('save', true);
};
// 点击保存并关闭时的事件处理函数。
const save_close_event = () => {
    emit('saveClose', true);
};

const confirm_event = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            dialog_visible.value = false;
            modelValue.value = {
                ...form.value,
                logo: form.value.logo.length > 0 ? form.value.logo[0].url : '',
            };
        }
        //  else {
        //     console.log('error submit!', fields);
        // }
    });
};
//#region 导出导入清空 --------------------start
const is_dropdown_show = ref(false);
const visible_change = (val: boolean) => {
    is_dropdown_show.value = val;
}
//导出
const export_click = () => {
    emit('export');
};
// 导入
const import_click = () => {
    emit('import');
};
// 清空列表
const clear_click = () => {
    emit('clear');
};
//#endregion
</script>
<style lang="scss" scoped>
.navbar {
    height: 7rem;
    padding: 0 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(231, 231, 231, 0.5);
    position: relative;
    z-index: 1;
    .nav-left {
        flex: 1;
        display: flex;
        align-items: center;
        .name {
            color: #333;
            position: relative;
            .img {
                width: 2.2rem;
                height: 2.2rem;
            }
        }
    }
    .nav-center {
        flex: 1;
        display: flex;
        justify-content: center;
        gap: 3rem;
        color: #333;
        font-size: 1.6rem;
        line-height: 6rem;
        .nav-tabs {
            padding: 1rem 1.8rem 0 1.8rem;
            cursor: pointer;
        }
        .active {
            color: $cr-primary;
            font-weight: 500;
            border-bottom: 0.2rem solid $cr-primary;
        }
    }
    .nav-right {
        flex: 1;
        display: flex;
        justify-content: end;
        gap: 1.2rem;
    }
    .el-button--primary.is-plain {
        --el-button-bg-color: #fff;
    }
    .nav-right-dropdown-button {
        .iconfont {
            color: $cr-main;
        }
        &:hover .iconfont {
            color: #fff;
        }
    }
}
</style>
