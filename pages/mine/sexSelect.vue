<template>
	<view class="">
		<view class="status_bar">
		</view>
		<uni-nav-bar leftText="确认" title="选择性别" @clickLeft="confirm" />
		<view class="block" @click="selectnan">
			<view class="block-left">
				<span>男</span>
			</view>
			<view class="block-right">
				<uni-icons v-if="selected" type="checkmarkempty" size="40upx" color="green"></uni-icons>
			</view>
		</view>
		<view class="block" @click="selectnv">
			<view class="block-left">
				<span>女</span>
			</view>
			<view class="block-right">
				<uni-icons v-if="!selected" type="checkmarkempty" size="40upx" color="green"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				selected: true,
			}
		},
		onLoad(option) {
			if(option.sex){
				if(option.sex == '男'){
					this.selected = true;
				}else{
					this.selected = false;
				}
			}
		},
		methods: {
			selectnan(){
				this.selected = true;
			},
			selectnv(){
				this.selected = false;
			},
			confirm() {
				let sex = '';
				if(this.selected == true){
					sex = '男'
				}else{
					sex = '女'
				}
				uni.redirectTo({
					url: `/pages/mine/userDate?sex=${sex}`,
					success(res){
					},
					fail(res){
					}
				});
			}
		}
	}
</script>

<style scoped>
	.status_bar{
		height: var(--status-bar-height);
		width: 100%;
	}
	.block{
		width: 100%;
		height: 80upx;
		border-bottom: 1px solid lightgray;
		position: relative;
	}
	.block-left{
		position: absolute;
		left: 20upx;
		top: 20upx;
	}
	.block-right{
		position: absolute;
		top: 20upx;
		right: 20upx;
	}
</style>