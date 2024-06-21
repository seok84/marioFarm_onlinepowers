import Api from "@/modules/api/Api";

export default class MypageApi extends Api {
    constructor(context) {
        super(context);
    }

    getMypage() {
        return this.get('/api/mypage');
    }

    getGrade() {
        return this.get('/api/mypage/grade');
    }
}
