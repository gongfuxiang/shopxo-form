<template>
    <div class="rendering-area w h">
        <div class="form-group w h" :style="common_store.layout_style + layout_style">
            <form-title v-if="!isCustom" :value="props.value" :style="title_style"></form-title>
            <div class="content w h flex-1">
                <div class="re oh" :style="video_style">
                    <video v-show="is_video_play" ref="videoPlayer" :src="form.video[0]?.url || ''" controls class="w h"></video>
                    <template v-if="!is_video_play">
                        <template v-if="(!isEmpty(form.video) && isEmpty(form.video_img))">
                            <video :src="form.video[0].url" controls class="w h"></video>
                        </template>
                        <template v-else>
                            <image-empty v-model="form.video_img[0]" error-img-style="width:60px;height:60px;"></image-empty>
                        </template>
                        <img :src="video_src" class="middle box-shadow-sm round" width="60" height="60" @click="video_change" />
                    </template>
                </div>
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
const video_src = ref(common_store.common.config.attachment_host + `/static/diy/images/components/model-video/video.png`);
const layout_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row'  ? 'align-items:flex-start;' : '');
const title_style = computed(() => common_store.form_layout?.computer?.flex_direction == 'row' ? 'margin-top:4px;' : '');

const video_style = computed(() => {
    if (!props.isCustom) {
        const { video_width, video_scale_type } = form.value;
        const height = video_scale_type === '1' ? video_width : video_scale_type == '0' ? (video_width * 9) / 16 : (video_width * 3) / 4;
        return {
            width: `${form.value.video_width}px`,
            height: `${ height }px`,
        };
    } else {
        return {
            width: '100%;',
            height: '100%',
        };
    }
});
const videoPlayer = ref<HTMLVideoElement | null>(null);
const is_video_play = ref(false);
const video_change = () => { 
    if (!isEmpty(form.value.video[0].url)) {
        const videoEl = videoPlayer.value;
        if (videoEl) {
            is_video_play.value = true;
            videoEl.play();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
