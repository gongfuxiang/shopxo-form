import defaultCommon from './index';

interface DefaultText {
    title: string;
    file: string[];
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultText: DefaultText = {
    title: '文件',
    file: [],
    com_width: 200,
    com_height: 56,
    common_config: defaultCommon
};

export default defaultText;
