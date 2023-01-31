<template>
	<view class="">
		<view class="status_bar">
		  <!-- 这里是占位状态栏 -->
		</view>
		
		<!-- 顶部导航栏 -->
		<view class="header-fixed">
		  <uni-nav-bar height="88rpx" backgroundColor="#ffffff">
		    <view class="header-title">
		      <span>{{ $t('common.settlement-in-the-past-detail') }}</span>
		    </view>
		    <view slot="left">
		      <!-- <view class="left" @click="back">
		        <span>{{ $t("common.quxiao") }}</span>
		      </view> -->
			  <i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 27px;" @click="back"></i>
		    </view>
		  </uni-nav-bar>
		</view>
		
		<view class="block block-header" v-if="!showNoDataImg">
			<view class="left">
				<span>{{ $t('common.Earnings-Date') }}</span>
			</view>
			<view class="right">
				<span>{{ $t('common.Settlement-Points-Aleo') }}</span>
			</view>
		</view>
		
		<view class="block" v-for="(item,key) in List" :key="key">
			<view class="left">
				<span>{{item.preDate}}</span>
			</view>
			<view class="right">
				<span>{{item.customerIntegral}}</span>
			</view>
		</view>

		<!-- 加载更多组件 -->
		<view v-if="isShowLoadMore">
		  <uni-load-more iconType="circle" :status="status" :color="loadDivColor" />
		</view>
		
		<!-- nodata img -->
		<view class="nodata" v-if="showNoDataImg">
		  <image src="@/static/images/nodata.png"></image>
		  <text>{{ $t("Aleo.InvestmentRecord.nodata") }}</text>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
	// #endif
	export default {
		data(){
			return {
				// 记录触发了几次需要更新APP
				appUpdate: 0,
				page: 1,
				pageSize: 16,
				total: 0,
				List:[],
				newData: [],
				status : 'loading',
				// 上拉加载组件是否显示
				isShowLoadMore: false,
				// 是否顯示nodata圖片
				showNoDataImg: false,
				// 底部上拉加载状态栏状态
				status: "more",
				// 加載組件的顔色
				loadDivColor: "#007AFF",
				// 记载上拉加载是否出现
				pop: false,
				// orderNumber: '',
				// 用于接口的时间
				useTime: '',
			}
		},
		onLoad(options) {
			if(options){
				this.useTime = options.settlementDate;
				this.getList()
			}
		},
		// 上拉加载更多,onReachBottom上拉触底函数
		onReachBottom() {
		  if(!this.pop){
			  this.status = 'more';
			  this.loadMoreFunc();
		  }
		},
		methods: {
			// 返回
			back(){
				uni.navigateBack({
					delta: 1,
				})
			},
			// 进入页面开始渲染
			getList(){
				// 查询记录
				uni.showLoading({
					mask:true,
					title: this.$t('common.jiazai-loading')
				})
				uni.request({
				  header: {
				    "Content-Type": "application/json",
					"x-token": uni.getStorageSync('token'),
				    //version
				    version: this.version,
				  },
				  url: this.host+'/app/integralDetail/preIntegralList?settlementDate='+this.useTime+'&page='+this.page+'&pageSize='+this.pageSize,
				  method: "GET",
				  data: {},
				  dataType: "json",
				  success: (res) => {
					  // console.log(res);
					  if (res.data.code == 2) {
					  	console.log("需要更新版本");
					  	this.appUpdate++;
					  	// 控制只出现一次弹窗
					  	if(this.appUpdate >= 0 && this.appUpdate < 2){
					  	// #ifdef APP-PLUS
					  	APPUpdate(true);
					  	// #endif
					  	}
					  	return;
					  }
					  
					  // 没有数据显示图片
					  if(res.data.data.total == 0){
						  this.showNoDataImg = true;
						  return;
					  }
					  this.List=res.data.data.list;
					  this.total = res.data.data.total;
					  // res.data.data.list.forEach((data) => {
					  //   data.CreatedAt = this.dateChangeFormat("YYYY-mm-dd HH:MM", data.CreatedAt);
					  // });
					  // 有数据，但数据不能全屏全部显示出来，加载组件不显示
					  if(this.total < 16){
						  this.isShowLoadMore = false;
						  return;
					  }
					  // 有数据但没有显示完全，显示加载组件
					 if(this.List.length < this.total){
						 this.status = 'more'
						 this.isShowLoadMore = true;
						 return;
					 }
					
				  },
				  fail: () => {
				  	
				  },
				  complete: () => {
				  	uni.hideLoading();
				  },
				});
			},
			
			// 转换日期格式
			  dateChangeFormat(format, date) {
			    date = new Date(date);
			    const dataItem = {
			      "Y+": date.getFullYear().toString(),
			      "m+": (date.getMonth() + 1).toString(),
			      "d+": date.getDate().toString(),
			      "H+": date.getHours().toString(),
			      "M+": date.getMinutes().toString(),
			      "S+": date.getSeconds().toString(),
			    };
			    Object.keys(dataItem).forEach((item) => {
			      const ret = new RegExp(`(${item})`).exec(format);
			      if (ret) {
			        format = format.replace(ret[1], ret[1].length === 1 ? dataItem[item] : dataItem[item].padStart(ret[1].length, "0"));
			      }
			    });
			    return format;
			  },
			  
			  loadMoreFunc:function(){
			      //展示loading
			      this.status = 'loading';            
			      this.page++;// 当上拉触发页码++
			      uni.request({
			          url: this.host+'/app/integralDetail/preIntegralList?orderNumber='+this.orderNumber+'&page='+this.page+'&pageSize='+this.pageSize, 
			          header: {
			          	'Content-Type': 'application/json',
			          	'x-token':	uni.getStorageSync('token'),
			  			//version
			  			version: this.version,
			          }, 
			      	method:'GET',
			          data:{},
			      	dataType:'json',
			          success:(res) =>{
						  console.log(res);
			  			if (res.data.code == 2) {
			  				console.log("需要更新版本");
			  				this.appUpdate++;
			  				// 控制只出现一次弹窗
			  				if(this.appUpdate >= 0 && this.appUpdate < 2){
			  				// #ifdef APP-PLUS
			  				APPUpdate(true);
			  				// #endif
			  				}
			  				return;
			  			}
			  			if(this.List.length == this.total){
							this.pop = true;
			  				this.status = 'noMore';  //没有数据时显示‘没有更多’
							this.loadDivColor = '#9ea3bb'
			  				return;
			  			}
						// res.data.data.list.forEach((data) => {
						//   data.CreatedAt = this.dateChangeFormat("YYYY-mm-dd HH:MM", data.CreatedAt);
						// });
			            this.newData=res.data.data.list;  
			  			this.List = this.List.concat(this.newData);
			          }
			      });
			  },
		},
	}
</script>

<style lang="scss">
	/deep/ .uni-navbar--border{
		border-bottom-color:rgba(236, 236, 236, 1) !important;
	}
	/deep/ .uni-navbar__header{
		padding: 0 5px;
	}
	.nodata {
	  position: relative;
	  top: 296rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  image {
	    width: 292rpx;
	    height: 198rpx;
	  }
	  text {
	    display: block;
	    margin-top: 46rpx;
	    font-size: 30rpx;
	    font-family: PingFangSC-Regular, PingFang SC;
	    font-weight: 400;
	    color: #2e334e;
	  }
	}
	page{
		background: rgba(243, 245, 247, 1);
	}
	.status_bar {
	  height: var(--status-bar-height);
	  width: 100%;
	  background: #ffffff;
	  position: fixed;
	  top: 0;
	  z-index: 11;
	}
	.header-fixed{
		width: 100%;
		position: fixed;
		top: var(--status-bar-height);
		z-index: 100;
	}
	.header-title {
	  width: 100%;
	  display: flex;
	  align-self: center;
	  justify-content: center;
	}
	.header-title > span {
	  /* width: 204rpx; */
	  height: 48rpx;
	  color: rgb(0, 0, 0);
	  font-size: 32rpx;
	  font-family: PingFangSC-Medium;
	  text-align: center;
	  white-space: nowrap;
	  line-height: 48rpx;
	}
	[class^=uni-btn-icon] {
	    display: inline-block;
	    font: normal normal normal 14px/1 unibtn;
	    font-size: inherit;
	    text-rendering: auto;
	    -webkit-font-smoothing: antialiased;
	}
	.block{
		// position: relative;
		border-bottom: 0.5px solid rgba(236, 238, 240, 1) ;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0 40rpx;
		font-size: 26rpx;
		background: #ffffff;
	}
	.block-header{
		// position: relative;
		margin-top: calc(var(--status-bar-height) + 88rpx);
	}
	.left{
		height: 100%;
		display: flex;
		flex: 1;
		justify-content: flex-start;
		align-items: center;
		font-size: 30rpx;
		color: rgba(136, 141, 167, 1);
	}
	.right{
		height: 100%;
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 30rpx;
		color: rgba(46, 51, 78, 1);
	}
</style>