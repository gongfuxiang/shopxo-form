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

export const layout_settings = {
    computer: {
        flex_direction: 'column',
        filed_title_width: 100,
        filed_title_justification: 'left',
        filed_title_size_type: 'small',
        input_width_type: 'default',
    },
    mobile: {
        flex_direction: 'column',
        filed_title_width: 100,
        filed_title_justification: 'left',
        filed_title_size_type: 'small',
        input_width_type: 'default',
    }
};

export const style_settings = {
    computer: {
        background_type: 'color',
        background_color: '#F8F8F8',
        background_image: [],
        heading_type: 'color',
        heading_color: '#C1EBFF',
        heading_image: [],
        is_show_heading_title: '0',
        heading_title_location: "left",
        heading_title_size: 14,
        heading_title_font_weight: '400',
        heading_title_color: '#000000',
        submit_color: '#2A94FF',
    },
    mobile: {
        background_type: 'color',
        background_color: '#F8F8F8',
        background_image: [],
        heading_type: 'color',
        heading_color: '#C1EBFF',
        heading_image: [],
        is_show_heading_title: '0',
        heading_title_location: "left",
        heading_title_size: 14,
        heading_title_font_weight: '400',
        heading_title_color: '#000000',
        submit_color: '#2A94FF',
    }
}
// 只好设置
export const font_weight = [
    { name: '加粗', value: 'bold' },
    { name: '正常', value: '400' },
];