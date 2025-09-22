// 定义一组预定义的颜色数组，用于在各种场景中轻松引用这些颜色
// 这些颜色包括从白色到黑色的不同灰度，以及一些鲜艳的颜色，格式有十六进制、RGB、RGBA、HSV、HSL等
export const predefine_colors = ['#eb5050', '#f0a800', '#46c26f', '#a2c204', '#00aed1', '#5865f5', '#c643e0', '#f0437d', '#fa8118', '#d6c504', '#00b899', '#6ac73c', '#2f7deb', '#7e47eb', '#d941c0', '#485970', '#f9cbcb', '#fbe5b3', '#c8edd4', '#e3edb4', '#b3e7f1', '#cdd1fc', '#eec7f6', '#fbc7d8', '#fed9ba', '#f3eeb4', '#b3eae0', '#d2eec5', '#c1d8f9', '#d8c8f9', '#f4c6ec', '#c8cdd4'];

export const color_change = (length: number) => {
    // 如果大于这个大小，就按照多余的数量来获取颜色
    if (length > predefine_colors.length) {
        const new_length = predefine_colors.length - length;
        if (new_length > predefine_colors.length) {
            color_change(new_length);
        } else {
            return predefine_colors[length];
        }
    } else {
        return predefine_colors[length];
    }
};
// 数据的默认值，避免没有值的时候报错
export const old_radius = { radius: 0, radius_top_left: 0, radius_top_right: 0, radius_bottom_left: 0, radius_bottom_right: 0 };

export const old_padding = { padding: 0, padding_top: 0, padding_bottom: 0, padding_left: 0, padding_right: 0 };

export const old_margin = { margin: 0, margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0 };

export const old_border_and_box_shadow = { border_is_show: '0', border_color: '#FF3F3F', border_style: 'solid',border_size: { padding: 1, padding_top: 1, padding_right: 1, padding_bottom: 1, padding_left: 1, }, box_shadow_color: '', box_shadow_x: 0, box_shadow_y: 0, box_shadow_blur: 0, box_shadow_spread: 0 };

// export const layout_settings = {
//     computer: {
//         flex_direction: 'column',
//         filed_title_width: 100,
//         filed_title_justification: 'flex-start',
//         filed_title_size_type: 'small',
//         input_width_type: 'default',
//     },
//     mobile: {
//         flex_direction: 'column',
//         filed_title_width: 100,
//         filed_title_justification: 'flex-start',
//         filed_title_size_type: 'small',
//         input_width_type: 'default',
//     }
// };

export const style_settings = {
    computer: {
        background_type: 'color',
        background_color: '#F8F8F8',
        background_image: [],
        heading_type: 'color',
        heading_color: '#C1EBFF',
        heading_image: [],
        is_show_heading_title: '0',
        heading_title_location: "flex-start",
        heading_title_size: 14,
        heading_title_font_weight: '400',
        heading_title_color: '#000000',
        submit_color: '#2A94FF',
        flex_direction: 'column',
        filed_title_width: 100,
        filed_title_justification: 'flex-start',
        filed_title_size_type: 'small',
        input_width_type: 'default',
        input_width: 354,
    },
    mobile: {
        background_type: 'color',
        background_color: '#F8F8F8',
        background_image: [],
        heading_type: 'color',
        heading_color: '#C1EBFF',
        heading_image: [],
        is_show_heading_title: '0',
        heading_title_location: "flex-start",
        heading_title_size: 14,
        heading_title_font_weight: '400',
        heading_title_color: '#000000',
        submit_color: '#2A94FF',
        flex_direction: 'column',
        filed_title_width: 100,
        filed_title_justification: 'flex-start',
        filed_title_size_type: 'small',
        input_width_type: 'default',
        input_width: 354,
    }
}
// 只好设置
export const font_weight = [
    { name: '加粗', value: 'bold' },
    { name: '正常', value: '400' },
];

export const desensitization_options = [
    { value: 'all', name: '全脱敏', desc: '脱敏全部内容' },
    { value: 'name', name: '姓名', desc: '显示前 1 个字，后 1 个字' },
    { value: 'email', name: '邮箱', desc: '显示前 3 位，@和之后的字' },
    { value: 'phone', name: '手机号', desc: '显示前 3 位，后 4 位' },
    { value: 'money', name: '金额', desc: '脱敏全部内容，统一 5 位数' },
    { value: 'id', name: '身份证件', desc: '显示后 4 位' },
    { value: 'address', name: '住址', desc: '显示前 4 个字，后 4 个字' },
    { value: 'IP_address', name: 'IP地址', desc: '显示第 1 段 IP' },
    { value: 'car_number', name: '车牌号', desc: '显示前 1 个字，后 2 位' },
]


// 截取document.location.search字符串内id/后面的所有字段
export const get_id = () => {
    let new_id = '';
    // 去除origin的数据
    const url = document.location.href;
    if (url.indexOf('id/') != -1) {
        new_id = url.substring(url.indexOf('id/') + 3);
        // 去除字符串的.html
        let html_index = new_id.indexOf('.html');
        if (html_index != -1) {
            new_id = new_id.substring(0, html_index);
        }
        return new_id;
    } else if (url.indexOf('-saveinfo') != -1) {
        new_id = url.substring(url.indexOf('-saveinfo-') + 10);
        // 去除字符串的.html
        const dot_data = new_id.split('.')[0];
        if (dot_data != '') {
            new_id = dot_data.split('/')[0];
        }
        return new_id;
    } else {
        return new_id;
    }
};

export const get_type = () => {
    let new_type = '';
    // 去除origin的数据
    const url = document.location.href;
    if (url.indexOf('type/') != -1) {
        new_type = url.substring(url.indexOf('type/') + 5);
        // 去除字符串的.html
        const dot_data = new_type.split('.')[0];
        if (dot_data != '') {
            new_type = dot_data.split('/')[0];
        }
        return new_type;
    } else {
        return new_type;
    }
}
