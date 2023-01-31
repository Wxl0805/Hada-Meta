<template>
	<view class="content">
		<view class="status_bar">
		</view>
		
		<!-- 顶部导航栏 -->
		<view class="header-fixed">
		<uni-nav-bar height="118rpx" backgroundColor="#ffffff" left-icon="left" @clickLeft="back">
			<view class="header-title">
				<span>子账户管理</span>
			</view>
		</uni-nav-bar>
		</view>
		
		<view class="listblock">
			
			<view class="block" @click="editAccount(value)" v-for="(value,key) in list" :key="key">
				<view class="block-left">
					<view class="left-img">
						<image src="@/static/images/mine/yidingying.png" alt=""/>
					</view>
					<span>{{value.subaccountName}}</span>
				</view>
				
				<view class="block-right">
					<view class="hashrate">
						<!-- <span>{{(value.HashRate/1000000).toFixed(2)}}&nbsp;MH/s</span> -->
						<span>{{value.machineCount}}</span>
					</view>
				</view>
			</view>
		</view>
		
		<button class="bd3 flex-col" @click="addaccount">
		  <view class="mod2 flex-row">
		    <view class="ImageText2 flex-row justify-between">
		      <view class="TextGroup2 flex-col">
		        <text class="txt1">新增</text>
		      </view>
		      <view class="outer5 flex-col"></view>
		    </view>
		  </view>
		</button>
		
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	export default{
		data(){
			return{
				list: [],
				token: '',
				// nums: '',
				// 记录触发了几次需要更新APP
				appUpdate: 0,
			}
		},
		onBackPress() {
			uni.switchTab({
				url:'/pages/mine/index'
			})
			return true;
		},
		onLoad() {
			this.token = uni.getStorageSync('token');
		},
		onShow() {
			uni.request({
				header: {
					'Content-Type': 'application/json',
					'x-token':	this.token,
					//version
					version: this.version,
					}, 
				url: this.host+'/app/user/account/sub/list', 
				method: 'GET',
				data: {},
				dataType:'json',
				success: (res) => {
					if(res.data.code != 0) {
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
						return
					}
					this.list = res.data.data;
				} 
			});
		},
		
		methods: {
		    async show(value){
				// let p = await new Promise((resolve,reject)=>{
				// 	uni.request({
				// 		header: {
				// 			'Content-Type': 'application/json',
				// 			'x-token':	this.token
				// 			}, 
				// 		url: this.host+'/app/user/product/machine/list/'+value.ID, 
				// 		method: 'GET',
				// 		data: {},
				// 		dataType:'json',
				// 		success: (res) => {
				// 			resolve(JSON.stringify(res.data.data.length))
				// 		},
				// 	});
				// });
			await uni.request({
					header: {
						'Content-Type': 'application/json',
						'x-token':	this.token,
						//version
						version: this.version,
						}, 
					url: this.host+'/app/user/product/machine/list/'+value.ID, 
					method: 'GET',
					data: {},
					dataType:'json',
				    success: (res) => {
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
						let num = JSON.stringify(res.data.data.length);
					},
				});
			},
			editAccount(value){
				uni.navigateTo({
					url: '/pages/mine/editAccount?subaccountId='+value.ID
					+"&subaccountName="+value.subaccountName+"&productName="+value.ProductName,
					success(res){
					},
					fail(res){
					}
				});
				// this.$router.push('/pages/mine/editAccount');
			},
			back(){
				uni.switchTab({
					url: '/pages/mine/index',
				});
			},
			addaccount(){
				uni.navigateTo({
					url:'/pages/mine/AddSubAccount',
				})
			}
			
		}
	}
</script>

<style >
	@import '@/static/css/common.css';
	@import "@/static/css/MainColor.less";
	.status_bar{
		height: var(--status-bar-height);
		width: 100%;
		background-color: #ffffff;
	}
	page{
		  height: 1300rpx;
		  overflow: hidden;
		background-color: rgba(243, 245, 247, 1);
	}
	.header-fixed{
		width: 100%;
		position: fixed;
		top: var(--status-bar-height);
		z-index: 100;
	}
	.header-title{
		width: 100%;
		display: flex;
		align-self: center;
		justify-content: center;
	}
	.header-title > span{
		width: 204rpx;
		  height: 48rpx;
		  color: rgba(46, 51, 78, 1);
		  font-size: 34rpx;
		  font-family: PingFangSC-Medium;
		  text-align: center;
		  white-space: nowrap;
		  line-height: 48rpx;
	}
	.left,.right{
		width: 68rpx;
		  height: 48rpx;
		  color: rgba(0, 155, 249, 1);
		  font-size: 34rpx;
		  font-family: PingFangSC-Medium;
		  text-align: center;
		  white-space: nowrap;
	}
	.content{
		width: 100%;
		height: 1200rpx;
		position: relative;
	}
	.block{
		width: 100%;
		height: 100upx;
		background: white;
		position: relative;
	}
	.block-left{
		width: 400upx;
		height: 50upx;
		position: absolute;
		top: 25upx;
		left: 42upx;
		line-height: 50upx;
	}
	.left-img{
		width: 44upx;
		height: 44upx;
		border-radius: 50%;
		overflow: hidden;
		position: absolute;
		top: 3upx;
		left: 0;
	}
	.left-img > image{
		width: 44upx;
		height: 44upx;
	}
	.block-left > span{
		position: absolute;
		top: 0;
		left: 60upx;
		font-family: PingFangSC-Medium;
	}
	.block-right{
		width: 300upx;
		height: 50upx;
		position: absolute;
		right: 20upx;
		top: 25upx;
		text-align: right;
	}
	.hashrate{
		width: 300upx;
		height: 50upx;
		position: absolute;
		right: 0;
		color: #9ea3bb;
		font-family: PingFangSC-Medium;
		line-height: 50upx;
	}
	.addAccount{
		background: gray;
		width: 80%;
		font-weight: bold;
		color: white;
		border-radius: 20upx;
		position: absolute;
		bottom: 40upx;
		left: 10%;
	}
	.bd3 {
	  height: 112rpx;
	  /* background-color: #009BF9; */
	  background-color: var(--main-color);
	  border-radius: 100rpx;
	  width: 635rpx;
	  margin: 100rpx 0 0 58rpx;
	}
	
	.mod2 {
	  width: 126rpx;
	  height: 50rpx;
	  margin: 31rpx 0 0 254rpx;
	}
	
	.ImageText2 {
	  width: 126rpx;
	  height: 50rpx;
	}
	
	.TextGroup2 {
	  height: 50rpx;
	  width: 71rpx;
	}
	
	.txt1 {
	  width: 71rpx;
	  height: 50rpx;
	  color: rgba(255, 255, 255, 1);
	  font-size: 36rpx;
	  font-family: AlibabaPuHuiTiM;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 50rpx;
	}
	
	.outer5 {
	  width: 38rpx;
	  height: 38rpx;
	  background: url('@/static/images/subjiahao.png')
	    100% no-repeat;
	  background-size: 100% 100%;
	  margin-top: 6rpx;
	}
	.listblock{
		width: 100%;
		height: 900rpx;
		margin-top: 118rpx;
		overflow-y: scroll;
	}
</style>