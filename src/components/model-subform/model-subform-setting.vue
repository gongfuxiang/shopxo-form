<template>
    <el-form :model="form" label-width="40" label-position="left" @submit.prevent>
        <!-- <div class="mb-10 fw">内容设置</div> -->
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title flex-row align-c jc-sb"><div class="flex-row">FROM名称<span class="required">*</span></div><div class="new_desc">子表单</div></div>
                <form-name :value="all_form_value.form_name" :model-id="all_form_value.id" @name_change="name_change"></form-name>
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
                <div class="new_title">默认值</div>
                <el-button class="w custom-button size-14" :disabled="default_children.length <= 0" @click="set_default"><icon name="edit" size="14"></icon>设置默认值</el-button>
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
                    <drag class="w" :data="form.children" is-show-copy :space-col="20" @remove="remove" @copy="copy" @on-sort="on_sort" @on_show_or_hidden="on_show_or_hidden">
                        <template #default="{ row }">
                            <el-input v-model="row.com_data.title"></el-input>
                        </template>
                    </drag>
                </template>
                <template v-else>
                    <span class="size-12 cr-6">暂无数据, 请点击下方添加子字段添加数据或者点击表单编辑配置详细数据</span>
                </template>
                <el-dropdown trigger="click" max-height="300px" placement="bottom-start" @visible-change="input_value = ''">
                    <el-button class="dialog-add"><icon name="add-wide" size="14" color="#2a94ff"/><span class="ml-5">添加子字段</span></el-button>
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
        <el-form-item label-width="0">
            <div class="flex-col gap-10 w h">
                <div class="new_title">子表单展示样式</div>
                <div class="flex-col gap-10 w h">
                    <el-radio-group v-model="form.subform_type" class="custom-radio-group">
                        <el-radio-button value="computer">电脑端</el-radio-button>
                        <el-radio-button value="mobile">移动端</el-radio-button>
                    </el-radio-group>
                    <template v-if="form.subform_type == 'computer'">
                        <el-row>
                            <el-col :span="8">
                                <el-checkbox v-model="form.computer.is_fixed" true-value="1" false-value="0">
                                    固定前
                                </el-checkbox>
                            </el-col>
                            <el-col :span="16">
                                <el-select v-model="form.computer.fixed_num" :disabled="form.computer.is_fixed == '0'" class="w" value-key="id" filterable>
                                    <el-option v-for="item in fixed_option" :key="item.value" :label="item.name" :value="item.value" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-else>
                        <div class="flex-col gap-10">
                            <el-radio-group v-model="form.mobile.arrange" @change="operation_end">
                                <el-radio value="direction">纵向平铺显示</el-radio>
                                <el-radio value="horizontal">横向表格显示</el-radio>
                            </el-radio-group>
                            <template v-if="form.mobile.arrange === 'horizontal'">
                                <el-row>
                                    <el-col :span="8">
                                        <el-checkbox v-model="form.mobile.is_fixed" true-value="1" false-value="0">
                                            固定前
                                        </el-checkbox>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-select v-model="form.mobile.horizontal_fixed_num" :disabled="form.mobile.is_fixed == '0'" class="w" value-key="id" filterable>
                                            <el-option v-for="item in fixed_option" :key="item.value" :label="item.name" :value="item.value" />
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </template>
                            <template v-else>
                                <div class="flex-col gap-10">
                                    <span class="size-12 cr-6 flex-row gap-10">数据收起时显示的简报<tooltip content="简报不显示图片、视频、上传、富文本、密码、辅助线等"></tooltip></span>
                                    <el-select v-model="form.mobile.direction_fixed" value-key="id" filterable>
                                        <el-option v-for="item in direction_fixed_option" :key="item.value" :label="item.name" :value="item.value" />
                                    </el-select>
                                    <template v-if="form.mobile.direction_fixed == 'custom'">
                                        <el-select v-model="form.mobile.briefing_field" multiple :multiple-limit="3" popper-class="custom-select" placeholder="请选择简报字段，最多3个" @focus="input_value3 = ''">
                                            <template #header>
                                                <el-input v-model="input_value3" class="search-select-input" placeholder="搜索" :prefix-icon="Search" size="large" />
                                            </template>
                                            <el-checkbox-group :model-value="form.mobile.briefing_field" :max="3">
                                                <el-option v-for="item in form.children.filter((item1: any) => item1.com_data.title.includes(input_value3) && item1.is_enable == '1' && !['video', 'img', 'auxiliary-line', 'upload-video', 'upload-attachments', 'upload-img', 'rich-text'].includes(item1.key))" :key="item.id" :value="item.id" :label="item.com_data.title">
                                                    <el-checkbox :value="item.id" :label="item.com_data.title">{{ item.com_data.title }}</el-checkbox>
                                                </el-option>
                                            </el-checkbox-group>
                                            <!-- 选中之后的效果 -->
                                            <template #tag>
                                                <div class="text-line-1 size-12 cr-6">{{ selected_names }}</div>
                                            </template>
                                        </el-select>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </template> 
                </div>
            </div>
        </el-form-item>
        <subform-dialog v-model:visible="subform_visible" :value="form" @accomplish="accomplish"></subform-dialog>
        <subform-default-dialog v-model:visible="subform_default_visible" :value="form" @submit="submit"></subform-default-dialog>
    </el-form>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { get_math } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash'
import defaultSettings from '@/views/layout/index';
const app = getCurrentInstance();
const fixed_option = [
    { name: '一列', value: 1 },
    { name: '两列', value: 2 },
    { name: '三列', value: 3 },
    { name: '四列', value: 4 }
]
const direction_fixed_option = [
    { name: '自定义', value: 'custom' },
    { name: '前3个字段的值', value: 'the_first_three' },
];
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isCustom: {
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
const default_children = computed(() => form.value.children.filter((item: any) => item.is_enable === '1'));
const old_title = ref(cloneDeep(props.value.title));
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
    // 将选中的数据改为0，下次进来重新选择
    form.value.children = children.map((item: any) => {
        return {
            ...item,
            show_tabs: 0,
        }
    });
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
    const new_id = get_math();
    const new_item = {
        name: item.name,
        id: new_id,
        form_name: new_id,
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
    app?.appContext.config.globalProperties.$common.message_box('删除后不可恢复，确定继续吗?', 'warning').then(() => {
        form.value.children.splice(index, 1);    
    });
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
const on_show_or_hidden = (index: number) => {
    form.value.children.forEach((item : { is_enable: string}, index1: number) => {
        if (index1 === index) {
            item.is_enable = item.is_enable == '1' ? '0' : '1';
        }
    });
};
//#endregion
//#region 设置默认值
const subform_default_visible = ref(false);
const set_default = () => { 
    subform_default_visible.value = true;
};
const title_change = () => {
    if (isEmpty(form.value.title)) {
        form.value.title = old_title.value;
    }
};
//#endregion
//#region 手机端字段显示
const input_value3 = ref('');
const selected_names = computed(() => {
    const optionList = form.value?.children || [];
    const formValue = form.value.mobile.briefing_field || [];

    const valueSet = new Set(formValue);
    return optionList
    .filter((item: { id: string }) => valueSet.has(item.id))
    .map((item: { com_data: { title: string } }) => item.com_data.title)
    .join(',');
});
watch(() => form.value.children, (val) => {
    // 过滤出来可以选中的字段
    const new_data = form.value.children.filter((item1: any) => item1.is_enable == '1' && !['video', 'img', 'auxiliary-line', 'upload-video', 'upload-attachments', 'upload-img', 'rich-text'].includes(item1.key));
    const formValue = cloneDeep(form.value?.mobile?.briefing_field || []);
    // 判断历史的是否被删除或者隐藏，去除之后过滤出来剩余的数量
    form.value.mobile.briefing_field = new_data.filter((item: { id: string}) => formValue.includes(item.id)).map((item: { id:string }) => item.id);
}, {immediate: true, deep: true})
//#endregion
const name_change = (val: string) => {
    all_form_value.value.form_name = val;
}
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
.custom-radio-group {
    background: #F3F3F3;
    border-radius: 4px;
    padding: 0.2rem;

    .el-radio-button {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .el-radio-button.is-active {
        height: 100%;
        background: #fff !important;
        :deep(.el-radio-button__inner) {
            color: #2A94FF !important;
        }
    }

    :deep(.el-radio-button__inner) {
        text-align: center;
        font-weight: 400;
        border: 0;
        color: #000 !important;
        box-shadow: none !important;
        background-color: transparent !important;
    }
}
.search-input, .search-select-input {
    :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
    }
}
</style>
