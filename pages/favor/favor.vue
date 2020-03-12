<template>
	<view class="content">
		<cu-custom bgColor="title-bg" :isBack="true" :isHome="false">
			<block slot="backText"></block>
			<block slot="homeText">

			</block>
			<block slot="content">我的收藏</block>
		</cu-custom>

		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh"
		 @setEnableScroll="setEnableScroll">
			<!-- 内容部分 -->
			<swiper id="swiper" class="swiper-box" :duration="300" :current="0" >
				<swiper-item v-for="tabItem in [1]" :key="tabItem">
					<scroll-view class="panel-scroll-box" :scroll-y="true" @scrolltolower="">
						<!-- 
							* 新闻列表 
							* 和nvue的区别只是需要把uni标签转为weex标签而已
							* class 和 style的绑定限制了一些语法，其他并没有不同
						-->
						<view v-for="(item, index) in items" :key="index" class="news-item" @click="navToDetails(item)">
							<mix-item :item="item"></mix-item>
						</view>
		
						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
		
		<view class="solids-bottom flex align-center" v-if="items.length<=0">

			<view class="flex-sub text-center">
				<view class="solid-bottom text-xsl padding">
					<text class="cuIcon-roundclose text-gray"></text>
				</view>
				<view class="padding text-gray">暂无数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import json from '@/json'
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import mixItem from '@/components/mix-item/mix-item';

	import {
		getBBsApi
	} from '@/utils/dbhelper.js'

	import {
		guid
	} from '@/utils/common.js'

	let windowWidth = 0,
		scrollTimer = false,
		tabBar;


	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore,
			mixItem
		},
		data() {
			return {
				items: []
			}
		},
		async onLoad() {
			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor: "#ffffff",
				title: '我的收藏',
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor: "#ffffff"
			})
			// #endif


			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadFavors();

		},
		methods: {
			async loadFavors() {
				let res =await uni.getStorageSync("myfavor");
				console.log("favor",res)
				if(res.length>0){
					let q= JSON.parse(res);
					this.items =  q.map(p=>{return Object.assign(p,{
						time:'发帖：'+p.rtime
					})})
				}
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable) {
				if (this.enableScroll !== enable) {
					this.enableScroll = enable;
				}
			},//下拉刷新
			onPulldownReresh() {
				setTimeout(()=>{
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
				},600)
			}
			

		},
		//新闻列表

	}
</script>

<style lang='scss'>
	page,
	.content {
		background-color: #f8f8f8;
		height: 100%;
		overflow: hidden;
	}

	/* 顶部tabbar */
	.nav-bar {
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0, 0, 0, .06);
		background-color: #fff;

		.nav-item {
			display: inline-block;
			width: 150upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;

			&:after {
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid #007aff;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}

		.current {
			color: #007aff;

			&:after {
				width: 50%;
			}
		}
	}

	.swiper-box {
		height: 100%;
	}

	.panel-scroll-box {
		height: 100%;

		.panel-item {
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}

	/**
	 * 新闻列表 直接拿的nvue样式修改，,
	 * 一共需要修改不到10行代码, 另外px需要直接修改为upx，只有单位不一样，计算都是一样的
	 * 吐槽：难道不能在编译的时候把nuve中的upx转为px? 这样就不用修改单位了
	 */
	.video-wrapper {
		width: 100%;
		height: 440upx;

		.video {
			width: 100%;
		}
	}

	view {
		display: flex;
		flex-direction: column;
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.news-item {
		position: relative;
	}

	/* 修改结束 */

	/* 新闻列表  emmm 仅供参考 */
	.news-item {
		width: 750upx;
		padding: 24upx 30upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
</style>
