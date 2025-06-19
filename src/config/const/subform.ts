import defaultCommon from './index';

interface DefaultText {
    title: string;
    form_value: any[];
    form_error_list: any[];
    children: any;
    subform_type: string;
    computer: {
        is_fixed: string;
        fixed_num: number;
    };
    mobile: {
        arrange: string;
        is_fixed: string;
        horizontal_fixed_num: number;
        direction_fixed_num: string;
    };
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultText: DefaultText = {
    title: '子表单',
    form_value: [{}],
    children: [],
    form_error_list: [],
    com_width: 150,
    com_height: 66,
    subform_type: 'computer',
    computer: {
        is_fixed: '1',
        fixed_num: 1,
    },
    mobile: {
        arrange: 'horizontal',
        is_fixed: '1',
        horizontal_fixed_num: 1,
        direction_fixed_num: 'the_first_three',
    },
    common_config: defaultCommon
};

export default defaultText;
