<template>
  <view>
    <!-- 这里放设备模块 -->
    <view class="moduleEquipment">
      <moduleEquipment :equipmentInfo="equipmentInfo"></moduleEquipment>
    </view>
  </view>
</template>

<script>
import moduleEquipment from "@/components/ETH/equipment/equipmentInfo.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  name: "equipmentView",
  components: {
    moduleEquipment,
  },
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      userToken: "",
      // 用来接从接口查到的信息
      equipmentInfo: [
        {
          // 商品名
          Series: "Hada 1",
          // 图片链接
          Img: "../../static/images/equipment/u98.png",
          // 额定算力
          ComputingPower: "400",
          // 功率
          RatedPower: "1600",
          // 价格
          Price: "38888",
        },
        {
          // 商品名
          Series: "Hada 1 Pro",
          // 图片链接
          Img: "../../static/images/equipment/u97.png",
          // 额定算力
          ComputingPower: "700",
          // 功率
          RatedPower: "2400",
          // 价格
          Price: "68888",
        },
      ],
    };
  },
  onLoad() {
    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取接口 用户可购买的设备简略信息
    this.getBuyEquipmentSimpInfo();
  },
  methods: {
    // 获取接口 用户可购买的设备简略信息
    getBuyEquipmentSimpInfo() {
      uni.request({
        url: this.host + "/app/equipment/all/simple",
        // url: "http://192.168.3.113:8888/app/equipment/all/simple",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code != 0) {
            if (res.data.code == 2) {
              console.log("需要更新版本");
              this.appUpdate++;
              // 控制只出现一次弹窗
              if (this.appUpdate >= 0 && this.appUpdate < 2) {
                // #ifdef APP-PLUS
                APPUpdate(true);
                // #endif
              }
            }
            return;
          }
          if (res.data.code == 0) {
            this.equipmentInfo = res.data.data;
          }
        },
      });
    },
  },
};
</script>

<style>
page {
  background-color: #f3f5f7;
}
</style>

<style lang="less" scoped>
// 顶部导航栏分割线
.nav-line {
  width: 100%;
  height: 4rpx;
  background-color: #f2f2f2;
}

.moduleEquipment {
  display: flex;
  justify-content: center;
  margin-top: 24rpx;
}
</style>
