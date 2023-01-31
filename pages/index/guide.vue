<template>
	<view >
		<view class="status_bar">
		</view>
	<!-- //这里放需要滑动的区域 -->
		<view class="page-index">
			<swiper class="swiper" interval="3000" indicator-dots="true" >
				<swiper-item @touchmove="getindex(key)" v-for="(item,key) in swiperList" :key="item" class="swiper-item">
					<image :src="item" alt="" />
				</swiper-item>
			</swiper>
		</view>
		<button v-if="showbtn" class="but" @click="next">跳过</button>
	</view>
	
</template>

<script>
	import img1 from '../../static/images/login/image4.webp';
	import img2 from '../../static/images/login/image5.webp';
	import img3 from '../../static/images/login/image6.webp';
	export default {
		data() {
			return {
				// 轮播图列表
				swiperList: [
					img1,
					img2,
					img3,
				],
				showbtn: false,
				
			}
		},
		methods: {
			next(){
				uni.navigateTo({
					url: '/pages/index/VerificationLogin',
					success(res){
					},
					fail(res){
					}
				});
				// this.$router.push('/pages/index/VerificationLogin');
			},
			getindex(index){
				if(index == 1 || index == 2){
					this.showbtn = true;
				}
			}
		},
	}
</script>

<style scoped>
	.status_bar{
		height: var(--status-bar-height);
		width: 100%;
	}
	.swiper {
		width: 100%;
		height: 90vh;
	}
	.swiper-item image {
		width: 100%;
		height: 80%;
	}
	.but{
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		background: transparent;
		border: 0;
		font-size: 40upx;
		font-weight: bold;
	}
	
</style>
