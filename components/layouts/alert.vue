<template>
    <div id="op-alert" class="modal fade p_notitle" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="pop_txt">
                        <p></p>
                    </div>
                    <div class="row no-gutters btn-group alert-type">
                        <div class="col-7 col-md-5">
                            <button type="button" class="btn btn_lg btn_primary op-modal-ok" data-dismiss="modal" @click="clickEvent">확인</button>
                        </div>
                    </div>
                    <div class="row no-gutters btn-group confirm-type">
                        <div class="col">
                            <button type="button" class="btn btn_lg btn_default op-modal-cancel" data-dismiss="modal">취소</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn_lg btn_primary op-modal-ok" data-dismiss="modal" @click="clickEvent">확인</button>
                        </div>
                    </div>
                </div>
                <button type="button" class="modal_close" data-dismiss="modal">
                    <span class="screen_out">닫기</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        methods: {
            clickEvent: function (e) {
                e.stopPropagation();
                this.$saleson.callbackAlert();
            }
        },
    };
</script>