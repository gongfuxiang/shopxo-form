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
    is_display_uppercase: string;
    is_display_money: string;
    money_sign: string;
    decimal_num: number;
    min_num: string;
    max_num: string;
    is_desensitization: string,
    desensitization_value: string[],
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    title: '数字',
    form_value: '',
    placeholder: '请输入内容',
    is_required: '0',
    is_limit_num: '0',
    is_decimal: '0',
    is_thousandths_symbol: '0',
    is_display_uppercase: '0',
    is_display_money: '0',
    money_sign: '',
    decimal_num: 0,
    format: 'num',
    min_num: '',
    max_num: '',
    is_desensitization: '0',
    desensitization_value: [],
    com_width: 200,
    com_height: 56,
    common_config: defaultCommon
};

export default defaultInput;
