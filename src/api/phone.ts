import request from '@/utils/request';
import api_request from '@/utils/api-request';

class CommonAPI {
    static getImageVerification () {
        return api_request({
            url: `user/userverifyentry&t=` + Math.random(),
            method: 'Get',
        });
    }
    static getVerification(data: any) {
        return api_request({
            url: `user/regverifysend`,
            method: 'post',
            data
        });
    }    
}

export default CommonAPI;
