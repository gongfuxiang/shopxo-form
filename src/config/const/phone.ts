import defaultCommon from './index';

interface DefaultSelect {
    title: string;
    form_value: string;
    form_value_code: string;
    placeholder: string;
    icon_name: string;
    is_required: string;
    is_telephone: string,
    is_sms_verification: string,
    is_img_sms_verification: string,
    is_desensitization: string,
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    title: '手机',
    form_value: '',
    form_value_code: '',
    placeholder: '请输入内容',
    icon_name: 'phone',
    is_required: '0',
    is_telephone: '0',
    is_sms_verification: '0',
    is_img_sms_verification: '0',
    is_desensitization: '0',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultSelect;
