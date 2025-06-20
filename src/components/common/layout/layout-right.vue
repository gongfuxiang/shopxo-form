<template>
    <div class="setting-content flex-col gap-20">
        <div class="flex-col gap-10 w h">
            <div class="new_title">页面背景</div>
            <div class="flex-col gap-10">
                <el-radio-group v-model="form.background_type">
                    <el-radio value="color">颜色</el-radio>
                    <el-radio value="img">图片</el-radio>
                </el-radio-group>
                <el-form-item v-if="form.background_type == 'color'">
                    <color-picker v-model="form.background_color" default-color="#f8f8f8" ></color-picker>
                </el-form-item>
                <el-form-item v-else>
                    <upload v-model="form.background_image" :limit="1" size="50"></upload>
                </el-form-item>
            </div>
        </div>
        <div class="flex-col gap-10 w h">
            <div class="new_title">表头样式</div>
            <div class="flex-col gap-10">
                <el-radio-group v-model="form.heading_type">
                    <el-radio value="color">颜色</el-radio>
                    <el-radio value="img">图片</el-radio>
                </el-radio-group>
                <el-form-item v-if="form.heading_type == 'color'">
                    <color-picker v-model="form.heading_color" default-color="#C1EBFF" ></color-picker>
                </el-form-item>
                <el-form-item v-else>
                    <upload v-model="form.heading_image" :limit="1" size="50"></upload>
                </el-form-item>
            </div>
        </div>
        <div class="flex-col gap-10 w h">
            <div class="new_title">标题样式</div>
            <div class="flex-row gap-10 align-c form-title mb-10">
                展示方式
                <div class="flex-1">
                    <el-radio-group v-model="form.is_show_heading_title">
                        <el-radio value="1">显示</el-radio>
                        <el-radio value="0">隐藏</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <template v-if="form.is_show_heading_title === '1'">
                <div class="flex-row gap-10 align-c form-title mb-10">
                    对齐方式
                    <div class="flex-1">
                        <el-radio-group v-model="form.heading_title_location" is-button class="two-copies-group three-copies-group w h">
                            <el-tooltip content="左对齐" placement="top" effect="dark">
                                <el-radio-button value="flex-start"><icon name="iconfont icon-left"></icon></el-radio-button>
                            </el-tooltip>
                            <el-tooltip content="居中" placement="top" effect="dark">
                                <el-radio-button value="center"><icon name="iconfont icon-center"></icon></el-radio-button>
                            </el-tooltip>
                            <el-tooltip content="右对齐" placement="top" effect="dark">
                                <el-radio-button value="flex-end"><icon name="iconfont icon-right"></icon></el-radio-button>
                            </el-tooltip>
                        </el-radio-group>
                    </div>
                </div>
                <div class="flex-row gap-10 align-b form-title mb-10">
                    <span class="mt-4">字号</span>
                    <div class="flex-1">
                        <color-text-size-group v-model:color="form.heading_title_color" v-model:typeface="form.heading_title_font_weight" v-model:size="form.heading_title_size" default-color="#000000"></color-text-size-group>
                    </div>
                </div>
            </template>
        </div>
        <div class="flex-col gap-10 w h">
            <div class="new_title">提交按钮</div>
            <color-picker v-model="form.submit_color" default-color="#2A94FF" ></color-picker>
        </div>
        <div class="flex-col gap-10 w h">
            <div class="new_title">字段标题位置</div>
            <div class="flex-row gap-10">
                <div :class="`title-location-icon flex-col gap-5 w h ${ form.flex_direction == 'column' ? 'active' : '' }`" @click="type_change('column')">
                    <div class="location-icon location-icon-1"></div>
                    <div class="location-icon"></div>
                    <div class="title">上下</div>
                </div>
                <div :class="`title-location-icon flex-col gap-5 jc-sb w h ${ form.flex_direction == 'column' ? '' : 'active' }`" @click="type_change('row')">
                    <div class="flex-row gap-5 align-c location-height">
                        <div class="location-icon location-icon-1"></div>
                        <div class="location-icon"></div>
                    </div>
                    <div class="title">左右</div>
                </div>
            </div>
        </div>
        <div v-if="form.flex_direction == 'row'" class="flex-col gap-10 w h">
            <div class="new_title">字段标题样式</div>
            <div class="flex-row gap-10 align-c form-title mb-10">
                宽度
                <div class="flex-1">
                    <slider v-model="form.filed_title_width" :max="500"></slider>
                </div>
            </div>
            <div class="flex-row gap-10 align-c form-title">
                对齐方式
                <div class="flex-1">
                    <el-radio-group v-model="form.filed_title_justification" class="two-copies-group w h" is-button>
                        <el-tooltip content="左对齐" placement="top" effect="dark">
                            <el-radio-button value="flex-start"><icon name="iconfont icon-left" size="16"></icon></el-radio-button>
                        </el-tooltip>
                        <el-tooltip content="右对齐" placement="top" effect="dark">
                            <el-radio-button value="flex-end"><icon name="iconfont icon-right" size="16"></icon></el-radio-button>
                        </el-tooltip>
                    </el-radio-group>
                </div>
            </div>
        </div>
        <div v-if="portType == 'computer' && common_store.form_config.type_value !== 'free'" class="flex-col gap-10 w h">
            <div class="new_title flex-row align-c gap-10">输入框宽度<tooltip content="控制字段输入框的宽度，标准模式下宽度固定，自动模式下宽度占满整列" placement="top" /></div>
            <el-radio-group v-model="form.input_width_type" class="two-copies-group w h" is-button>
                <el-radio-button value="default">标准</el-radio-button>
                <el-radio-button value="auto">自动</el-radio-button>
            </el-radio-group>
        </div>
        <div class="flex-col gap-10 w h">
            <div class="new_title">大小</div>
            <el-radio-group v-model="form.filed_title_size_type" class="two-copies-group three-copies-group w h" is-button>
                <el-radio-button value="big">大</el-radio-button>
                <el-radio-button value="middle">中</el-radio-button>
                <el-radio-button value="small">小</el-radio-button>
            </el-radio-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { commonStore } from "@/store";
const common_store = commonStore();
const props = defineProps({
    // 配置类型，layout：表单布局，style：表单样式
    configType: {
        type: String,
        default: 'layout',
    },
    portType: {
        type: String,
        default: 'computer',
    },
    value: {
        type: Object,
        default: () => {},
    },
});
const form = ref(props.value);
watch(() => props.value, () => {
    form.value = props.value;
});
const type_value = ref('computer');
// 弹出框显示逻辑
const dialogVisible = defineModel('visible', { type: Boolean, default: false });
// #region 表单布局的显示逻辑
const type_change = (val: string) => {
    form.value.flex_direction = val;
};
//#endregion
</script>

<style lang="scss" scoped>
.title-location-icon {
    padding: 1rem;
    background: #FFFFFF;
    border-radius: 0.4rem;
    border: 0.1rem solid #EEEEEE;
    .location-icon {
        width: 100%;
        height: 1.5rem;
        background: #F4F4F4;
        border-radius: 2px;
    }
    .location-icon-1 {
        width: 2.6rem;
        background: #E4EEF4;
    }
    .location-height {
        height: 3.5rem;
    }
}
.title-location-icon.active {
    border: 0.1rem solid #2A94FF;
}
.form-title {
    font-weight: 400;
    font-size: 1.2rem;
    color: #666666;
    line-height: 1.7rem;
    font-style: normal;
}
:deep(.slider .slider-input .el-input-number) {
    width: 7rem;
}
:deep(.el-input-number.is-controls-right .el-input__wrapper) {
    padding-left: 1rem;
    padding-right: 3.5rem;
}
</style>