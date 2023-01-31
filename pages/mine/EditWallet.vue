<template>
	<view class="content">
		<view class="status_bar">
		</view>
		
		<!-- 顶部导航栏 -->
		<view class="header-fixed">
		<uni-nav-bar height="118rpx" backgroundColor="#ffffff">
			<view class="header-title">
				<span>编辑钱包</span>
			</view>
			<view slot="left">
				<view class="left" @click="back" v-if="change">
					<span>取消</span>
				</view>
				
				<view class="left" @click="backtop" v-if="!change">
					<span>返回</span>
				</view>
			</view>
			<view slot="right">
				<view class="right" @click="save" v-if="change">
					<span>保存</span>
				</view>
			</view>
		</uni-nav-bar>
		</view>
		
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确定" title="退出确认" content="钱包尚未保存,是否确认退出？" @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content" >
				<text class="text">保存成功</text>
			</view>
		</uni-popup>
		
		<view class="content-cont">
			<view class="block-cont addhight">
				<span style="color: #2e334e;">钱包地址</span>
			</view>
			<view class="block-cont subheight">
				<view class="input-address">
					<input v-model="walletAddress" @input="walletaddress" placeholder-style="color:#9ea3bb;" type="text" placeholder="输入钱包地址">
				</view>
			</view>
			<view class="block-cont addhight ">
				<span style="color: #2e334e;">自动提现</span><span style="color: #2facff;margin-left: 0;">*</span>
				<view class="right-icon">
					<zero-switch
					 v-model="switchBtn" 
					 backgroundColorOff="#d4d4d4" 
					 backgroundColorOn="#2facff" 
					 activeColor='#ffffff' 
					 inactiveColor='#ffffff'
					 @change="switchchange">
					</zero-switch>
				</view>
			</view>
			<view class="block-cont addstyle" v-if="switchBtn">
				<span>起付金额</span><span style="color: #2facff;margin-left: 0;">*</span>
				<view class="radio">
					<own-check ref = "editlist" :list="list" color="rgba(158, 163, 187, 1)"
					   bgColor="#ffffff"
					   activeTextColor="rgba(0, 155, 249, 1)"
					   activeBgColor="rgba(0, 155, 249, 0.18)"
					   type="radio"
					   class="btn"
					   v-bind:active="active"
					   @chooseItem="chooseitem">
					</own-check>
				</view>
				
			</view>
			
		</view>
	</view>
</template>

<script>
	import ownCheck from '@/components/own-checkBtn/own-check.vue'; //多选单选自定义按钮
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	export default {
		components: {
		    ownCheck
		},
		data(){
			return{
				active: 0,
				currencyCategory: '',
				walletAddress: '',
				autoWithdrawal: '0',
				type: 'center',
				msgType: 'message',
				switchBtn: false,
				chooseItem:'',
				change: false,
				list: [
					{name:"0.2 ETH"},
					{name:"0.5 ETH"},
					{name:"1 ETH"},
					{name:"5 ETH"}
				],
				// 记录触发了几次需要更新APP
				appUpdate: 0,
				
			}
		},
		onLoad(options) {
			this.currencyCategory = options.currencyCategory;
			this.walletAddress = options.subaddress;
			this.autoWithdrawal = options.withdrawal;
			this.limit = options.limit;
			this.list[0].name = '0.2 '+this.currencyCategory;
			this.list[1].name = '0.5 '+this.currencyCategory;
			this.list[2].name = '1 '+this.currencyCategory;
			this.list[3].name = '5 '+this.currencyCategory;
			if (options.limit == 0.2) {
				this.active = 0;
			}else if(options.limit == 0.5){
				this.active = 1;
			}else if(options.limit == 1){
				this.active = 2;
			}else if(options.limit == 5){
				this.active = 3;
			}
			
			if (options.withdrawal == 1){
				this.switchBtn = true
			}else{
				this.switchBtn = false
			}
		},
		
		methods: {
			switchchange(e){
				this.change = true;
			},
			walletaddress(val){
				this.change = true;
			},
			back(){
				this.$refs.alertDialog.open()
			},
			save(){
				if(this.walletAddress == ''){
					uni.showToast({
						title: '钱包地址不能为空',
						icon:'none'
					});
					return;
				}
				var switchFlag =0;
				var chose = 5;
				if(this.switchBtn) {
					switchFlag=1
					chose = this.chooseItem.replace(' '+this.currencyCategory,'')
				}
				if(this.chooseItem.length == 0){
					chose = this.limit
				}
				uni.request({
					header: {
						'Content-Type': 'application/json',
						'x-token':	uni.getStorageSync('token'),
						//version
						version: this.version,
						}, 
					// url: this.host+'/app/user/bind/wallet/' + this.walletAddress + '/' + this.subaccountId+"/"+switchFlag+"/"+chose,
					url: this.host+'/app/user/bind/wallet/'+this.walletAddress+'/'+switchFlag+'/'+chose+'/'+this.currencyCategory,
					method: 'POST',
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
						uni.showToast({
						  icon: 'none',
						  title: '保存成功！'
						})
						uni.navigateBack({
								delta:1,//返回层数，2则上上页
						});
					} 
				});
			},
			dialogConfirm(){
				uni.navigateBack({
						delta:1,//返回层数，2则上上页
				});
			},
			dialogClose(){
				this.$refs.alertDialog.close();
			},
			chooseitem(e){
				this.chooseItem = e.name;
				this.change = true;
			},
			backtop(){
				uni.navigateBack({
					delta:1,
				})
			},
		},
	}
</script>

<style >
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
		width: 100vw;
		height: 100vh;
		 background-color: rgba(243, 245, 247, 1);
	}
	.content-cont{
		margin-top: 118rpx;
		 font-family: PingFangSC-Medium;
	}
	.popup-content {
		align-items: center;
		justify-content: center;
		padding: 30upx;
		height: 40upx;
		background-color: #fff;
	}
	.text {
		font-size: 24upx;
		color: #333;
	}
	.block-cont{
		width: 100vw;
		height: 110upx;
		background-color: white;
		position: relative;
		font-family: PingFangSC-Medium;
	}
	.addhight{
		border-top: 1.5px solid rgba(243, 245, 247, 1);
	}
	.subheight{
		height: 100rpx;
	}
	.block-cont > span{
		margin-left: 20upx;
	}
	.block-cont > span:first-child{
		line-height: 110upx;
	}
	.input-address{
		position: absolute;
		top: 20upx;
		left: 20upx;
		width: 90%;
		height: 50upx;
		/* color: #9ea3bb; */
		font-family: "PingFangSC-Medium";
	}
	.right-icon{
		position: absolute;
		right: 20upx;
		top: 28upx;
	}
	.info{
		color: darkgray;
	}
	.btn{
		width: 200upx;
		height: 10upx;
	}
	.radio{
		position: absolute;
		right: 380upx;
		top: 21upx;
	}
	.addstyle{
		border-top: 1.5px solid rgba(243, 245, 247, 1);
		color: #9ea3bb;
		font-size: 30rpx;
	}
</style>