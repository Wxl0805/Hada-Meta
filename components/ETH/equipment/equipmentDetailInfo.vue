<template>
  <view class="content">
    <view class="header">
      <!-- 图片 -->
      <view class="img">
        <!-- <image :src="equipmentDetailInfo.Img"></image> -->
		<!-- <image :src="equipmentDetailInfo.Img" v-if="equipmentDetailInfo.Img != '../../static/images/equipment/u98.png  '"></image> -->
		<image src="../../../static/images/equipment/hada1.png" v-if="equipmentDetailInfo.Img == '../../static/images/equipment/u98.png  '"></image>
		<image src="../../../static/images/equipment/hada1Pro.png" style="width: 702rpx;" v-if="equipmentDetailInfo.Img == '../../static/images/equipment/u97.png'"></image>
		<!-- 售罄图片 -->
		<image :src="soldOutImg" class="soldOutImg"></image>
      </view>
      <!-- 标题价格 -->
      <view class="price">
        <!-- <text>{{ equipmentDetailInfo.Series }}</text>
        <view>
          <p>$</p>
          <text>{{ equipmentDetailInfo.Price }}</text>
        </view> -->
      </view>
    </view>

    <!-- 表格1 -->
    <view class="uni-container">
      <view class="table-title1">{{ $t("Home.Swiper.equipmentDetail.title1") }}</view>
      <uni-table ref="table1" :border="false" :stripe="false">
        <uni-tr>
          <uni-th width="150rpx" align="center" class="title">主体</uni-th>
          <uni-th width="250rpx" align="center" class="title">主体</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment1-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Series }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment1-2") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.DeviceModel }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment1-3") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Structure }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment1-4") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.CertifiedModel }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格2 -->
    <view class="uni-container">
      <view class="table-title2 title2">{{ $t("Home.Swiper.equipmentDetail.title2") }}</view>
      <uni-table ref="table2" :border="false" :stripe="false">
        <uni-tr>
          <uni-th width="100rpx" align="center" class="title">处理器</uni-th>
          <uni-th width="250rpx" align="center" class="title">处理器</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment2-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.CpuName }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment2-2") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.CpuFrequency }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment2-3") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Tdp }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment2-4") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.NumsCores }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment2-5") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Threads }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格3 -->
    <view class="uni-container">
      <view class="table-title2 title3">{{ $t("Home.Swiper.equipmentDetail.title3") }}</view>
      <uni-table ref="table3" :border="false" :stripe="false">
        <uni-tr>
          <uni-th width="300rpx" align="center" class="title">主板</uni-th>
          <uni-th width="100rpx" align="center" class="title">主板</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Model }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-2") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.MainChipset }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-3") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.MemorySupport }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-4") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.HardDiskInterface }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-5") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.VideoInterface }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-6") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.UsbInterface }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-7") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Dimensions }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-8") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.ExtendedPcie }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment3-9") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.EmbeddedNetworkController }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格4 -->
    <view class="uni-container">
      <view class="table-title2 title4">{{ $t("Home.Swiper.equipmentDetail.title4") }}</view>
      <uni-table ref="table4" :border="false" :stripe="false">
        <uni-tr>
          <uni-th width="300rpx" align="center" class="title">存储</uni-th>
          <uni-th width="100rpx" align="center" class="title">存储</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment4-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.InternalHandDriverNumber }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment4-2") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Storage }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格5 -->
    <view class="uni-container">
      <view class="table-title2 title5">{{ $t("Home.Swiper.equipmentDetail.title5") }}</view>
      <uni-table ref="table5" :border="false" :stripe="false" emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="300rpx" align="center" class="title">电源性能</uni-th>
          <uni-th width="100rpx" align="center" class="title">电源性能</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment5-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.RatedPower }}W({{ $t("Home.Swiper.equipmentDetail.equipment5-2") }})</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格6 -->
    <view class="uni-container">
      <view class="table-title2 title6">{{ $t("Home.Swiper.equipmentDetail.title6") }}</view>
      <uni-table ref="table6first" :border="false" :stripe="false" emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="200rpx" align="center" class="title">软件系统</uni-th>
          <uni-th width="200rpx" align="center" class="title">软件系统</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment6-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.ApplicableSystem }}</view></uni-td
          >
        </uni-tr>
      </uni-table>

      <view class="table-miniTitle">{{ $t("Home.Swiper.equipmentDetail.equipment6-2") }}</view>

      <uni-table ref="table6second" :border="false" :stripe="false" emptyText="暂无更多数据">
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment6-3") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.OperatingTemperature }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment6-4") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.WorkingHumidity }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment6-5") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.StorageTemperature }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment6-6") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.StorageHumidity }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格7 -->
    <view class="uni-container">
      <view class="table-title2 title7">{{ $t("Home.Swiper.equipmentDetail.title7") }}</view>
      <uni-table ref="table7" :border="false" :stripe="false" emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="100rpx" align="center" class="title">参数</uni-th>
          <uni-th width="300rpx" align="center" class="title">参数</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment7-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Type }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment7-2") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Processor }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment7-3") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.NumsCpu }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment7-4") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.HardDriveCapacity }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment7-5") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.MemoryCapacity }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>

    <!-- 表格8 -->
    <view class="uni-container">
      <view class="table-title2 title8">{{ $t("Home.Swiper.equipmentDetail.title8") }}</view>
      <uni-table ref="table8" :border="false" :stripe="false" emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="120rpx" align="center" class="title">显卡</uni-th>
          <uni-th width="300rpx" align="center" class="title">显卡</uni-th>
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-1") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.GpuModel }}</view></uni-td
          >
        </uni-tr>
        <uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-2") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.VideoMemory }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-3") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.CoreFrequency }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-4") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.CoreBrand }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-5") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.PowerInterface }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-6") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.NumsGraphicsCards }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-7") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.CoolingFan }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-8") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.Interface }}</view></uni-td
          > </uni-tr
        ><uni-tr>
          <uni-td align="left" class="text">{{ $t("Home.Swiper.equipmentDetail.equipment8-9") }}</uni-td>
          <uni-td align="right" class="text">
            <view class="right-text">{{ equipmentDetailInfo.RatedPowerSingle }}</view></uni-td
          >
        </uni-tr>
      </uni-table>
    </view>
  </view>
</template>

<script>
export default {
  name: "equipmentDetailInfo",
  props: {
    equipmentDetailInfo: { type: Object },
  },
  data(){
	  return{
		  soldOutImg:'../../static/images/equipment/soldOut.png'
	  }
  }
};
</script>

<style lang="less" scoped>
	@import "@/static/css/MainColor.less";
.header {
  padding-top: 42rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  .img {
	  position: relative;
    width: 702rpx;
    height: 334rpx;
    background: #f8f8f8;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 429rpx;
      height: 334rpx;
    }
	.soldOutImg{
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		width: 79rpx;
		height: 79rpx;
	}
  }
  .price {
    margin-top: 42rpx;
    margin-bottom: 26rpx;
    width: 750rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // name
    text:first-child {
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
      padding-left: 32rpx;
    }

    view {
      display: flex;
      align-items: center;
      padding-right: 32rpx;
      // price
      text:last-child {
        font-size: 50rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        // color: #009bf9;
        color: @main-color;
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

// 表格
.uni-container {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  position: relative;
  // 绝对定位固定表头文字
  .table-title1 {
    position: absolute;
    z-index: 999;
    top: 32rpx;
    left: 341rpx;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
  .table-title2 {
    position: absolute;
    z-index: 999;
    top: 32rpx;
    left: 324rpx;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
  .title3 {
    left: 344rpx;
  }
  .title4 {
    left: 348rpx;
  }
  .title5 {
    left: 314rpx;
  }
  .title6 {
    left: 314rpx;
  }
  .title7 {
    left: 348rpx;
  }
  .title8 {
    left: 348rpx;
  }
  // 适用环境
  .table-miniTitle {
    padding: 20rpx 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(46, 51, 78, 0.9);
  }
  // 原表头文字
  .title {
    font-size: 46rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
  .text {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #888da7;
    .right-text {
      display: inline-block;
      color: #2e334e;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
  }
}

.uni-container:last-child {
  padding-bottom: 60rpx;
}

// 设备数据+投资产品数据的左右边距调整
// 设备数据+投资产品数据里面的分割线颜色按usbi改了uni-model/uni-table/uni-td和uni-th的$border-color
/deep/ .uni-container .text {
  padding: 32rpx 32rpx 28rpx;
}
</style>
