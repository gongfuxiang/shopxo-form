<template>
    <div class="mains">
        <!-- 左侧模块 -->
        <div class="siderbar flex-col">
            <el-scrollbar>
                <div class="ptb-5">
                    <el-collapse v-model="activeNames">
                        <div v-for="(com, i) in components" :key="i" class="plr-12">
                            <el-collapse-item v-if="com.data.length > 0" :key="i" :title="com.name" :name="com.key">
                                <VueDraggable v-model="com.data" :animation="500" ghost-class="ghost" handle=".item" :group="{ name: 'people', pull: 'clone', put: false }" class="component flex-row flex-wrap gap-10" :clone="clone_item_com_data" :sort="false" :force-fallback="true">
                                    <div v-for="item in com.data" :key="item.key" class="item" @click.stop="draggable_click(item)">
                                        <div class="tc drag-seat">释放鼠标将组件添加到此处</div>
                                        <div class="flex-row align-c gap-2 drag-hide">
                                            <img class="img radius-xs" :src="url_computer(item.key)" />
                                            <div class="text-line-1">{{ item.name }}</div>
                                        </div>
                                    </div>
                                </VueDraggable>
                            </el-collapse-item>
                        </div>
                    </el-collapse>
                </div>
            </el-scrollbar>
        </div>
        <div class="flex-1 drag-container">
            <el-scrollbar>
                <div class="pa-30">
                    <div class="drag-content flex-row br-f1 radius-xl pa-16">
                        <VueDraggable v-model="diy_data" :animation="500" :touch-start-threshold="2" group="people" class="drag-area re flex-1" ghost-class="ghost" :on-sort="on_sort" :on-start="on_start" :on-end="on_end">
                            <div v-for="(item, index) in diy_data" :key="item.id" class="item" :class="[{ active: item.show_tabs == '1', 'required-error': item.com_data.is_required == '1' && item.com_data.common_config.is_error == '1' }]" @click.stop="on_choose(index, item)">
                                <div v-if="item.show_tabs == '1'" class="oprate">
                                    <div class="icon" @click.stop="set_enable(index)">
                                        <icon :name="`${item.is_enable == '1' ? 'eye' : 'eye-close'}`" size="10"/>
                                    </div>
                                    <span class="divider"></span>
                                    <div class="icon" @click="on_del(index)">
                                        <icon name="del" size="10"></icon>
                                    </div>
                                    <span class="divider"></span>
                                    <div class="icon" @click="on_copy(index, item)">
                                        <icon name="copy" size="10"></icon>
                                    </div>
                                </div>
                                <div>
                                    <!-- 单行文本 -->
                                    <template v-if="item.key == 'single-text'">
                                        <model-input :value="item.com_data"></model-input>
                                    </template>
                                </div>
                            </div>
                        </VueDraggable>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SortableEvent, VueDraggable } from 'vue-draggable-plus';
import { get_math } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash';
import defaultSettings from '../../index';
const app = getCurrentInstance();
const props = defineProps({
    diyData: {
        type: Array<any>,
        default: () => [],
    },
});
const emits = defineEmits(['update-setting']);

// 拖拽数据
const diy_data = ref(props.diyData);
// 监听
watch(
    () => props.diyData,
    (newValue) => {
        debugger;
        diy_data.value = newValue;
    }
);

// siderbar
const activeNames = reactive(['base', 'hight-level', 'extend']);
interface componentsData {
    name: string;
    key: string;
    data: any[];
}
const components = ref<componentsData[]>([
    {
        name: '基础',
        key: 'base',
        data: [
            { name: '单行文本', key: 'single-text', data: [] },
            { name: '多行文本', key: 'multi-text', data: [] },
            { name: '数字', key: 'number', data: [] },
            { name: '日期时间', key: 'date', data: [] },
            { name: '单选按钮组', key: 'radio-btns', data: [] },
            { name: '复选框组', key: 'checkbox', data: [] },
            { name: '下拉框', key: 'select', data: [] },
            { name: '下拉复选框', key: 'select-multi', data: [] },
            { name: '选项卡', key: 'tabs', data: [] },
            { name: '日期时间组', key: 'date-group', data: [] },
        ],
    },
    {
        name: '高级',
        key: 'hight-level',
        data: [
            { name: '上传图片', key: 'upload-img', data: [] },
            { name: '上传附件', key: 'upload-attachments', data: [] },
            { name: '地址', key: 'address', data: [] },
            { name: '定位', key: 'position', data: [] },
            { name: '表单', key: 'form', data: [] },
            { name: '手写签名', key: 'sign', data: [] },
            { name: '手机', key: 'phone', data: [] },
            { name: '选择数据', key: 'data', data: [] },
            { name: '富文本', key: 'rich-text', data: [] },
            { name: '按钮', key: 'btn', data: [] },
            { name: '评分', key: 'score', data: [] },
            { name: '密码', key: 'pwd', data: [] },
        ],
    },
    {
        name: '扩展',
        key: 'extend',
        data: [
            { name: '辅助线', key: 'auxiliary-line', data: [] },
            { name: '文本', key: 'text', data: [] },
            { name: '图片', key: 'img', data: [] },
            { name: '矩形', key: 'rectangle', data: [] },
            { name: '圆形', key: 'round', data: [] },
        ],
    },
]);

// computer
const url_computer = (name: string) => {
    // const new_url = common_store.common.config.attachment_host + `/static/diy/images/layout/siderbar/${name}.png`;
    const new_url = `/src/assets/img/${name}.png`;
    return new_url;
};

// 复制
const clone_item_com_data = (item: commonComponentData) => {
    console.log(item);
    return {
        name: item.name,
        id: get_math(),
        key: item.key,
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
};

//#region 拖拽组件的公共方法
// 是否显示提示用户拖拽位置
const show_model_border = ref(true);
// 点击添加tabs组件
const draggable_click = (item: componentsData) => {
    console.log(item);
    const new_item = {
        ...item,
        id: get_math(),
        show_tabs: '1',
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
    diy_data.value.push(new_item);
    // 设置当前选中的是那个
    set_show_tabs(diy_data.value.length - 1);
};

// 拖拽开始
const on_start = () => {
    show_model_border.value = false;
};
// 拖拽结束
const on_end = () => {
    show_model_border.value = true;
};
// 拖拽排序
const on_sort = (event: SortableEvent) => {
    console.log(event);
    set_show_tabs(event.newIndex || 0);
};
// 选择
const on_choose = (index: number, item: any) => {
    set_show_tabs(index);
};
// 删除
const on_del = (index: number) => {
    app?.appContext.config.globalProperties.$common.message_box('删除后不可恢复，确定继续吗?', 'warning').then(() => {
        // 如果是选项卡被删除，则删除tabs组件，并判断是否有拖拽内容，有的选中第一个，没有的时候，默认选中页面设置
        const show_tabs_index = diy_data.value.findIndex((item: any) => item.show_tabs == '1');
        // 删除的是当前的这个数据
        if (show_tabs_index == index) {
            diy_data.value.splice(index, 1);
            if (diy_data.value.length > 0) {
                let new_index: number = index;
                // 删除的时候如果大于0，则显示上边的数据
                if (index > 0) {
                    new_index = new_index - 1;
                }
                set_show_tabs(new_index);
            }
        } else {
            diy_data.value.splice(index, 1);
        }
    });
};
// 复制
const on_copy = (index: number, item: any) => {
    const new_item = cloneDeep(item);
    new_item.id = get_math();
    new_item.show_tabs = '0';
    diy_data.value.splice(index + 1, 0, new_item);
};
const set_enable = (index: number) => {
    const old_data = get_diy_index_data(index);
    old_data.is_enable = old_data.is_enable == '1' ? '0' : '1';
};
// 获取当前传递过来的index对应的diy_data中的数据
const get_diy_index_data = (index: number) => {
    return (<arrayIndex>diy_data.value)[index.toString()];
};
// 设置当前选中的是那个
const set_show_tabs = (index: number) => {
    diy_data.value.forEach((item, for_index) => {
        // 先将全部的设置为false,再将当前选中的设置为true
        item.show_tabs = '0';
        if (for_index == index) {
            item.show_tabs = '1';
            emits('update-setting', diy_data.value[index]);
        }
    });
};
</script>

<style scoped lang="scss">
.mains {
    flex: 1;
    display: flex;
    height: 100%;
    .siderbar {
        width: 23.4rem;
        background-color: #fff;
        overflow: auto;
        max-height: calc(100vh - 7rem);
        .el-collapse {
            border: 0;
            :deep(.el-collapse-item__wrap) {
                border: 0;
                overflow: unset;
            }
            :deep(.el-collapse-item__header) {
                font-size: 1.4rem;
                border: 0;
            }
            :deep(.el-icon) {
                right: -0.7rem;
            }
        }
        .item {
            width: calc(50% - 0.5rem);
            padding: 0.6rem 0.8rem 0.6rem 1rem;
            background: #f9f9f9;
            border-radius: 0.4rem;
            font-size: 1.2rem;
            line-height: 1.8rem;
            border: 0.1rem solid #e4e7ec;
            cursor: all-scroll;
            .img {
                width: 1.8rem;
                height: 1.8rem;
                border-radius: 0.2rem;
            }
            .drag-seat {
                display: none;
            }
            &:hover {
                border-style: dashed;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            }
        }
    }
    .drag-container {
        max-height: calc(100vh - 7rem);
        .drag-content {
            min-height: 20rem;
            max-width: 100rem;
            background-color: #fff;
            margin: 0 auto;
            .item {
                position: relative;
                padding: 1.8rem 2rem;
                cursor: all-scroll;
                &.active {
                    position: relative;
                    z-index: 1;
                    box-sizing: border-box;
                }
                &.active::before {
                    content: '';
                    width: calc(100% + 0.4rem);
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: -0.2rem;
                    border: 0.2rem solid $cr-main;
                    z-index: 1;
                }
                .oprate {
                    position: absolute;
                    right: 2rem;
                    top: 0.8rem;
                    display: flex;
                    align-items: center;
                    background-color:#f5fbff;
                    border-radius: 15px;
                    color: $cr-primary;
                    z-index: 2;
                    .icon {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        padding: 0.6rem 1.2rem;
                    }
                    .divider {
                        width: 1px;
                        height: 1.2rem;
                        background-color: #e4e7ec;
                    }
                }
            }
        }
        .drag-seat {
            display: inherit;
        }
        .drag-hide {
            display: none;
        }
    }
    .drag-seat {
        background: #f5fbff;
        padding: 1.8rem 2rem;
        border-radius: 12px;
        color: $cr-primary;
    }
}
</style>
