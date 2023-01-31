<template>
	<view class="centent">
		<view class="block" @click="lang">
			<view class="lang">
				<span>{{$t('mine.switch-language')}}</span>
			</view>
			<!-- <view class="rightimg">
				<image :src="img" mode=""></image>
			</view> -->

			<view class="lang-right">
				<span v-if="fan">{{ $t('locale.zh-hant') }}</span>
				<span v-else>{{ $t('locale.zh-hans') }}</span>
				<view class="lang-right-icon"></view>
			</view>
		</view>

		<view class="block" @click="zhuxiao = true" v-if="showZhuxiao">
			<view class="lang">
				<span>{{$t('mine.set-zhuxiaoUser')}}</span>
			</view>
			<view class="rightimg" style="display: flex;justify-content: flex-end;align-items: center;">
				<view class="right-icon"></view>
			</view>
		</view>

		<view class="btn" v-if="exit">
			<button @click="quit">{{$t('common.tuichu')}}</button>
		</view>

		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" :cancelText="$t('common.quxiao')" :confirmText="$t('common.confirm-1')" :title="$t('common.tuichu-title')" :content="$t('common.tuichu-content')" @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup>


		<!-- 注销弹窗 -->
		<view class="section_3 flex-col" v-if="zhuxiao">
		  <view class="group_11 flex-row justify-between">
		    <text class="text_7">{{$t('mine.set-confirmZhuxiao')}}</text>
		    <button class="icon_1 flex-col" @click="zhuxiao = false;password = ''"></button>
		  </view>
		  <text class="text_8">
		    {{$t('mine.set-firstCont')}}
		  </text>
		  <text class="text_9">
		    {{$t('mine.set-secondCont')}}
		  </text>
		  <view class="text-wrapper_3 flex-col">
		    <uni-easyinput @focus="getkeyboard" @blur="getkeyboard" type="password" :inputBorder="false" v-model="password" :placeholder="$t('VerificationLogin.password-placeholder')"></uni-easyinput>
		  </view>
		  <view class="group_12 flex-row justify-between">
		    <button class="button_1 flex-col" @click="confirmZhuxiao">
		      <text class="text_11">{{$t('mine.set-confirmZhuxiao')}}</text>
		    </button>
		    <button class="button_2 flex-col" @click="zhuxiao = false;password = ''">
		      <text class="text_12">{{$t('mine.set-think')}}</text>
		    </button>
		  </view>
		</view>

		<!-- 遮罩层 -->
		<view class="mask" v-if="zhuxiao"></view>

	</view>
</template>

<script>
	import America from '@/static/images/mine/America.png'
	import China from '@/static/images/mine/wuxin1.png'
	import xinjiapo from '@/static/images/mine/xinjiapo1.png'
	// #ifdef APP-PLUS
	import APPUpdate, { getCurrentNo } from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
	// #endif
	export default {
		data(){
			return{
				type: 'center',
				msgType: 'message',
				img: xinjiapo,
				zhuxiao: false,
				password: '',
				exit: true,
				// 记录触发了几次需要更新APP
				appUpdate: 0,
				showZhuxiao: true,
				// 显示简体中文或者繁体中文
				fan: true,
			}
		},
		onLoad(options) {
			if(options.IsLogOut){
				console.log;
				if(options.IsLogOut === 'Y'){
					this.showZhuxiao = true;
				}else{
					this.showZhuxiao = false;
				}
			}
		},
		onShow() {
			// 获取语言设置国旗

			if(uni.getStorageSync('lang')){
				 // if(uni.getStorageSync('lang') == 'en'){
					//  this.img = America;
					//  return;
				 // }else
				 if(uni.getStorageSync('lang') == 'zh-Hans'){
					 this.img = China;
					 this.fan = false;
					 return;
				 }else{
					 this.fan = true;
					 this.img = xinjiapo;
					 return;
				 }
			}
			// if(uni.getSystemInfoSync().language == 'en-US'){
			// 	this.img = America
			// 	return;
			// }
			// if(uni.getSystemInfoSync().language == 'zh-CN'){
			// 	this.img = China
			// 	return;
			// }
			// if(uni.getSystemInfoSync().language == 'zh-TW'){
			// 	this.img = xinjiapo
			// 	return;
			// }
			this.fan = true;
			this.img = xinjiapo
		},
		methods:{
			quit(){
				this.$refs.alertDialog.open();
			},
			dialogClose(){
				this.$refs.alertDialog.close();
			},
			dialogConfirm(){
				uni.navigateTo({
					url:'/pages/index/VerificationLogin',
					success(res){
						uni.clearStorageSync();
						plus.runtime.restart();
					},
					fail(res){
					}
				});

			},
			lang(){
				uni.navigateTo({
					url: '/pages/mine/lang'
				})
			},
			confirmZhuxiao(){
				uni.request({
				  header: { "Content-Type": "application/json" ,
				  "x-token": uni.getStorageSync('token'),
				 //version
				 version: this.version,
				  },
				  url: this.host+'/app/logOut?password='+this.password,
				  method: "GET",
				  dataType: "json",
				  success: (res) => {
					  console.log(res);
					  if(res.data.code == 0){
						  uni.navigateTo({
						  	url:'/pages/index/VerificationLogin',
						  	success(res){
						  		uni.clearStorageSync();
						  		plus.runtime.restart();
						  	},
						  	fail(res){
						  	}
						  });
					  }
					  if(res.data.code == 7){
						  this.zhuxiao = false;
						  this.password = '';
						  uni.showToast({
						  	icon:'none',
							title:this.$t('common.zhuxiao-password')
						  })
						  return;
					  }

				  },
				});

			},
			getkeyboard(){
				// this.exit = true;
				uni.onKeyboardHeightChange(res => {
					// console.log(res.height)
					if(res.height != 0){
						this.exit = false;
						return
					}
					this.exit = true;
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("@/static/css/common.css");
	@import "@/static/css/MainColor.less";
	page{
		background-color: rgba(243, 245, 247, 1);
	}
	.block{
		width: 100%;
		height: 120upx;
		background-color: #ffffff;
		border-top: 1px solid rgba(243, 245, 247, 1);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.lang{
		font-size: 34upx;
		line-height: 100upx;
		margin-left: 30upx;
	}
	.btn{
		width: 80%;
		position: absolute;
		bottom: 40upx;
		left: 10%;
		/* background-color: #009bf9; */
		background-color: var(--main-color,#009bf9);
		background-color: @main-color;
		border-radius: 100upx;
	}
	.btn > button{
		color: #ffffff;
		border-radius: 100upx;
	}
	.rightimg{
		width: 90upx;
		height: 60upx;
		/* margin-top: 20upx; */
		margin-left: auto;
		margin-right: 30rpx;
	}
	.rightimg > image{
		width: 90upx;
		height: 60upx;
	}
	.right-icon{
		width: 20rpx;
		height: 20rpx;
		background: url('@/static/images/mine/rightjiantou.png');
		background-size: 100% 100%;
	}


	/* 注销弹窗样式 */
	.section_3 {
	  background-color: rgba(255, 255, 255, 1);
	  border-radius: 12px;
	  width: 640rpx;
	  height: 696rpx;
	  z-index: 1000;
	  position: fixed;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -60%);
	}

	.group_11 {
	  width: 358rpx;
	  height: 62rpx;
	  margin: 34rpx 0 0 248rpx;
	}

	.text_7 {
	  width: 144rpx;
	  height: 50rpx;
	  overflow-wrap: break-word;
	  color: rgba(46, 51, 78, 1);
	  font-size: 36rpx;
	  font-family: PingFangSC-Medium;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 50rpx;
	  margin-top: 12rpx;
	}

	.icon_1 {
	  width: 44rpx;
	  height: 44rpx;
	  background: url('@/static/images/mine/shanchu.png')
	    0rpx 0rpx no-repeat;
	  background-size: 45rpx 44rpx;
	}

	.text_8 {
	  width: 520rpx;
	  height: 104rpx;
	  overflow-wrap: break-word;
	  color: rgba(46, 51, 78, 1);
	  font-size: 30rpx;
	  font-family: PingFang-SC-Medium;
	  text-align: left;
	  line-height: 52rpx;
	  margin: 53rpx 0 0 60rpx;
	}

	.text_9 {
	  width: 520rpx;
	  height: 104rpx;
	  overflow-wrap: break-word;
	  color: rgba(46, 51, 78, 1);
	  font-size: 30rpx;
	  font-family: PingFang-SC-Medium;
	  text-align: left;
	  line-height: 52rpx;
	  margin: 20rpx 0 0 65rpx;
	}

	.text-wrapper_3 {
	  background-color: rgba(245, 249, 250, 1);
	  border-radius: 45px;
	  height: 90rpx;
	  width: 530rpx;
	  margin: 38rpx 0 0 55rpx;
	  overflow: hidden;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  box-sizing: border-box;
	  padding: 0 42rpx 0 22rpx;
	}

	.text_10 {
	  width: 210rpx;
	  height: 42rpx;
	  overflow-wrap: break-word;
	  color: rgba(136, 141, 167, 1);
	  font-size: 30rpx;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 42rpx;
	  margin: 25rpx 0 0 42rpx;
	}

	.group_12 {
	  width: 580rpx;
	  height: 90rpx;
	  margin: 55rpx 0 46rpx 30rpx;
	}

	.button_1 {
	  border-radius: 100px;
	  height: 90rpx;
	  border: 1px solid rgba(244, 244, 244, 1);
	  width: 280rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	.text_11 {
	  width: 126rpx;
	  height: 44rpx;
	  overflow-wrap: break-word;
	  color: rgba(46, 51, 78, 1);
	  font-size: 32rpx;
	  font-family: AlibabaPuHuiTiR;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 44rpx;
	}

	.button_2 {
	  background-color: rgba(0, 155, 249, 1);
	  border-radius: 100px;
	  height: 90rpx;
	  width: 280rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	.text_12 {
	  width: 126rpx;
	  height: 44rpx;
	  overflow-wrap: break-word;
	  color: rgba(255, 255, 255, 1);
	  font-size: 32rpx;
	  font-family: AlibabaPuHuiTiR;
	  text-align: left;
	  white-space: nowrap;
	  line-height: 44rpx;
	}

	/* 遮罩层 */
	.mask{
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,0.4);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.lang-right{
		/* width: 400px; */
		height: 100%;
		margin-left: auto;
		margin-right: 30rpx;
		display: flex;
		align-items: center;
		color: rgba(158, 163, 187, 1);
		font-size: 28rpx;
	}
	.lang-right-icon{
		width: 20rpx;
		height: 20rpx;
		background: url('@/static/images/mine/rightjiantou.png');
		background-size: 100% 100%;
		margin-left: 20rpx;
	}
</style>
