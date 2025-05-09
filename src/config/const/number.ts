import defaultCommon from './index';
interface DefaultInput {
    title: string;
    form_value: string;
    placeholder: string;
    is_required: string;
    is_limit_num: string;
    format: string;
    is_decimal: string;
    is_thousandths_symbol: string;
    decimal_num: number;
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
    is_decimal: '0',
    is_thousandths_symbol: '0',
    decimal_num: 0,
    format: 'num',
    min_num: '',
    max_num: '',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultInput;
