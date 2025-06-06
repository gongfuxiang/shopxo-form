import defaultCommon from './index';

interface DefaultText {
    title: string;
    form_value: string;
    text_color: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultText: DefaultText = {
    title: '文本',
    form_value: '',
    text_color: '#666',
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultText;
