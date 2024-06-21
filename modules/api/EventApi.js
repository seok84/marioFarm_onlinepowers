import Api from "@/modules/api/Api";

export default class EventApi extends Api {
    constructor(context) {
        super(context);
    }

    getEvents(params) {
        return this.get('/api/event', params);
    }

    getEvent(link) {
        return this.get('/api/event/'+link);
    }

    getReplies(params) {
        return this.get('/api/event/replies', params);
    }

    writeReply(params) {
        return this.post('/api/event/reply', params);
    }

    getSpotItems(params) {
        return this.get('/api/event/spot', params);
    }
}
