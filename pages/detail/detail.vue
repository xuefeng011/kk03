<template>
	<view class="content">
		<cu-custom bgColor="title-bg" :isBack="true" :isHome="true">
			<block slot="backText"></block>
			<block slot="homeText">
				<text class="text-blue" :class="{'cuIcon-favorfill':isfavor,'cuIcon-favor':!isfavor}" @click="changeFavor"></text>
				
			</block>
			<block slot="content">{{title}}</block>
		</cu-custom>

		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view class="container" v-show="loading === false">
					<view class="cu-card dynamic no-card" v-for="(item,index) in evaList" :key="item.msgId">
						<view class="cu-item" style="border-top: 1upx solid rgba(0, 0, 0, 0.1);border-bottom: 1upx solid rgba(0, 0, 0, 0.1);">
							<!-- <view class="cu-list menu-avatar" style="height:80upx;">
								<view class="cu-item padding-sm" style="height:80upx;">
									<view class="cu-avatar round sm user" :style="{'background-image':`url(${item.userdata.photo})`}"></view>
									<view class="content flex-sub">
										<view>{{item.userName}}</view>
										<view class="text-gray text-sm flex justify-between">
											{{item.postTime}} ({{item.platform}})
										</view>
									</view>
								</view>
							</view> -->
							<view class="action flex row margin-left-sm align-center padding-top-sm">
								<view class="cu-avatar round sm user" :style="{'background-image':`url(${item.userdata.photo})`}"></view>
								<view class="margin-left-sm flex flex-direction">
									<view>{{item.userName}}</view>
									<view class="text-gray text-sm flex justify-between">
										{{item.postTime}} ({{item.platform}})
									</view>
								</view>
							</view>
							<view class="message">
								<rich-text :nodes="item.message"></rich-text>
							</view>

							<view class="text-gray text-sm text-right padding-sm">
								<text class="cuIcon-attentionfill margin-lr-xs"></text> {{(index+1)}}楼
							</view>
						</view>
					</view>

				</view>
				<!-- 加载图标 -->
				<mixLoading class="mix-loading" v-if="loading"></mixLoading>
			</view>
		</scroll-view>
		<view class="cu-bar bg-white foot align-center self-center">
			<uni-pagination style="margin:0 auto;" show-icon="true" :total="total" :current="pageindex" @change="handeChangePage"></uni-pagination>
		</view>

	</view>
</template>

<script>
	import json from '@/json';
	import mixLoading from '@/components/mix-loading/mix-loading';

	import {
		getBBsApi
	} from '@/utils/dbhelper.js'

	import {
		guid
	} from '@/utils/common.js'


	export default {
		components: {
			mixLoading
		},
		data() {
			return {
				loading: true,
				detailData: {},
				newsList: [],
				evaList: [],
				pageindex: 1,
				id: 0,
				title: "",
				favorlist: [],
				isfavor: false,
				total: 0,
				item:{}
			}
		},
		async onLoad(options) {
			const item = JSON.parse(decodeURIComponent(options.item));
			
			console.log("id",item)
			
			this.id=item.id;
			this.item=item;
			await this.checkFavor();
			await this.loadNewsList();
		},
		methods: {
			//获取推荐列表
			async loadNewsList() {
				// let list = await json.newsList;
				// setTimeout(()=>{
				// 	list.sort((a,b)=>{
				// 		return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
				// 	})
				// 	list.length = 5;
				// 	list.forEach(item=>{
				// 		this.newsList.push(item);
				// 	})

				// 	this.detailData.flow = `<div style="font-size:15px;color: #555;line-height: 25px"><h1 style="margin: 0px; font-weight: normal; font-size: 26px; font-family: 微软雅黑; text-align: center; line-height: 30px; white-space: normal; background-color: rgb(255, 255, 255);"><br/></h1><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;"><img style="width: 100%;max-width: 100% !important;" src="http://app.shundecity.com/data/upload/yangtata/20190414/1555206583915888.jpg" border="0" hspace="0" vspace="0" data-bd-imgshare-binded="1" style="margin: 0px; padding: 0px; border: none; max-width: 90%;"/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;">市委常委、顺德区委书记郭文海赴勒流调研。<br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　昨日（4月13日），市委常委、顺德区委书记郭文海利用周末时间到勒流街道江村、黄连社区调研村级工业园改造、乡村振兴工作。郭文海表示，村级工业园改造和城乡形态提升是勒流目前面临的两大任务，要下定决心以城产人融合标准做好村级工业园连片改造的规划，健全生态体系建设；文化振兴是乡村振兴战略的源头活水，勒流要挖掘弘扬乡村民俗文化，为乡村振兴战略提供坚实的文化支撑，同时要充分发挥党建引领作用，广泛发动群众参与社区营造，自己家园自己建，打造美丽文明乡村。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　勒流今年以五金创新小镇·滨水生态区、中部产业园及富安工业区为着力点，重点推进龙眼、江村、新安三个村级工业园区的改造，吸引优质产业集聚，打造南、中、北三大产业集中布局组团，借助村级工业园改造的契机，让勒流的产业布局和城市面貌得到优化和提升。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　其中，江村工业区计划由改造方分单元进行连片改造，以绿色环保为导向，突出智能制造，打造“环境科技产业基地”；新安工业区初步划分为东、中、西三个改造区域，通过“退二进三”，建设集居住、商业、娱乐于一体的生活服务区，为富安工业区及周边村居提供配套设施服务。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　郭文海表示，勒流位于顺德的地理中心，是顺德的腹地，且工业基础雄厚，工业产值在顺德镇街中排名第三，发展潜力巨大，在村级工业园改造升级过程中，要下定决心做好连片改造的规划，腾出空间完善城市配套，以城产人融合标准健全生态体系建设，形成经济效益、生态效益、社会效益的三重丰收，为进驻企业提供优质的工作生活环境。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　古韵绵绵，河水潺潺，组成一幅优美的岭南水乡画卷。在千年古村黄连，文化营造和水乡生态修复、乡土美食推广、民宿建设构成了黄连振兴乡村，建设美丽文明村居的四大发展思路。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　郭文海参观了画家艺术村、藩侯何公祠、广绣坊。目前，黄连画家艺术村设有8个入驻画家工作室和10个流动流动艺术家创作驿站，画家村艺术活动非常活跃；黄连广绣作为顺德的传统文化和国家级非物质文化遗产，如今在黄连广绣坊开展有师资培训班、绣娘屋、亲子夏令营、广绣传承进校园等活动，激活、创新广绣技艺。值得一提的是，黄连社区把“厕所革命”与生态文明建设有机结合，优化提升人居环境和文旅公共服务水平。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　郭文海分别与画家村驻村画家及广绣坊学员亲切交流，并“点赞”黄连社区乡村振兴工作的开展成效。郭文海表示，文化振兴是乡村振兴战略的源头活水，千年古村黄连拥有深厚的民俗文化底蕴，需要挖掘、弘扬和发扬光大，将黄连的民俗文化做成黄连特色，必然会为乡村振兴提供坚实的文化支撑；同时，黄连的乡村振兴工作也离不开党建引领和社区营造，要充分发挥党建引领作用，广泛发动群众参与社区营造，自己家园自己建，打造“近者悦，远者来”的美丽文明乡村。（姚易　通讯员顺宣）</p><p><br/></p></div>`;
				// 	this.loading = false;
				// }, 1000)

				let result = await this.getDetails(this.id)
				if (result == null) {
					return
				}
				let {
					title,
					replys,
					totalPage
				} = result;
				replys.map(item => {
					// item.message=item.message.replace(/ids/gi, 'image')
				})
				console.log("xxx", replys)

				this.evaList = replys;
				this.title = title;
				this.total = totalPage
				this.loading = false

			},
			//获取评论列表
			async loadEvaList() {
				this.evaList = await json.evaList;
			},
			async getDetails() {

				console.log("getDetails", this.pageindex)

				const sign = guid()
				let res = await getBBsApi({
					type: "detail",
					id: this.id,
					page: this.pageindex,
					limit: 10,
					order: 0,
					system: "wechat",
					sign: sign,
				}, "bbsapi").catch(error => {

				})


				if (res && res.data) {
					return res.data;
				} else {
					return null;
				}

			},
			async checkFavor() {
				let res = await uni.getStorageSync("myfavor");
				console.log("favor", res)
				if (res.length > 0) {
					let q = JSON.parse(res);
					this.favorlist = q;
				} else {
					this.favorlist = []
				}

				this.isfavor = this.favorlist.some(p => p.id == this.id)
				console.log("isfavor", this.isfavor, this.favorlist)
				return
			},
			async changeFavor() {
				 this.isfavor=!this.isfavor
				 
				 if(this.isfavor){
					 this.favorlist.unshift(this.item)
					 
				}else{
					let idx =this.favorlist.findIndex(p=>p.id==this.id)
					
					if(idx>-1){
						this.favorlist.splice(idx,1)
					}
				}
				
				await uni.setStorageSync("myfavor", JSON.stringify(this.favorlist))
				
			},
			handeChangePage({
				type
			}) {
				if (type == 'prev') {
					this.pageindex--
				} else {
					this.pageindex++
				}
				this.getDetails()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
	}

	.user {}

	.message {
		margin: 30upx;
	}

	.message img {
		width: 100%;
		margin: 30upx auto;
		overflow: hidden;
	}

	.kds_img {
		width: 100%;
	}

	.bottom {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		height: 90upx;
		padding: 0 30upx;
		box-shadow: 0 -1px 3px rgba(0, 0, 0, .04);
		position: relative;
		z-index: 1;
		bottom: 0;
	}
</style>
