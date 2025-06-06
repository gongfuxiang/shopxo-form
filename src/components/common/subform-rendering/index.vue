<template>
    <div class="setting-content content">
        <!-- 单行文本 | 下拉框 | 单选按钮组-->
        <template v-if="['single-text', 'select', 'radio-btns'].includes(model_type)">
            <template v-if="['radio-btns', 'select'].includes(form.type)">
                <div class="flex-col gap-10">
                    <el-select ref="selectRef" v-model="form.form_value" multiple :multiple-limit="1" filterable placeholder="" class="multicolour-select flex-1" :style="frame_style + style_container" @change="select_change">
                        <el-option v-for="item in form.option_list" :key="item.value" :value="item.value" :label="item.name" :class="['flex-row align-c select-option' , { 'selected-bg': form.form_value.includes(item.value) && form.multicolour == '1', 'selected-color': form.form_value.includes(item.value) && form.multicolour !== '1' }]" @click="select_click(item.value)"><div :style="option_style(item)">{{ item.name }}</div></el-option>
                        <template #tag>
                            <template v-if="isEmpty(form.form_value)">
                                <div class="select-tag" :style="common_styles">{{ form.placeholder }}</div>
                            </template>
                            <template v-else>
                                <div v-for="item in form.option_list.filter((item1: any) => form.form_value.includes(item1.value))" :key="item.value" :style="option_style(item)">{{ item.name }}</div>
                            </template>
                        </template>
                    </el-select>
                    <template v-if="form.form_value == 'outer'">
                        <el-input v-model="form.outer_value" :style="frame_style + style_container" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" placeholder="请填写内容"></el-input>
                    </template>
                </div>
            </template>
            <template v-else>
                <el-input v-model="form.form_value" :style="frame_style + style_container" :placeholder="form.placeholder"  @blur="data_check(true)" @change="data_check(true)"></el-input>
            </template>
        </template>
        <!-- 多行文本 -->
        <template v-else-if="model_type == 'multi-text'">
            <el-input v-model="form.form_value" type="textarea" :style="frame_style + style_container + 'height:100%;'" :minlength="form.is_limit_num == '1' ? form.min_num : ''" :maxlength="form.is_limit_num == '1' ? form.max_num : ''" :autosize="{ minRows: 4, maxRows: 8 }" :placeholder="form.placeholder" @blur="data_check(false)" @change="data_check(false)"></el-input>
        </template>
        <!-- 数字 -->
        <template v-else-if="model_type == 'number'">
            <number-input v-model="form.form_value" :decimal-num="form.is_decimal == '1' ? form.decimal_num : 0" :money-sign="form.is_display_money == '1' ? form.money_sign : ''" :format="form.format" :is-thousandths-symbol="form.is_thousandths_symbol" :is-percentage="form.format == 'percentage'" :placeholder="form.placeholder" :style="frame_style + style_container" @blur="data_check(true, 'number')" @change="data_check(true, 'number')"></number-input>
        </template>
        <!-- 日期时间 -->
        <template v-else-if="model_type == 'date'">

        </template>
        <!-- 日期时间组 -->
        <template v-else-if="model_type == 'date-group'">

        </template>
        <!-- 多选按钮组 ｜ 下拉复选框 -->
        <template v-else-if="['checkbox', 'select-multi'].includes(model_type)">

        </template>
        <!-- 定位 -->
        <template v-else-if="model_type == 'position'">

        </template>
        <!-- 地址 -->
        <template v-else-if="model_type == 'address'">

        </template>
        <!-- 手机 -->
        <template v-else-if="model_type == 'phone'">

        </template>
        <!-- 密码 -->
        <template v-else-if="model_type == 'pwd'">

        </template>
        <!-- 评分 -->
        <template v-else-if="model_type == 'score'">

        </template>
        <!-- 上传图片｜上传视频 ｜ 上传文件 -->
        <template v-else-if="['upload-img', 'upload-video', 'upload-attachments'].includes(model_type)">
            
        </template>
        <!-- 文本 -->
        <template v-else-if="model_type == 'text'">{{ form.form_value }}</template>
        <!-- 图片 -->
        <template v-else-if="model_type == 'img'">

        </template>
        <!-- 视频 -->
        <template v-else-if="model_type == 'video'">

        </template>
        <!-- 文件 -->
        <template v-else-if="model_type == 'attachments'">

        </template>
        <template v-else>
            <div class="pa-16 cr-6 mt-40 pt-40 tc">暂无设置</div>
        </template>
    </div>
</template>

<script setup lang="ts"> 
import { common_styles_computer, get_border_left_right_size, get_format_checks, isEmpty } from "@/utils";
import { commonStore } from "@/store";
import type { ElSelect } from "element-plus";
const common_store = commonStore();
const model_type = defineModel('type', { type: String, default: () => '' });
const form = defineModel({ type: Object, default: () => ({}) });
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
const data_check = (val: boolean = false, type: string = '') => {
    get_format_checks(form.value, val, type)
};
const select_change = (val: any) => {
    form.value.form_value = Array.isArray(val) ? val[0] : val;
}
// 关闭下拉框
const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);
// 单选选择框为了兼容颜色设置，清空老数据并赋值新数据
const select_click = (val: any) => {
    if (!form.value.form_value.includes(val)) {
        form.value.form_value = val;
    }
    // 点击之后关闭下拉框的弹出框
    if (selectRef.value) {
        selectRef.value.blur();
    }
}
//#endregion
// 用于样式显示
const style_container = computed(() => common_styles_computer(form.value.common_config));
const frame_style = computed(() => common_store.frame_style + `max-width:100%;width:calc(100% - ${ get_border_left_right_size(form.value.common_config) }px);`);
</script>
<style lang="scss" scoped>

</style>
