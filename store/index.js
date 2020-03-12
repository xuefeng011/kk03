import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const KKDBHIS = "kkhis"
const KKDB = 'kkmas'
const KKDBLOG = "kklog"
const KKDBCHART = "kkchart"

import {
	getDb
} from '../utils/dbhelper.js'


import {
	calcData,
	formatDate
} from '../utils/common.js'


const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {
			openid: ""
		}
	},
	getters: {

	},
	mutations: {
		login(state, provider) {
			console.log("mutation login", provider)

			if (provider.nickName) {
				state.hasLogin = true;
				state.userInfo = provider;
				uni.setStorage({ //缓存用户登陆状态
					key: 'userInfo',
					data: provider
				})
				console.log(state.userInfo);
			}
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {
		async ApiLogin({
			commit,
			state,
			dispatch
		}, data) {
			commit("login", data)
			return;
		}

	}


});
export default store
