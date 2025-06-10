<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb">标题<div class="new_desc">文本</div></div>
                <el-input v-model="form.title" placeholder="请输入标题" clearable @change="operation_end"></el-input>
            </div>
        </el-form-item>
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">默认值</div>
                <el-button class="w custom-button size-14" :disabled="form.children.length <= 0" @click="set_default"><icon name="edit" size="14"></icon>设置默认值</el-button>
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
                <div class="new_title">子字段</div>
                <template v-if="form.children.length > 0">
                    <drag class="w" :data="form.children" is-show-copy :space-col="20" @remove="remove" @copy="copy" @on-sort="on_sort">
                        <template #default="{ row }">
                            <el-input v-model="row.com_data.title"></el-input>
                        </template>
                    </drag>
                </template>
                <template v-else>
                    <span class="size-12 cr-6">暂无数据, 请点击下方添加子字段添加数据或者点击表单编辑配置详细数据</span>
                </template>
                <el-dropdown trigger="click" max-height="300px" placement="bottom-start" @visible-change="input_value = ''">
                    <el-button class="dialog-add"><icon name="xzdz-tianjiabiaoq" size="14" color="#2a94ff"/><span class="ml-5">添加子字段</span></el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-input v-model="input_value" class="plr-10 pb-4" placeholder="搜索" :prefix-icon="Search" />
                            <el-dropdown-item v-for="item in children_List.filter(item => item.name.includes(input_value))" :key="item.key" @click="dropdown_click(item)">{{ item.name }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-form-item>
        <el-button class="w custom-button size-14 mb-18" @click="custom_edit"><icon name="edit" size="14"></icon>表单编辑</el-button>
        <help-config class="mb-18" :value="form.common_config" />
        <subform-dialog v-model:visible="subform_visible" :value="form" @accomplish="accomplish"></subform-dialog>
        <subform-default-dialog v-model:visible="subform_default_visible" :value="form" @submit="submit"></subform-default-dialog>
    </el-form>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { get_math } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash'
import defaultSettings from '@/views/layout/index';
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    modelId: {
        type: String,
        default: '',
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = ref(props.value);// 判断配置项是否有误

const emit = defineEmits(['operation_end']);
const operation_end = () => {
    emit('operation_end');
};
const subform_visible = ref(false);
const custom_edit = () => {
    subform_visible.value = true;
};
// 点击完成之后将值赋值回来
const accomplish = (children: any[], value: any[]) => {
    form.value.children = children;
    form.value.form_value = value;
    subform_visible.value = false;
};
// 默认值点击确定的时候修改数据
const submit = (val: any) => {
    form.value.form_value = val;
};
//#region 子字段数据操作
const input_value = ref('');
const children_List = [
    { name: '单行文本', key: 'single-text', data: [] },
    { name: '多行文本', key: 'multi-text', data: [] },
    { name: '数字', key: 'number', data: [] },
    { name: '日期时间', key: 'date', data: [] },
    { name: '单选按钮组', key: 'radio-btns', data: [] },
    { name: '复选框组', key: 'checkbox', data: [] },
    { name: '下拉框', key: 'select', data: [] },
    { name: '下拉复选框', key: 'select-multi', data: [] },
    { name: '日期时间组', key: 'date-group', data: [] },
    { name: '上传图片', key: 'upload-img', data: [] },
    { name: '定位', key: 'position', data: [] },
    { name: '地址', key: 'address', data: [] },
    { name: '密码', key: 'pwd', data: [] },
    { name: '评分', key: 'score', data: [] },
    { name: '上传文件', key: 'upload-attachments', data: [] },
    { name: '上传视频', key: 'upload-video', data: [] },
    { name: '文本', key: 'text', data: [] },
    { name: '图片', key: 'img', data: [] },
    { name: '视频', key: 'video', data: [] },
    { name: '文件', key: 'attachments', data: [] },
]
const dropdown_click = (item: { name: string; key: string }) => {
    const new_item = {
        name: item.name,
        id: get_math(),
        mark_name: '',
        location: { x: 0, y: 0, record_x: 0, record_y: 0, staging_y: 0 },
        show_tabs: '0',
        is_enable: '1',
        key: item.key,
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
    form.value.children.push(new_item);
    // 添加新字段后，可填数据也需要更新
    const new_val = cloneDeep(form.value.children);
    if (form.value.form_value.length > 0) {
        const validIds = new Set(new_val.map((item: any) => item.id));
        // 先将新字段填充进去，再判断历史是否存在多余的字段
        new_val.forEach((item: any) => {
            form.value.form_value.forEach((item1: any) => {
                if (isEmpty(item1[item.id])) {
                    item1[item.id] = item.com_data.form_value;
                }
            });
        });
        // 清理不在 validIds 中的字段：同样使用 map 创建新对象
        form.value.form_value = form.value.form_value.map((item1: arrayIndex) => {
            const newItem: arrayIndex = {};
            Object.keys(item1).forEach((key) => {
                if (validIds.has(key)) {
                    newItem[key] = item1[key];
                }
            });
            return newItem;
        });
    } else {
        const data = new_val.map((item: any) => {
            const obj = {
                [item.id]: item.com_data.form_value
            };
            return obj;
        });
        form.value.form_value = [data];
    }
};
// 删除数据
const remove = (index: number) => {
    form.value.children.splice(index, 1);
};
// 复制数据
const copy = (index: number) => {
    // 获取当前数据, 复制的时候id更换一下
    const new_data = {
        ...cloneDeep(form.value.children[index]),
        id: get_math(),
    };
    // 在当前位置下插入数据
    form.value.children.splice(index, 0, new_data);
}
// 拖拽的时候返回的数据
const on_sort = (val: any) => {
    form.value.children = val;
};
//#endregion
//#region 设置默认值
const subform_default_visible = ref(false);
const set_default = () => { 
    subform_default_visible.value = true;
};
//#endregion
</script>

<style scoped lang="scss"> 
.custom-button {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0; /* 固定在底部 */
  background-color: white; /* 设置背景色以避免按钮看不见 */
  z-index: 1000; /* 确保按钮在其他内容之上 */
  width: 100%; /* 确保按钮宽度占满父容器 */
  padding: 1rem; /* 添加一些内边距 */
}
:deep(.el-dialog) {
    margin-top: 0;
    padding: 0;
    overflow: hidden;
    .el-dialog__header {
        padding: 2.3rem 2rem;
        .el-dialog__title {
            font-size: 16px;
        }
        .el-dialog__headerbtn {
            font-size: 2.4rem;
            padding: 2rem;
            height: auto;
            width: auto;
        }
    }
    .el-dialog__body {
        background: #f5f5f5;
        height: calc(100% - 15rem);
    }
    .el-dialog__footer {
        padding: 2.4rem 3rem;
    }
}
.dialog-add {
    background: #fff;
    text-align: center;
    font-size: 1.2rem;
    height: 2.4rem;
    width: 10rem;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    &:focus-visible {
        outline: none !important;
    }
}
</style>
