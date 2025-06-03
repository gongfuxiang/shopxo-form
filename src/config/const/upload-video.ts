import defaultCommon from './index';
interface DefaultInput {
    title: string;
    form_value: string[];
    is_required: string;
    is_limit_num:  string;
    limit: number;
    is_limit_size: string;
    upload_size: number;
    com_width: number;
    com_height: number;
    common_config: object;
}

const defaultInput: DefaultInput = {
    title: '上传视频',
    form_value: [],
    is_required: '0',
    is_limit_num: '1',
    limit: 1,
    is_limit_size: '1',
    upload_size: 10,
    com_width: 200,
    com_height: 56,
    common_config: {
        ...defaultCommon,
        border_type: 'dashed'
    }
};

export default defaultInput;
