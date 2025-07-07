import defaultCommon from './index';

interface DefaultSelect {
    title: string;
    form_value: string[];
    province_name: string,
    city_name: string,
    county_name: string,
    detailed_value: string;
    address_type: string;
    placeholder: string;
    is_required: string;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultSelect: DefaultSelect = {
    title: '地址',
    address_type: 'noDetailed',
    form_value: [],
    province_name: '',
    city_name: '',
    county_name: '',
    detailed_value: '',
    placeholder: '请选择内容',
    is_required: '0',
    com_width: 150,
    com_height: 66,
    common_config: defaultCommon
};

export default defaultSelect;
