# SalesOn Nuxt
## 기본 구성
- nodejs & npm
- nuxt
- axios
    - api 통신
- vuex-persistedstate
    - vuex 정보를 session-storage 와 local-storage 를 이용
- crypto-js
    - 암호화 처리
## 설치
- git clone
    - https://git.onlinepowers.com:8443/saleson/saleson.git
    - 브랜치명 develop-nuxt

- nodejs 설치
    - https://nodejs.org/ko/download/current/
    - 설치 확인
        ```bash
        npm -v
        node -v
        ```
- 설치 실행
    - saleson-nuxt 이동
    ```bash
    cd saleson-nuxt
    npm install
    ```
- npm 실행 (인텔리 J)
    - Run/Debug Configurations 선택
    - '+' 을 선택후 npm 선택
        - npm 이 안보일 경우
        - nodejs 플러그인 설치
    - package.json 에 nuxtg package.json 경로 설정
    - Command 'run' 선택
    - Scripts 'dev' 선택
    - 설정한 npm 선택후 실행

## 특징
- page 기본 형식
    ```html
    <template>
        <!-- 페이지 내용 -->
    </template>
    <script>
    let $s, vm;

    export default {
        layout : 'layout-default',
        head() {
            return {
                script: [
                    ...
                ],
                link: [
                    ...
                ]
            }
        },
        beforeCreate: function() {
            // 기존 Vue로 작성된 스크립트 실행시 적용
            $s = this.$saleson;
            vm = this;
        },
        data: function () {
            return {
                data : 'data'
            }
        },
        methods: {
            ...
        },
        mounted: function() {
            this.$nextTick(function () {
                
                ...
            });
        }
    }
    <script>
    ```
- 주요 변경점
    - ES6 형식을 사용
    - uri 형식 변경
        ```
        /users/login.html -> /users/login
        /items/details.html?code=G2000482026 -> /item/G2000482026
        ```

    - header & footer 의 정보 전달
        - 기존에는 각 페이지별로 header 및 footer 를 적용</br>
          -> layout-default.vue 에만 적용
        - 컴포넌트로 value 전달시 vuex 이용

    - layout 구조
        - 기존 JSP 와 비슷 한 형식의 layout 구성이 가능
            - page 작성시 필수 값임
            ``` javascript
            ...
            export default {
                layout : 'layout-default',
                ...
            }
            ...
            ```
        - layout-default
            - 공통으로 적용돠는 스크립트 및 CSS 적용
            - page 별 추가 되는 스크립트 및 CSS는 page 에 적용
            - 공통 head 적용
                - seo
                - title
            - header, fotter, alert, toast 적용
                - 기존에 진행되던 header, fotter 데이터 처리는 vuex 로 처리
                - 기존 html 에서는 header 및 fotter 라이프 사이클의 로 인해 <br/>
                  중복으로 실행하던 스크립트는 해당 컴포넌트에서만 실행 되도록 변경
    - 스크립트 모듈화
        - 대상
            - op.saleson.js
            - op.vue.js
            - op.sns.js
        - 현재 기존 스타일로 작업을 진행해도 무관 하게 변경 처리
        - 개발자 도구로 테스트시 변경점
            - op.saleson.js
                - $nuxt.$saleson.get();
            - op.vue.js
                - $nuxt.get();

    - vuex 활용
        - 기존 session storage 및 local storage 부분 변경
        - vuex 를 활용
        - 상태 저장위치를 session 또는 local 지정 가능
            - saleson-nuxt/plugins/vuex-local-storage.js
            - saleson-nuxt/plugins/vuex-session-storage.js
            - path 에 추가
                - 'aaaa' // 단일
                - 'common.aaaa' // 모듈
        - 사용할 상태값을 ./store/index.js 에 추가
        - 예시
            ``` javascript
            // 상태 변경
            $s.core.setState('saleson_id','111111');
            this.$stroe.commit('saleson_id','111111');

            // 상태 조회
            $s.core.getState('saleson_id');
            this.$stroe.state.saleson_id;
            ```
        - $s.getState 는 this.$store.getters['get']; 에 지정된 상태 값 조회

