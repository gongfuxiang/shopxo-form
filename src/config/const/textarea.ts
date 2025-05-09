import defaultCommon from './index';
interface DefaultInput {
    title: string;
    form_value: string;
    placeholder: string;
    is_required: string;
    is_limit_num: string;
    min_num: string;
    max_num: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    title: '多行文本',
    form_value: '',
    placeholder: '请输入内容',
    is_required: '0',
    is_limit_num: '0',
    min_num: '',
    max_num: '',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultInput;
