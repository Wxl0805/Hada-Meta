<template>
	<view class="all">
		<view class="block" >
			<view class="card" v-for="(value,key) in accounts" :key="key">
				<view class="header">
					<view class="header-left">
						<view class="header-img">
						</view class="currencyCategory">
						<span>{{value.ProductName}}</span>
					</view>
					<view class="header-right" v-if="(value.walletAddress.length > 0)">
						<view class="bindstate">
							<span>已绑定</span>
						</view>
					</view>
					<view class="header-right-unbind" v-if="(value.walletAddress.length == 0)">
						<view class="bindstate">
							<span>未绑定</span>
						</view>
					</view>
				</view>
				<view class="content" :class='{addheight: value.autoWithdrawal == "1"}'>
					<view class="walletaddress">
						<span>钱包地址:</span><span class="walletaddress-color">{{value.walletAddress}}</span>
					</view>
					<view class="automatic">
						<span>自动提现:</span>
						<span class="automatic-switch" v-if="!(value.autoWithdrawal == '1')">关闭</span>
						<span class="automatic-switch-open" v-else>开启</span>
					</view>
					<view class="startmoney" v-if="value.autoWithdrawal == '1'">
						<span>起付金额:</span><span class="startmoney-num">{{value.withdrawalLimit}}{{value.currencyCategory}}</span>
					</view>
				</view>
				<view class="footer" @click="edit(value.currencyCategory,value.walletAddress,value.autoWithdrawal,value.withdrawalLimit)">
					<view class="ImageText1 flex-row justify-between">
					  <view class="TextGroup1 flex-col">
						<text class="word5">编辑</text>
					  </view>
					  <view class="main3 flex-col"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	export default {
		data(){
			return{
				addheight: false,
				accounts:[],
				// 记录触发了几次需要更新APP
				appUpdate: 0,
			}
		},
		onShow() {
			uni.request({
				header: {
					'Content-Type': 'application/json',
					'x-token':	uni.getStorageSync('token'),
					//version
					version: this.version,
					}, 
				url: this.host+'/app/user/account/wallet/list',
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
					if (res.data.data){
						this.accounts = res.data.data;
					}
				} 
			});
		},
		methods: {
			edit(currencyCategory,address,withdrawal,limit){
				uni.navigateTo({
					url: '/pages/mine/EditWallet?currencyCategory='+currencyCategory+'&subaddress='+address+'&withdrawal='+withdrawal+'&limit='+limit,
					success(res){
					},
					fail(res){
					}
				});
			}
		},
	}
</script>

<style >
	@import '@/static/css/common.css';
	@import "@/static/css/MainColor.less";
	page{
		background-color: rgba(243, 245, 247, 1);
	}
	.all{
		width: 100vw;
	}
	.card{
		width: 95vw;
		/* height: 350upx; */
		background: #ffffff;
		position: relative;
		margin-bottom: 20rpx;
		top: 20upx;
		left: 2.5vw;
		border-radius: 20upx;
		overflow: hidden;
	}
	.header{
		width: 100%;
		height: 100upx;
		position: relative;
	}
	.content{
		width: 100%;
		height: 100upx;
		position: relative;
		/* top: 100upx; */
		font-weight: bold;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}
	.footer{
		width: 100%;
		height: 75upx;
		position: relative;
		/* top: 250upx; */
		font-weight: bold;
		background-color: rgba(251, 253, 253, 1);
	}
	.header-left{
		width: 300upx;
		height: 100upx;
		position: absolute;
		left: 50upx;
		line-height: 50upx;
	}
	.header-img{
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		overflow: hidden;
		position: absolute;
		top: 30upx;
		background: url('@/static/images/yidingying.png');
		background-size: 100% 100%; 
	}
	
	.header-left > span{
		height: 50upx;
		position: absolute;
		left: 60upx;
		top: 23upx;
		  font-size: 34rpx;
		  font-family: PingFangSC-Medium;
	}
	.header-right{
		width: 139upx;
		height: 75upx;
		position: absolute;
		right: 0;
		background-color: #00aaff;
		border-radius: 0 0 0 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header-right-unbind{
		width: 139upx;
		height: 75upx;
		position: absolute;
		right: 0;
		background-color: #D4D8DD;
		border-radius: 0 0 0 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.bindstate{
		width: 100upx;
		height: 50upx;
		color: rgba(255, 255, 255, 1);
		font-weight: bold;
		font-size: 30rpx;
		font-family: PingFangSC-Medium;
	}
	.walletaddress{
		position: absolute;
		top: 0;
		left: 50upx;
		color: #9ea3bb;
	}
	.walletaddress > span:first-child{
		margin-right: 10upx;
	}
	
	.automatic{
		position: absolute;
		top: 60upx;
		left: 50upx;
		color: #9ea3bb;
	}
	.automatic > span:first-child{
		margin-right: 10upx;
	}
	.startmoney{
		position: relative;
		top: 120upx;
		left: 50upx;
		color: #9ea3bb;
	}
	.startmoney > span:first-child{
		margin-right: 10upx;
	}

	.automatic-switch{
		color: #fa6401;
	}
	.automatic-switch-open{
		/* color: #009bf9; */
		color: var(--main-color);
	}
	.startmoney-num{
		color: #fa6401;
	}
	
	.ImageText1 {
	  width: 110rpx;
	  position: absolute;
	  top: 16upx;
	  right: 42upx;
	  
	}
	
	.TextGroup1 {
	  height: 42rpx;
	  width: 60rpx;
	}
	
	.word5 {
	  width: 60rpx;
	  height: 42rpx;
	  /* color: #009bf9; */
	  color: var(--main-color);
	  font-size: 30rpx;
	  font-family: PingFangSC-Medium;
	  text-align: center;
	  white-space: nowrap;
	  line-height: 42rpx;
	  font-weight: bold;
	}
	
	.main3 {
	  width: 34rpx;
	  height: 34rpx;
	  background: url('@/static/images/update.png');
	  background-size: 100% 100%;
	  margin-top: 4rpx;
	}
	
	.currencyCategory {
		width: 102rpx;
		height: 48rpx;
		color: rgba(46, 51, 78, 1);
		font-size: 34rpx;
		font-family: PingFangSC-Medium;
		text-align: center;
		white-space: nowrap;
		line-height: 48rpx;
		margin: 40rpx 0 0 24rpx;
	}
	
	.walletaddress-color {
		width: 120rpx;
		height: 40rpx;
		font-size: 28rpx;
		color: rgba(46, 51, 78, 1);
		font-family: PingFangSC-Medium;
		text-align: center;
		white-space: nowrap;
		line-height: 40rpx;
	}
	.addheight{
		height: 160rpx;
	}
</style>