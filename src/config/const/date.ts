import defaultCommon from './index';
interface DefaultInput {
    title: string;
    form_value: string;
    placeholder: string;
    is_required: string;
    date_style: string;
    date_type: string;
    icon_name: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    title: '日期时间',
    form_value: '',
    placeholder: '请选择时间',
    is_required: '0',
    date_style: 'horizontal',
    date_type: 'option6',
    icon_name: 'date',
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultInput;
