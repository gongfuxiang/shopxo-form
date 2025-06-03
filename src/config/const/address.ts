import defaultCommon from './index';

interface DefaultSelect {
    title: string;
    form_value: string[];
    detailed_value: string;
    address_type: string;
    placeholder: string;
    is_required: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    title: '地址',
    address_type: 'noDetailed',
    form_value: [],
    detailed_value: '',
    placeholder: '请选择内容',
    is_required: '0',
    com_width: 200,
    com_height: 56,
    common_config: defaultCommon
};

export default defaultSelect;
