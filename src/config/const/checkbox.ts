import { get_math } from '@/utils';
import defaultCommon from './index';

interface option {
    name: string;   
    value: string;
    is_outer?: string;
    color: string;
}
interface DefaultInput {
    type: string;
    title: string;
    form_value: string[];
    is_multicolour: string;
    option_list: option[];
    custom_option_list: option[];
    placeholder: string;
    is_required: string;
    is_add_option: string;
    is_limit_num: string;
    min_num: string;
    max_num: string;
    arrangement: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    type: 'checkbox',
    title: '多选按钮组',
    form_value: [],
    is_multicolour: '0',
    option_list: [{ name: '选项1', value: get_math(), color: '#eb5050' }, { name: '选项2', value: get_math(), color: '#f0a800' }, { name: '选项3', value: get_math(), color: '#46c26f' }],
    custom_option_list: [],
    placeholder: '请选择内容',
    is_required: '0',
    is_add_option: '0',
    is_limit_num: '0',
    min_num: '',
    max_num: '',
    arrangement: 'horizontal',
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultInput;
