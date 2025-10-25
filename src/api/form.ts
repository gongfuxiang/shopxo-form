import request from '@/utils/request';

class FORMINPUTAPI {
    /**  form表单初始化接口--获取详情 */
    static getInit(data: form) {
        return request({
            url: `forminputapi/forminputdetail`,
            method: 'post',
            data,
        });
    }
    /**  form表单接口--保存 */
    static save(data: formData) {
        return request({
            url: `forminputapi/forminputsave`,
            method: 'post',
            data,
        });
    }
    /** form表单导入--获取列表 */
    static getImportList(data: any) {
        return request({
            url: `forminputapi/forminputmarket`,
            method: 'post',
            data,
        });
    }
    /** form表单导入 */
    static import(data: FormData) {
        return request({
            url: `forminputapi/forminputupload`,
            method: 'post',
            data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    /** form表单导入 -- 安装 */
    static install(data: form) {
        return request({
            url: `forminputapi/forminputinstall`,
            method: 'post',
            data,
        });
    }
    /** form表单导出 */
    static export(data: form) {
        return request({
            url: `forminputapi/forminputdownload`,
            method: 'post',
            data,
        });
    }
}

export default FORMINPUTAPI;

interface form {
    /** 主键 */
    id: string;
}
export interface formData {
    id: string;
    logo: string;
    name: string;
    describe: string;
    config: formConfig | string;
    is_enable: string;
}

export interface formConfig {
    overall_config: {
        type_value: string;
        // is_layout_settings: string;
        // layout_settings: object,
        custom_size_type: string,
        custom_width: number,
        custom_height: number,
        is_style_settings: string;
        style_settings: {
            computer: object,
            mobile: object
        }, 
        is_front_end_cache: string,
        is_show_submit: string,
        submit_title: string,
        is_show_save_draft: string,
        save_draft_title: string,
    };
    diy_data: Array<any>;
}


export interface form_data_item {
    id: string;
    model: {
        logo: string;
        name: string;
        is_enable: string;
        describe: string;
    };
    overall_config: {
        type_value: string;
        is_switch_type: string;
        // is_layout_settings: string;
        // layout_settings: object,
        custom_size_type: string,
        custom_width: number,
        custom_height: number,
        is_style_settings: string;
        style_settings: {
            computer: object,
            mobile: object
        }, 
        is_front_end_cache: string,
        is_show_submit: string,
        submit_title: string,
        is_show_save_draft: string,
        save_draft_title: string,
    };
    diy_data: Array<any>;
}