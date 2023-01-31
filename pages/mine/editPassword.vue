<template>
	<view class="content">
		<!-- <view class="status_bar">
		</view> -->
		
		<!-- 顶部导航栏 -->
		<!-- <view class="header-fixed">
		<uni-nav-bar height="118rpx" backgroundColor="#ffffff" left-icon="left" @clickLeft="back">
			<view class="header-title">
				<span>{{$t('mine.editpassword')}}</span>
			</view>
		</uni-nav-bar>
		</view> -->
		
		<view class="content-body">
			<view class="block" @click="clickbtnone" >
				<span>{{$t('mine.oldpassword')}}</span>
				<view class="icon">
				</view>
			</view>
			<view class="block" @click="clickbtntwo(1)">
				<span>{{$t('common.tel-editpassword')}}</span>
				<view class="icon">
				</view>
			</view>
			<view class="block" @click="clickbtnthree(1)" >
				<span>{{$t('mine.email-vericode-password')}}</span>
				<view class="icon">
				</view>
			</view>
			
			<!-- <view class="btn">
				<button>{{$t('common.next')}}</button>
			</view> -->
		</view>
		
		<aui-dialog 
		    ref="dialog"
		    :title="auiDialog.title"
		    :msg="auiDialog.msg"
		    :btns="auiDialog.btns"
		    :mask="auiDialog.mask"
		    :maskTapClose="auiDialog.maskTapClose"
		    :items="auiDialog.items"
		    :theme="auiDialog.theme"
		></aui-dialog>
		
	</view>
</template>

<script>
	import {aui} from '@/components/aui-dialog/common/aui/js/aui.js';
	import auiDialog from '@/components/aui-dialog/aui-dialog.vue';
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	export default {
		components: {
		    auiDialog
		},
		data(){
			return{
				
				formation: '',
				 auiDialog: {
					title: '',
					msg: '',
					btns: [{name: '确定'}],
					mask: true,
					maskTapClose: true,
					items: [],
					theme: 1,
				 },
				 // 记录触发了几次需要更新APP
				 appUpdate: 0,
			}
		},
		onReady() {
			// this.email = uni.getStorageSync('user').email;
			uni.request({
				header: {'Content-Type': 'application/json',
				'x-token': uni.getStorageSync('token'),
				//#ifdef APP-PLUS
				//version
				version: this.version,
				//#endif
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
					this.formation = res.data.data;
				},
			});
		},
		
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				})
			},
			clickbtnone(){
				
				uni.navigateTo({
					url: '/pages/mine/oldPassword',
					success(res){
					},
					fail(res){
					}
				});
			},
			clickbtntwo(theme){
				
				if(this.formation.phone == ''){
					 var _this = this;
					 _this.auiDialog.title = _this.$t('mine.editpassword-poptitle');
					 _this.auiDialog.msg = _this.$t('common.unbindtel-cont');
					 _this.auiDialog.btns = [{name: _this.$t('common.confirm-1'), color: '#197DE0'}];
					 _this.auiDialog.items = [];
					 _this.auiDialog.theme = theme;
					 _this.$refs.dialog.show();
					 return;
				}
				uni.navigateTo({
					url: '/pages/mine/telValidate',
					success(res){
					},
					fail(res){
					}
				});
			},
			clickbtnthree(theme){
				
				if(this.formation.email == ''){
					 var _this = this;
					 _this.auiDialog.title = _this.$t('mine.editpassword-poptitle');
					 _this.auiDialog.msg = _this.$t('mine.editpassword-emailmsg');
					 _this.auiDialog.btns = [{name: _this.$t('common.confirm-1'), color: '#197DE0'}];
					 _this.auiDialog.items = [];
					 _this.auiDialog.theme = theme;
					 _this.$refs.dialog.show();
					 return;
				}
				uni.navigateTo({
					url: '/pages/mine/emailValidate',
					success(res){
					},
					fail(res){
					}
				});
			}
			
		}
	}
</script>

<style lang="less">
	// /deep/ .uni-icons{
	// 	font-size: 24px !important;
	// 	color: rgb(0, 0, 0);
	// }
	// /deep/ .uni-navbar__header{
	// 	height: 44px !important;
	// }
	.status_bar{
		height: var(--status-bar-height);
		width: 100%;
		background-color: #ffffff;
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
	page{
		background-color: rgba(243, 245, 247, 1);
	}
	.content{
		width: 100vw;
		position: relative;
	}
	.content-body{
		width: 100vw;
		height: 90vh;
		position: absolute;
	}
	.block{
		width: 100vw;
		height: 100upx;
		border-top: 1px solid #efefef;
		background-color: #ffffff;
		line-height: 100upx;
		// top: 85rpx;
		position: relative;
		// font-family: "PingFangSC-Medium";
		color: rgba(46, 51, 78, 1);
		font-size: 30rpx;
	}
	.block > span{
		margin-left: 42upx;
	}
	.icon{
		position: absolute;
		width: 20upx;
		height: 20upx;
		right: 40upx;
		top: 40upx;
		background: url('@/static/images/rightjiantou.png') no-repeat;
		background-size: 100% 100%;
	}
	.select{
		background-color: azure;
	}
	.btn{
		position: absolute;
		bottom: 0;
		background:rgba(0,155,249,1);
		border-width: 0;
		width: 80%;
		border-radius: 100px;
		left: 10%;
		overflow: hidden;
	}
	.btn > button{
		color: #ffffff;
		border-radius: 10px;
	}
</style>