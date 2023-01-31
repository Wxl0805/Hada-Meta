<template>
	<view>
		<view v-for="(info,index) in equipmentInfo" :key="info.index" class="equipmentModel" @click="onClick(index)">
			<view class="equipmentTitle">
				<p>{{info.Series}}</p>
				<view>
					<text class="more">{{$t('Home.Swiper.equipment.more')}}</text>
					<uni-icons type="forward" color="#9EA3BB" size="14"></uni-icons>
				</view>
			</view>
			<view class="equipmentImg">
				<image :src="info.Img" ></image>
				<!-- 售罄图片 -->
				<image :src="soldOutImg" class="soldOutImg"></image>
			</view>
			<view class="equipmentBottom">
				<view class="equipmentPower">
					<view>
						<image src="@/static/images/equipment/subEquipment/circle.png">
						<view>
							<text>{{$t('Home.Swiper.equipment.hashrate')}}：</text>
							<p>{{info.ComputingPower}}</p>
							<text>MH/S</text>
						</view>
					</view>
					<view>
						<image src="@/static/images/equipment/subEquipment/circle.png">
						<view>
							<text>{{$t('Home.Swiper.equipment.power')}}：</text>
							<p>{{info.RatedPower}}</p>
							<text>W</text>
						</view>
					</view>
				</view>
				<!-- <view class="equipmentPrice">
					<p>$</p>
					<text>{{info.Price}}</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
export default{
	name:'equipmentInfo',
	props: {
	  equipmentInfo: {
	    type: Array,
	  }
	},
	data(){
		return{
			// 售罄图片
			soldOutImg:'../../static/images/equipment/soldOut.png',
		}
	},
	methods:{
		onClick(index) {
			//跳转到对应的"查看更多"页
			uni.navigateTo({
				url: '../equipment/equipmentDetails?id='+this.equipmentInfo[index].Id,
			});
		}
	}
}
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
//整体样式css
.equipmentModel{
	margin-bottom: 30rpx;
	background-color: #ffffff;
	width: 702rpx;
	// height: 643rpx;
	border-radius: 12rpx;
	// 设备标题css
	.equipmentTitle{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 32rpx 24rpx;
		p{
			font-size: 34rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #2E334E;
		}
		// 查看更多
		.more{
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9EA3BB;
		}
	}
	
	// 设备图片img
	.equipmentImg{
		position: relative;
		width: 650rpx;
		height: 334rpx;
		background-color: #F8F8F8;
		border-radius: 12rpx;
		margin: 0 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 453rpx;
			height: 500rpx;
			background-repeat: no-repeat;
			background-size: cover;
		}
		.soldOutImg{
			position: absolute;
			top: 0rpx;
			right: 0rpx;
			width: 79rpx;
			height: 79rpx;
		}
	}
	
	// 设备底部内容css
	.equipmentBottom{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		// padding-bottom: 20rpx;
		padding-bottom: 60rpx;
		// 功率css
		.equipmentPower{
			margin-top: 23rpx;
			margin-left: 28rpx;
			width: 593rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			text{
				margin-bottom: 20rpx;
				// margin-left: 20rpx;
			}
			view{
				// 小圆点
				image{
					padding-bottom: 6rpx;
					width: 9rpx;
					height: 9rpx;
				}
				view{
					display: inline-block;
					// 算力
					text:first-child{
						margin-left: 16rpx;
						color: rgba(158, 163, 187, 1);
						  font-size: 28rpx;
						  font-family: PingFangSC-Medium;
					}
					// number
					p{
						display: inline-block;
						color: rgba(46, 51, 78, 1);
						  font-size: 38rpx;
						  font-family: PingFangSC-Semibold;
					}
					// 单位
					text:last-child{
						color: rgba(46, 51, 78, 1);
						  font-size: 24rpx;
						  font-family: PingFangSC-Medium;
					}
				}
			}
		}
		// 价格css
		.equipmentPrice{
			margin-left: 26rpx;
			margin-top: 24rpx;
			// color: #009BF9;
			color: @main-color;
			  display: flex;
			  align-items: center;
			  // price
			  text {
			    font-size: 50rpx;
			    font-family: PingFangSC-Semibold, PingFang SC;
			    font-weight: 600;
			    // color: #009bf9;
			    color:@main-color;
			  }
			  // $
			  p {
			    font-size: 32rpx;
			    font-weight: 700;
			    display: inline-block;
			    // color: #009bf9;
			    color: @main-color;
				margin-right: 4rpx;
			  }
		}
	}
}
</style>