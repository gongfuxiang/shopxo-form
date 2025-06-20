import request from '@/utils/request';
import api_request from '@/utils/api-request';
class CommonAPI {
    static dataSave(data: any) {
        return api_request({
            url: `?s=forminputdata/save`,
            method: 'post',
            data,
        });
    }
}

export default CommonAPI;
