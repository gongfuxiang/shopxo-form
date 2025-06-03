import defaultCommon from './index';
interface DefaultInput {
    title: string;
    form_value: string[] | string;
    start_placeholder: string;
    end_placeholder: string;
    is_required: string;
    date_style: string;
    date_type: string;
    icon_name: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    title: '日期时间组',
    form_value: '',
    start_placeholder: '请选择开始时间',
    end_placeholder: '请选择结束时间',
    is_required: '0',
    date_style: 'horizontal',
    date_type: 'option6',
    icon_name: 'date',
    com_width: 200,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultInput;
