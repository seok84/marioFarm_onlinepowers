import Vue from 'vue'

/* https://beomy.tistory.com/62 */
/* css 에 display:none 이 설정되어 있을 경우 v-show 를 사용해도 block/none 이 진행되지 않아 지시어 추가 */
// 2022-02-08 권세희 - 사용하지 않을 예정입니다. v-show 사용예정 (css 에서 display:none 제거하도록 퍼블 수정요청하였으며 반영전임)
Vue.directive("display", function(el, binding) {    // bind & update
    let value = binding.value.value ?? binding.value;
    let attribute = binding.value.attribute ?? "block";
    el.style.display = value ? attribute : "none";
})

/* https://coder-question-ko.com/cq-ko-blog/133559 */
Vue.directive("scroll", {
    inserted: function(el, binding) {
        let f = function (evt) {
            if (binding.value(evt, el)) {
                window.removeEventListener('scroll', f)
            }
        }
        window.addEventListener('scroll', f);
    }
})