import Api from "@/modules/api/Api";

export default class ExperienceApi extends Api {
    constructor(context) {
        super(context);
    }


    getExperienceById(experienceId){
        return this.get(`/api/experience-team/${experienceId}`);
    }

    getExperienceApplysApi(param){
        return this.get('/api/experience-team/applys', param);
    }

    experienceTeamApplyInsert(param){
        return this.post(`/api/experience-team/${param.experienceId}/apply/create`, param);

    }

    getExperienceTeamApplyByUserId(experienceId){
        return this.get(`/api/experience-team/${experienceId}/me/detail`);
    }

    experienceTeamApplyUpdate(param){
        return this.post(`/api/experience-team/${param.experienceId}/apply/edit`, param);
    }

    experienceTeamApplyDelete(param){
        return this.post(`/api/experience-team/${param.experienceId}/apply/delete`, param);
    }

    getExperienceApplyApi(applyId) {
        return this.get(`/api/experience-team/apply/${applyId}`);
    }

    getExperienceReviewsApi(param) {
        return this.get(`/api/experience-team/reviews`, param);
    }

    getExperienceReviewApi(reviewId) {
        return this.get(`/api/experience-team/${reviewId}/review`);
    }

    deleteExperienceReviewImage(imageId){
        return this.post(`/api/experience-team/review-image/${imageId}`);
    }

    deleteExperienceReview(param){
        return this.post(`/api/experience-team/${param.id}/review/delete`, param);
    }
}