<template>
  <view class="list-item">
    <view class="slot-body">
      <view class="body-title">
        <text>
          {{ record.order_number }}
        </text>
        <text v-if="record.status == 0" class="ing"> ({{ $t("Aleo.InspiredPointsRecord.ing") }}) </text>
        <text v-if="record.status == 1" class="ing successState"> ({{ $t("Aleo.InspiredPointsRecord.success") }}) </text>
        <text v-if="record.status == 2" class="ing failState"> ({{ $t("Aleo.InspiredPointsRecord.fail") }}) </text>
      </view>
      <view class="body-content">
        <text>
          {{ record.trade_time }}
        </text>
      </view>
    </view>

    <view class="footer-time">
      <text> {{ record.change_amount * GutoHM }}HM </text>
      <text> {{ record.change_amount }}股 </text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    record: Object,
  },
  data() {
    return {
      GutoHM: 2000,
    };
  },
};
</script>

<style lang="less" scoped>
.list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 750rpx;

  padding: 24rpx 0rpx;

  // 左半部分
  .slot-body {
    margin-left: 32rpx;
    color: #2e334e;
    .body-title {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
      .ing {
        padding-left: 10rpx;
      }
    }
    .body-content {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #9ea3bb;
    }
  }
  // 右半部分
  .footer-time {
    margin-right: 32rpx;
    display: flex;
    flex-direction: column;
    text {
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #9ea3bb;
    }
    text:last-of-type {
      text-align: end;
    }
  }
  .failState {
    color: rgba(249, 0, 0, 1);
  }
  .successState {
    color: #008000;
  }
}
</style>
