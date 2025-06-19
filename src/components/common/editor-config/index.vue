<template>
    <div class="br-c pr z-deep w h oh border-focus" :style="props.newStyle">
        <!-- 工具栏 -->
        <Toolbar id="toolbar-container" :editor="editor_ref" :default-config="toolbar_config" :mode="mode" />
        <!-- 编辑器 -->
        <Editor id="editor-container" ref="editorRef" v-model="html_value" class="editor" :default-config="editor_config" :mode="mode" @on-change="handle_change" @on-created="handle_created" />
    </div>
    <!-- 文件上传区域 -->
    <el-upload v-model:file-list="file_list" action="#" :accept="exts_text" :auto-upload="false" class="upload-visiable" :limit="1" :show-file-list="false" drag :on-change="upload_change">
        <el-button ref="upload_type" type="primary">Click to upload</el-button>
    </el-upload>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ext_file_name_list, ext_img_name_list, ext_video_name_list } from '../upload';
import UploadAPI from '@/api/upload';
import { ElButton, ElUpload, UploadFile, UploadUserFile } from 'element-plus';
import { isEmpty } from '@/utils';
interface Props {
    placeholder?: string;
    newStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '请输入内容...',
    newStyle: '',
});
// 默认值处理
const html_value = defineModel({ type: String, default: '' });

const mode = ref('default'); // 编辑器模式
const editorRef = ref<HTMLElement | null>(null);
// 编辑器实例，必须用 shallowRef
const editor_ref = shallowRef();
const toolbar_config = ref({}); // 工具条配置
// 上传类型
const rich_upload_type = ref('img');
// 编辑器配置
interface InsertFnType {
    (url: string, alt?: string, link?: string): void;
}
// 表单数据
const exts = computed(() => rich_upload_type.value == 'img' ? ext_img_name_list.value : rich_upload_type.value == 'video' ? ext_video_name_list.value : ext_file_name_list.value);
const exts_text = computed(() => exts.value.join(','));

const upload_type = ref<InstanceType<typeof ElButton> | null>(null);
// 编辑器配置
const editor_config = ref({
    placeholder: props.placeholder,
    MENU_CONF: {
        // 自定义菜单配置
        uploadImage: {
            // 自定义选择图片
            customBrowseAndUpload(insertFn: InsertFnType) {
                rich_upload_type.value = 'img';
                setTimeout(() => {
                    if (upload_type.value) {
                        file_list.value = [];
                        upload_type.value?.$.vnode.el?.click();
                    }
                });
                upload_insert.value = insertFn;
            },
        },
        uploadVideo: {
            // 自定义上传视频
            customBrowseAndUpload(insertFn: InsertFnType) {
                rich_upload_type.value = 'video';
                setTimeout(() => {
                    if (upload_type.value) {
                        file_list.value = [];
                        upload_type.value?.$.vnode.el?.click();
                    }
                });
                upload_insert.value = insertFn;
            },
        },
    },
});
// 获取到对应的触发事件
const upload_insert = ref<any>(null);
// 创建编辑器实例
const handle_created = (editor: any) => {
    editor_ref.value = editor; // 记录 editor 实例，重要！
};
const file_list = ref<UploadUserFile[]>([]);
// 文件添加时触发
const upload_change = (uploadFile: UploadFile) => {
    if (!isEmpty(uploadFile.raw)) {
        const formData = new FormData();
        formData.append('type', rich_upload_type.value == 'img' ? 'image' : rich_upload_type.value == 'video' ? 'video' : rich_upload_type.value == 'file' ? 'file' : '');
        formData.append('category_id', '[]');
        formData.append('upfile', uploadFile?.raw || '');
        const on_upload_progress = (progressEvent: any) => {
            uploadFile.percentage = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2));
        };
        UploadAPI.uploadAttachment(formData, on_upload_progress)
            .then((res: any) => {
                if (res.code == 0) {
                    const url = res.data.url;
                    const alt = res.data.name;
                    // 弹出框结束的时候触发添加事件
                    if (rich_upload_type.value == 'img') {
                        upload_insert.value(res.data.url, alt);
                    } else {
                        upload_insert.value(url);
                    }
                }
                ElMessage.success('上传成功');
            })
            .catch((err) => {
                ElMessage.success('上传失败');
            });
    } else {
        ElMessage.success('上传失败');
    }
}
const emit = defineEmits(['update:value']);
// 内容改变
const handle_change = (editor: any) => {
    html_value.value = editor.getHtml();
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editor_ref.value;
    if (editor == null) return;
    editor.destroy();
});
</script>
<style lang="scss" scoped>
.rich-text-content {
    position: relative;
    z-index: 9;
    .editor {
        position: relative;
        overflow-y: hidden;
        * {
            max-width: 100%;
        }
    }
}
.upload-visiable {
    visibility: hidden;
}
</style>
