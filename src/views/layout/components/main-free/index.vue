<template>
    <div class="mains">
        <!-- 左侧模块 -->
        <div class="siderbar flex-col">
            <el-scrollbar>
                <div class="ptb-5">
                    <el-collapse v-model="activeNames">
                        <div v-for="(com, i) in components" :key="i" class="plr-12">
                            <el-collapse-item v-if="com.data.length > 0" :key="i" :title="com.name" :name="com.key">
                                <div class="component flex-row flex-wrap gap-10">
                                    <div v-for="item in com.data" :key="item.key" class="item" draggable="true" @dragstart="dragStart(item, $event)" @dragend="dragEnd" @click.stop="draggable_click(item)">
                                        <div class="tc drag-seat">释放鼠标将组件添加到此处</div>
                                        <div class="flex-row align-c gap-2 drag-hide">
                                            <img class="img radius-xs" :src="url_computer(item.key)" />
                                            <div class="text-line-1">{{ item.name }}</div>
                                        </div>
                                    </div>
                                </div>
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
                        <!-- 拖拽区 -->
                        <div class="model-drag">
                            <div class="model-wall">
                                <div ref="imgBoxRef" class="drag-area re dropzone" @dragover.prevent @dragenter.prevent @drop="drop">
                                    <div class="w h" @mousedown.prevent="start_drag" @mousemove.prevent="move_drag" @mouseup.prevent="end_drag">
                                        <DraggableContainer v-if="draggable_container" style="z-index: 0" :reference-line-visible="true" :disabled="false" reference-line-color="#ddd" @selectstart.prevent @contextmenu.prevent @dragstart.prevent>
                                            <Vue3DraggableResizable v-for="(item, index) in diy_data" :key="item.id" v-model:w="item.com_data.com_width" v-model:h="item.com_data.com_height" :min-w="0" :min-h="0" :class="{ 'plug-in-show-component-line': is_show_component_line, 'plug-in-show-tabs': item.show_tabs == '1', 'vdr-handle-z-index': item.com_data.bottom_up == '1' }" :style="{ 'z-index': diy_data.length - 1 - index }" :init-w="item.com_data.com_width" :init-h="item.com_data.com_height" :x="item.location.x" :y="item.location.y" :parent="true" :draggable="is_draggable" @mousedown.stop="on_choose(index, item.show_tabs)" @click.stop="on_choose(index, item.show_tabs)" @drag-end="dragEndHandle($event, index)" @resizing="resizingHandle($event, item.key, index)" @resize-end="resizingHandle($event, item.key, index)">
                                                <div :class="['main-content', { 'plug-in-border': item.show_tabs == '1' }]">
                                                    <!-- 单行文本 -->
                                                    <template v-if="item.key == 'single-text'">
                                                        <model-input :value="item.com_data"></model-input>
                                                    </template>
                                                </div>
                                            </Vue3DraggableResizable>
                                        </DraggableContainer>
                                        <div ref="areaRef" class="area" :style="init_drag_style"></div>
                                    </div>
                                    <div v-for="(item, index) in hot_list.data" :key="index" class="area-box" :style="rect_style(item.drag_start, item.drag_end)" @mousedown.stop="start_drag_area_box(index, $event)" @dblclick="dbl_drag_event(item, index)">
                                        <div class="del-btn" @click.stop="del_area_event(index)"><icon name="close"></icon></div>
                                        <div class="drag-btn drag-tl" :data-index="index" @mousedown.stop="start_drag_btn_tl(index, $event)"></div>
                                        <div class="drag-btn drag-tc" :data-index="index" @mousedown.stop="start_drag_btn_tc(index, $event)"></div>
                                        <div class="drag-btn drag-lc" :data-index="index" @mousedown.stop="start_drag_btn_lc(index, $event)"></div>
                                        <div class="drag-btn drag-bl" :data-index="index" @mousedown.stop="start_drag_btn_bl(index, $event)"></div>
                                        <div class="drag-btn drag-bc" :data-index="index" @mousedown.stop="start_drag_btn_bc(index, $event)"></div>
                                        <!-- 已完成 -->
                                        <div class="drag-btn drag-br" :data-index="index" @mousedown.stop="start_drag_btn_br(index, $event)"></div>
                                        <div class="drag-btn drag-rc" :data-index="index" @mousedown.stop="start_drag_btn_rc(index, $event)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
watch(() => props.diyData, (newValue) => {
    diy_data.value = newValue;
});

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
            { name: '视频', key: 'video', data: [] },
            { name: '文件', key: 'attachments', data: [] },
            { name: '矩形', key: 'rectangle', com_data: [] },
            { name: '圆形', key: 'round', com_data: [] },
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
const clone_item_data = (item: commonComponentData) => {
    return {
        name: item.name,
        id: get_math(),
        location: { x: 0, y: 0, record_x: 0, record_y: 0, staging_y: 0 },
        key: item.key,
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
};

//#region 组件边线相关
const is_show_component_line = ref(false);
const show_computer_line = () => {
    is_show_component_line.value = !is_show_component_line.value;
    // set_show_tabs(0);
    cancel();
};
//#endregion
//#region 拖拽组件的公共方法
// 是否显示提示用户拖拽位置
const center_height = defineModel('height', { type: Number, default: 0 });
const center_width = defineModel('width', { type: Number, default: 390 });

const drag_area_height = computed(() => center_height.value + 'px');
const drag_area_width = computed(() => center_width.value + 'px');

const draggable_container = ref(true);
let data = reactive<any[]>([]);
const show_model_border = ref(true);

//#region 左侧拖拽过来的处理
const hot_list = reactive({ data: [] as hotListData[] });
const hot_list_index = ref(0);
let draggedItem = ref<any>({});
// 点击添加tabs组件
const draggable_click = (item: componentsData) => {
    const new_item = {
        ...item,
        id: get_math(),
        location: { x: 0, y: 0, record_x: 0, record_y: 0, staging_y: 0 },
        show_tabs: '1',
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
    diy_data.value.push(new_item);
    // 设置当前选中的是那个
    set_show_tabs(diy_data.value.length - 1);
};
// 拖拽开始
const dragStart = (item: any, event: any) => {
    // 初始化拖拽的数据
    draggedItem.value = {
        show_tabs: '1',
        location: { x: 0, y: 0, record_x: 0, record_y: 0, staging_y: 0 },
        id: get_math(),
        key: item.key,
        com_data: cloneDeep((defaultSettings as any)[item.key.replace(/-/g, '_')]),
    };
    // 拖拽的时候清空热区
    hot_list.data = [];
};
// 拖拽结束
const dragEnd = () => {
    draggedItem.value = {};
};
// 拖拽
const drop = (event: any) => {
    if (draggedItem.value) {
        const com_width = draggedItem.value.com_data.com_width;
        const com_height = draggedItem.value.com_data.com_height;
        let location_x = event.offsetX;
        let location_y = event.offsetY;
        // 使用新函数调整位置
        const { x: adjustedX, y: adjustedY } = adjustPosition(location_x, location_y, com_width, com_height, 390, center_height.value);
        // 计算存在多少个相同的key
        const list = diy_data.value.filter((item) => item.key == draggedItem.value.key);
        const newItem = {
            ...draggedItem.value,
            new_name: list.length > 0 ? draggedItem.value.name + list.length : draggedItem.value.name, // 默认添加别名
            location: {
                x: adjustedX,
                y: adjustedY,
                record_x: adjustedX,
                record_y: adjustedY,
                staging_y: adjustedY,
            },
        };
        // 因为修改层级之后z-index是递减的，所以新添加的元素，需要添加到头部
        diy_data.value.unshift(newItem);
        // 选中第0个
        set_show_tabs(0);
    }
};

const select_index = ref<null | number>(null);
const imgBoxRef = ref<HTMLElement | null>(null);
const rect_start = ref<rectCoords>({ x: 0, y: 0, width: 0, height: 0 });
const rect_end = ref<rectCoords>({ x: 0, y: 0, width: 0, height: 0 });
const areaRef = ref<HTMLElement | null>(null);
const init_drag_style = ref('');
const is_draggable = ref(true);
// 拖拽生成盒子的开关
const drag_bool = ref(false);
// 拖拽盒子的开关
const drag_box_bool = ref(false);
// 拖拽放大缩小盒子的开关
const drag_box_scale_bool = ref(false);
// 开始拖拽生成时的坐标
const start_drag = (event: MouseEvent) => {
    drag_bool.value = true;
    if (!imgBoxRef.value) return;
    rect_start.value.x = rect_start.value.x != 0 ? rect_start.value.x : event.clientX - imgBoxRef.value.getBoundingClientRect().left;
    rect_start.value.y = rect_start.value.y != 0 ? rect_start.value.y : event.clientY - imgBoxRef.value.getBoundingClientRect().top;
    rect_start.value.width = 0;
    rect_start.value.height = 0;
};
// 拖动中
const move_drag = (event: MouseEvent) => {
    if (drag_bool.value) {
        if (!imgBoxRef.value) return;
        rect_end.value.x = event.clientX - imgBoxRef.value.getBoundingClientRect().left;
        rect_end.value.y = event.clientY - imgBoxRef.value.getBoundingClientRect().top;
        rect_end.value.width = rect_end.value.x - rect_start.value.x > 0 ? rect_end.value.x - rect_start.value.x : 0;
        rect_end.value.height = rect_end.value.y - rect_start.value.y > 0 ? rect_end.value.y - rect_start.value.y : 0;
        if (rect_end.value.width > 5 && rect_end.value.height > 5) {
            hot_list.data = [];
        }
        init_drag_style.value = `left: ${rect_start.value.x}px;top: ${rect_start.value.y}px;width: ${Math.max(rect_end.value.width, 1)}px;height: ${Math.max(rect_end.value.height, 1)}px;display: flex;`;
    }
};
const area_box_point = ref({ x: 0, y: 0 });
// area-box
const dbl_drag_event = (item: hotListData, index: number) => {
    hot_list_index.value = index;
};
// 开始拖拽生成的热区时候
const start_drag_area_box = (index: number, event: MouseEvent) => {
    hot_list_index.value = index;
    event.stopPropagation();
    drag_box_bool.value = true;
    let clone_drag_start = cloneDeep(hot_list.data[hot_list_index.value].drag_start);
    let clone_drag_end = cloneDeep(hot_list.data[hot_list_index.value].drag_end);
    // 记录原始位置
    area_box_point.value = {
        x: clone_drag_start.x - event.clientX,
        y: clone_drag_start.y - event.clientY,
    };
    is_draggable.value = false;
    // 当前选中区域包含的内容
    const rect1 = { x: clone_drag_start.x, y: clone_drag_start.y, width: clone_drag_end.width, height: clone_drag_end.height };
    diy_data.value.forEach((item) => {
        const rect2 = { x: item.location.x, y: item.location.y, width: item.com_data.com_width, height: item.com_data.com_height };
        // 如果交集或者包裹，返回为1，否则为0
        item.is_hot = isRectangleIntersecting(rect1, rect2);
    });

    // 当子元素拖拽方法触发后父元素方法不触发
    document.onmousemove = (areaBoxEvent) => {
        // areaBoxEvent.stopPropagation();
        if (drag_box_bool.value) {
            if (!imgBoxRef.value) return;
            const new_coordinate = {
                x: areaBoxEvent.clientX + area_box_point.value.x,
                y: areaBoxEvent.clientY + area_box_point.value.y,
            };
            // 左上边界判断
            if (new_coordinate.x < 0) {
                new_coordinate.x = 0;
            }
            if (new_coordinate.y < 0) {
                new_coordinate.y = 0;
            }
            // 右下边界判断
            if (new_coordinate.x + Math.max(clone_drag_end.width, 1) > imgBoxRef.value.getBoundingClientRect().width) {
                new_coordinate.x = imgBoxRef.value.getBoundingClientRect().width - Math.max(clone_drag_end.width, 1);
            }
            if (new_coordinate.y + Math.max(clone_drag_end.height, 1) > imgBoxRef.value.getBoundingClientRect().height) {
                new_coordinate.y = imgBoxRef.value.getBoundingClientRect().height - Math.max(clone_drag_end.height, 1);
            }
            // 计算鼠标移动的距离
            const move_x = new_coordinate.x - clone_drag_start.x;
            const move_y = new_coordinate.y - clone_drag_start.y;
            // 遍历对象,包裹在区域内部的拖拽距离更新
            diy_data.value.forEach((item) => {
                if (item.is_hot == '1') {
                    // 只更新交集和包裹中的数据
                    let { record_x, record_y } = cloneDeep(item.location);
                    item.location.x = Math.max(0, record_x + move_x);
                    item.location.y = Math.max(0, record_y + move_y);
                }
            });
            hot_list.data[hot_list_index.value].drag_start.x = new_coordinate.x;
            hot_list.data[hot_list_index.value].drag_start.y = new_coordinate.y;
            hot_list.data[hot_list_index.value].drag_end.x = new_coordinate.x + Math.max(clone_drag_end.width, 1);
            hot_list.data[hot_list_index.value].drag_end.y = new_coordinate.y + Math.max(clone_drag_end.height, 1);
        }
    };
    document.onmouseup = () => {
        is_draggable.value = true;
        drag_box_bool.value = false;
        // 鼠标抬起的时候将默认值重置为当前x、y坐标
        diy_data.value.forEach((item) => {
            if (item.is_hot == '1') {
                const { x, y } = cloneDeep(item.location);
                item.location.record_x = x;
                item.location.record_y = y;
            }
        });
    };
};
// 拖动结束时的处理
const end_drag = (event: MouseEvent) => {
    drag_bool.value = false;
    if (areaRef.value) areaRef.value.style.display = 'none';
    if (!imgBoxRef.value) return;
    init_drag_style.value = ``;
    // 大于16px才添加热区
    if (rect_end.value.width > 16 && rect_end.value.height > 16) {
        hot_list.data = [{ name: '热区' + (hot_list.data.length + 1), link: {}, drag_start: cloneDeep(rect_start.value), drag_end: cloneDeep(rect_end.value) }];
        diy_data.value.forEach((item: any) => {
            item.show_tabs = '0';
        });
        // 清除选中
        select_index.value = null;
        // emits('rightUpdate', {});
    }
    rect_start.value = { x: 0, y: 0, width: 0, height: 0 };
    rect_end.value = { x: 0, y: 0, width: 0, height: 0 };
};

// drag-btn
const start_drag_btn_br = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'br');
};
const start_drag_btn_bl = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'bl');
};
const start_drag_btn_bc = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'bc');
};
const start_drag_btn_tl = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'tl');
};
const start_drag_btn_tc = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'tc');
};
const start_drag_btn_lc = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'lc');
};
const start_drag_btn_rc = (index: number, event: MouseEvent) => {
    start_drag_btn(index, event, 'rc');
};
// 画布拖拽公用方法
const start_drag_btn = (index: number, event: MouseEvent, type: string) => {
    hot_list_index.value = index;
    event.stopPropagation();
    drag_box_scale_bool.value = true;
    let clone_drag_start = hot_list.data[hot_list_index.value].drag_start;
    let clone_drag_end = hot_list.data[hot_list_index.value].drag_end;
    document.onmousemove = (dragBtnEvent) => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        if (drag_box_scale_bool.value) {
            if (!imgBoxRef.value) return;

            switch (type) {
                case 'br':
                    // 下右
                    clone_drag_end.x = handleBoundary(dragBtnEvent.clientX - imgBoxRef.value.getBoundingClientRect().left, 0, imgBoxRef.value.getBoundingClientRect().width);
                    clone_drag_end.y = handleBoundary(dragBtnEvent.clientY - imgBoxRef.value.getBoundingClientRect().top, 0, imgBoxRef.value.getBoundingClientRect().height);
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, clone_drag_end);
                    break;
                case 'bl':
                    // 下左
                    clone_drag_start.x = handleBoundary(dragBtnEvent.clientX - imgBoxRef.value.getBoundingClientRect().left, 0, clone_drag_end.x);
                    clone_drag_end.y = handleBoundary(dragBtnEvent.clientY - imgBoxRef.value.getBoundingClientRect().top, 0, imgBoxRef.value.getBoundingClientRect().height);
                    hot_list.data[hot_list_index.value].drag_start.x = clone_drag_start.x;
                    hot_list.data[hot_list_index.value].drag_end.y = clone_drag_end.y;
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, { y: clone_drag_end.y });
                    break;
                case 'bc':
                    // 下中
                    clone_drag_end.y = handleBoundary(dragBtnEvent.clientY - imgBoxRef.value.getBoundingClientRect().top, 0, imgBoxRef.value.getBoundingClientRect().height);
                    hot_list.data[hot_list_index.value].drag_end.y = clone_drag_end.y;
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, { y: clone_drag_end.y });
                    break;
                case 'tl':
                    // 上左
                    clone_drag_start.x = handleBoundary(dragBtnEvent.clientX - imgBoxRef.value.getBoundingClientRect().left, 0, clone_drag_end.x);
                    clone_drag_start.y = handleBoundary(dragBtnEvent.clientY - imgBoxRef.value.getBoundingClientRect().top, 0, clone_drag_end.y);
                    hot_list.data[hot_list_index.value].drag_start.x = clone_drag_start.x;
                    hot_list.data[hot_list_index.value].drag_start.y = clone_drag_start.y;
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, {});
                    break;
                case 'tc':
                    // 上中
                    clone_drag_start.y = handleBoundary(dragBtnEvent.clientY - imgBoxRef.value.getBoundingClientRect().top, 0, clone_drag_end.y);
                    hot_list.data[hot_list_index.value].drag_start.y = clone_drag_start.y;
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, { y: clone_drag_end.y });
                    break;
                case 'lc':
                    // 左中
                    clone_drag_start.x = handleBoundary(dragBtnEvent.clientX - imgBoxRef.value.getBoundingClientRect().left, 0, clone_drag_end.x);
                    hot_list.data[hot_list_index.value].drag_start.x = clone_drag_start.x;
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, {});
                    break;
                case 'rc':
                    // 右中
                    clone_drag_end.x = handleBoundary(dragBtnEvent.clientX - imgBoxRef.value.getBoundingClientRect().left, 0, imgBoxRef.value.getBoundingClientRect().width);
                    hot_list.data[hot_list_index.value].drag_end.x = clone_drag_end.x;
                    hot_list.data[hot_list_index.value].drag_end = updateDragEnd(clone_drag_start, clone_drag_end, { x: clone_drag_end.x });
                    break;
            }
        }
    };
    document.onmouseup = () => {
        drag_box_scale_bool.value = false;
    };
};

// 辅助函数用于更新drag_end
const updateDragEnd = (dragStart: { x: number; y: number }, dragEnd: { x: number; y: number }, newDragEnd: { x?: number; y?: number }) => {
    const newX = newDragEnd.x != undefined ? newDragEnd.x : dragEnd.x;
    const newY = newDragEnd.y != undefined ? newDragEnd.y : dragEnd.y;
    return {
        x: newX,
        y: newY,
        width: newX - dragStart.x > 0 ? newX - dragStart.x : 0,
        height: newY - dragStart.y > 0 ? newY - dragStart.y : 0,
    };
};

// 辅助函数用于处理边界
const handleBoundary = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
// 删除拖拽热区
const del_area_event = (index: number) => {
    hot_list.data.splice(index, 1);
};
// 获取热区样式
const rect_style = computed(() => {
    return (start: rectCoords, end: rectCoords) => {
        return `left: ${start.x}px;top: ${start.y}px;width: ${Math.max(end.width, 1)}px;height: ${Math.max(end.height, 1)}px;display: flex;`;
    };
});
// 拖拽的时候，显示拖拽的位置
function adjustPosition(x: number, y: number, width: number, height: number, maxWidth: number, maxHeight: number) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // 确保元素不会超出屏幕范围
    x = Math.max(0, Math.min(maxWidth - width, x - halfWidth));
    y = Math.max(0, Math.min(maxHeight - height, y - halfHeight));

    return { x, y };
}

interface react1 {
    x: number;
    y: number;
    width: number;
    height: number;
}
// 判断两个矩形是否有交集或者被包裹
const isRectangleIntersecting = (rect1: react1, rect2: react1) => {
    // 矩形的格式为 { x, y, width, height }
    const { x: x1, y: y1, width: w1, height: h1 } = rect1;
    const { x: x2, y: y2, width: w2, height: h2 } = rect2;

    // 检查是否有交集
    if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
        return '1'; // 有交集
    }

    // 检查是否一个包含另一个
    if (x1 >= x2 && y1 >= y2 && x1 + w1 <= x2 + w2 && y1 + h1 <= y2 + h2) {
        return '1'; // rect1完全包含rect2
    }
    return '0'; // 无交集
};
//#endregion 左侧拖拽过来的处理

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

//组件置底
const bottom_up = (index: number) => {
    if (!isEmpty(diy_data.value[index])) {
        const old_data = get_diy_index_data(index);
        const old_length = diy_data.value.length - 1;
        // 删除当前位置信息
        diy_data.value.splice(index, 1);
        // 将数据插入下一层数据中
        diy_data.value.splice(old_length, 0, old_data);
        set_show_tabs(old_length);
    }
};

// 获取当前传递过来的index对应的diy_data中的数据
const get_diy_index_data = (index: number) => {
    return (<arrayIndex>diy_data.value)[index.toString()];
};
// 选中和鼠标按下时候的效果
const on_choose = (index: number, show_tabs: string) => {
    // 如果已经选中了, 设置为不可再次触发事件
    if (show_tabs != '1') {
        // 设置对应的位置为显示
        set_show_tabs(index);
    }
};
// 清除选中
const cancel = () => {
    diy_data.value.forEach((item) => {
        item.show_tabs = '0';
    });
    select_index.value = null;
    // emits('rightUpdate', {});
};
//#endregion

//#region 区域内拖拽显示
const dragEndHandle = (item: any, index: number) => {
    diy_data.value[index].location = { x: item.x, y: item.y, record_x: item.x, record_y: item.y, staging_y: item.y };
};
// {x: number, y: number, w: number, h: number}
const resizingHandle = (new_location: any, key: string, index: number) => {
    const { x, y, w, h } = new_location;
    // 对应位置的定位修改为当前更新的位置
    diy_data.value[index].location = { x, y, record_x: x, record_y: y, staging_y: y };
    // 获取到当前更新的内容
    const com_data = diy_data.value[index].com_data;
    // 更新组件的宽高
    com_data.com_width = w;
    com_data.com_height = h;
    com_data.staging_height = h;
    // 图片和线的宽高需要重新计算
    if (key == 'img') {
        const { img_width, img_height } = handleImg(com_data, w, h);
        com_data.img_width = img_width;
        com_data.img_height = img_height;
    } else if (key == 'auxiliary-line') {
        const { line_width, line_size } = handleAuxiliaryLine(com_data, w, h);
        com_data.line_width = line_width;
        com_data.line_size = line_size;
    }
};
// 图片大小的计算
const handleImg = (com_data: any, w: number, h: number) => {
    if (com_data.border_show == '1') {
        return { img_width: w - com_data.border_size * 2, img_height: h - com_data.border_size * 2 };
    } else {
        return { img_width: w, img_height: h };
    }
};
// 线条的计算
const handleAuxiliaryLine = (com_data: any, w: number, h: number) => {
    if (com_data.line_settings === 'horizontal') {
        return { line_width: com_data.com_width, line_size: com_data.com_height - 10 };
    } else {
        return { line_width: com_data.com_height, line_size: com_data.com_width - 10 };
    }
};
//#endregion
</script>

<style scoped lang="scss">
@import './index.scss';
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

            .model-drag {
                width: 100%;
                .model-wall {
                    width: 100%;
                    height: 100%;
                    background-image: linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(135deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(135deg, transparent 75%, #e5e5e5 75%);
                    background-size: 32px 32px;
                    background-position:
                        0 0,
                        16px 0,
                        16px -16px,
                        0 16px;
                    margin: 0 auto;
                    .drag-area {
                        height: 100%;
                        width: 100%;
                        margin: 0.5rem 0; // 用于将上边框和下边框显示出来
                        user-select: none;
                        cursor: crosshair;
                    }
                    .main-content {
                        max-width: 100%;
                        height: 100%;
                        overflow: hidden;
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
