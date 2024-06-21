import Api from "@/modules/api/Api";

export default class BusinessConversionApi extends Api{
    getDownloadFile(){
        return this.downloadFile('/api/mypage/converse-business/download', {}, 'blob');
    }
}