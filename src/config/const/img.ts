import defaultCommon from './index';

interface DefaultText {
    title: string;
    img_src: uploadList[];
    img_width: number,
    img_scale_type: string,
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultText: DefaultText = {
    title: '图片',
    img_src: [],
    img_width: 100,
    img_scale_type: '1',
    com_width: 75,
    com_height: 75,
    common_config: defaultCommon
};

export default defaultText;
