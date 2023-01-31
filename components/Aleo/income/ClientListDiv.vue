<template>
  <view class="introduction">
    <view class="title">
      <text>{{ clientInfo.NickName }}</text>
      <text>(UID:{{ clientInfo.UID.substring(clientInfo.UID.length-6, clientInfo.UID.length) }})</text>
	  <view class="leader-icon" v-if="(clientInfo.is_leader == '1')"></view>
	</view>
    <view class="content">
	  <text>{{$t('Aleo.ExpandingCustomerDetails.telephone')}}：</text>
      <text v-if="clientInfo.Telephone!= ''">{{ clientInfo.Telephone }}</text>
      <text v-if="clientInfo.Telephone== ''">-</text>
    </view>
	<view class="content2">
	  <text>{{$t('Aleo.ExpandingCustomerDetails.email')}}：</text>
	  <text v-if="clientInfo.Email!= ''">{{ clientInfo.Email }}</text>
	  <text v-if="clientInfo.Email== ''">-</text>
	</view>
  </view>
</template>

<script>
export default {
  props: {
    clientInfo: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="less">
page {
  position: absolute;
  background-color: #f3f5f7;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>

<style lang="less" scoped>
// 产品简介
.introduction {
	width: 700rpx;
  // margin: 10rpx 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  // padding: 24rpx 40rpx;
  .title {
	  margin-top: 30rpx;
	  margin-left: 40rpx;
    display: flex;
    align-items: center;
	position: relative;
    // border-left: 10rpx solid #009bf9;
    text {
      display: inline-block;
      margin-left: 10rpx;
	  font-size: 34rpx;
	  font-family: PingFangSC-Medium, PingFang SC;
	  font-weight: 500;
	  color: #2E334E;
    }
	text:first-child{
		margin: 0rpx;
	}
	.leader-icon{
		width: 28rpx;
		height: 28rpx;
		background: url('@/static/images/income/Aleo/leader.png');
		background-size: 100% 100%;
		margin-left: 20rpx;
	}
	.right-icon{
		background: url('@/static/images/income/Aleo/rightjiantou.png');
		width: 20rpx;
		height: 20rpx;
		background-size: 100% 100%;
		position: absolute;
		right: 20rpx;
	}
  }
  .content1{
	  margin-top: 34rpx;
	  margin-left: 40rpx;
	  text {
	    font-size: 28rpx;
	    font-family: PingFangSC-Regular, PingFang SC;
	    font-weight: 400;
	    color: #888DA7;
	  }
  }
  .content {
    margin-top: 10rpx;
	margin-left: 40rpx;
    text {
	  font-size: 28rpx;
	  font-family: PingFangSC-Regular, PingFang SC;
	  font-weight: 400;
	  color: #888DA7;
    }
  }
  .content2 {
    margin-top: 10rpx;
  	margin-bottom: 42rpx;
  	margin-left: 40rpx;
    text {
  	  font-size: 28rpx;
  	  font-family: PingFangSC-Regular, PingFang SC;
  	  font-weight: 400;
  	  color: #888DA7;
    }
  }
}
</style>
