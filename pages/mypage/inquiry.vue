<template>
  <section class="contents inquiry_contents">
    <h2 class="screen_out">1:1문의</h2>
    <div class="tit_wrap">
      <h3 class="tit">고객센터</h3>
    </div>
    <div class="customer_wrap">
      <div class="container">

        <customer-navigation active="inquiry"></customer-navigation>

        <div class="total_top">
          <div class="total_area">
            <p class="total">전체 <span>{{result.totalElements}}</span></p>
            <button type="button" class="btn_inquiry">1:1문의하기</button>
          </div>
          <div class="inquiry_write">
            <div class="form_wrap_box">
              <div class="form-group">
                <select class="custom-select box" v-model="param.form.qnaGroup">
                  <option value="00">문의구분을 선택하세요</option>
                  <option v-for="code in qnaGroups" :value="code.id">{{code.label}}</option>
                </select>
              </div>

              <div class="form-group">
                <input type="text" class="form-control box" placeholder="제목을 입력해주세요"
                       title="제목을 입력해주세요" v-model="param.form.subject" required>
              </div>
              <div class="form-group">
                                <textarea class="form-control" cols="30" rows="10" placeholder="내용을 입력해주세요"
                                          v-model="param.form.question" required></textarea>
              </div>
              <div class="form-group file_area">
                <ul>
                  <li>
                    <div>
                      <img class="img_full" :src="fileImage" alt="썸네일">
                    </div>
                    <button type="button" class="btn_file_del" @click="fileDelete" v-if="param.form.files != null">
                      <span class="screen_out">파일삭제</span>
                    </button>
                  </li>
                  <li>
                    <input type="file" id="qnaImage" @change="fileSelect($event)">
                    <label for="qnaImage" class="btn_file_add" v-if="param.form.files == null">
                      <span class="screen_out">파일추가</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div class="row no-gutters btn-group right">
                <div class="col col-md-3 col-lg-2">
                  <button type="button" class="btn btn_lg btn_light btn_cancel">취소</button>
                </div>
                <div class="col  col-md-3 col-lg-2">
                  <button type="button" class="btn btn_lg btn_primary" @click="submit()">등록</button>
                </div>
              </div>
            </div>
          </div>

          <div class="search_form">
            <div class="row">
              <div class="col-12 col-md-4 search_input">
                <input type="hidden" placeholder="시작날짜" title="검색날짜 입력" class="form-control box"
                       name="startDate" v-model="param.list.searchStartDate">
                <input type="hidden" placeholder="종료날짜" title="검색날짜 입력" class="form-control box"
                       name="endDate" v-model="param.list.searchEndDate">
              </div>
              <div class="col-9">
                <select class="custom-select box searchDate">
                  <option value="">찾고자 하는 날짜를 설정해 주세요.</option>
                  <option value="week-1">1주일</option>
                  <option value="month-1">1개월</option>
                  <option value="month-3">3개월</option>
                  <option value="month-6">6개월</option>
                </select>
              </div>
              <div class="col-3">
                <button type="button" class="btn btn_m box btn_primary" @click="paging(1)">조회</button>
              </div>
            </div>
          </div>

        </div>

        <div class="list_wrap faq_list">
          <template v-if="result != null && result.length > 0">
            <ul>
              <li v-for="(data, index) in result" :key="data.qnaId" class="list_area list_open">
                <div class="list_in" data-toggle="collapse" :data-target="'#qna'+index">
                  <div class="list_top">
                    <p class="state" v-if="data.answerCount > 0">답변완료</p>
                    <p class="state" v-else>답변대기</p>
                    <p class="date">{{ dateFormat(data.createdDate, 'date') }}</p>
                  </div>
                  <div class="question"><span class="qa">Q.</span>{{ data.subject }}</div>
                  <p class="txt" v-html="nl2br(data.question)"></p>
                  <div class="hide_area">
                    <div class="answer" v-if="data.answerCount > 0"><span class="qa">A.</span>{{ data.qnaAnswer.title }}</div>
                    <p class="txt" v-else></p>
                    <div class="answer">{{ data.qnaAnswer.answer }}</div>
                    <p class="answer_date" v-if="data.answerCount > 0">답변일 : <span>{{ dateFormat(data.qnaAnswer.answerDate,'date') }}</span></p>
                    <p class="answer_date" v-else></p>
                    <div class="btn_right">
                      <button type="button" class="btn btn_sm btn_outline_secondary"
                              @click="deleteInquiry(data.qnaId)">삭제</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <div class="common_none" v-else><p>조회 된 1:1문의가 없습니다.</p></div>
        </div>

        <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="paging"></pagination>

      </div> <!-- container E -->

    </div> <!-- customer_wrap E -->

  </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";
import CustomerNavigation from "@/components/ui/customer-navigation";

let $s, vm;

export default {
  middleware: 'auth',
  components: {Pagination, CustomerNavigation},
  head() {
    return {
      script: [],
      link: [
        { rel: 'stylesheet', href: '/static/css/customer.css' },
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      // data
      param: {
        form: {
          qnaId: 0,
          subject: '',
          question: '',
          qnaGroup: '00',
          userName: '',
          email: '',
          files: null
        },
        list: {
          page: 1,
          itemsPerPage: 3,

          searchStartDate: '',
          searchEndDate: '',
          query: ''
        }
      },
      result: {
        content:[],
      },
      fileImage : '/static/images/thumb.png',
      qnaGroups: []
    }
  },
  methods: {
    // custom methods..
    qna:function () {
      $s.api.getInquiries(vm.param.list,
          function (response) {
            vm.result = response.content;
            vm.qnaGroups = response.qnaGroups;
          }
      );
    },


    deleteInquiry: function (id) {
      $s.confirm('1:1문의를 삭제하시겠습니까?', function () {

        vm.param.form.qnaId = id;
        $s.api.deleteInquiry(vm.param.form,
            function (response) {
              if (response.status === "OK") {
                $s.alert("삭제되었습니다.", function() {
                  location.reload();
                });
              } else {
                $s.alert(response,"삭제할 수 없습니다.");//response
              }
            }
        );

      });
    },

    submit: function () {
      $s.confirm('1:1문의를 작성하시겠습니까?', function () {

        if (vm.param.form.subject === "") {
          $s.alert("제목을 입력해주세요.");
          return false;
        } else if (vm.param.form.question === "") {
          $s.alert("내용을 입력해주세요.");
          return false;
        } else if(vm.param.form.qnaGroup === '00'){
          $s.alert("문의구분을 선택하세요.");
          return false;
        } else {

          let formData = new FormData();
          formData.append('subject', vm.param.form.subject);
          formData.append('question', vm.param.form.question);
          formData.append('qnaGroup', vm.param.form.qnaGroup);

          let files = vm.param.form.files;
          if (files != null) {
            formData.append('qnaImageFile', files);
          }

          $s.api.createInquiry(formData, function (response) {
            if (response.status === "OK") {
              $s.alert("1:1문의가 작성되었습니다.", function () {
                window.location.reload();
              });
            } else {
              $s.alert(response);
            }
          });
        }

      });
    },

    fileSelect : function(e){
      let extensions = ['jpg','jpeg','png','gif'];

      let file = e.target.files[0];
      let fileExt = e.target.value;

      // 사이즈 체크
      if (fileExt != "") {
        let fileSize = file.size;
        let maxSize = 5 * 1024 * 1024;  // 5MB

        if(fileSize > maxSize){
          $s.alert("파일크기는 5MB 이내로 등록 가능합니다.");
          return;
        }
      }

      // 확장자 체크
      fileExt = fileExt.slice(fileExt.indexOf(".") + 1).toLowerCase();
      if(fileExt != "jpg" && fileExt !="png" && fileExt != "gif" && fileExt !="bmp" && fileExt !="jpeg"){
        $s.alert("이미지 파일(jpg, png, gif, bmp, jpeg) 만 등록 가능합니다.");
        return;
      }

      // 미리보기 생성
      try {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (ie) {
          vm.fileImage = reader.result;
          vm.param.form.files = file;
        };
      } catch (e) {

      }

    },

    fileDelete : function(){
      vm.fileImage = '/static/images/thumb.png';
      vm.param.form.files = null;
    },

    paging: function (page) {
      vm.param.list.page = page;

      vm.param.list.searchStartDate = $("input[name='startDate']").val();
      vm.param.list.searchEndDate = $("input[name='endDate']").val();

      vm.qna();
    }
  },
  mounted: function() {
    this.$nextTick(function () {



      $s.DateEvent.set('.searchDate');

      // 페이지 로딩 후 실행
      vm.paging(1);

      initializeListEvent();
    });
  }
}
</script>
