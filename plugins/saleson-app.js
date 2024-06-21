import appEvent from "@/modules/app.event";

export default (context, inject) => {
    inject('appEvent', appEvent)
}