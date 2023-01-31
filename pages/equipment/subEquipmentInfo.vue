<template>
  <view class="content">
    <view class="equipment2div">
      <equipment2div :subEquipmentInfo="equipData[this.index]"></equipment2div>
    </view>

    <view class="equipmentHashRate">
      <equipmentHashRate></equipmentHashRate>
    </view>

    <view class="GPU-info">
      <view class="title">
        <text>GPU信息({{ GPUInfoList.length }})</text>
      </view>
      <view
        class="equipmentGPUdiv"
        v-for="(GPU, index) in GPUInfoList"
        :key="index"
      >
        <equipmentGPUdiv :equipmentGPUInfo="GPU"></equipmentGPUdiv>
      </view>
      <view class="zhanwei"> </view>
    </view>

    <view class="other-info">
      <view class="title">
        <text>其他信息</text>
      </view>
      <view class="equipmentOtherInfo">
        <uni-table
          ref="table1"
          :border="false"
          :stripe="false"
          emptyText="暂无更多数据"
        >
          <!-- <uni-tr>
					<uni-th width="150rpx" align="center" class="title">{{
					  equipmentOtherInfo.title1
					}}</uni-th>
					<uni-th width="250rpx" align="center" class="title">{{
					  equipmentOtherInfo.title1
					}}</uni-th>
				  </uni-tr> -->
          <uni-tr>
            <uni-td align="left" class="text">中央处理器</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">{{
                equipmentOtherInfo.coreCPU
              }}</view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">中央处理器温度</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text"
                >{{ equipmentOtherInfo.coreTemperature }}°C</view
              ></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">中央处理器负载</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">
                <text>
                  {{ equipmentOtherInfo.coreLoadPercentage }}% ({{
                    equipmentOtherInfo.coreLoadMinutes
                  }}分钟)
                </text>
              </view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">硬盘</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">{{
                equipmentOtherInfo.hardDisk
              }}</view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">硬盘使用率</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">
                <text>
                  {{ equipmentOtherInfo.hardDiskSize }}G ({{
                    equipmentOtherInfo.hardDiskPercentage
                  }}%)
                </text>
              </view></uni-td
            >
          </uni-tr>
          <uni-tr>
            <uni-td align="left" class="text">操作系统</uni-td>
            <uni-td align="right" class="text">
              <view class="right-text">{{
                equipmentOtherInfo.system
              }}</view></uni-td
            >
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script>
import equipmentHashRate from "@/components/ETH/equipment/equipmentHashRate.vue";
import equipmentGPUdiv from "@/components/ETH/equipment/equipmentGPUdiv.vue";
import equipment2div from "@/components/ETH/equipment/equipment2div.vue";
export default {
  components: {
    equipmentHashRate,
    equipmentGPUdiv,
    equipment2div,
  },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    //打印出上个页面传递的参数。
    this.subAccountId = option.subAccountId;
    //判断options.item是否为空 不然会因为json.parse解析undefined报错
    if (option.idx) {
      this.index = JSON.parse(decodeURIComponent(option.idx));
    }
  },
  onShow() {
    // 获取接口 子产品下的设备信息
    this.getEquipmentTotalInfo();
  },
  data() {
    return {
      userToken: "",
      equipData: [],
      index: 0,
      // 记录从subAccount页面传来的子账号id
      subAccountId: null,
      // 当前page
      page: 1,
      // 当前每页的size
      pageSize: 2,
      // // 子账户里总共有多少条数据
      // totalLength:null,
      equipmentOtherInfo: {
        coreCPU: "AMD A6-3420M APU",
        coreTemperature: "42",
        coreLoadPercentage: "10",
        coreLoadMinutes: "10",
        hardDisk: "固态硬盘 128G",
        hardDiskSize: "10",
        hardDiskPercentage: "10",
        system: "Hada OS",
      },
      GPUInfoList: [
        {
          GPUName: "Geforce RTX 3090 0",
          temperature: "90",
          memorySize: "5",
          hashRate: "50.6",
          power: "500",
          fanSpeed: "500",
        },
        {
          GPUName: "Geforce RTX 3090 1",
          temperature: "90",
          memorySize: "5",
          hashRate: "50.6",
          power: "500",
          fanSpeed: "500",
        },
        {
          GPUName: "Geforce RTX 3090 2",
          temperature: "90",
          memorySize: "5",
          hashRate: "50.6",
          power: "500",
          fanSpeed: "500",
        },
        {
          GPUName: "Geforce RTX 3090 3",
          temperature: "90",
          memorySize: "5",
          hashRate: "50.6",
          power: "500",
          fanSpeed: "500",
        },
      ],
    };
  },
  methods: {
    // 获取接口 子产品下的设备详细信息
    getEquipmentTotalInfo() {
      uni.request({
        // url: 'http://192.168.3.139:8888/app/machine/status/list',
        // url: "http://192.168.3.112:8888/app/machine/status/list",
        url: this.host + "/app/machine/status/list",
        method: "GET",
        data: {
          SubaccountId: this.subAccountId,
          // page传不传都行,因为这里不分页
          // page:this.page,
          // 传pageSize为0的时候可以获取到这个子账号下的所有设备信息
          pageSize: 0,
        },
        header: {
          //token
          "x-token": this.userToken,
        },
        success: (res) => {
          // code!=0就是接口请求结果失败
          if (res.data.code != 0) {
            return;
          }
          // 把onload里读取到的子账户下的pageSize条设备信息都存入equipData
          this.equipData = res.data.data.list;
        },
      });
    },
  },
};
</script>

<style>
page {
  /* position: absolute;
	z-index: -999; */
  background-color: #f3f5f7;
}
</style>

<style lang="less" scoped>
.equipment2div,
.equipmentHashRate,
.GPU-info,
.other-info {
  margin-bottom: 24rpx;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .GPU-info {
    width: 702rpx;
    background-color: #ffffff;
    border-radius: 12rpx;

    .title {
      margin-left: 32rpx;
      margin-top: 32rpx;
      text {
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
      }
    }
    .equipmentGPUdiv {
      display: flex;
      justify-content: center;
    }
    .zhanwei {
      height: 6rpx;
    }
  }

  .other-info {
    width: 702rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    .title {
      margin-left: 32rpx;
      margin-top: 32rpx;
      margin-bottom: 28rpx;
      text {
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e334e;
      }
    }
    .equipmentOtherInfo {
      text {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
      .text {
        color: #888da7;
      }
      .right-text {
        color: #2e334e;
      }
      /deep/ .uni-table-td {
        padding: 32rpx;
      }
    }
  }
}
</style>
