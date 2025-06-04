import defaultCommon from './index';

interface DefaultAuxiliary {
    title: string;
    line_type: string;
    line_style: string;
    line_width: number;
    line_location: string;
    line_size: number;
    line_color: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultAuxiliary: DefaultAuxiliary = {
    title: '辅助线',
    line_type: 'horizontal',
    line_style: 'solid',
    line_width: 100,
    line_location: 'center',
    line_size: 1,
    line_color: '#eee',
    com_width: 200,
    com_height: 17,
    common_config: defaultCommon
};

export default defaultAuxiliary;
