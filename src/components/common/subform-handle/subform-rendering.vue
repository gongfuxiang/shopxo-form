<template>
    <div class="setting-content content w oh">
        <!-- 单行文本 | 下拉框 | 单选按钮组-->
        <template v-if="['single-text', 'select', 'radio-btns'].includes(model_type)">
            <template v-if="['radio-btns', 'select'].includes(form.type)">
                <div class="flex-col gap-10">
                    <el-select ref="selectRef" v-model="form_value" multiple :multiple-limit="1" filterable placeholder="" class="multicolour-select flex-1 border-focus" :style="frame_style + style_container" @change="select_change">
                        <el-option v-for="item in form.option_list" :key="item.value" :value="item.value" :label="item.name" :class="['flex-row align-c select-option' , { 'selected-bg': form_value.includes(item.value) && form.multicolour == '1', 'selected-color': form_value.includes(item.value) && form.multicolour !== '1' }]" @click="select_click(item.value)"><div :style="option_style(item)">{{ item.name }}</div></el-option>
                        <template #tag>
                            <template v-if="isEmpty(form_value)">
                                <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                            </template>
                            <template v-else>
                                <div v-for="item in form.option_list.filter((item1: any) => form_value.includes(item1.value))" :key="item.value" :style="option_style(item)">{{ item.name }}</div>
                            </template>
                        </template>
                    </el-select>
                    <template v-if="form_value == 'outer'">
                        <el-input v-model="form.outer_value" class="border-focus" :style="frame_style + style_container" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" placeholder="请填写内容"></el-input>
                    </template>
                </div>
            </template>
            <template v-else>
                <el-input v-model="form_value" class="border-focus" :style="frame_style + style_container" :placeholder="form.placeholder" @blur="data_check(true)" @change="data_check(true)"></el-input>
            </template>
        </template>
        <!-- 多行文本 -->
        <template v-else-if="model_type == 'multi-text'">
            <el-input v-model="form_value" type="textarea" class="border-focus" :style="frame_style + style_container + 'height: auto'" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" :autosize="{ minRows: 4, maxRows: 8 }" :placeholder="form.placeholder" @blur="data_check(false)" @change="data_check(false)"></el-input>
        </template>
        <!-- 数字 -->
        <template v-else-if="model_type == 'number'">
            <number-input v-model="form_value" :decimal-num="form.is_decimal == '1' ? form.decimal_num : 0" :money-sign="form.is_display_money == '1' ? form.money_sign : ''" :format="form.format" :is-thousandths-symbol="form.is_thousandths_symbol" :is-percentage="form.format == 'percentage'" :placeholder="form.placeholder" class="border-focus" :style="frame_style + style_container" @blur="data_check(true, 'number')" @change="data_check(true, 'number')"></number-input>
        </template>
        <!-- 日期时间 -->
        <template v-else-if="model_type == 'date'">
            <template v-if="['option1', 'option2'].includes(form.date_type)">
                <div class="re w h border-focus" :style="frame_style + style_container + 'height: 100%;'">
                    <el-time-picker v-model="form_value" class="model-date" :style="frame_style + 'width:100%;box-sizing:border-box;'" clearable :placeholder="form.placeholder" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                    <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                </div>
            </template>
            <template v-else>
                <div class="re w h border-focus" :style="frame_style + style_container + 'height: 100%;'">
                    <el-date-picker v-model="form_value" class="model-date" :style="frame_style + 'width:100%;box-sizing:border-box;'" :type="form.date_type == 'option3' ? 'month' : form.date_type == 'option4' ? 'date' : 'datetime'" clearable :placeholder="form.placeholder" :value-format="date_style_format" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                    <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                </div>
            </template>
        </template>
        <!-- 日期时间组 -->
        <template v-else-if="model_type == 'date-group'">
            <template v-if="['option1', 'option2'].includes(form.date_type)">
                <div class="re w h border-focus" :style="frame_style + style_container + 'height: 100%'">
                    <el-time-picker v-model="form_value" class="model-date" :style="frame_style + 'width:100%;box-sizing:border-box;'" is-range clearable :start-placeholder="form.start_placeholder" :end-placeholder="form.end_placeholder" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                    <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                </div>
            </template>
            <template v-else>
                <div class="re w h border-focus" :style="frame_style + style_container + 'height: 100%'">
                    <el-date-picker v-model="form_value" class="model-date" :style="frame_style + 'width:100%;box-sizing:border-box;'" :type="form.date_type == 'option3' ? 'monthrange' : form.date_type == 'option4' ? 'daterange' : 'datetimerange'" clearable :start-placeholder="form.start_placeholder" :end-placeholder="form.end_placeholder" :value-format="date_style_format" :format="date_style_format" @focus="time_focus" @blur="time_blur" />
                    <icon v-if="is_time_icon_show" :name="form.icon_name" class="custom-icon" size="16" @click="custom_icon_click"></icon>
                </div>
            </template>
        </template>
        <!-- 多选按钮组 ｜ 下拉复选框 -->
        <template v-else-if="['checkbox', 'select-multi'].includes(model_type)">
            <el-select v-model="form_value" multiple placeholder="" class="multi-select flex-1 border-focus" popper-class="custom-select" :style="frame_style + style_container" @change="data_check(true, 'checkbox')" @visible-change="input_value = ''">
                <template #header>
                    <el-input v-model="input_value" class="search-select-input" placeholder="搜索(多个关键字用空格隔开)" :prefix-icon="Search" size="large" />
                </template>
                <el-checkbox v-model="selectAll" :indeterminate="indeterminate" class="pl-20" @change="handleCheckAllChange">{{ !isEmpty(input_value) ? '搜索结果全选' : '全选' }}</el-checkbox>
                <el-checkbox-group :model-value="form_value">
                    <el-option v-for="item in new_option_list" :key="item.value" :value="item.value" :label="item.name">
                        <el-checkbox :value="item.value" :label="item.name"><div :style="option_style(item)">{{ item.name }}</div></el-checkbox>
                    </el-option>
                </el-checkbox-group>
                <template v-if="form.is_add_option == '1'" #footer>
                    <div v-if="!popover_visible" class="add-option flex-row gap-10 align-c pl-20" @click="add_option">
                        <icon name="xzdz-tianjiabiaoq" size="14" color="#2a94ff"/>
                        <span class="size-14 cr-primary">添加选项</span>
                    </div>
                    <div v-else class="flex-col gap-10 align-c jc-sb w h">
                        <el-form ref="ruleFormRef" :model="popover_form" :rules="rules" class="w h" label-width="0" status-icon>
                            <el-form-item label-width="0" prop="popover_option" class="mb-0">
                                <el-input v-model="popover_form.popover_option" placeholder="请填写内容，enter确定" type="small" @change="confirm(ruleFormRef)"></el-input>
                            </el-form-item>
                        </el-form>
                        <div style="text-align: left;">
                            <el-button size="small" text @click="cancle(ruleFormRef)">取消</el-button>
                            <el-button size="small" type="primary" @click="confirm(ruleFormRef)">确定</el-button>
                        </div>
                    </div>
                </template>
                <!-- 选中之后的效果 -->
                <template #tag>
                    <template v-if="isEmpty(form_value)">
                        <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                    </template>
                    <template v-else>
                        <template v-if="form.is_multicolour == '1'">
                            <div v-for="item in form.option_list.filter((item1: any) => form_value.includes(item1.value))" :key="item.value" :style="option_style(item) + 'white-space: nowrap;'">{{ item.name }}</div>
                        </template>
                        <template v-else> 
                            <div class="text-line-1" :style="common_styles">{{ selected_names }}</div>
                        </template>
                    </template>
                </template>
            </el-select>
        </template>
        <!-- 定位 -->
        <template v-else-if="model_type == 'position'">
            <div class="pc-disable flex-row align-c jc-c w h" :style="frame_style + style_container">
                <div class="flex-row align-c jc-c gap-10 text-line-1 plr-5">
                    <icon name="latitude-location" color="#000"></icon>
                    请在移动端打开表单进行定位
                </div>
            </div>
        </template>
        <!-- 地址 -->
        <template v-else-if="model_type == 'address'">
            <div class="flex-col gap-10 align-c" :style="frame_style + 'height: 100%;'">
                <el-cascader v-model="form_value" :options="common_store.address_list" class="border-focus" :style="frame_style + style_container" :props="{ 'value': 'id', 'label': 'name', 'children': 'items' }" filterable @change="data_check(false)" />
            </div>
        </template>
        <!-- 密码 -->
        <template v-else-if="model_type == 'pwd'">
            <el-input v-model="form_value" :type="pwd_is_show ? 'password' : ''" class="border-focus" :style="frame_style + style_container" :placeholder="form.placeholder" @change="data_check(false)">
                <template #prefix>
                    <icon :name="form.icon_name" color="#999"></icon>
                </template>
                <template #suffix>
                    <icon :name="pwd_is_show ? 'eye' : 'eye-close'" color="#999" @click="eye_change"></icon>
                </template>
            </el-input>
        </template>
        <!-- 评分 -->
        <template v-else-if="model_type == 'score'">
            <custom-rate v-model="form_value" :max="form.total" :select-color="form.select_color" :type="form.score_type" :style="frame_style + 'height:100%;'" @change="data_check"/>
        </template>
        <!-- 上传图片｜上传视频 ｜ 上传文件 -->
        <template v-else-if="['upload-img', 'upload-video', 'upload-attachments'].includes(model_type)">
            <el-dropdown trigger="click" max-height="300px" size="large" placement="bottom-start" :hide-on-click="false" popper-class="subform-upload-setting-box" class="subform-upload-setting-box">
                <template v-if="form_value.length > 0">
                    <div class="w h flex-row align-s gap-3 oh pa-4">
                        <div v-for="(item, index) in form_value" :key="index" class="w h flex-row align-c"> 
                            <template v-if="model_type === 'upload-img'">
                                <el-image :src="file_to_base64(item.raw)" fit="contain" class="h" @click="preview_event(file_to_base64(item.raw), item.raw.name)">
                                    <template #error>
                                        <div class="bg-f5 img flex-row jc-c align-c radius h w">
                                            <icon name="error-img" size="12"></icon>
                                        </div>
                                    </template>
                                </el-image>
                            </template>
                            <template v-else-if="model_type === 'upload-video'">
                                <video :src="file_to_base64(item.raw)" class="radius-sm w h" @click="preview_event(file_to_base64(item.raw), item.raw.name)"></video>
                            </template>
                            <template v-else>
                                <el-tooltip class="radius-sm w h" effect="dark" :content="item.name">
                                    <div class="upload-file flex-row align-c jc-c">{{ new_name(item.raw.name)[1].toUpperCase() }}</div>
                                </el-tooltip>
                            </template>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="w h"></div>
                </template>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            <upload-setting :value="form_value" :accept-type="model_type == 'upload-img' ? 'img' : model_type == 'upload-video' ? 'video' : 'file'" :file-size-limit="form.is_limit_size == '1' ? form.upload_size : ''" :limit="form.is_limit_num == '1' ? form.limit : ''" :upload-style="frame_style + style_container" @change="upload_change" />
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </template>
        <!-- 文本 -->
        <template v-else-if="model_type == 'text'">{{ form_value }}</template>
        <!-- 图片 -->
        <template v-else-if="model_type == 'img'">
            <image-empty v-model="form.img_src[0]" fit="contain" class="w h"></image-empty>
        </template>
        <!-- 视频 -->
        <template v-else-if="model_type == 'video'">
            <div class="re oh w h">
                <video v-show="is_video_play" ref="videoPlayer" :src="form.video[0]?.url || ''" controls class="w h"></video>
                <template v-if="!is_video_play">
                    <template v-if="(!isEmpty(form.video) && isEmpty(form.video_img))">
                        <video :src="form.video[0].url" controls class="w h"></video>
                    </template>
                    <template v-else>
                        <image-empty v-model="form.video_img[0]" error-img-style="width:60px;height:60px;"></image-empty>
                    </template>
                    <img :src="video_src" class="middle box-shadow-sm round" width="20" height="20" @click="video_change" />
                </template>
            </div>
        </template>
        <!-- 文件 -->
        <template v-else-if="model_type == 'attachments'">
            <template v-if="form.file.length > 0">
                <div class="flex-row gap-20 align-c">
                    <span class="file-title text-line-1">{{ form.file[0].original || '' }}</span>
                    <div class="oprate">
                        <div class="icon" @click.stop="copy(form.file[0].url)">
                            <icon name="copy" size="10"/>
                        </div>
                        <span class="divider"></span>
                        <div class="icon" @click="download(form.file[0].original, form.file[0].url)">
                            <icon name="download-btn" size="10"></icon>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <span class="file-title">暂无文件</span>
            </template>
        </template>
        <template v-else>
            <div class="pa-16 cr-6 mt-40 pt-40 tc">暂无设置</div>
        </template>
    </div>
</template>

<script setup lang="ts"> 
import { color_change } from "@/utils/common";
import { common_styles_computer, date_style_options, get_border_left_right_size, get_math, isEmpty } from "@/utils";
import { commonStore } from "@/store";
import type { ElSelect, FormInstance, FormRules } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { cloneDeep } from "lodash";
import { PropType } from "vue";
const common_store = commonStore();
const model_type = defineModel('type', { type: String, default: () => '' });
const form = defineModel({ type: Object, default: () => ({}) });
// 定义 form_value 类型
type FormValueType = string | number | Array<any> | Record<string, any>;
const props = defineProps({
    value: {
        type: [String, Number, Array] as PropType<FormValueType>,
        default: () => {},
    },
    subformKey: {
        type: String,
        default: '',
    }
});
const form_value = ref<any>(props.value);
const emit = defineEmits(['change', 'data_check']);
watch(() => props.value, (val) => {
    if (val !== form_value.value) {
      form_value.value = val;
    }
}, { immediate: true });
// 数据发生变化时传递给父组件
watch(() => form_value.value, (val) => {
    emit('change', val);
}, { deep: true });
//#region 单行文本 | 下拉框 | 单选按钮组
// 没有彩色时的公共样式
const common_styles = computed(() => `${ common_store.color_style };padding-left:0rem;padding-right:0rem;`);
const option_style = (val: any) => {
    if (form.value.is_multicolour == '1') {
        return `background:${ val.color };color:${ val.is_outer == '1' ? '#141E31' : '#fff'};border-radius:0.4rem;${ common_store.color_style }`;
    } else {
        return common_styles.value;
    }
}
const data_check = (is_format: boolean = false, type: string = '') => {
    emit('data_check', { is_format, type });
};
const select_change = (val: any) => {
    form_value.value = Array.isArray(val) ? val[0] : val;
}
// 关闭下拉框
const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);
// 单选选择框为了兼容颜色设置，清空老数据并赋值新数据
const select_click = (val: any) => {
    if (!form_value.value.includes(val)) {
        form_value.value = val;
    }
    // 点击之后关闭下拉框的弹出框
    if (selectRef.value) {
        selectRef.value.blur();
    }
}
//#endregion
//#region 时间选择器内容出现
const date_style_format = computed(() => {
    const data = new Map(date_style_options(form.value.date_style).map(item => [item.value, item]));
    return data.get(form.value.date_type)?.label || 'YYYY-MM-DD HH:mm:ss';
});
const is_time_icon_show = ref(true);
const time_focus = () => {
    if (!isEmpty(form_value.value)) {
        is_time_icon_show.value = false;
    } else {
        is_time_icon_show.value = true;
    }
};

const time_blur = () => {
    is_time_icon_show.value = true;
    emit('data_check', { is_format: false, type: '' });
};
const el_time = ref<any>(null);
const custom_icon_click = () => {
    if (el_time.value) {
        if (!isEmpty(form_value.value)) {
            is_time_icon_show.value = false;
        } else {
            is_time_icon_show.value = true;
        }
        el_time.value.focus();
    }
};
//#endregion
//#region 多选下拉框全选和反选的处理
const selected_names = computed(() => {
    const optionList = form.value?.option_list || [];
    const formValue = form_value.value || [];

    const valueSet = new Set(formValue);
    return optionList
    .filter((item: { value: any; name: string }) => valueSet.has(item.value))
    .map((item: { name: string }) => item.name)
    .join(',');
});
// 搜索框筛选内容
const new_option_list = computed(() => {
    if (!isEmpty(input_value.value)) {
        const inputValue = input_value.value.split(' ').filter(item => item !== '');
        return form.value.option_list.filter((item: { value: string }) => inputValue.some(keyword => item.value.includes(keyword)));
    } else {
        return form.value.option_list;
    }
    
});
const selectAll = ref(false);
const input_value = ref('');
const indeterminate = ref(true);
watchEffect(() => {
    if (['checkbox', 'select-multi'].includes(model_type.value)) {
        if (!isEmpty(input_value.value)) {
            // 判断符合条件的数据中选中多少个
            const count = new_option_list.value.reduce((acc : number, item: { value: string }) => form_value.value.includes(item.value) ? acc + 1 : acc, 0);
            const flag = count > 0 && count < new_option_list.value.length;
            selectAll.value = count == new_option_list.value.length;
            indeterminate.value = flag;
        } else {
            const valueSet = new Set(form_value.value);
            const flag = valueSet.size > 0 && valueSet.size < form.value.option_list.length;
            selectAll.value = valueSet.size == form.value.option_list.length;
            indeterminate.value = flag;
        }
    }
});
// 全选操作时的处理
const handleCheckAllChange = () => {
    if (!isEmpty(input_value.value)) {
        // 判断有多少个符合筛选条件的数据
        const option_list_value = new_option_list.value.map((item: { value: any }) => item.value);
        form_value.value = selectAll.value ? cloneDeep(form_value.value).concat(option_list_value) : cloneDeep(form_value.value).filter((item: any) => !option_list_value.includes(item))
    } else {
        form_value.value = selectAll.value ? form.value.option_list.map((item: { value: any }) => item.value) : []
    }
}
//#endregion
// #region 添加选项相关
type popoverForm = {
    popover_option: string;
}
const popover_form = reactive<popoverForm>({
    popover_option: '',
});
const rules = reactive<FormRules<popoverForm>>({
    popover_option: [
        { required: true, message: '请输入选项名称', trigger: ['change', 'blur'] },
    ],
});
const ruleFormRef = ref<FormInstance>();
const popover_visible = ref(false);
// 点击添加选项
const add_option = () => {
    popover_visible.value = true;
};
// 取消添加选项
const cancle = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    popover_visible.value = false;
};
// 确认添加选项时的操作
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
        const value = 'option' + get_math();
        form.value.option_list.push({
            name: popover_form.popover_option,
            value: value,
            color: color_change(form.value.option_list.length - 1),
        });
        form_value.value.push(value);
        popover_visible.value = false;
    }
  })
}
//#endregion
//#region 密码
const pwd_is_show = ref(true);
const eye_change = () => {
    pwd_is_show.value = !pwd_is_show.value;
};
//#endregion
//#region 上传
const upload_change = (value: any) => {
    form_value.value = value;
    setTimeout(() => {
        emit('data_check', { is_format: false, type: '' });
    }, 0);
}
// file转换成base64
const file_to_base64 = (file: any) => {
	return URL.createObjectURL(file);
};
// 预览开关
const preview_switch_img = ref(false);
const preview_switch_video = ref(false);
// 视频预览的路径
const preview_url = ref('');
const preview_name = ref('');
// 预览图片/视频
const preview_event = (item: any, name: string) => {
    preview_url.value = item;
	preview_name.value = name;
    if (model_type.value == 'img') {
        preview_switch_img.value = true;
    } else if (model_type.value == 'video' || model_type.value == 'file') {
        preview_switch_video.value = true;
    }
};
// 预览关闭
const preview_close = () => {
    preview_switch_img.value = false;
};
// 名字和格式拆开显示
const new_name = (name: string) => {
    let index = name.lastIndexOf('.'); // 获取最后一个/的位置
	let lastSegment = name.substring(index + 1); // 截取最后一个/后的值
	let new_name = name.substring(0, index);
	return [ new_name, lastSegment]
};
//#endregion
//#region 文件
// 复制到剪切板
const copy = (url: string) => {
    /* 创建一个临时的textarea元素 */
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? '成功复制！' : '复制失败';
    } catch (err) {
        console.error('复制失败', err);
    }

    document.body.removeChild(textarea);
}
// 文件下载
const download = (name: string, url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
    document.body.appendChild(link);
    link.click();
	document.body.removeChild(link);
}
//#endregion
//#region 视频
const video_src = ref(common_store.common.config.attachment_host + `/static/diy/images/components/model-video/video.png`);
// 视频播放处理逻辑
const videoPlayer = ref<HTMLVideoElement | null>(null);
const is_video_play = ref(false);
const video_change = () => { 
    const videoEl = videoPlayer.value;
    if (videoEl) {
        is_video_play.value = true;
        videoEl.play();
    }
};
//#endregion
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
const frame_style = computed(() => common_store.frame_style + `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);`);
</script>
<style lang="scss" scoped>
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
// 复选框的处理逻辑
.select-tag {
    color: #a8abb2;
}
.search-input, .search-select-input {
    :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
    }
}
.multi-select {
    :deep(.el-select__wrapper) {
        .el-select__selection {
            flex-wrap: nowrap;
            overflow: hidden;
        }
        .el-select__suffix {
            padding-left: 0.2rem;
        }
    }
}
.add-option {
    cursor: pointer;
}
.oprate {
    display: flex;
    align-items: center;
    border-radius: 15px;
    color: $cr-primary;
    background: #FFFFFF;
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.1);
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0.3rem 0.6rem;
    }
}
.subform-upload-setting-box {
    border-radius: 0.4rem;
    border: 0.1rem solid #e3e3e3;
    width: 100%;
    height: 3.2rem;
    background: #fff;
    :deep(.el-dropdown-menu__item:not(.is-disabled)):hover{
        background: #fff;
    }
}
.upload-file {
    width: 2.5rem;
    height: 100%;
    border-radius: 0.4rem;
    color: #fff;
    background: #96ADA9;
}
</style>
