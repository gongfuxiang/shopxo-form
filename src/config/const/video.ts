import defaultCommon from './index';

interface DefaultText {
    title: string;
    video: uploadList[];
    video_img: uploadList[];
    video_width: number,
    video_scale_type: string,
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultText: DefaultText = {
    title: '视频',
    video: [],
    video_img: [],
    video_width: 200,
    video_scale_type: '1',
    com_width: 200,
    com_height: 200,
    common_config: defaultCommon
};

export default defaultText;
