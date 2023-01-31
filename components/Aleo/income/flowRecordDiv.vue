<template>
  <view class="list-item">
    <view class="slot-body">
      <view class="body-title">
        <!-- U文字-->
        <text v-if="record.types === 0 && record.recordType === 0">
          {{ $t("Aleo.FlowRecordDiv.ltzr") }}
        </text>
        <text v-if="record.types === 1 && record.recordType === 0">
          {{ $t("Aleo.FlowRecordDiv.dhzc") }}
        </text>
        <text v-if="record.status === 0 && record.recordType === 0 && record.types === 0" class="ing"> ({{ $t("Aleo.FlowRecordDiv.ing") }}) </text>
        <text v-if="record.status === 1 && record.recordType === 0 && record.types === 0" class="ing"> ({{ $t("Aleo.FlowRecordDiv.success") }}) </text>
        <text v-if="record.status === 2 && record.recordType === 0 && record.types === 0" class="ing"> ({{ $t("Aleo.FlowRecordDiv.fail") }}) </text>
        <!-- G文字-->
        <text v-if="record.types === 0 && record.recordType === 1">
          {{ record.orderNumber }}
        </text>
        <text v-if="record.status === 1 && record.recordType === 1 && record.types === 0" class="ing"> ({{ $t("Aleo.Gdiv.exchange-self") }}) </text>
        <text v-if="record.status === 1 && record.recordType === 1 && record.types === 1" class="ing"> ({{ $t("Aleo.Gdiv.exchange-other") }}) </text>
        <!-- Ao文字-->
        <text v-if="record.types === 0 && record.recordType === 2">
          {{ $t("Aleo.FlowRecordDiv.cc") }} - {{ record.textTime }}
        </text>
      </view>
      <view class="body-content">
        <text>
          {{ record.tradeTime }}
        </text>
      </view>
    </view>

    <view class="footer-time">
      <text :class="changeAmountColor(record)">
        <text v-if="record.types === 0 && record.recordType === 0 || record.recordType === 1 || record.recordType === 2">+</text>
        <text v-if="record.types === 1 && record.recordType === 0">-</text>
        {{ record.changeAmount }}
      </text>
      <uni-icons type="forward" size="10"></uni-icons>
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
    };
  },
  methods: {
    changeAmountColor(data) {
      // U数字颜色变换逻辑
      if (data.recordType === 0) {
        // 判断是否是0转入
        if (data.types == 0) {
          // 判断状态是否是成功
          if (data.status == 1) {
            return "amount successState";
          } else if (data.status == 2) {
            // 判断状态是否是失败
            return "amount failState";
          } else {
            // 判断状态是否是待审核
            return "amount waitingState";
          }
        } else {
          // 是1转出
          return "amount normalState";
        }
      }

      // G数字颜色变换逻辑
      if (data.recordType === 1) {
        // 判断状态是否是成功
        if (data.status == 1) {
          return "amount successState";
        } else {
          // 判断状态是否是待审核
          return "amount waitingState";
        }
      }
	  // Ao数字颜色变换逻辑
      if (data.recordType === 2) {
          return "amount successState";
      }
    },
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
    margin-left: 40rpx;
    color: #2e334e;
    .body-title {
      font-size: 30rpx;
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
    margin-right: 40rpx;
    display: flex;
    align-items: center;
    .amount {
      display: block;
      margin-right: 8rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
  }
  .normalState {
    color: #2e334e;
  }
  .waitingState {
    color: #ffab4f;
  }
  .failState {
    color: #ee423d;
  }
  .successState {
    color: #05c985;
  }
}
</style>
