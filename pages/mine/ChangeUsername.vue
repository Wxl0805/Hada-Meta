<template>
	<view class="content">
		
		
		<!-- 原邮箱 -->
		<view class="wrap2 flex-col" >
		  <view class="InputNumber1 flex-col">
		    <uni-easyinput :inputBorder="false" v-model="username" :placeholder="$t('common.username-input')"></uni-easyinput>
		  </view>
		  
		  <button class="xiugai-6 flex-col" @click="submit" :class="{hasvalue:user}">
		    <text class="info4">{{$t('common.confirm')}}</text>
		  </button>
		</view>

	</view>
</template>

<script>
	export default {
		data(){
			return{
				username: '',
				user: false,
			}
		},
		watch:{
			username(val){
				if(!val){
					this.user = false
				}else{
					this.user = true
				}
			}
		},
		onLoad(option) {
			this.token = uni.getStorageSync('token');
			if(option.username){
				this.username = option.username;
			}
		},
		
		methods: {
			
			submit(){
				if(!this.user){
					return;
				}
				if(this.username == ''){
					uni.showToast({
						icon:"none",
						title: '用户名不能为空'
					})
				}else{
					let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					let object = {
						username: this.username,
					};
					prevPage.$vm.otherFun(object)// 給上一頁綁定方法otherFun,傳參object
					uni.navigateBack({
						delta: 1,
						animationType:"none"
					})
				}
			}
		}
		
		
	}
</script>

<style scoped>
	@import '@/static/css/common.css';
	page{
		background-color: #ffffff;
		font-weight: bold;
	}
	.content{
		border-top: 2upx solid rgba(0, 0, 0, 0.1);
	}
	
	
	.wrap2 {
	  width: 635rpx;
	  height: 802rpx;
	  margin: 102rpx 0 0 58rpx;
	  position: relative;
	}

	.xiugai-6 {
	  background-color: rgba(212, 216, 221, 1);
	  border-radius: 100px;
	  height: 112rpx;
	  width: 635rpx;
	  position: absolute;
	  bottom: 0;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	.info4 {
	  color: rgba(255, 255, 255, 1);
	  font-size: 36rpx;
	  font-family: AlibabaPuHuiTiM;
	  line-height: 50rpx;
	}

	
	uni-button:after{
		border: none;
	}
	.style{
		color: rgba(0, 155, 249, 1);
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
	
	.hasvalue{
		background-color: rgba(0, 155, 249, 1);
	}

</style>