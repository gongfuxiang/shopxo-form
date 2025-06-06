import defaultCommon from './index';

interface DefaultText {
    title: string;
    form_value: any[];
    children: any;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultText: DefaultText = {
    title: '子表单',
    form_value: [],
    children: [],
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultText;
