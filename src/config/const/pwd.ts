import defaultCommon from './index';

interface DefaultSelect {
    title: string;
    form_value: string;
    placeholder: string;
    icon_name: string;
    is_required: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    title: '密码',
    form_value: '',
    placeholder: '请输入密码',
    icon_name: 'lock',
    is_required: '0',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultSelect;
