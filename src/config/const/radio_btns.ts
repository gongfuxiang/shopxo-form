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
interface DefaultRadio {
    type: string;   
    title: string;
    form_value: string;
    other_value: string;
    option_list: option[];
    placeholder: string;
    is_required: string;
    is_limit_num: string;
    max_num: string;
    min_num: string;
    is_desensitization: string,
    desensitization_value: string[],
    is_multicolour: string;
    show_hidden_list: show_hidden[];
    arrangement: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultRadio: DefaultRadio = {
    type: 'radio-btns',
    option_list: [{ name: '选项1', value: get_math(), color: '#eb5050' }, { name: '选项2', value: get_math(), color: '#f0a800' }, { name: '选项3', value: get_math(), color: '#46c26f' }],
    show_hidden_list: [],
    title: '单选按钮组',
    form_value: '',
    other_value: '',
    placeholder: '请输入内容',
    is_required: '0',
    is_limit_num: '0',
    max_num: '',
    min_num: '',
    is_desensitization: '0',
    desensitization_value: [],
    is_multicolour: '0',
    arrangement: 'horizontal',
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultRadio;
