<template>
    <div class="rendering-area">
        <div class="form-group" :style="common_store.layout_style">
            <form-title :value="props.value"></form-title>
            <div class="content w flex-1">
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
                    <span class="file-title" :style="common_store.frame_style + 'width:100%;height:100%'">暂无文件</span>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { commonStore } from "@/store";
const common_store = commonStore();
import { isEmpty } from "lodash";
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    isCustom: {
        type: Boolean,
        default: false,
    }
});
const form = computed(() => props.value);
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
</script>
<style lang="scss" scoped>
.file-title {
    font-weight: 400;
    font-size: 1.2rem;
    color: #666666;
    line-height: 1.7rem;
    font-style: normal;
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
        padding: 0.6rem 1.2rem;
    }
}
</style>
