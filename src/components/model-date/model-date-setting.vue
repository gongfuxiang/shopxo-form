<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">FROM名称<span class="required">*</span></div><div class="new_desc">日期时间</div></div>
                <form-name :value="all_form_value.form_name" :model-id="all_form_value.id" :is-subform="isSubform" :subform-list="subformList" @name_change="name_change"></form-name>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">标题<span class="required">*</span></div></div>
                <el-input v-model="form.title" placeholder="请输入标题" @change="title_change"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">提示文字</div>
                <el-input v-model="form.placeholder" placeholder="请输入提示文字" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">样式</div>
                <el-select v-model="form.date_style" value-key="id" filterable placeholder="请选择输入格式">
                    <el-option v-for="item in style_option" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">类型</div>
                <el-select v-model="form.date_type" value-key="id" filterable placeholder="请选择输入格式">
                    <el-option v-for="option in date_style_options(form.date_style)" :key="option.value" :label="option.label" :value="option.value" />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">默认值</div>
                <template v-if="['option1', 'option2'].includes(form.date_type)">
                    <div class="re w h">
                        <el-time-picker ref="el_time" v-model="form.form_value" class="model-date" clearable placeholder="" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                        <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                    </div>
                </template>
                <template v-else>
                    <div class="re w h">
                        <el-date-picker ref="el_time" v-model="form.form_value" class="model-date" :type="form.date_type == 'option3' ? 'month' : form.date_type == 'option4' ? 'date' : 'datetime'" clearable placeholder="" :value-format="date_style_format" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                        <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                    </div>
                </template>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">校验</div>
                <div><el-checkbox v-model="form.is_required" label="必填" true-value="1" false-value="0" /></div>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">图标</div>
                <upload v-model:icon-value="form.icon_name" is-icon type="icon" :limit="1" size="50"></upload>
            </div>
        </el-form-item>
        <border-config class="mb-18" :value="form.common_config" />
        <help-config class="mb-18" :value="form.common_config" />
        <template v-if="isSubform">
            <subform-width v-model="form.com_width"></subform-width>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import { date_style_options } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash';

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isSubform: {
        type: Boolean,
        default: false,
    },
    subformList: {
        type: Array,
        default: () => ([]),
    },
    allValue: {
        type: Object,
        default: () => {},
    }
});
const all_form_value = ref(props.allValue);
const form = ref(props.value);// 判断配置项是否有误
//#region 标题更新时的修改
const old_title = ref(cloneDeep(form.value.title));
const title_change = () => {
    if (isEmpty(form.value.title)) {
        form.value.title = old_title.value;
    }
};
//#endregion
const style_option = [
    { name: 'YYYY-MM-DD HH:mm:ss', value: 'horizontal' },
    { name: 'YYYY/MM/DD HH:mm:ss', value: 'slash' },
    { name: 'YYYY年MM月DD日 HH时mm分ss秒', value: 'chinese' }
];
const date_style_format = computed(() => {
    const data = new Map(date_style_options(form.value.date_style).map(item => [item.value, item]));
    return data.get(form.value.date_type)?.label || 'YYYY-MM-DD HH:mm:ss';
});
//#region 时间选择器内容出现
const is_time_icon_show = ref(true);
const time_focus = () => {
    if (!isEmpty(form.value.form_value)) {
        is_time_icon_show.value = false;
    } else {
        is_time_icon_show.value = true;
    }
};

const time_blur = () => {
    is_time_icon_show.value = true;
};
const el_time = ref<any>(null);
const custom_icon_click = () => {
    if (el_time.value) {
        if (!isEmpty(form.value.form_value)) {
            is_time_icon_show.value = false;
        } else {
            is_time_icon_show.value = true;
        }
        el_time.value.focus();
    }
};
//#endregion
const name_change = (val: string) => {
    all_form_value.value.form_name = val;
}

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
</script>

<style scoped lang="scss">
:deep(.model-date) {
    width: 100% !important;
    .el-input__prefix {
        position: absolute;
        top: 0;
        right: 0;
        display: none;
    }
}
.custom-icon {
    position: absolute;
    top: 50%;
    max-height: 16px;
    z-index: 1;
    right: 1rem;
    background: #fff;
    transform: translateY(-50%);
}
</style>
