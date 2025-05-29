import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import CommonAPI from '@/api/common';
import { get_title_style, get_layout_style, get_frame_style, get_icon_size, get_color_style, get_frame_size } from '@/utils/index';
export const commonStore = defineStore('common', () => {
    // 链接是否需要调接口判断
    const is_common_api = ref(false);
    const is_immersion_model = ref(false);
    const is_have_tabs = ref(false);
    const header_height = ref(0);
    const address_list = ref([]);
    const common = ref({
        article_category: [] as any[], //---- 文章分类
        attachment_category: [] as any[], //---- 附件分类
        brand_category: [] as any[], //---- 品牌分类
        brand_list: [] as any[], //---- 品牌列表
        goods_category: [] as any[], //---- 商品分类
        module_list: [] as any[], //---- 模块列表
        page_link_list: [] as any[], //---- 页面链接
        plugins: {} as any, //---- 插件
        config: {
            common_amap_map_ak: '',
            common_amap_map_safety_ak: '',
            common_baidu_map_ak: '',
            common_map_type: '',
            common_tencent_map_ak: '',
            common_tianditu_map_ak: '',
            currency_symbol: '',
            attachment_host: '',
            store_diy_url: '',
            site_logo_app: '',
            site_logo_wap: '',
            site_logo: '',
            site_name: '',
        } as any, // 基础数据配置参数
    });
    const form_config = ref<any>({});
    const form_layout = ref({});
    type model = {
        [key: string]: string;
    }
    const form_model_config = ref<model>({});
    const set_form_layout = (data: any) => {
        form_layout.value = data;
    };
    const set_config = (data: any) => {
        form_config.value = data;
    };
    const set_model_config = (data: any) => {
        form_model_config.value = data;
    }
    // 存储链接数据
    const set_common = (data: any) => {
        common.value = data;
        is_common_api.value = true;
    };
    // 如果为false 则转为true
    const set_is_common_api = (bool: boolean) => {
        is_common_api.value = bool;
    };

    const set_is_immersion_model = (bool: boolean) => {
        is_immersion_model.value = bool;
    };

    const set_is_have_tabs = (bool: boolean) => {
        is_have_tabs.value = bool;
    };

    const set_header_height = (height: number) => {
        header_height.value = height;
    };
    const get_address = () => {
        CommonAPI.getAddress().then((res: any) => {
            address_list.value = res.data;
        });
    };
    // 标题样式
    const title_style = computed(() => get_title_style(form_layout.value));
    // 布局样式
    const layout_style = computed(() => get_layout_style(form_layout.value));
    // 输入框大小控制
    const frame_style = computed(() => get_frame_style(form_layout.value));
    const frame_size = computed(() => get_frame_size(form_layout.value));
    const help_icon_size = computed(() => get_icon_size(form_layout.value));
    const color_style = computed(() => get_color_style(form_layout.value));
    return {
        common,
        is_common_api,
        is_immersion_model,
        is_have_tabs,
        header_height,
        form_layout,
        title_style,
        layout_style,
        frame_style,
        frame_size,
        help_icon_size,
        color_style,
        address_list,
        form_config,
        form_model_config,
        set_common,
        set_is_common_api,
        set_is_immersion_model,
        set_is_have_tabs,
        set_header_height,
        set_form_layout,
        set_model_config,
        get_address,
        set_config,
    };
});
