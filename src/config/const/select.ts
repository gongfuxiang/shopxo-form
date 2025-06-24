import { get_math } from '@/utils';
import defaultCommon from './index';
type show_hidden = {
    value: string;
    is_show: string[];
}
interface option {
    name: string;   
    value: string;
    is_other?: string;
    color: string;
}
interface DefaultSelect {
    type: string;   
    title: string;
    form_value: string;
    other_value: string;
    option_list: option[];
    placeholder: string;
    is_required: string;
    is_multicolour: string;
    show_hidden_list: show_hidden[];
    format: string;
    arrangement: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    type: 'select',
    option_list: [{ name: '选项1', value: get_math(), color: '#eb5050' }, { name: '选项2', value: get_math(), color: '#f0a800' }, { name: '选项3', value: get_math(), color: '#46c26f' }],
    show_hidden_list: [],
    title: '下拉框',
    form_value: '',
    other_value: '',
    placeholder: '请选择内容',
    is_required: '0',
    is_multicolour: '0',
    format: 'none',
    arrangement: 'horizontal',
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultSelect;
