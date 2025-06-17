import request from '@/utils/request';
import api_request from '@/utils/api-request';

class CommonAPI {
    /**  链接初始化接口 */
    static getInit() {
        return request({
            url: `forminputapi/init`,
            method: 'post',
        });
    }
    static getAddress() {
        return api_request({
            url: `?s=region/all`,
            method: 'post',
        });
    }
}

export default CommonAPI;
