import defaultCommon from './index';
type show_hidden = {
    value: string;
    is_show: string[];
}
interface option {
    name: string;   
    value: string;
    is_outer?: string;
    color: string;
}
interface DefaultRadio {
    type: string;   
    title: string;
    form_value: string;
    outer_value: string;
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

const defaultRadio: DefaultRadio = {
    type: 'radio-btns',
    option_list: [{ name: '选项1', value: 'option1', color: '#eb5050' }, { name: '选项2', value: 'option2', color: '#f0a800' }, { name: '选项3', value: 'option3', color: '#46c26f' }],
    show_hidden_list: [],
    title: '单选按钮组',
    form_value: '',
    outer_value: '',
    placeholder: '请输入内容',
    is_required: '0',
    is_multicolour: '0',
    format: 'none',
    arrangement: 'horizontal',
    com_width: 200,
    com_height: 56,
    common_config: defaultCommon
};

export default defaultRadio;
