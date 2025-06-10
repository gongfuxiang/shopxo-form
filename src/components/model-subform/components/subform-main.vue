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
                                    <div v-for="item in com.data" :key="item.key" class="item drag-item" @click.stop="draggable_click(item)">
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
            <div class="subform flex-row oh pa-16">
                <div class="row-header flex-col">
                    <div class="head-label"></div>
                    <template v-if="table_list.length > 0">
                        <div v-for="(item, index) in table_list" :key="index" class="flex-1 row-num flex-row align-c jc-c">{{ index + 1 }}</div>
                    </template>
                    <template v-else>
                        <div class="flex-1 row-num">1</div>
                    </template>
                </div>
                <div class="flex-1 scroll-area flex-row">
                    <VueDraggable v-model="diy_data" :animation="500" :touch-start-threshold="2" group="people" :invert-swap="false" class="subform-container drag-area flex-row re" ghost-class="ghost" :on-sort="on_sort">
                        <template v-if="diy_data.length > 0">
                            <div v-for="(item, index) in diy_data" :key="item.id" :class="['subform-item re', { 'active': item.show_tabs == '1' }]" :style="`width: ${ item.com_data.com_width }px;`" @click.stop="on_choose(index, item.show_tabs)">
                                <div v-if="item.show_tabs == '1'" class="oprate">
                                    <div class="icon" @click.stop="set_enable(index)">
                                        <icon :name="`${item.is_enable == '1' ? 'eye' : 'eye-close'}`" size="10"/>
                                    </div>
                                    <span class="divider"></span>
                                    <div class="icon" @click="on_del(index)">
                                        <icon name="del" size="10"></icon>
                                    </div>
                                    <span class="divider"></span>
                                    <div class="icon" @click="on_copy(index)">
                                        <icon name="copy" size="10"></icon>
                                    </div>
                                </div>
                                <div :class="['flex-col jc-c w h', { 'plug-in-close': item.is_enable != '1' }]">
                                    <!-- 头部操作逻辑 -->
                                    <div class="item-label flex-row align-c">
                                        <span v-if="item.com_data.is_required == '1'" class="required">*</span>
                                        {{ item.com_data.title }}
                                        <tooltip v-if="item.com_data.common_config.help_is_show == '1'" :content="item.com_data.common_config.help_explain" :size="common_store.help_icon_size"></tooltip>
                                    </div>
                                    <div v-for="(item1, index1) in table_list" :key="index1" class="flex-1 item-row rendering-area flex-row align-c jc-c">
                                       <subform-rendering :key="index1 + get_math()" v-model="item.com_data" v-model:type="item.key" :value="item1[item.id]"></subform-rendering>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="empty-title">从左侧拖拽来添加字段</div>
                        </template>
                    </VueDraggable>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SortableEvent, VueDraggable } from 'vue-draggable-plus';
import { get_math } from '@/utils';
import { cloneDeep, isEmpty } from 'lodash';
import { commonStore } from "@/store";
const common_store = commonStore();
import defaultSettings from '@/views/layout/index';
const app = getCurrentInstance();
const props = defineProps({
    diyData: {
        type: Array<any>,
        default: () => [],
    },
    value: {
        type: Array<any>,
        default: () => [],
    },
});
const emits = defineEmits(['update-setting']);

// 拖拽数据
const diy_data = ref(props.diyData);
// 监听
watch(() => props.diyData, (newValue) => {
    diy_data.value = newValue;
});

const table_list = ref(props.value);
// watch(() => props.value, (newValue) => {
//     table_list.value = newValue;
// });
watch(() => diy_data.value, (new_val) => {
	if (new_val.length > 0) {
		if (table_list.value.length > 0) {
            const validIds = new Set(new_val.map((item: any) => item.id));
            // 先将新字段填充进去，再判断历史是否存在多余的字段
            new_val.forEach((item: any) => {
                table_list.value.forEach((item1: any) => {
                    if (isEmpty(item1[item.id]) || (!isEmpty(item.com_data.form_value) && item1[item.id] !== item.com_data.form_value)) {
                        item1[item.id] = item.com_data.form_value;
                    }
                });
            });
            // 清理不在 validIds 中的字段：同样使用 map 创建新对象
            table_list.value = table_list.value.map((item1: arrayIndex) => {
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
			table_list.value = [data];
		}
	}
}, { deep: true });
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
            { name: '日期时间组', key: 'date-group', data: [] },
        ],
    },
    {
        name: '高级',
        key: 'hight-level',
        data: [
            { name: '上传图片', key: 'upload-img', data: [] },
            { name: '定位', key: 'position', data: [] },
            { name: '地址', key: 'address', data: [] },
            { name: '密码', key: 'pwd', data: [] },
            { name: '评分', key: 'score', data: [] },
            { name: '上传文件', key: 'upload-attachments', data: [] },
            { name: '上传视频', key: 'upload-video', data: [] },
        ],
    },
    {
        name: '扩展',
        key: 'extend',
        data: [
            { name: '文本', key: 'text', data: [] },
            { name: '图片', key: 'img', data: [] },
            { name: '视频', key: 'video', data: [] },
            { name: '文件', key: 'attachments', data: [] },
        ],
    },
]);

// computer
const url_computer = (name: string) => {
    const new_url = `/src/assets/img/${name}.png`;
    return new_url;
};

// 复制
const clone_item_com_data = (item: commonComponentData) => {
    return {
        name: item.name,
        id: get_math(),
        mark_name: '',
        location: { x: 0, y: 0, record_x: 0, record_y: 0, staging_y: 0 },
        show_tabs: '1',
        is_enable: '1',
        key: item.key,
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
};

//#region 拖拽组件的公共方法
// 点击添加tabs组件
const draggable_click = (item: componentsData) => {
    const new_item = {
        name: item.name,
        id: get_math(),
        mark_name: '',
        location: { x: 0, y: 0, record_x: 0, record_y: 0, staging_y: 0 },
        show_tabs: '1',
        is_enable: '1',
        key: item.key,
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
    diy_data.value.push(new_item);
    // 设置当前选中的是那个
    set_show_tabs(diy_data.value.length - 1);
};
// 拖拽排序
const on_sort = (event: SortableEvent) => {
    set_show_tabs(event.newIndex || 0);
};
// 选中时候的效果
const on_choose = (index: number, show_tabs: string) => {
    // 如果已经选中了, 设置为不可再次触发事件
    if (show_tabs != '1') {
        // 设置对应的位置为显示
        set_show_tabs(index);
    }
};
// 是否启用
const set_enable = (index: number) => {
    const old_data = get_diy_index_data(index);
    old_data.is_enable = old_data.is_enable == '1' ? '0' : '1';
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
const on_copy = (index: number) => {
    // 获取当前数据, 复制的时候id更换一下
    const new_data = {
        ...cloneDeep(get_diy_index_data(index)),
        id: get_math(),
    };
    // 在当前位置下插入数据
    diy_data.value.splice(index, 0, new_data);
    set_show_tabs(index + 1);
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
            emits('update-setting', item, diy_data.value);
        }
    });
};
// 暴露出去的数据，避免跟外部数据双向绑定，点击保存的时候才会保存数据
defineExpose({
    diy_data,
    table_list,
});
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
        max-width: calc(100% - 23.4rem);
        max-height: calc(100vh - 7rem);
        display: flex;
        align-items: center;
        justify-content: center;
        .subform {
            max-width: 90%;
            width: 100%;
            // height: 100%;
            background: #fff;
            overflow: hidden;
            .row-header {
                padding-bottom: 1rem;
                overflow-x: scroll;
                .head-label {
                    background: #f0f1f4;
                    border: 0.1rem solid #e6e8ed;
                    border-top-left-radius: 0.3rem;
                    width: 7.8rem;
                    height: 3.5rem;
                }
                .row-num {
                    text-align: center;
                    background: #fff;
                    border: 0.1rem solid #e6e8ed;
                    border-top: 0;
                    width: 7.8rem;
                    min-height: 4rem;
                    line-height: 4rem;
                    position: relative;
                }
                .row-num:last-child {
                    border-bottom-left-radius: 0.3rem;
                }
            }
            .subform-item {
                &.active {
                    position: relative;
                    z-index: 1;
                }
                &.active::before { 
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border: 0.1rem dotted var(--color-main);
                    z-index: 2;
                }
                .item-label {
                    height: 3.5rem;
                    padding: 0.5rem;
                    background: #f0f1f4;
                    font-size: 1.4rem;
                    color: #141E31;
                    border: 0.1rem solid #e6e8ed;
                    border-left: 0;
                }
                .item-row { 
                    padding: 0.5rem;
                    min-height: 4rem;
                    border: 0.1rem solid #e6e8ed;
                    border-left: 0;
                    border-top: 0;
                }
            }
            .empty-title {
                width: 16rem;
                height: 100%;
                font-size: 1.4rem;
                color: #838892;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 0.1rem solid #e6e8ed;
                border-left: 0;
                border-top-right-radius: 0.3rem;
                border-bottom-right-radius: 0.3rem;
            }
            .scroll-area {
                padding-bottom: 1rem;
                overflow-x: scroll;
                .oprate {
                    position: absolute;
                    right: 0.5rem;
                    top: 0.5rem;
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
                        padding: 0.3rem 0.6rem;
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
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .drag-hide {
            display: none;
        }
    }
    .drag-seat {
        min-width: 18rem;
        height: 100%;
        padding: 0;
        padding-bottom: 1rem;
        border-radius: 4px;
        background: #f5fbff;
        color: $cr-primary;
    }
}
.plug-in-close::before {
    position: absolute;
    content: '\5DF2\9690\85CF';
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
