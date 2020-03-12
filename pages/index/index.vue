<template>
	<view class="content">
		<cu-custom bgColor="title-bg" :isBack="false" :isHome="true">
			<block slot="backText"></block>
			<block slot="homeText">
				<text class="cuIcon-favor text-blue" @click="gotoFavor"></text>
			</block>
			<block slot="content">首页</block>
		</cu-custom>

		<!-- 顶部选项卡 -->
		<!-- 	<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft">
			<view v-for="(item,index) in tabBars" :key="item.id" class="nav-item" :class="{current: index === tabCurrentIndex}"
			 :id="'tab'+index" @click="changeTab(index)">{{item.name}}</view>
		</scroll-view> -->

		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh"
		 @setEnableScroll="setEnableScroll">
			<!-- 内容部分 -->
			<swiper id="swiper" class="swiper-box" :duration="300" :current="tabCurrentIndex" @change="changeTab">
				<swiper-item v-for="tabItem in tabBars" :key="tabItem.id">
					<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadMore">
						<!-- 
							* 新闻列表 
							* 和nvue的区别只是需要把uni标签转为weex标签而已
							* class 和 style的绑定限制了一些语法，其他并没有不同
						-->

						<view v-for="(item, index) in items" :key="item.id" class="news-item">
							<navigator class="navx" :url="`/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`" open-type="navigate" animation-type="pop-in">
								<mix-item :item="item"></mix-item>
							</navigator>
						</view>



						<!-- 上滑加载更多组件 -->
						<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>

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
				tabCurrentIndex: 0, //当前选项卡索引
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				tabBars: [],
				items: [],
				pageindex: 1
			}
		},
		async onLoad() {
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


			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadTabbars();

		},
		methods: {
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			//获取分类
			loadTabbars() {
				let tabList = json.tabList;
				tabList.forEach(item => {

					item.loadMoreStatus = 0; //加载更多 0加载前，1加载中，2没有更多了
					item.refreshing = 0;
				})
				this.tabBars = tabList;
				this.loadNewsList('add');
			},
			//新闻列表
			async loadNewsList(type) {
				let tabItem = this.tabBars[this.tabCurrentIndex];
				console.log("tabItem.id", tabItem.id)
				//type add 加载更多 refresh下拉刷新
				if (type === 'add') {
					this.pageindex++;
					if (tabItem.loadMoreStatus === 2) {
						return;
					}
					tabItem.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if (type === 'refresh') {
					tabItem.refreshing = true;
				}
				// #endif

				//setTimeout模拟异步请求数据


				console.log("X", datas)
				if (type === 'refresh') {
					this.pageindex = 1

				}
				let datas = await this.getDatas(tabItem.id)

				// await uni.setStorageSync("myfavor", JSON.stringify(datas))

				if (type === 'refresh') {
					this.items = []; //刷新前清空数组
				}
				this.items = this.items.concat(datas)

				//下拉刷新 关闭刷新动画
				if (type === 'refresh') {
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
					// #ifdef APP-PLUS
					tabItem.refreshing = false;
					// #endif
					tabItem.loadMoreStatus = 0;
				}
				//上滑加载 处理状态
				if (type === 'add') {

					tabItem.loadMoreStatus = datas.length <= 0 ? 2 : 1;
				}

			},
			//新闻详情
			navToDetails(item) {
				let data = {
					id: item.id,
					title: item.title,
					author: item.author,
					time: item.time
				}
				uni.navigateTo({
					url: `/pages/detail/detail?data=${JSON.stringify(data)}`
				})
			},

			//下拉刷新
			onPulldownReresh() {
				this.loadNewsList('refresh');
			},
			//上滑加载
			loadMore() {
				this.loadNewsList('add');
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable) {
				if (this.enableScroll !== enable) {
					this.enableScroll = enable;
				}
			},

			//tab切换
			async changeTab(e) {

				if (scrollTimer) {
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if (typeof e === 'object') {
					index = e.detail.current
				}
				if (typeof tabBar !== 'object') {
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if (i === index) {
						nowWidth = result.width;
					}
				}
				if (typeof e === 'number') {
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(() => {
					if (width - nowWidth / 2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth / 2 - windowWidth / 2;
					} else {
						this.scrollLeft = 0;
					}
					if (typeof e === 'object') {
						this.tabCurrentIndex = index;
					}
					this.tabCurrentIndex = index;


					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if (this.tabCurrentIndex !== 0 && tabItem.loaded !== true) {

						this.loadNewsList('refresh');
						tabItem.loaded = true;
					}
				}, 300)

			},
			//获得元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			async getDatas(_id) {

				console.log("getdata", _id, this.pageindex)

				const sign = guid()
				let res = await getBBsApi({
					type: "list",
					fid: _id,
					page: this.pageindex,
					limit: 50,
					order: 0,
					system: "wechat",
					sign: sign,
				}, "bbsapi").catch(error => {

				})


				if (res && res.data && res.data.length > 0) {
					return res.data.map(p => {
						return {
							id: p.bbsId,
							title: p.title,
							type: p.img_path ? 1 : 0,
							images: p.img_path ? [p.preview] : [],
							rtime: p.postTime,
							time: p.replyTime,
							author: p.nickName,
							view: p.view,
							reply: p.reply
						}
					})



				} else {
					return []
				}

			},
			gotoFavor() {
				uni.navigateTo({
					url: `/pages/favor/favor`
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
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
	.news-item .navx{
		height: 100%;
	}
</style>
