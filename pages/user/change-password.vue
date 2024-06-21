<template>
	<section class="contents change_pw_contents">
		<div class="tit_wrap">
			<h2 class="tit">비밀번호 변경하기</h2>
		</div>
		<div class="container">
			<div class="row no-gutters justify-content-center">
				<div class="col-12 col-md-6 col-lg-4">
					<div class="form_wrap_line">
						<form @submit.prevent="submit">
							<fieldset>
								<legend>비밀번호 변경하기</legend>
								<div class="form-group">
									<input type="password" v-model="param.originalPassword" class="form-control line"
									       placeholder="기존 비밀번호를 입력하세요"
									       title="기존 비밀번호를 입력하세요" required>
								</div>
								<div class="form-group">
									<input type="password" v-model="param.password"
									       @change="valid($event, validate.password)"
									       class="form-control line" placeholder="새 비밀번호를 입력하세요" title="새 비밀번호를 입력하세요"
									       required>
									<div class="invalid-feedback">비밀번호는 영문/숫자/특수문자를 혼합하여 8자 이상 20자 이하로 입력하세요.</div>
								</div>
								<div class="form-group">
									<input type="password" v-model="param.corfirmPassword"
									       @change="validfeed($event, corfirmPasswordFlag)"
									       class="form-control line" placeholder="비밀번호 재입력해주세요" title="비밀번호 재입력해주세요"
									       required>
									<div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
								</div>
								<div class="info_dot">
									<p>비밀번호 변경 후 90일이 지난 후에는 비밀번호 재설정을 권장합니다.</p>
									<p>[연장하기]버튼을 누르시면 기존 비밀번호로 유지됩니다.</p>
								</div>
								<div class="row no-gutters btn-group">
									<div class="col">
										<button type="submit" class="btn btn_lg btn_primary">변경</button>
									</div>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
let $s, vm;

export default {
	head() {
		return {
			script: [],
			link: [
				{rel: 'stylesheet', href: '/static/css/users.css'}
			]
		}
	},
	beforeCreate: function () {
		// 기존 Vue로 작성된 스크립트 실행시 적용
		$s = this.$saleson;
		vm = this;
	},
	data: function () {
		return {
			param: {
				password: '',
				corfirmPassword: '',
				originalPassword: '',
			},
			validate: {
				password: $s.validator.patterns.password
			},
			target : $s.pages.INDEX
		}
	},
	methods: {
		submit: function () {

			if (!vm.checkfeed('.form_wrap_line')) {
				return;
			}

			$s.confirm('비밀번호를 변경 하시겠습니까?', function () {

				$s.api.changePassword(vm.param, function (response) {
					$s.alert('비밀번호 변경 완료 했습니다.', function () {
						$s.redirect($s.pages.LOGIN);
					});
				}, function (error) {
					$s.alert(error.response.data.message);
				});

			});
		}
	},
	computed: {
		corfirmPasswordFlag: function () {
			return this.param.password == this.param.corfirmPassword;
		}
	},
	mounted: function() {
		this.$nextTick(function () {

		});
	}
}
</script>

