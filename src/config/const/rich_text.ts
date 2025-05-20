import defaultCommon from './index';

interface DefaultSelect {
    title: string;
    form_value: string;
    placeholder: string;
    is_required: string;
    is_longitude_and_latitude: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    title: '富文本',
    form_value: '',
    placeholder: '请输入内容',
    is_required: '0',
    is_longitude_and_latitude: '0',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultSelect;
