import defaultCommon from './index';

interface DefaultSelect {
    title: string;
    form_value: number;
    is_required: string;
    select_color: string,
    score_type: string,
    total: number,
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    title: '评分',
    form_value: 3,
    select_color: '#FFD22A',
    score_type: '0',
    total: 5,
    is_required: '0',
    com_width: 200,
    com_height: 56,
    common_config: defaultCommon
};

export default defaultSelect;
