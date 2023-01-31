<template>
	<view>
		<uni-list>
			<uni-list-item 
				title="输入设备编码" 
				link 
				to="/pages/equipment/inputBindInfo" 
				@click="onClick($event,1)"
				:showExtraIcon="true"
				:extraIcon="icon1"></uni-list-item>
			<uni-list-item 
				title="扫码添加" 
				link 
				:to="url" 
				@click="onClick($event,1)" 
				:showExtraIcon="true"
				:extraIcon="icon2"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				icon1:{color: '#0079fe',size: '36rpx',type: 'compose'},
				icon2:{color: '#ff0000',size: '36rpx',type: 'scan'},
				textscan: '扫码',
				typescan: 'scan-listener',
				value:'',
				url:'/pages/plusScan/index?text=' + this.textscan + '&type=' + this.typescan,
			}
		}
	}
</script>

<style>
</style>