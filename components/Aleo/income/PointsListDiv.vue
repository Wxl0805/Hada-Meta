<template>
  <view class="points-block">
    <view class="date">
      <text>{{ info.time }}</text>
    </view>
    <view class="content">
      <text>{{ info.points }}Aleo</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
    },
  },
};
</script>

<style lang="less" scoped>
.points-block {
  background-color: #ffffff;
  padding: 24rpx 42rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .date {
    text {
      display: inline-block;
      margin-left: 10rpx;
	  font-size: 30rpx;
	  font-family: PingFangSC-Medium, PingFang SC;
	  font-weight: 500;
	  color: #9EA3BB;
    }
  }
  .content {
    text {
	  font-size: 30rpx;
	  font-family: PingFangSC-Medium, PingFang SC;
	  font-weight: 500;
	  color: #9EA3BB;
    }
  }
}
</style>
