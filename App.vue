<script>
	import Vue from 'vue'
	import {
		mapActions
	} from 'vuex';
	import {
		loginMp,loginAlipay
	} from './utils/loginhelper.js'
	export default {
		onLaunch: function() {
			// console.error("App onLaunch")
			var _this = this;
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			// #ifndef H5
			uni.getSetting({
				async success(res) {
					console.log("getsettings", res)
					if (res.authSetting['scope.userInfo'] || res.authSetting['userInfo']) {
						console.log("res.authSetting getsettings1")
						// #ifdef MP-ALIPAY
						my.getOpenUserInfo({
							fail: (res) => {},
							success: async (res) => {
								console.error("getOpenUserInfo", res)
						
								let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response  
						
								loginAlipay().then(async openid => {
									console.log("openid succ", openid)
									Object.assign(userInfo, {
										openid
									})
								
									return await _this.ApiLogin(userInfo);
								
								}).catch(error => {
									console.log("openid error", error)
								})
						
							}
						});
						// #endif

						// #ifndef MP-ALIPAY
						uni.getUserInfo({
							"withCredentials": true,
							async success(res) {
								console.log("App OnLaunch 用户已授权登录 getUserInfo withCredentials", res.userInfo)
								// //用户已经授权过
								// console.log("app launch haslogin")
								// _this.$store.commit("login", res.userInfo)

								loginMp().then(async openid => {
									console.log("openid succ", openid)
									Object.assign(res.userInfo, {
										openid
									})

									return await _this.ApiLogin(res.userInfo);

								}).catch(error => {
									console.log("openid error", error)
								})



							}
						})
						// #endif


					} else {
						await _this.ApiLogin({
							nickName: ""
						});
						// console.log("app launch nologin")
					}
				},
				fail: function() {

				}
			})
			// #endif

			// #ifdef H5
			_this.ApiLogin({
				nickName: "模拟登陆"
			});

			// #endif

			if (!uniCloud) {
				console.error('uniCloud 云能力 不支持')
			} else {
				console.info('uniCloud 云能力 初始化')
				uniCloud.init({
					provider: 'aliyun',
					spaceId: '8d40765c-350f-4d9d-8a9c-6a5e00448a4a',
					clientSecret: 'TqZDuijTqF232XbXPJI/xg=='
				});
			}



		},
		onShow: function() {
			console.error('App onShow')
		},
		onLoad: function() {
			console.error('App onLoad')
		},
		methods: {
			...mapActions(['ApiLogin'])

		}

	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	
	.title-bg{
		color:#000;
		
		/* background-color: #fe0000; */
		
		
		 background-color: #fff; 
	}
	
	
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
	
</style>
