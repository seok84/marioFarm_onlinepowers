<template>
    <div id="popupArea">
        <div v-for="data in result" :id="'popup_' + data.popupId" class="p_admin_win" :style="data.popupStyle">
            <div class="p_header">
                <h3 class="p_header_tit">{{data.subject}}</h3>
            </div>
            <div class="p_body">
                <div v-if="data.popupImage !== '' && data.popupImage !== null
                        && data.imageLink !== '' && data.imageLink !== null">
                    <a :href="data.imageLink" target="_blank">
                        <img :src="data.popupImageSrc" border="0" />
                    </a>
                </div>
                <div v-else-if="data.popupImage !== '' && data.popupImage !== null">
                    <img :src="data.popupImageSrc" border="0" />
                </div>
                <div v-else v-html="unescapeHtml(nl2br(data.content))"></div>
            </div>
            <div class="check_area">
                <input type="checkbox" :id="'check' + data.popupId" title="선택" @click="setCookie(data.popupId)">
                <label :for="'check' + data.popupId">오늘 하루 이 창을 열지 않음</label>
            </div>
            <a href="javascript:void(0);" class="p_admin_win_close" @click="popupClose(data.popupId)">
                <span class="screen_out">닫기</span>
            </a>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function() {
            return {
                result: []
            }
        },
        methods: {
            setCookie: function(popupId) {
                $s.api.popup.setCookie('2', popupId);
            },
            popupClose: function(popupId) {
                $s.api.popup.popupClose('2', popupId);
            },
			makeLayerPopup: function(list) {
                this.result = list;
			}
		}
    }
</script>