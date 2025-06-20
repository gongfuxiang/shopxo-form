import request from '@/utils/request';

class CommonAPI {
    static dataSave(data: any) {
        return request({
            url: `forminputapi/forminputdata/save`,
            method: 'post',
            data,
        });
    }
}

export default CommonAPI;
