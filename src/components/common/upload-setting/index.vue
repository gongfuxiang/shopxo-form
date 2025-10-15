<template>
	<div class="custom-upload-container">
		<!-- 文件上传区域 -->
		<el-upload v-model:file-list="success_list" multiple action="#" :accept="exts_text" :auto-upload="false" class="flex-row align-c jc-c bg-f" :style="uploadStyle" :show-file-list="false" drag :on-change="upload_change" :limit="is_number(limit) ? Number(limit) : 1000" :on-exceed="handle_exceed">
			<div class="el-upload__text text-line-1" :style="common_store.frame_size">
				<span style="color: #2A94FF;">请选择</span>（点击选择{{ props.acceptType == 'img' ? '图片' : props.acceptType == 'video' ? '视频' : '文件' }}，
				<template v-if="is_number(limit)">最多{{ limit }}{{ props.acceptType == 'img' ? '张' : props.acceptType == 'video' ? '个' : '个' }}</template>
				<template v-if="is_number(fileSizeLimit)">、单个{{ fileSizeLimit }}MB以内</template>）</div>
		</el-upload>
		<div v-if="success_list.length > 0" class="w h mt-14 flex-row align-c flex-wrap gap-10" :style="common_store.frame_style + 'height: 100%;'">
			<div v-for="(item, index) in success_list" :key="index">
				<template v-if="acceptType == 'file'">
					<div v-if="item" class="upload-file-style re" @click="preview_event(item.url, item.name)"> 
						<div class="upload-file-content flex-row align-c gap-10">
							<div v-if="item" class="flex-row align-c upload-file-title w h">
								<span class="text-line-1">{{ new_name(item.name)[0] || '' }}</span><span>.{{ new_name(item.name)[1] || '' }}</span>
							</div>
							<div @click.stop="upload_remove(index)">
								<icon class="flex-1 c-pointer" name="close" size="10"></icon>
							</div>
						</div>
						<div v-if="item.percentage && item.percentage > 0 && item.percentage < 100" class="progress" :style="`width: ${ item.percentage }%;height:2px;`"></div>
					</div>
				</template>
				<template v-else>
					<div v-if="item" class="upload-img-style flex-col gap-3 re">
						<icon class="upload-delete c-pointer" name="close-fillup" size="12" @click="upload_remove(index)"></icon>
						<div class="upload-img oh re">
							<template v-if="acceptType == 'video'">
								<icon class="upload-bofang" name="bofang" size="12" @click="preview_event(item.url, item.name)"></icon>
								<video :src="item.url" class="radius-sm w h" @click="preview_event(item.url, item.name)"></video>
							</template>
							<template v-else>
								<el-image :src="item.url" class="preview-img radius-sm w h" fit="contain" @click="preview_event(item.url, item.name)">
									<template #error>
										<div class="bg-f5 img flex-row jc-c align-c radius h w">
											<icon name="error-img" size="12"></icon>
										</div>
									</template>
								</el-image>
							</template>
							<div v-if="item.percentage && item.percentage > 0 && item.percentage < 100" class="mask_layer flex-row align-c jc-c re">
								<el-progress type="circle" :width="45" :stroke-width="3" indeterminate :percentage="item.percentage">
									<template #default="{ percentage }">
										<span class="percentage-value">{{ percentage }}%</span>
									</template>
								</el-progress>
							</div>
						</div>
						<div class="flex-1 plr-3 oh">
							<div class="flex-row align-c upload-title">
								<span class="text-line-1">{{ new_name(item.name)[0] || '' }}</span><span>.{{ new_name(item.name)[1] || '' }}</span>
							</div>
							<div class="mb-2 upload-size">{{ annex_size_to_unit(item.size) }}</div>
						</div>
					</div>
				</template>
			</div>
		</div>
		<el-dialog v-model="preview_switch_video" width="650" :title="preview_name" draggable append-to-body destroy-on-close>
			<div class="flex-row align-c jc-c">
				<template v-if="acceptType === 'video'">
					<video ref="videoPlayer" width="600" height="400" class="video-style" controls autoplay :src="preview_url"></video>
				</template>
				<template v-else>
					<div class="flex-col align-c jc-c gap-10 mtb-20">
						<span class="size-20 cr-c">文件不支持在线预览</span>
						<span class="size-10 download-desc" @click="download">前往下载</span>
					</div>
				</template>
			</div>
		</el-dialog>
		<!-- 图片预览 -->
		<el-image-viewer v-if="preview_switch_img && acceptType == 'img'" class="123123" :z-index="999999" :url-list="[preview_url]" teleported :hide-on-click-modal="true" @close="preview_close"></el-image-viewer>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import UploadAPI, { Tree } from '@/api/upload';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus'
import { ext_img_name_list, ext_video_name_list, ext_file_name_list, ext_file_name_list_map } from '@/components/common/upload/index'
import { get_id } from '@/utils/common';
import { annex_size_to_unit, ext_name, get_math, isEmpty, is_number } from '@/utils';
import { cloneDeep } from "lodash";
import { commonStore } from "@/store";
const common_store = commonStore();

// Props 定义
const props = defineProps({
	value: {
		type: Array as PropType<UploadUserFile[]>,
		default: () => ([]),
	},
	limit: {
		type: [ Number, String ],
		default: 500000,
	},
	acceptType: {
		type: String,
		default: 'img'
	},
	fileSizeLimit: {
		type: [ Number, String ],
		default: 100000, // 10MB
	},
	uploadStyle: {
		type: String,
		default: ''
	}
})
// 表单数据
interface fileData {
    file: File;
    status: string;
    progress: number;
}
interface formData {
    type: string;
    category_id: string[];
    file: fileData[];
    qrcode: string;
    web_image: string;
}
const file_list = ref<UploadUserFile[]>(props.value);
watch(() => props.value, (val: any) => {
	if (JSON.stringify(val) !== JSON.stringify(file_list.value)) {
		file_list.value = val;
	}
}, { immediate:true });
const emit = defineEmits(['change']);
watch(() => file_list.value, (val: any) => {
	const list = val.filter((item: any) => item.status !== 'error');
    emit('change', list);
}, {deep: true});
const success_list = computed(() => file_list.value.filter((item: any) => item.status !== 'error'));
// 名字和格式拆开显示
const new_name = (name: string) => {
    let index = name.lastIndexOf('.'); // 获取最后一个/的位置
	let lastSegment = name.substring(index + 1); // 截取最后一个/后的值
	let new_name = name.substring(0, index);
	return [ new_name, lastSegment]
};
// 表单数据
const exts = computed(() => props.acceptType == 'img' ? ext_img_name_list.value : props.acceptType == 'video' ? ext_video_name_list.value : ext_file_name_list.value);
const exts_text = computed(() => exts.value.join(','));
// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
const validExt = (name: string) => exts.value.includes(ext_name(name));
const validSize = (size: number) => size <= (Number(props.fileSizeLimit) || 100000) * 1024 * 1024;
const error_change = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	// 检查格式和大小是否符合条件
	if (!validExt(uploadFile.name)) {
		ElMessage.error('文件类型不正确');
		file_list.value = uploadFiles.filter(item => item.name !== uploadFile.name && item.size !== uploadFile.size);
		return false; // 不允许上传
	} else if (uploadFile.size && !validSize(uploadFile.size)) {
		ElMessage.error('超出可上传文件大小')
		file_list.value = uploadFiles.filter(item => item.name !== uploadFile.name && item.size !== uploadFile.size);
		return false; // 不允许上传
	} else { // 检查文件是否已存在
		const isExist = success_list.value.some(uploadedFile => uploadedFile.name === uploadFile.name && uploadedFile.size === uploadFile.size);
		if (isExist) {
			ElMessage.error('该文件已存在，请勿重复上传');
			// console.log(uploadFiles.filter((item, index, self) => self.findIndex(i => i.name === item.name && i.size === item.size) === index ));
			// 删除已存在的文件
			file_list.value = uploadFiles.filter((item, index, self) => self.findIndex(i => i.name === item.name && i.size === item.size) === index );
			return false; // 阻止文件上传
		} else {
			return true; // 允许上传
		}
	}
}
// 文件添加时触发
const upload_change = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	if(!error_change(uploadFile, uploadFiles)) {
		return;
	}
	// // 过滤已上传的文件和重复的文件
	file_list.value = uploadFiles.filter((f: any) => f.name && validExt(f.name) && f.size && validSize(f.size) && f.status && f.status !== 'error');
	// 合并数组之后上传文件
	file_list.value.forEach((item: any) => {
		const formData = new FormData();
		formData.append('type', props.acceptType == 'img' ? 'image' : props.acceptType == 'video' ? 'video' : props.acceptType == 'file' ? 'file' : '');
		formData.append('category_id', '[]');
		formData.append('path_type', 'forminputdata-' + get_id());
		formData.append('upfile', item.raw);
		item.url = !isEmpty(item.url) ? item.url : file_to_base64(item.raw);
		if (item.status == 'ready') {
			item.status = 'loading';
			const on_upload_progress = (progressEvent: any) => {
				item.percentage = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2));
			};
			UploadAPI.uploadAttachment(formData, on_upload_progress)
				.then((res: any) => {
					if (res.code == 0) {
						item.url = res.data.url;
						item.raw = '';
					}
					ElMessage.success('上传成功');
					item.status = 'success';
				})
				.catch((err) => {
					item.status = 'error';
					item.url = '';
					item.percentage = 0;
				});
		}
	});
}
// 超出数量限制回调
const handle_exceed = () => {
	ElMessageBox.alert(`最多只能上传 ${props.limit} 个文件`)
}

const upload_remove = (index: number) => {
	// 根据下标删除文件
    file_list.value.splice(index, 1);
}
// file转换成base64
const file_to_base64 = (file: any) => {
	return URL.createObjectURL(file);
};
//#region 预览相关
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
    if (props.acceptType == 'img') {
        preview_switch_img.value = true;
    } else if (props.acceptType == 'video' || props.acceptType == 'file') {
        preview_switch_video.value = true;
    }
};
// 预览关闭
const preview_close = () => {
    preview_switch_img.value = false;
};
const download = () => {
	const link = document.createElement('a');
    link.href = preview_url.value;
    link.download = preview_name.value;
    link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
    document.body.appendChild(link);
    link.click();
	document.body.removeChild(link);
}
//#enddregion
</script>

<style scoped lang="scss">
.upload-img-style {
	background: #fff;
	width: 8rem;
	border-radius: 0.4rem;
	box-shadow: 0px 0px 5px 0px rgba(207,207,207,0.5);
	padding-bottom: 0.4rem;
	.upload-img {
		width: 100%;
		height: 6rem;
		background: #DADADA;
		border-radius: 4px 4px 0px 0px;
	}
	.upload-title { 
		font-weight: 400;
		font-size: 1rem;
		color: #333333;
		line-height: 1.4rem;
		text-align: left;
		font-style: normal;
	}
	.upload-size {
		font-weight: 400;
		font-size: 0.8rem;
		color: #999999;
		line-height: 1.1rem;
		text-align: left;
		font-style: normal;
	}
	.upload-bofang {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		border-radius: 0.8rem;
	}
	.upload-delete {
		position: absolute;
		top: -0.5rem;
		right: -0.5rem;
		z-index: 3;
	}
}
.upload-file-style {
	// width: 33%;
	box-shadow: 0px 0px 5px 0px rgba(207,207,207,0.5);
	background: #fff;
	border-radius: 0.4rem;
	.upload-file-content { 
		padding: 1rem 1.2rem 1rem 1.6rem;
	}
	.upload-file-title {
		font-weight: 400;
		font-size: 1.2rem;
		color: #333333;
		line-height: 1.7rem;
		text-align: left;
		font-style: normal;
	}
}
// 进度条
.progress {
	position: absolute;
	bottom: 0;
	width: 0;
	height: 0;
	background: #2A94FF;
	transition: width 0.3s linear;
	border-radius: 0.2rem;
}
.video-content {
	position: relative;
	z-index: 9999;
	.video-style {
		background: #000;
		// opacity: 0.5;
	}
}
.download-desc {
	color: $cr-main;
	cursor: pointer;
}
.mask_layer {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: #000;
	opacity: 0.8;
	z-index: 3;
	:deep(.el-progress__text) {
		color: #fff;
		font-size: 0.9rem !important;
		min-width: 4.5rem;
	}
}
</style>