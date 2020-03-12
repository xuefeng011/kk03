<template>
	<view>
		<cu-custom bgColor="title-bg" :isBack="false" :isHome="true">
			<block slot="backText"></block>
			<block slot="homeText"></block>
			<block slot="content">首页</block>
		</cu-custom>
		
		<uni-list class="">
			<uni-list-item title="测试" note="信息"></uni-list-item>
			<uni-list-item title="" note=""></uni-list-item>
		</uni-list>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad: function() {
			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor: "#ffffff",
				title: '首页',
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor: "#ffffff"
			})
			// #endif
		},
		methods: {

		}
	}
</script>

<style>
	
</style>
