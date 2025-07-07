import defaultCommon from './index';

interface DefaultRect {
    type: string;
    border_size: number;
    border_color: string;
    border_style: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultRect: DefaultRect = {
    type: 'rect',
    border_size: 1,
    border_color: '#000',
    border_style: 'solid',
    com_width: 50,
    com_height: 50,
    common_config: defaultCommon
};

export default defaultRect;
