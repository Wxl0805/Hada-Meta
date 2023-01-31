<template>
	<view>
		<view class="logoImg">
			<image src="../../static/images/home/telegram/logo_meta1.png" ></image>
		</view>
		<view class="content">
			<view class="title">{{$t('Home.Swiper.telegram.title')}}</view>
			<text>100000+<p>members</p></text>
			<view class="content-text">
				<text>
					{{$t('Home.Swiper.telegram.content-text-1')}}
					<br />
					<br />
					{{$t('Home.Swiper.telegram.content-text-2')}}<p>@Hada Meta</p>
				</text>
			</view>
		</view>
		<view class="btn">
			<button class="openBtn" @click="openTelegram">
				<text>{{$t('Home.Swiper.telegram.open-telegram-btn')}}</text>
			</button>
		</view>
			<image src="../../static/images/home/telegram/circle.png" mode="scaleToFill" class="bottomCircle"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				telegramUrl:'https://t.me/+b39l3KUIAPgyOWQ1',
			}
		},
		methods:{
			// 打开telegram
			openTelegram(){
				// #ifdef APP-PLUS
				if(plus.runtime.isApplicationExist({pname:'org.telegram.messenger',action:'telegram://'})){
					// 直接打开telegram
					plus.runtime.launchApplication(  
						{pname:'org.telegram.messenger',action:'telegram://'}, 
						function(e) {
						}  
					);  
				}else{
					// 走url打开链接
					plus.runtime.openURL(this.telegramUrl, function(res) {
					});  
				}
				//#endif
			}
		}
	}
</script>


<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
.logoImg{
	padding-top: 64rpx;
	margin-left: 42rpx;
	padding-bottom: 64rpx;
	// logo图片
	image{
		width: 370rpx;
		height: 59rpx;
	}
}

.content{
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-left: 42rpx;
	.title{
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #2E334E;
	}
	// 10000+
	text{
		margin-top: 10rpx;
		color: rgba(0, 155, 249, 1);
		font-size: 40rpx;
		font-family: PingFangSC-Medium;
		// members
		p{
			display: inline;
			color: rgba(46, 51, 78, 1);
			font-size: 30rpx;
			font-family: PingFangSC-Medium;
		}
	}
	// 欢迎xxxxxx
	.content-text{
		margin-top: 42rpx;
		margin-right: 48rpx;
		white-space: pre-wrap;
		text{
			color: rgba(46, 51, 78, 1);
			font-size: 30rpx;
			font-family: PingFangSC-Medium;
			p{
				display: inline-block;
				color: rgba(0, 155, 249, 1);
				  font-size: 32rpx;
				  font-family: PingFangSC-Medium;
			}
		}
	}
}

.btn{
	display: flex;
	justify-content: center;
	margin-top: 194rpx;
	.openBtn{
		width: 635rpx;
		height: 112rpx;
		// background-color: #009BF9;
		background-color: @main-color;
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		text{
			font-size: 36rpx;
			font-family: AlibabaPuHuiTiM;
			color: #FFFFFF;
		}
	}
}
// 最底下的裝飾圓
.bottomCircle{
	z-index: -999;
	position: absolute;
	left: 0%;
	bottom: 0%;
	width: 230rpx;
	height: 260rpx;
}
</style>