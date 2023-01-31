<template>
	<view class="content">
		<!-- 第一次 -->
		<!-- <view class="mod2 flex-col justify-end" v-if="select">
		  <view class="group1 flex-row justify-between">
		    <text class="info2">{{$t('common.phone-veri')}}</text>
		    <text class="word3">{{$t('mine-editpassword-setnew')}}</text>
		  </view>
		  <view class="group2 flex-row">
		    <view class="wrap1 flex-col"></view>
		  </view>
		</view> -->
		
		<!-- 第二次 -->
		<!-- <view class="outer3 flex-col justify-end"v-else>
		  <view class="outer4 flex-row justify-between">
		    <text class="xiugai-4">{{$t('common.phone-veri')}}</text>
		    <text class="info2">{{$t('mine-editpassword-setnew')}}</text>
		  </view>
		  <view class="outer5 flex-row">
		    <view class="main3 flex-col"></view>
		  </view>
		</view> -->
		
		
		<view class="header-bg" v-if="select">
			<text>{{ $t('common.passeord-header-tile') }}</text>
		</view>
		<!-- 手机号 -->
		<view class="wrap2 flex-col" v-if="select">
		  <!-- <view class="InputNumber1 flex-col">
		    <uni-easyinput :inputBorder="false" :disabled="true" v-model="tel" placeholder="请输入手机号"></uni-easyinput>
		  </view>
		  <view class="block1 flex-col">
		    <view class="vali-block">
		    	<view class="telvalicode">
		    		<uni-easyinput :inputBorder="false" v-model="valicode" :placeholder="$t('mine.change-telvericode')"></uni-easyinput>
		    	</view>
		    	<image
		    	  class="icon1"
		    	  referrerpolicy="no-referrer"
		    	  src="@/static/images/login/shugang.png"
		    	/>
		    	<view class="send-code">
		    		<button class="send" :class="{style:styles}" :disabled="forbidden" @click="sendvalidate">{{validatecode}}</button>
		    	</view>
		    </view>
		  </view> -->
		  <view class="input">
		  	<view class="input-left">{{ $t('common.shoujihao') }}</view>
		  	<view class="input-right">
		  		<uni-easyinput :inputBorder="false" :disabled="true" v-model="tel" placeholder="请输入手机号"></uni-easyinput>
		  	</view>
			<view class="input-right-code"></view>
		  </view>
		  <view class="input">
		  	<view class="input-left">{{ $t('common.yanzhengma') }}</view>
		  	<view class="input-right">
		  		<uni-easyinput :inputBorder="false" v-model="valicode" :placeholder="$t('mine.change-telvericode')"></uni-easyinput>
		  	</view>
			<view class="input-right-code">
				<image
				  class="icon1"
				  referrerpolicy="no-referrer"
				  src="../../static/images/login/shugang.png"
				/>
				<view class="send-code">
					<button class="send" :class="{style:styles}" :disabled="forbidden" @click="sendvalidate">{{validatecode}}</button>
				</view>
			</view>
		  </view>
		  
		  <button class="xiugai-6 flex-col" @click="select1" :class="{hasvalue:oldcode}">
		    <text class="info4">{{$t('common.next')}}</text>
		  </button>
		</view>
		
		<!-- 设置新密码 -->
		 <view class="bd10 flex-col" v-else>
		  <!-- <view class="InputNumber1 flex-col">
		      <uni-easyinput type="password" :inputBorder="false" v-model="newpassword" placeholder="请设置8-16位新的登录密码"></uni-easyinput>
		  </view>
		  <view class="mod1 flex-col">
			  <uni-easyinput type="password" :inputBorder="false" v-model="confirmpassword" placeholder="请再次输入新的登录密码"></uni-easyinput>
		  </view> -->
		  <view class="input">
		  	<view class="input-left" style="flex: 0.8;">{{ $t('common.newpassword') }}</view>
		  	<view class="input-right" style="flex: 2;">
		  		<uni-easyinput type="password" :inputBorder="false" v-model="newpassword" :placeholder="$t('mine-editpassword-newinput')"></uni-easyinput>
		  	</view>
		  </view>
		  <view class="input">
		  	<view class="input-left" style="flex: 0.8;">{{ $t('common.confirmpassword') }}</view>
		  	<view class="input-right" style="flex: 2;">
		  		<uni-easyinput type="password" :inputBorder="false" v-model="confirmpassword" :placeholder="$t('mine-editpassword-newconfirminput')"></uni-easyinput>
		  	</view>
		  </view>
		  <button class="Button1 flex-col" @click="select2">
		    <text class="xiugai-5">{{$t('common.tijiao')}}</text>
		  </button>
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
				select: true,
				tel: '',
				valicode: '',
				validatecode: this.$t('common.sendcode'),
				errorNum:true,
				errorBind:false,
				forbidden:false,
				styles: false,
				newpassword:'',
				confirmpassword: '',
				token: '',
				oldcode: false,
				// 记录触发了几次需要更新APP
				appUpdate: 0,
			}
		},
		watch:{
			valicode(val){
				if(!val){
					this.oldcode = false
				}else{
					this.oldcode = true
				}
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token');
		},
		onReady() {
			// this.email = uni.getStorageSync('user').email;
			uni.request({
				header: {'Content-Type': 'application/json',
				'x-token': this.token,
				//version
				version: this.version,
				}, 
				url: this.host+'/app/user/info',
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
					this.tel = res.data.data.phone;
				},
			});
		},
		methods: {
			select1() {
				if(!this.oldcode){
					return;
				}
				if(this.valicode == ''){
					uni.showToast({
						title: this.$t('common.vericode-error'),
						icon:"none"
					});
					return;
				}
				uni.request({
					header: {'Content-Type': 'application/json',
					'x-token': this.token,
					//version
					version: this.version,
					}, 
					url: this.host+'/app/checksmscode?type=resetpwdbyphone&value='+this.tel+'&code='+this.valicode,
					method: 'GET',
					data: {},
					dataType:'json',
					success: (res) => {
						if(res.data.code != 0){
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
							uni.showToast({
								title:this.$t('common.vericode-error'),
								icon:'none'
							});
							return;
						}
						this.select = false;
					},
				});
			},
			select2(){
				if(this.newpassword == '' && this.confirmpassword == ''){
					uni.showToast({
						icon:"none",
						title: this.$t('mine-editpassword-newnull')
					});
					return;
				}
				if(this.newpassword != this.confirmpassword){
					uni.showToast({
						icon:"none",
						title: this.$t('mine-editpassword-newconfirm')
					});
					return;
				}
				if(this.newpassword.length < 8 || this.newpassword.length > 16){
					uni.showToast({
						icon:"none",
						title: this.$t('common.password-input')
					});
					return;
				}
				uni.request({
					header: {'Content-Type': 'application/json',
					'x-token': this.token,
					//version
					version: this.version,
					}, 
					url: this.host+'/app/resetpwdbyphone?phone='+this.tel+'&code='+this.valicode+'&newpassword='+this.newpassword,
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
						uni.setStorageSync('password',this.newpassword);
						uni.showToast({
							icon:"none",
							title: this.$t('common.edit-success')
						})
						uni.switchTab({
							url:'/pages/mine/index'
						})
					},
				});
				
			},
			sendvalidate(){
				uni.showLoading({
					mask:true,
					title: this.$t('common.send')
				})
				uni.request({
					header: {'Content-Type': 'application/json',
					'x-token': this.token,
					//version
					version: this.version,
					}, 
					url: this.host+'/app/getsmscode?type=resetpwdbyphone&value='+this.tel,
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
						this.styles = true;
						this.forbidden = true;
						let num = 60;
						let run = setInterval(()=>{
							this.validatecode = num + this.$t('common.chongfa');
							num--;
							if(num == -1){
								clearInterval(run);
								this.validatecode = this.$t('common.sendcode');
								this.styles = false;
								this.forbidden = false;
							}
						},1000);
						if(res.data.msg == '操作成功'){
							uni.showToast({
								title:this.$t('common.send-success'),
								icon:'none'
							});
							return;
						}
						if(res.data.msg == '验证码还在有效期内，请勿重复发送'){
							uni.showToast({
								title:this.$t('common.sendcode-error'),
								icon:'none'
							});
							return;
						}
					},
					complete: () => {
						uni.hideLoading();
					}
				});
				
			}
		},
		
		
	}
</script>

<style scoped>
	@import '@/static/css/common.css';
	/deep/ .uni-input-input{
		font-size: 30rpx !important;
	}
	
	/deep/ .uni-easyinput__placeholder-class{
		font-size: 30rpx !important;
	}
	
	/deep/ .uni-easyinput__content{
		background-color: #ffffff !important;
	}
	
	/deep/ .content-clear-icon{
		background-color: #ffffff !important;
	}
	
	uni-button[disabled]:not([type]), uni-button[disabled][type=default]{
		background-color: transparent;
	}
	page{
		background-color: #ffffff;
		/* font-weight: bold; */
	}
	.content{
		border-top: 2upx solid rgba(0, 0, 0, 0.1);
	}
	.header-bg{
		width: 100%;
		height: 70rpx;
		background: rgba(245, 249, 250, 1);
		box-sizing: border-box;
		padding-left: 42rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: rgba(158, 163, 187, 1);
	}
	.input{
		width: 100%;
		height: 80rpx;
		margin-top: 50rpx;
		display: flex;
		/* align-items: center; */
		border-bottom: 0.5px solid rgba(236, 236, 236, 1);
	}
	.input-left{
		display: flex;
		align-items: center;
		flex: 0.6;
		font-size: 30rpx;
		color: rgba(46, 51, 78, 1);
	}
	.input-right{
		display: flex;
		align-items: center;
		flex: 2;
	}
	.input-right-code{
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: center;
	}
	/* 提示信息弹窗 */
		.popup-content{
			padding: 30rpx;
			color: #ffffff;
			.text{
				.icons{
					margin-right: 10rpx;
					size: 28rpx;
					display: inline-block;
					transform: rotate(180deg);
				}
			}
		}
	
	.mod2 {
	  background-color: rgba(251, 253, 253, 1);
	  height: 90rpx;
	  margin-top: 2rpx;
	  width: 750rpx;
	}
	
	.group1 {
	  width: 565rpx;
	  height: 48rpx;
	  margin: 21rpx 0 0 94rpx;
	}
	
	.info2 {
	  width: 228rpx;
	  height: 48rpx;
	  color: rgba(0, 155, 249, 1);
	  font-size: 34rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 48rpx;
	}
	
	.word3 {
	  width: 200rpx;
	  height: 48rpx;
	  color: rgba(46, 51, 78, 1);
	  font-size: 34rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 48rpx;
	}
	
	.group2 {
	  width: 71rpx;
	  height: 12rpx;
	  margin: 9rpx 0 0 173rpx;
	}
	
	.wrap1 {
	  background-color: rgba(0, 155, 249, 1);
	  width: 71rpx;
	  height: 12rpx;
	}
	
	
	.wrap2 {
	  /* width: 635rpx; */
	  /* height: 932rpx; */
	  margin: 0 42rpx;
	}
	
	.InputNumber1 {
	  height: 110rpx;
	  /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng53cbe6ad053be599e57f226f4b2f2ca119a9bb43812a3ce766918f1c3fe3eea5)
	    100% no-repeat; */
	  background-size: 100% 100%;
	  margin-left: 5rpx;
	  width: 625rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  padding: 20upx;
	}
	
	.box5 {
	  width: 541rpx;
	  height: 45rpx;
	  margin: 32rpx 0 0 42rpx;
	}
	
	.info3 {
	  width: 245rpx;
	  height: 45rpx;
	  color: rgba(36, 39, 51, 1);
	  font-size: 32rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 45rpx;
	}
	
	.wrap3 {
	  width: 1rpx;
	  height: 41rpx;
	 /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngfc96eade191544f04069ab3e5e92d9be99331c12f08740349fef4d0480e68c92) -2rpx
	    0rpx no-repeat; */
	  background-size: 5rpx 42rpx;
	  margin: 2rpx 0 0 9rpx;
	}
	
	.wrap4 {
	  width: 44rpx;
	  height: 44rpx;
	  /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngd04b17b8be7cfb54208c21ad41e4700248216161659236f5330bd832be922b01)
	    100% no-repeat; */
	  background-size: 100% 100%;
	  margin: 1rpx 0 0 242rpx;
	}
	
	.block1 {
	  background-color: rgba(245, 249, 250, 1);
	  border-radius: 100px;
	  height: 110rpx;
	  width: 625rpx;
	  margin: 24rpx 0 0 5rpx;
	  
	}
	
	.box6 {
	  width: 541rpx;
	  height: 45rpx;
	  margin: 32rpx 0 0 42rpx;
	}
	
	.word4 {
	  width: 256rpx;
	  height: 45rpx;
	  color: rgba(136, 141, 167, 1);
	  font-size: 32rpx;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 45rpx;
	}
	
	/* .icon1 {
	  width: 1rpx;
	  height: 22rpx;
	  margin: 14rpx 0 0 122rpx;
	} */
	
	.word5 {
	  width: 140rpx;
	  height: 40rpx;
	  color: rgba(46, 51, 78, 1);
	  font-size: 28rpx;
	  font-family: PingFangSC-Medium;
	  text-align: right;
	  white-space: nowrap;
	  line-height: 40rpx;
	  margin: 5rpx 0 0 22rpx;
	}
	
	.xiugai-6 {
	  background-color: rgba(212, 216, 221, 1);
	  border-radius: 100px;
	  height: 112rpx;
	  /* margin-top: 576rpx; */
	  width: 635rpx;
	  position: absolute;
	  bottom: 300rpx;
	  transform: translateX(-50%);
	  left: 50%;
	}
	
	.info4 {
	  width: 107rpx;
	  height: 50rpx;
	  color: rgba(255, 255, 255, 1);
	  font-size: 36rpx;
	  font-family: AlibabaPuHuiTiM;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 50rpx;
	  margin: 31rpx 0 0 264rpx;
	}

	.vali-block{
		width: 561rpx;
		height: 110rpx;
		margin: 0 0 0 22rpx;
		display: flex;
		justify-content: baseline;
	}
	.telvalicode{
		width: 380upx;
		height: 110rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.icon1 {
	  width: 1px;
	  height: 30rpx;
	  margin: 0 10rpx 0 10rpx;
	}
	.send-code{
		width: 140rpx;
		height: 110rpx;
		color: rgba(46, 51, 78, 1);
		font-size: 28rpx;
		font-family: PingFangSC-Medium;
		text-align: right;
		white-space: nowrap;
		margin: 0 0 0 20rpx;
		display: flex;
		justify-content: center;
	}
	.send{
		font-size: 28rpx;
		color: rgba(46, 51, 78, 1);
		line-height: 110rpx;
		border: none;
		outline: none;
	}
	uni-button:after{
		border: none;
	}
	.style{
		color: rgba(0, 155, 249, 1);
	}
	
	
	.outer3 {
	  background-color: rgba(251, 253, 253, 1);
	  height: 90rpx;
	  margin-top: 2rpx;
	  width: 750rpx;
	}
	
	.outer4 {
	  width: 565rpx;
	  height: 48rpx;
	  margin: 21rpx 0 0 94rpx;
	}
	
	.xiugai-4 {
	  width: 228rpx;
	  height: 48rpx;
	  color: rgba(46, 51, 78, 1);
	  font-size: 34rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 48rpx;
	}
	
	.info2 {
	  width: 200rpx;
	  height: 48rpx;
	  color: rgba(0, 155, 249, 1);
	  font-size: 34rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 48rpx;
	}
	
	.outer5 {
	  width: 71rpx;
	  height: 12rpx;
	  margin: 9rpx 0 0 524rpx;
	}
	
	.main3 {
	  background-color: rgba(0, 155, 249, 1);
	  width: 71rpx;
	  height: 12rpx;
	}
	
	.bd10 {
	  /* width: 651rpx; */
	  /* height: 932rpx; */
	  margin: 0 42rpx;
	}
	
	.InputNumber1 {
	  background-color: rgba(245, 249, 250, 1);
	  border-radius: 100px;
	  height: 110rpx;
	  width: 625rpx;
	  padding: 20upx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	
	
	.info1 {
	  width: 190rpx;
	  height: 45rpx;
	  color: rgba(36, 39, 51, 1);
	  font-size: 32rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 45rpx;
	}
	
	.section2 {
	  width: 1rpx;
	  height: 41rpx;
	 /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngfc96eade191544f04069ab3e5e92d9be99331c12f08740349fef4d0480e68c92) -2rpx
	    0rpx no-repeat; */
	  background-size: 5rpx 42rpx;
	  margin: 2rpx 0 0 6rpx;
	}
	
	.section3 {
	  width: 44rpx;
	  height: 44rpx;
	 /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngd04b17b8be7cfb54208c21ad41e4700248216161659236f5330bd832be922b01)
	    100% no-repeat; */
	  background-size: 100% 100%;
	  margin: 1rpx 0 0 300rpx;
	}
	
	.mod1 {
	  background-color: rgba(245, 249, 250, 1);
	  border-radius: 100px;
	  height: 110rpx;
	  margin-top: 24rpx;
	  width: 625rpx;
	  padding: 20upx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	.word5 {
	  width: 352rpx;
	  height: 45rpx;
	  color: rgba(136, 141, 167, 1);
	  font-size: 32rpx;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 45rpx;
	  margin: 32rpx 0 0 42rpx;
	}
	
	.Button1 {
	  background-color: rgba(0, 155, 249, 1);
	  border-radius: 100px;
	  height: 112rpx;
	  width: 635rpx;
	  /* margin: 576rpx 0 0 0; */
	  position: absolute;
	  bottom: 150px;
	  transform: translateX(-50%);
	  left: 50%;
	}
	
	.xiugai-5 {
	  width: 71rpx;
	  height: 50rpx;
	  color: rgba(255, 255, 255, 1);
	  font-size: 36rpx;
	  font-family: AlibabaPuHuiTiM;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 50rpx;
	  margin: 31rpx 0 0 282rpx;
	}
	.hasvalue{
		background-color: rgba(0, 155, 249, 1);
	}

</style>