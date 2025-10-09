import CommonAPI from '@/api/common';
import { da } from 'element-plus/es/locale';

import { cloneDeep } from 'lodash';
 
/**
 * 判断对象数组等是否为空。
 */
export function isEmpty(value: any) {
    return value === null || value === undefined || value === '' || (typeof value === 'number' && isNaN(value)) || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0);
}
/**
 * 判断一个对象是否为空。
 *
 * 为空的定义是对象的键的数量为0。这适用于任何对象，包括普通对象、数组（视为对象）等。
 * 该函数不直接使用`Object.keys(obj).length === 0`进行判断，而是通过封装这个逻辑来提供一个独立的、可重用的函数。
 * 这样做可以增加代码的可读性和可维护性，并且抽象了对象为空的检查，使得调用者不需要关心具体的实现细节。
 *
 * @param obj 要检查的对象。可以是任何类型的对象，包括数组。
 * @returns 如果对象为空，则返回true；否则返回false。
 */
export function is_obj_empty(obj: object): boolean {
    return Object.keys(obj).length === 0;
}
/**
 * 判断一个字符串是否是数字。
 * @param val 要检查的值
 * @returns 如果字符串为数字，则返回true；否则返回false。
 */
export function is_number(val: string | number): boolean {
    return typeof val == 'number' && !isNaN(val);
}
/**
 * 将对象或数组中的字符串转换为数字
 * 此函数递归地遍历给定对象或数组，将所有能转换为数字的字符串转换成数字类型
 * 如果字符串不能转换为数字，则保留原字符串
 *
 * @param obj 任意类型的对象或数组，需要转换其中的字符串
 * @param maxDepth 递归的最大深度，默认为100，用于防止无限递归
 * @param currentDepth 当前递归的深度，默认为0
 * @returns 转换后的对象或数组，结构与原输入相同
 */
export function convert_strings_to_numbers(obj: any, maxDepth: number = 100, currentDepth: number = 0): any {
    // 递归深度限制
    if (currentDepth >= maxDepth) {
        return obj;
    }
    if (Array.isArray(obj)) {
        // 处理数组
        return obj.map((item) => convert_strings_to_numbers(item, maxDepth, currentDepth + 1));
    } else if (is_obj(obj)) {
        // 处理对象
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const value = obj[key];
            if (typeof value === 'string') {
                // 处理字符串
                const numValue = Number(value);
                if (!isNaN(numValue) && value.trim() !== '') {
                    acc[key] = numValue;
                } else {
                    acc[key] = value;
                }
            } else if (is_obj(value)) {
                // 递归处理子对象
                acc[key] = convert_strings_to_numbers(value, maxDepth, currentDepth + 1);
            } else {
                // 其他类型直接保留
                acc[key] = value;
            }
            return acc;
        }, {});
    } else {
        // 非对象类型直接返回
        return obj;
    }
}

/**
 * 检查给定的参数是否为对象
 *
 * 此函数用于精确地验证一个变量是否为对象类型它通过以下步骤实现：
 * 1. 特殊处理 `null` 值，因为 `null` 在 JavaScript 中被当作对象处理，但实质上它不是
 * 2. 使用 `typeof` 操作符初步判断变量是否为对象
 * 3. 使用 `Object.prototype.toString.call(obj)` 方法精确判断变量是否为普通的对象
 *
 * @param obj 未知类型的参数，待检查是否为对象
 * @returns 如果参数是对象，则返回 true；否则返回 false
 */
export function is_obj(obj: unknown): boolean {
    // 特殊处理 null值，因为 typeof null 返回 "object"，但 null 并不是我们要检查的对象
    if (obj === null) return false;
    // 使用 typeof 排除非对象类型
    if (typeof obj != 'object') return false;
    // 确认是普通对象
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 渐变色的方法
 * color_list: [] 渐变色的存储
 * direction 渐变色的角度
 * @param {string[], string} path
 * @returns {string}
 */
export function gradient_computer(new_style: gradientStyle, is_return_all: boolean = true) {
    let color_list = new_style.color_list;
    let direction = new_style.direction;
    return gradient_handle(color_list, direction, is_return_all);
}
/**
 * 根据给定的颜色列表和方向生成一个线性渐变的CSS样式字符串。
 *
 * @param color_list 颜色列表，包含渐变中的各个颜色值。
 * @param direction 渐变的方向，可以是角度或其他CSS支持的渐变方向。
 * @param is_return_all 是否返回所有样式，包括渐变类型、颜色列表和方向。默认为false，只返回渐变样式。
 * @returns 返回一个字符串，包含生成的线性渐变样式。
 */
export function gradient_handle(color_list: color_list[], direction: string, is_return_all: boolean = true) {
    let container_common_styles = ``;
    if (color_list && color_list.length > 0) {
        if (is_return_all) {
            container_common_styles += `background:`;
        }
        container_common_styles += `linear-gradient(${direction || '180deg'},`;

        const new_color_list = JSON.parse(JSON.stringify(color_list));
        new_color_list.forEach((item: any, index: number) => {
            container_common_styles += `${item.color ? item.color : 'rgb(255 255 255 / 0%)'}`;
            if (color_list.length == 1) {
                container_common_styles += ` ${item.color_percentage || 0}%, ${item.color ? item.color : 'rgb(255 255 255 / 0%)'} 100%`;
            } else {
                if (typeof item.color_percentage === 'number') {
                    if (index == color_list.length - 1) {
                        container_common_styles += ` ${item.color_percentage}%`;
                    } else {
                        container_common_styles += ` ${item.color_percentage}%,`;
                    }
                } else {
                    if (index == color_list.length - 1) {
                        container_common_styles += ` 100%`;
                    } else if (index == 0) {
                        container_common_styles += ` 0%,`;
                    } else {
                        container_common_styles += ` ${(100 / color_list.length) * index}%,`;
                    }
                }
            }
        });
        container_common_styles += `)`;
        if (is_return_all) {
            container_common_styles += `;`;
        }
    }
    return container_common_styles;
}

/**
 * 计算并组合组件的常用样式。
 *
 * 该函数通过调用一系列特定样式的计算函数，来组装一个组件的常用样式字符串。
 * 这些样式包括渐变色、内边距、外边距、圆角和阴影等，为组件提供了一套完整的外观定义。
 *
 * @param new_style  组件的新样式对象，包含了需要计算的样式属性。
 * @returns 返回一个字符串，包含了计算后的样式定义，可以被直接应用于组件的样式属性。
 */
export function common_styles_computer(new_style: componentsCommonCommonStyle) {
    return radius_computer(new_style.border_radius) + border_computer(new_style) + `background:#fff;overflow:hidden;`;
}
/**
 * 设置内边距的方法
 * new_style: 内边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
interface newPaddingStyle extends paddingStyle {
    padding_top_safe_value?: number;
}
export function padding_computer(new_style: newPaddingStyle, scale: number = 1) {
    let top = new_style.padding_top;
    if (typeof new_style.padding_top_safe_value == 'number') {
        top += new_style.padding_top_safe_value;
    }
    return `padding: ${top * scale || 0}px ${new_style.padding_right * scale || 0}px ${new_style.padding_bottom * scale || 0}px ${new_style.padding_left * scale || 0}px;`;
}

/**
 * 设置外边距的方法
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function margin_computer(new_style: marginStyle) {
    return `margin: ${new_style.margin_top || 0}px ${new_style.margin_right || 0}px ${new_style.margin_bottom || 0}px ${new_style.margin_left || 0}px;`;
}

/**
 * 设置圆角的方法
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function radius_computer(new_style: radiusStyle, scale: number = 1) {
    return `border-radius: ${new_style.radius_top_left * scale || 0}px ${new_style.radius_top_right * scale || 0}px ${new_style.radius_bottom_right * scale || 0}px ${new_style.radius_bottom_left * scale || 0}px;`;
}

export const border_computer = (new_style: border_style) => {
    const { border_is_show = '0', border_color = '', border_style = 'solid', border_size = { padding: 0, padding_bottom: 0, padding_left: 0, padding_right: 0, padding_top: 0 } } = new_style;
    if (border_is_show == '1') {
        return `border-width: ${border_size.padding_top}px ${border_size.padding_right}px ${border_size.padding_bottom}px ${border_size.padding_left}px;border-style: ${border_style};border-color: ${border_color};box-sizing: content-box;`;
    }
    return '';
};
/**
 * 设置阴影样式
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function box_shadow_computer(new_style: boxShadowStyle) {
    return `box-shadow: ${new_style.box_shadow_x || 0}px ${new_style.box_shadow_y || 0}px ${new_style.box_shadow_blur || 0}px ${new_style.box_shadow_spread || 0}px ${new_style.box_shadow_color || 'rgba(0,0,0,0)'};`;
}

/**
 * 设置阴影样式
 * new_style: 外边距的集合
 * @param {string[], string} path
 * @returns {string}
 */
export function background_computer(new_style: backgroundImgUrlStyle) {
    if (new_style.background_img.length > 0) {
        let url_styke = '';
        if (new_style.background_img_style == '1') {
            url_styke = 'background-repeat: repeat;';
        } else if (new_style.background_img_style == '2') {
        } else {
            url_styke = `background-repeat: no-repeat;background-position: center;`;
        }
        switch (new_style.background_img_style) {
            case '1':
                url_styke = `background-repeat: no-repeat;background-position: bottom;background-size: 100% auto;`;
                break;
            case '2':
                url_styke = `background-repeat: no-repeat;background-position: center;background-size: 100% auto;`;
                break;
            case '3':
                url_styke = 'background-repeat: repeat;';
                break;
            case '4':
                url_styke = 'background-size: cover;background-position: center;';
                break;
            default:
                url_styke = `background-repeat: no-repeat;background-position: top;background-size: 100% auto;`;
                break;
        }
        return `background-image:url(${new_style.background_img[0].url});${url_styke}`;
    } else {
        return '';
    }
}

/**
 * 生成一个随机数学字符串。
 * @returns {string} 一个6位的36进制随机字符串。
 */
export function get_math(): string {
    // 通过Math.random()生成随机数，并转换为36进制的字符串
    let randomString = Math.random().toString(36);
    // 确保随机字符串至少有6位，因为substring(2)可能会使短于6位的字符串产生错误。
    // 如果字符串长度不足6位，通过padStart将其前面填充为0，直到长度达到6位。
    randomString = randomString.length >= 6 ? randomString : randomString.padStart(6, '0');
    // 截取掉随机字符串开头的'0.'部分，获得最终的6位随机字符串。
    return 'form' + randomString.substring(2);
}

/**
 * 附件字节大小转换为单位
 * @author  Devil
 * @blog    http://gong.gg/
 * @version 1.0.0
 * @date    2024-07-21
 * @desc    description
 * @param   {int}        size [文件大小]
 */
export function annex_size_to_unit(size: number = 0) {
    var unit = 'KB';
    var kb = size / 1024;
    if (kb < 1024) {
        unit = 'KB';
        size = Math.round(kb * 100) / 100;
    } else if (kb < 1024 * 1024) {
        unit = 'MB';
        size = Math.round((size / (1024 * 1024)) * 100) / 100;
    } else if (kb < 1024 * 1024 * 1024) {
        unit = 'GB';
        size = Math.round((size / (1024 * 1024 * 1024)) * 100) / 100;
    }
    return size + unit;
}
/**
 * 获取文件名的扩展名。
 * 该函数用于从给定的文件名中提取扩展名。它通过寻找文件名中最后一个点字符的位置来确定扩展名的开始，
 * 并返回从该位置到字符串结尾的所有字符。如果文件名中没有点字符，或者点字符位于文件名的开头，
 * 则表示没有扩展名，函数将返回空字符串。
 *
 * @param name 文件名或路径名。
 * @returns 文件名的扩展名，如果不存在扩展名则返回空字符串。
 */
export const ext_name = (name: string) => {
    // 查找最后一个点字符的位置。
    const i = name.lastIndexOf('.');
    // 如果找到了点字符，并且点字符不是在字符串的开头（即确保它是扩展名的一部分）。
    if (i >= 0) {
        // 从点字符位置到字符串末尾提取扩展名，并转换为小写。
        return name.substring(i).toLowerCase();
    }
    // 如果没有找到点字符，或者点字符在字符串的开头，返回空字符串。
    return '';
};

/**
 * 将大小计算成百分比
 *
 * @param num 当前的大小或位置。
 * @param size 容器的大小。
 * @returns 计算后的百分比值，含4位小数
 */
export const percentage_count = (num: number, container_size: number) => {
    const marks = (num / container_size) * 100;
    return marks.toFixed(4) + '%';
};

/**
 * 判断四个值是否相等
 *
 * @param a,b,c,d 对应的四个数字
 * @returns boolean true表示相等，false表示不相等
 */
export const areAllEqual = (a: number, b: number, c: number, d: number) => {
    if (a === null || a === undefined || b === null || b === undefined || c === null || c === undefined || d === null || d === undefined) {
        return false;
    }
    return a === b && b === c && c === d;
};

/**
 * 计算当前偏移量
 *
 * @param size 当前的组件的大小宽或者高。
 * @param location 容器的位置的偏移量。
 * @param container_size 对应位置的容器的大小
 * @returns 偏移量
 */
export const location_compute = (size: number, location: number, container_size: number) => {
    if (size + location >= container_size) {
        const deviation = container_size - size;
        if (deviation >= 0) {
            return deviation;
        } else {
            return 0;
        }
    } else {
        return location;
    }
};

/**
 * 读取指定名称的cookie值
 * @param name 需要读取的cookie的名称
 * @returns 返回cookie的值，如果未找到则返回空字符串
 */
export const get_cookie = (name: string) => {
    // 初始化cookie值为空字符串
    var cookievalue = '';
    // 定义要搜索的cookie名称字符串
    var search = name + '=';
    // 检查是否存在cookie
    if (document.cookie.length > 0) {
        // 尝试查找cookie名称的位置
        let offset = document.cookie.indexOf(search);
        // 如果找到了cookie名称
        if (offset != -1) {
            // 跳过cookie名称的长度
            offset += search.length;
            // 查找cookie值的结束位置（可能是分号或者字符串末尾）
            let end = document.cookie.indexOf(';', offset);
            if (end == -1) end = document.cookie.length;
            // 提取并解码cookie值
            cookievalue = decodeURIComponent(document.cookie.substring(offset, end));
        }
    }
    // 返回获取到的cookie值
    return cookievalue;
};
/**
 * 设置cookie
 * 该函数用于设置一个cookie，包括cookie的名称、值和过期时间
 * @param name {string} - cookie的名称
 * @param value {string} - cookie的值
 * @param expire_time {number} - cookie的过期时间，单位为天
 */
export const set_cookie = (name: string, value: string, expire_time?: number) => {
    // 构造cookie字符串
    var cookie_str = name + '=' + encodeURIComponent(value);
    if (expire_time) {
        // 获取当前时间
        var now = new Date();
        // 计算过期时间
        var expire_date = new Date(now.getTime() + expire_time * 86400);
        cookie_str += ';expires=' + expire_date.toUTCString();
        // 将新增的cookie储存到cookie中，可以存储多个而不是替换
        document.cookie = cookie_str;
    } else {
        // 将新增的cookie储存到cookie中，可以存储多个而不是替换
        document.cookie = cookie_str;
    }
};

// style 风格
export const tabs_style = (color: string, style: string | number | boolean | undefined) => {
    const color_list = ['rgba(51,51,51,1)', 'rgba(255, 34, 34, 1)', 'rgba(255, 255, 255, 1)'];
    if (color_list.includes(color)) {
        if (style == '2' || style == '4') {
            return 'rgba(255, 255, 255, 1)';
        } else if (style == '3') {
            return 'rgba(255, 34, 34, 1)';
        } else {
            return 'rgba(51,51,51,1)';
        }
    } else {
        return color;
    }
};
/**
 * 获取在线资源URL的异步函数
 * 该函数根据当前环境变量的配置选择不同的方式来获取资源URL
 * 如果环境变量VITE_APP_BASE_API被设置为'/dev-api'，则从本地开发环境中导入临时数据
 * 否则，从cookie中获取资源主机地址
 * 这种设计允许开发者在不同的环境中灵活切换资源URL的来源，以适应不同的开发和生产需求
 * @param directory {string} - 资源目录名称
 * @returns {Promise<string>} 返回一个Promise，解析为包含资源URL的字符串
 */
export const online_url = async (directory: string = '') => {
    if (import.meta.env.VITE_APP_BASE_API == '/dev-api') {
        let temp_data = await import(import.meta.env.VITE_APP_BASE_API == '/dev-api' ? '../../temp.d' : '../../temp_pro.d');
        return temp_data.default.temp_attachment_host + directory;
    } else {
        // let attachemnt_host = common.config.attachment_host;
        let attachemnt_host = get_cookie('attachment_host') && get_cookie('attachment_host') !== 'null' && get_cookie('attachment_host') !== null ? get_cookie('attachment_host') : '';
        if (attachemnt_host.length <= 0) {
            await CommonAPI.getInit().then((res: any) => {
                set_cookie('attachment_host', res.data.config.attachment_host);
                attachemnt_host = res.data.config.attachment_host;
                // 将数据存到localStorage中
                localStorage.setItem('forminput_init_common', res.data);
            });
        }
        return attachemnt_host + directory;
    }
};
/**
 * 获取标题样式
 * 根据配置信息生成标题的CSS样式字符串
 * @param config 包含配置信息的对象，用于决定标题的样式
 * @returns 返回一个字符串，包含了标题的CSS样式
 */
export const get_title_style = (config: any) => {
    // 从配置中提取与计算机相关的数据
    const data = config.computer;
    // 标题大小控制
    // 根据配置中的filed_title_size_type字段决定标题字体大小
    let style = `font-weight: bold;font-size:${data.filed_title_size_type == 'big' ? 22 : data.filed_title_size_type == 'middle' ? 16 : 12}px;color:#333;`;
    //标题宽度控制
    // 根据flex_direction字段决定标题的对齐方式和宽度
    if (data.flex_direction == 'column') {
        style += `justify-content: flex-start;`;
    } else if (data.flex_direction == 'row') {
        style += `width: ${data.filed_title_width}px;justify-content:${data.filed_title_justification}`;
    }
    // 返回拼接好的样式字符串
    return style;
};
/**
 * 根据配置信息获取图标尺寸
 *
 * 此函数旨在通过配置信息中的相关设置来确定图标的合适尺寸
 * 它根据计算机配置中的文件标题字体大小来决定图标的大小
 *
 * @param config 包含配置信息的对象，特别是计算机相关的配置
 * @returns {number} 图标的推荐尺寸，单位为像素
 */
export const get_icon_size = (config: any) => {
    // 提取配置对象中的计算机相关数据
    const data = config.computer;
    // 根据文件标题字体大小决定图标尺寸
    return data.filed_title_size_type == 'big' ? 20 : data.filed_title_size_type == 'middle' ? 14 : 12;
};

export const get_color_style = (config: any) => {
    // 提取配置对象中的计算机相关数据
    const data = config.computer;
    let padding = '0.3rem 0.6rem';
    let size = '12';
    switch (data.filed_title_size_type) {
        case 'big':
            size = '20';
            padding = '1.1rem 1.2rem';
            break;
        case 'middle':
            size = '14';
            padding = '0.5rem 0.6rem';
            break;
        default:
            size = '12';
            padding = '0 0.6rem';
            break;
    }
    // 根据文件标题字体大小决定图标尺寸
    return `padding:${padding};line-height:2.2rem;font-size:${data.filed_title_size_type == 'big' ? 16 : data.filed_title_size_type == 'middle' ? 14 : 12}px;`;
};
/**
 * 根据配置信息获取框架样式
 * 此函数旨在为不同的计算机配置提供动态样式调整选项
 * 它主要通过调整高度和字体大小来适应不同的显示需求
 *
 * @param config - 包含计算机配置信息的对象
 * @returns 返回一个字符串，包含了根据配置动态生成的CSS样式
 */
export const get_frame_style = (config: any) => {
    // 提取配置对象中的计算机相关数据
    const data = config.computer;
    // 根据字段标题字体大小动态生成框架的样式
    // 字体大小和高度根据配置的不同而变化
    return `width:100%;max-width:${data.input_width_type == 'default' ? `${ data.input_width }px;` : '100%'};height:${data.filed_title_size_type == 'big' ? 54 : data.filed_title_size_type == 'middle' ? 40 : 30}px;font-size:${data.filed_title_size_type == 'big' ? 16 : data.filed_title_size_type == 'middle' ? 14 : 12}px;`;
};

export const get_frame_size = (config: any) => {
    // 提取配置对象中的计算机相关数据
    const data = config.computer;

    // 根据字段标题字体大小动态生成框架的样式
    // 字体大小和高度根据配置的不同而变化
    return `font-size:${data.filed_title_size_type == 'big' ? 16 : data.filed_title_size_type == 'middle' ? 14 : 12}px;`;
};
/**
 * 根据配置信息生成布局样式
 * 此函数旨在根据配置对象中计算机相关数据生成动态的CSS样式字符串，用于控制布局
 * 主要通过配置信息中的flex_direction字段来决定布局的方向和对齐方式
 *
 * @param config 包含计算机配置信息的对象，用于生成动态样式
 * @returns 返回一个字符串，包含了根据配置信息生成的CSS样式
 */
export const get_layout_style = (config: any) => {
    // 提取配置信息中的计算机数据
    const data = config.computer;

    // 初始化样式字符串，包含基本的flex布局设置和gap属性，flex-direction根据配置信息动态设置
    let style = `display:flex;gap:10px;flex-direction:${data.flex_direction};`;

    // 根据flex_direction的值，添加相应的对齐方式
    if (data.flex_direction == 'row') {
        // 当flex_direction为row时，添加垂直居中对齐
        style += `align-items: baseline;`;
    } else if (data.flex_direction == 'column') {
        // 当flex_direction为column时，添加水平居中对齐
        style += `justify-content: center;`;
    }

    // 返回生成的样式字符串
    return style;
};

/**
 * 格式检查函数
 * @param data 待检查的数据对象
 */
export const get_format_checks = (data: any, is_format: boolean = false, type: string = '') => {
    // 判断是否是必填字段,并且没有值
    if (data.is_required == '1' && isEmpty(data.form_value)) {
        // 是否报错显示
        data.common_config.is_error = '1';
        data.common_config.error_text = `${ ['select', 'checkbox', 'upload', 'time', 'address', 'score', 'radio'].includes(type) ? '必选' : '必填'}字段不能为空`;
    } else {
        // 否就清除报错显示
        data.common_config.is_error = '0';
        data.common_config.error_text = '';
        if (is_format) {
            if (type == 'number') {
                // 数字组件的校验逻辑
                number_range_handle(data, data.form_value);
            } else if (type == 'checkbox') {
                // 复选框和复选下拉框的校验逻辑
                checkbox_range_handle(data, data.form_value);
            } else {
                // 单行文本的校验逻辑
                // 对字段进行格式检查
                get_format_checks_v2(data.common_config, data.form_value);
            }
        }
    }
};
// 复选框和复选下拉框的校验逻辑
export const checkbox_range_handle = (data: any, form_value: any) => {
    const { min_num = '', max_num = '' } = data;
    const length = form_value?.length || 0;
    const minNum = Number(min_num);
    const maxNum = Number(max_num);
    if ((!isEmpty(min_num) && length < minNum) || (!isEmpty(max_num) && length > maxNum)) {
        // 是否报错显示
        data.common_config.is_error = '1';
        data.common_config.error_text = `请选择${min_num}~${max_num}项`;
    } else {
        // 否就清除报错显示
        data.common_config.is_error = '0';
        data.common_config.error_text = '';
    }
};
// 数字组件的校验逻辑
export const number_range_handle = (data: any, form_value: any) => {
    const { min_num = '', max_num = '', format = 'num' } = data;
    const num = Number(form_value);
    const minNum = Number(min_num);
    const maxNum = Number(max_num);
    if ((!isEmpty(min_num) && num < minNum) || (!isEmpty(max_num) && num > maxNum)) {
        // 是否报错显示
        data.common_config.is_error = '1';
        data.common_config.error_text = `请输入${min_num}${format == 'num' ? '' : '%'}~${max_num}${format == 'num' ? '' : '%'}之间的数`;
    } else {
        // 否就清除报错显示
        data.common_config.is_error = '0';
        data.common_config.error_text = '';
    }
};

const type_config = [
    { name: '手机号码', value: 'phone-number', check: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/ },
    { name: '电话号码', value: 'telephone-number', check: [/^0\d{0,3}-?\d{7,8}$/, /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/] },
    { name: '邮政编码', value: 'postal-code', check: /^[1-9]\d{5}$/ },
    { name: '身份证号码', value: 'id-no', check: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/ },
    { name: '邮箱', value: 'email', check: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
];

// 构建 Map 提升查找效率
const typeConfigMap = new Map(type_config.map((item) => [item.value, item]));

/**
 * 根据通用配置和给定值进行格式校验
 * 该函数用于检查输入值是否符合特定的格式要求，主要应用于用户输入验证
 *
 * @param common_config 通用配置对象，包含格式和错误信息的配置
 * @param value 需要进行格式校验的值
 */
export const get_format_checks_v2 = (common_config: componentsCommonCommonStyle, value: any) => {
    // 检查值是否为空，如果为空则直接重置错误状态
    if (!isEmpty(value)) {
        // 根据通用配置中的格式，从类型配置映射中获取对应的格式检查项
        const item = typeConfigMap.get(common_config.format);
        // 如果找不到对应的格式检查项，则不进行后续操作
        if (!item) return;

        // 初始化验证状态为不通过
        let isValid = false;
        // 检查项可能是一个数组，包含多个正则表达式，循环遍历直到找到一个匹配的正则表达式
        if (Array.isArray(item.check)) {
            for (const regex of item.check) {
                // 如果当前正则表达式匹配成功，则标记验证状态为通过，并停止循环
                if (regex.test(value)) {
                    isValid = true;
                    break;
                }
            }
        } else {
            // 如果检查项不是一个数组，直接进行正则表达式匹配
            isValid = item.check.test(value);
        }

        // 根据验证结果更新通用配置对象的错误状态和错误信息
        if (isValid) {
            common_config.is_error = '0';
            common_config.error_text = '';
        } else {
            common_config.is_error = '1';
            const error_text = item.value == 'telephone-number' ? `请输入正确的电话号码或手机号码格式` : `请输入正确的${item.name}格式`;
            common_config.error_text = error_text;
        }
    } else {
        // 如果值为空，重置错误状态
        common_config.is_error = '0';
        common_config.error_text = '';
    }
};

/**
 * 格式化数字字符串或数值
 * 此函数根据是否需要转换，将输入的数字字符串或数值格式化为带有逗号分隔的字符串
 * 如果不需要转换，则移除输入中的所有逗号
 *
 * @param num - 输入的数字字符串或数值
 * @param is_convert - 指示是否需要转换的布尔值
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: string | number, is_convert: boolean) => {
    if (is_convert) {
        // 将输入转换为字符串形式以便处理
        const number = num.toString();
        // 使用正则表达式将整数部分每三位用逗号分隔
        const integerPart = number.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // 避免小数为空的时候也处理
        const decimalPart = number.split('.')[1] == null ? '' : '.' + number.split('.')[1];
        // 组合整数部分和小数部分
        return integerPart + decimalPart;
    } else {
        // 如果不需要转换，移除所有逗号并返回
        return num.toString().replace(/,/g, '');
    }
};

const convert_to_chinese_currency = (amount: number | string) => {
    const num = Number(amount);
    // 定义数字到中文的映射
    const numMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    // 定义单位，从元到分
    const units = ['分', '角', '元', '拾', '佰', '仟', '万', '亿', '拾', '佰', '仟', '万', '拾', '佰', '仟']; // 修正单位数组

    // 处理小数部分
    let decimalPart = (num * 100).toFixed(0).substr(-2); // 取小数点后两位
    let decimalChinese = '';
    for (let i = 0; i < decimalPart.length; i++) {
        decimalChinese += numMap[Number(decimalPart[i])];
        decimalChinese += units[i];
    }

    // 处理整数部分
    amount = Math.floor(num); // 转换为整数处理，避免小数点影响
    let integerPart = amount.toString();
    let integerChinese = '';
    for (let i = 0; i < integerPart.length; i++) {
        const digit = Number(integerPart[i]); // 显式转换为数字
        integerChinese += numMap[digit]; // 使用数字索引访问 numMap
        if (i < integerPart.length - 1) {
            // 非最后一位时添加单位
            integerChinese += units[units.length - integerPart.length + i]; // 动态匹配单位
        }
    }

    // 拼接整数部分和小数部分
    return integerChinese + (decimalChinese ? '整' : '') + (decimalChinese || '');
};

//#region 样式更新时配置更新
export const date_style_options = (date_style: string) => {
    const style = (unit: any, is_last: boolean = false) => style_handle(date_style, unit, is_last);
    return [
        { value: 'option1', label: `HH${style('hour')}mm${style('minute', true)}` },
        { value: 'option2', label: `HH${style('hour')}mm${style('minute')}ss${style('second', true)}` },
        { value: 'option3', label: `YYYY${style('year')}MM${style('month', true)}` },
        { value: 'option4', label: `YYYY${style('year')}MM${style('month')}DD${style('day', true)}` },
        { value: 'option5', label: `YYYY${style('year')}MM${style('month')}DD${style('day')}HH${style('hour')}mm${style('minute', true)}` },
        { value: 'option6', label: `YYYY${style('year')}MM${style('month')}DD${style('day')}HH${style('hour')}mm${style('minute')}ss${style('second', true)}` },
    ];
};
// 定义可用的 date_style 类型
type DateStyle = 'horizontal' | 'slash' | 'chinese';

// 明确声明 styles 类型
const date_styles: Record<DateStyle, Record<string, string>> = {
    horizontal: {
        year: '-',
        month: '-',
        day: ' ',
        hour: ':',
        minute: ':',
        second: '',
    },
    slash: {
        year: '/',
        month: '/',
        day: ' ',
        hour: ':',
        minute: ':',
        second: '',
    },
    chinese: {
        year: '年',
        month: '月',
        day: '日 ',
        hour: '时',
        minute: '分',
        second: '秒',
    },
};

/**
 * 根据指定的类型和是否为最后一个元素获取相应的样式
 *
 * 此函数旨在根据用户选择的日期样式（currentStyle）和请求的类型（type）返回适当的样式
 * 如果当前样式不存在、请求的样式类型不存在，或者在特定条件下（当前样式不是中文且为最后一个元素），
 * 函数将返回空字符串
 *
 * @param type - 需要获取样式的类型
 * @param is_last - 是否为最后一个元素，默认为false
 * @returns 返回对应的样式字符串或空字符串
 */
const style_handle = (date_style: string, type: string, is_last: boolean = false) => {
    // 将form.value.date_style断言为DateStyle类型，确保类型安全
    const currentStyle = date_style as DateStyle; // 类型断言
    // 检查当前样式是否存在于预定义的样式中，如果不存在，返回空字符串
    if (!(currentStyle in date_styles)) {
        return '';
    }

    // 根据当前样式获取对应的样式映射
    const mapping = date_styles[currentStyle];
    // 根据类型获取对应的样式结果
    const result = mapping[type];

    // 如果结果未定义，或者当前样式不是中文且为最后一个元素，返回空字符串
    if (result === undefined || (currentStyle !== 'chinese' && is_last)) {
        return '';
    }

    // 返回找到的样式结果
    return result;
};

/**
 * 将时间戳转换为指定格式的日期字符串
 * @param {number|string} time - 时间
 * @param {string} [date_style='horizontal'] - 日期格式风格：horizontal/slash/chinese
 * @returns {string} 格式化后的日期时间字符串
 */
export const time_stamp = (time: string, date_style = 'horizontal', date_type: string) => {
    // 如果时间为空或不是数字，则返回空字符串
    if (isEmpty(time)) {
        return '';
    }
    let new_time = time;
    // 检查时间是否符合日期格式, 不符合的话，添加上固定的年月日
    if (['option1', 'option2'].includes(date_type) && isNaN(new Date(new_time).getTime())) {
        new_time = '1970/01/01 ' + time.replace(/时|分|秒/g, ':').replace(/:+$/, '');
    }
    let date = new Date(new_time.replace(/-/g, '/').replace(/年|月|日/g, '/').replace(/\/+$/, ''));
    // 如果可以直接解析成功，就使用直接解析好的数据
    if (!isNaN(new Date(new_time).getTime())) {
        date = new Date(new_time);
    }
    // 获取各时间组件
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // 获取对应的分隔符配置
    const style = (date_styles as Record<string, Record<string, string>>)[date_style] || date_styles.horizontal;
    // 组合成完整日期时间字符串
    if (date_type == 'option1') {
        return `${hours}${style.hour}${minutes}${date_style == 'chinese' ? style.minute : ''}`;
    } else if (date_type == 'option2'){
        return `${hours}${style.hour}${minutes}${style.minute}${seconds}${date_style == 'chinese' ? style.second : ''}`;
    } else if (date_type == 'option3'){
        return `${year}${style.year}${month}${date_style == 'chinese' ? style.month : ''}`;
    } else if (date_type == 'option4'){
        return `${year}${style.year}${month}${style.month}${day}${ date_style == 'chinese' ? style.day : ''}`;
    } else if (date_type == 'option5'){
        return `${year}${style.year}${month}${style.month}${day}${style.day}${hours}${style.hour}${minutes}${date_style == 'chinese' ? style.minute : ''}`;
    } else {
        return `${year}${style.year}${month}${style.month}${day}${style.day}${hours}${style.hour}${minutes}${style.minute}${seconds}${date_style == 'chinese' ? style.second : ''}`;
    }
}
//#endregion

// 工具函数：安全地将字符串转为数字并格式化
export const parse_and_format = (value: any, decimalNum: number): number | null => {
    if (isEmpty(value)) return null;
    const num = Number(formatNumber(value, false));
    return isNaN(num) ? null : parseFloat(num.toFixed(decimalNum));
};

/**
 * 根据指定类型对字符串进行脱敏处理，若不满足格式要求则返回 '***'
 * @param value 待脱敏的字符串
 * @param type 脱敏类型
 * @returns 脱敏后的字符串或 '***'
 */
export const get_desensitization = (value: string, type: string): string => {
    switch (type) {
        case 'all':
            // 全部字符替换为 *
            return value.replace(/./g, '*');
        case 'name':
            // 姓名：保留首尾各 1 个字
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value.replace(/^(.).*(.)$/, '$1**$2') : value.replace(/./g, '*');
        case 'email':
            // 邮箱：显示前 3 位和 @ 及之后部分
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? value.replace(/^([a-zA-Z0-9]{3})[a-zA-Z0-9.+-]*@/, '$1****@') : value.replace(/./g, '*');
        case 'phone':
            // 手机号：显示前 3 位和后 4 位
            return /^1[3-9]\d{9}$/.test(value) ? value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : value.replace(/./g, '*');
        case 'money':
            // 金额：统一显示 *****
            return '*****';
        case 'id':
            // 身份证：显示后 4 位
            return /^\d{17}[\dXx]$/.test(value) ? value.replace(/^.*(\d{4})$/, '**********$1') : value.replace(/./g, '*');
        case 'address':
            // 地址：显示前 4 个汉字和后 4 个汉字
            return /^[\u4e00-\u9fa5]{8,}$/.test(value) ? value.replace(/^([\u4e00-\u9fa5]{4})[\u4e00-\u9fa5]*(?=(.{4}))$/, '$1****$2') : value.replace(/./g, '*');
        case 'IP_address':
            // IP 地址：只显示第一段
            return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value) ? value.split('.')[0] + '****' : value.replace(/./g, '*');
        case 'car_number':
            // 车牌号：显示第一个汉字和最后两位数字
            return /^[\u4e00-\u9fa5][A-Za-z]\d{5,6}$/.test(value) ? value.replace(/^([\u4e00-\u9fa5]).*(\d{2})$/, '$1****$2') : value.replace(/./g, '*');
        default:
            return value.replace(/./g, '*');
    }
};


export const get_border_left_right_size = (new_style: border_style) => { 
    const { border_is_show = '0', border_size = { padding: 0, padding_bottom: 0, padding_left: 0, padding_right: 0, padding_top: 0 } } = new_style;
    if (border_is_show == '1') {
        return border_size.padding_left + border_size.padding_right;
    }
    return 0;
};

// 只有没有其他提示warning的时候才提示
export const is_show_message_warning = (message: string) => {
    if (document.querySelectorAll(".el-message.el-message--warning").length < 3) {
        ElMessage.warning(message);
    }
};

/**
 * 接口Item定义了具有特定属性的项的结构
 * 包含项的唯一标识id，项的位置location，以及项的组件数据com_data
 */
interface Item {
    id: string;
    is_enable: string;
    location: { x: number; y: number };
    com_data: { com_width: number; com_height: number };
}

/**
 * 计算容器的位置
 * 根据提供的项列表、特定项的ID、位置类型、间距以及初始位置坐标，计算出新容器的位置
 * 
 * @param list 项的列表，每个项都符合Item接口的结构
 * @param id 需要计算位置的项的ID
 * @param type 定义了计算位置的类型，可以是'left'（计算左侧位置）或'top'（计算顶部位置）
 * @param spacing 项之间的间距
 * @param locationx 容器的初始x轴位置
 * @param locationy 容器的初始y轴位置
 * @returns 返回一个包含新x和y坐标的对象，根据type参数的不同，相应的坐标将被计算更新
 */
export const get_container_location = (list: Item[], id: string, type: 'left' | 'top', spacing: number, locationx: number, locationy: number) => {
    let x = locationx;
    let y = locationy;

    // 遍历项列表，寻找匹配给定ID的项
    for (const item of list) {
        if (item.id === id) {
            // 解构获取项的位置和组件数据，如果没有提供则使用默认
            const { location = { x: 0, y: 0 }, com_data = { com_width: 0, com_height: 0 }, is_enable = '0' } = item;
            const width = is_enable == '1' ? com_data.com_width : 0;
            const height = is_enable == '1' ? com_data.com_height : 0;
            // 计算新的x和y坐标，根据组件的宽度/高度和间距
            const new_x = location.x + width + spacing;
            const new_y = location.y + height + spacing;

            // 根据type参数更新x或y坐标
            if (type === 'left') {
                x = new_x;
            } else if (type === 'top') {
                y = new_y;
            }

            break; // 找到匹配项后即停止遍历
        }
    }

    // 返回更新后的坐标
    return { x, y };
}

// 截取document.location.search字符串内id/后面的所有字段
export const get_id = () => {
    let new_id = '';
    if (document.location.search.indexOf('id/') != -1) {
        new_id = document.location.search.substring(document.location.search.indexOf('id/') + 3);
        // 去除字符串的.html
        let html_index = new_id.indexOf('.html');
        if (html_index != -1) {
            new_id = new_id.substring(0, html_index);
        }
        return new_id;
    } else {
        return new_id;
    }
};

interface RegionItem {
  id: string | number;
  name: string;
  items?: RegionItem[];
}
/**
 * 根据省市区ID数组获取对应的名称路径
 * @param data 级联数据数组
 * @param ids 要查找的ID数组 [省ID, 市ID, 区ID]
 * @returns 包含省市区名称的数组，如果未找到则返回空数组
 */
export const get_region_names_by_id = (data: RegionItem[], ids: (string | number)[]): string[] => {
  if (!data || !ids || ids.length === 0) {
    return [];
  }

  const result: string[] = [];
  let currentData = data;
  
  for (const id of ids) {
    const foundItem = currentData.find(item => item.id === id);
    if (!foundItem) {
      return [];
    }
    result.push(foundItem.name);
    currentData = foundItem.items || [];
  }
  return result;
}
// 保存的数据规整
export const data_organization = (data: any) => { 
    if (isEmpty(data)) {
        return '';
    }
    const clone_form = cloneDeep(data);
    clone_form.diy_data.forEach((item: any) => { 
        item.show_tabs = '0';
        item.common_style = common_styles_computer(item.com_data.common_config);
        // 子表单需要统一规整一下数据
        if (item.key == 'subform') {
            item.com_data?.children.forEach((item_data: any, index: number) => {
                item_data.common_style =  common_styles_computer(item_data.com_data.common_config);
            })
        } else if (['date', 'date-group'].includes(item.key)) { 
            const com_data = item.com_data;
            const data = new Map(date_style_options(com_data.date_style).map(item => [item.value, item]));
            const new_format = data.get(com_data.date_type)?.label || 'yyyy-MM-DD HH:mm:ss';
            com_data.format = new_format.replaceAll('Y', 'y').replaceAll('D', 'd').replaceAll('S', 's');
            if (item.key == 'date') {
                com_data.new_form_value = time_stamp(com_data.form_value, com_data.date_style, com_data.data_type);
            } else {
                com_data.new_form_value = [];
                if (com_data.form_value.length > 0) {
                    com_data.new_form_value = com_data.form_value.map((item: any) => time_stamp(item, com_data.date_style, com_data.data_type));
                }
            }
        }
    });
    return clone_form;
}