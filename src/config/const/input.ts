import defaultCommon from './index';
interface option {
    name: string;   
    value: string;
    is_color: string;
    color: string;
}
interface DefaultInput {
    type: string;   
    title: string;
    form_value: string;
    option_list: option[];
    placeholder: string;
    is_required: string;
    format: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    type: 'single-text',
    option_list: [{ name: '选项一', value: 'option1', is_color: '0', color: '' }, { name: '选项二', value: 'option2', is_color: '0', color: '' }, { name: '选项三', value: 'option3', is_color: '0', color: '' }],
    title: '单行文本',
    form_value: '',
    placeholder: '请输入内容',
    is_required: '0',
    format: 'none',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultInput;
