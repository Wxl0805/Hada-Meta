<template>
  <view class="content">
    <!-- 遮罩层 -->
    <!-- 可以设置这个禁止滚动@touchmove.stop.prevent="stopRoll" -->
    <view class="shadow" @click="ShowPickerView = !ShowPickerView" v-if="ShowPickerView" :style="{ height: screenHeight + 'px' }"></view>

    <view class="box-bg">
      <view class="title">
        <view class="leftIcon" @click="back">
          <uni-icons type="back" size="20"></uni-icons>
        </view>
        <view class="body-title">
          <text class="uni-nav-bar-text">绑定设备</text>
        </view>
      </view>
    </view>

    <view class="form-block">
      <form @submit="formSubmit">
        <view class="uni-form-item uni-column">
          <uni-list-item title="设备编码" class="nav-top-line"></uni-list-item>
          <input class="uni-input" :value="inputEquipmentCode" name="equipmentID" placeholder="输入设备编码" :adjust-position="false" />
        </view>

        <view class="uni-form-item uni-column">
          <uni-list-item title="设备名称"></uni-list-item>
          <input class="uni-input" :value="inputEquipmentName" name="equipmentName" placeholder="输入设备名称" :adjust-position="false" />
        </view>

        <view class="uni-list-cell">
          <uni-list-item title="所属子账户">
            <template v-slot:footer>
              <text class="selected-picker-view" @click="ShowPickerView = !ShowPickerView"
                >{{ productNameList[value[0]] }}&nbsp;&nbsp;
                <uni-icons type="forward" size="14" color="#9ea3bb"></uni-icons>
              </text>
            </template>
          </uni-list-item>
          <view class="uni-list-cell-db" v-if="ShowPickerView">
            <picker-view
              :value="value"
              @change="bindPickerChange"
              class="picker-view"
              mask-class="picker-view-mask-class"
              indicator-class="picker-view-indicator-class"
              name="subProductList"
            >
              <picker-view-column>
                <view class="item" v-for="(product, index) in productNameList" :key="index" @click="confirm">{{ product }}</view>
              </picker-view-column>
            </picker-view>
          </view>
        </view>

        <view class="uni-btn-v">
          <button type="primary" form-type="submit" @click="toggle" class="uni-btn-add">
            确认添加
          </button>
        </view>
      </form>
    </view>

    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#666666" type="center" v-show="errorPop">
      <view class="popup-content">
        <!-- 用v-if控制显示哪个信息 -->
        <text class="text" v-if="errorNum == 7"> <uni-icons type="info-filled" class="icons" color="#f59a23"></uni-icons>绑定失败</text>
        <!-- <uni-icons type="info-filled" class="icons" color="#f59a23"></uni-icons>您输入的设备编号无效，请重新输入</text> -->
        <text class="text" v-if="errorBind"> <uni-icons type="info-filled" class="icons" color="#f59a23"></uni-icons>当前设备编号已被其他账户绑定</text>
        <text class="text" v-if="errorNum == 0"> <uni-icons type="info-filled" class="icons" color="#f59a23"></uni-icons>绑定成功</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif

export default {
  // components: { mPicker },
  data() {
    return {
      // 记录屏幕高度
      screenHeight: null,
      // 是否显示picker-view
      ShowPickerView: false,
      //picker-view选择第几项
      value: [0],
      // 存picker内容
      subProductSelected: 0,
      title: "picker",
      index: 0,
      errorPop: false,
      errorNum: 0,
      errorBind: false,
      // eID:'',
      userToken: "",
      productList: [],
      productNameList: [],
      productCodeList: [],
      selectedProduct: "",
      inputEquipmentCode: "",
      inputEquipmentName: "",
      source: 1,
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  onBackPress(options) {
    if (options.from === "navigateBack") {
      return false;
    }
    this.back();
    //监听back键，关闭弹出菜单
    // if (nvMask.isVisible()) {
    // 	nvMask.hide()
    // 	// return true
    // }
    return true;
  },
  onLoad(options) {
    // nvMask.show()

    if (options.resultCode) {
      this.inputEquipmentCode = options.resultCode;
      this.source = 2;
    } else {
      this.source = 1;
    }

    try {
      const value = uni.getStorageSync("token");
      if (value) {
        // 获取token
        this.userToken = value;
      }
    } catch (e) {
      // error
    }
    // 获取所有产品清单
    this.getAllProduct();

    // 获取屏幕高度
    // 获取可使用窗口的高度使用windowHeight关键字
    this.screenHeight = uni.getSystemInfoSync().screenHeight;
  },
  methods: {
    // 禁止滚动的函数,为空也起效
    stopRoll() {},
    confirm() {
      // 改变默认选中的value为用户选中的值
      this.value = this.subProductSelected;
      // 让选择框和遮罩隐藏
      this.ShowPickerView = !this.ShowPickerView;
    },
    // 获取所有产品清单
    getAllProduct() {
      uni.request({
        url: this.host + "/app/user/account/ETH/sub/list",
        method: "GET",
        header: {
          //token
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          // code为0为成功
          if (res.data.code == 0) {
            this.productList = res.data.data;
            this.productList.forEach((p) => {
              this.productCodeList.push(p.ID);
              this.productNameList.push(p.subaccountName);
            });
          }
          if (res.data.code == 2) {
            console.log("需要更新版本");
            this.appUpdate++;
            // 控制只出现一次弹窗
            if (this.appUpdate >= 0 && this.appUpdate < 2) {
              // #ifdef APP-PLUS
              APPUpdate(true);
              // #endif
            }
            return;
          }
        },
        // complete: (res) => {
        // },
      });
    },
    toggle() {
      // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
      this.$refs.popup.open();
    },
    formSubmit(e) {
      this.inputEquipmentCode = e.detail.value.equipmentID;
      this.inputEquipmentName = e.detail.value.equipmentName;

      this.selectedProduct = this.productCodeList[this.subProductSelected];

      // 输入的设备编码为空
      if (this.inputEquipmentCode == "") {
        uni.showToast({
          icon: "none",
          title: "请输入设备编码",
        });
        return;
      }
      // 输入的设备名称为空
      if (this.inputEquipmentName == "") {
        uni.showToast({
          icon: "none",
          title: "请输入设备名称",
        });
        return;
      }
      uni.request({
        url: this.host + "/app/user/product/bind/machine/" + this.selectedProduct + "/" + this.inputEquipmentCode + "/" + this.inputEquipmentName,
        method: "POST",
        header: {
          "x-token": this.userToken,
          //version
          version: this.version,
        },
        success: (res) => {
          if (res.data.code == 0) {
            uni.showToast({
              icon: "none",
              title: "绑定成功",
            });
            uni.switchTab({
              url: "/pages/mine/editAccount",
            });
          } else {
            if (res.data.code == 2) {
              console.log("需要更新版本");
              this.appUpdate++;
              // 控制只出现一次弹窗
              if (this.appUpdate >= 0 && this.appUpdate < 2) {
                // #ifdef APP-PLUS
                APPUpdate(true);
                // #endif
              }
              return;
            }
            uni.showToast({
              icon: "none",
              title: "绑定失败",
            });
          }
        },
        complete: (res) => {
          // console.log('complete',`this.host+"//app/user/product/bind/machine/${this.selectedProduct}/${this.inputEquipmentCode}`);
        },
      });
    },
    bindPickerChange: function (e) {
      // this.index = e.detail.value;
      this.subProductSelected = e.detail.value;
    },
    back() {
      uni.navigateBack({
        delta: this.source,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/static/css/MainColor.less";
.box-bg {
  z-index: 20;
  position: relative;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90rpx;
    padding-top: var(--status-bar-height);
    z-index: 50;
    background-color: transparent;
    // color: rgba(255,255,255,0.8);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .leftIcon {
      position: absolute;
      left: 40rpx;
    }
    .body-title {
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
  }
}
// 遮罩层css
.shadow {
  z-index: 90;
  position: absolute;
  top: calc(var(--status-bar-height) * -1rpx);
  // top: var(--status-bar-height);
  width: 750rpx;
  background-color: transparent;
  background-color: rgba(0, 0, 0, 0.6);
}

//表格整体
.form-block {
  // position: relative;
  padding-top: calc(var(--status-bar-height) + 90rpx);
}

// 所属子账户整体
.uni-list-cell {
  // 右边文字
  .selected-picker-view {
    display: flex;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9ea3bb;
  }

  // picker选框
  .uni-list-cell-db {
    width: 750rpx;
    position: absolute;
    bottom: 80rpx;
    display: flex;
    justify-content: center;
    // position: relative;
    z-index: 100;
    // background-color: green;

    .picker-view {
      width: 702rpx;
      height: 334rpx;
      // margin-top: 20rpx;
      color: #2e334e;
      // background-color: #ffffff;

      /deep/ .uni-picker-view-group {
        background-color: #ffffff;
        border-radius: 24rpx;
      }
    }
    /deep/ .picker-view-mask-class {
      border-radius: 24rpx;
      // background-color: #ffffff;
    }
    /deep/ .picker-view-indicator-class {
      height: 108rpx;
      // background-color: #f5f9fa;
      // border-radius: 24rpx;
    }
    .item {
      background-color: transparent;
      height: 108rpx;
      line-height: 108rpx;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2e334e;
    }
  }
}

.uni-input {
  padding: 30rpx;
}
.uni-btn-v {
  position: absolute;
  bottom: 80rpx;
  width: 750rpx;
  height: 90rpx;
  display: flex;
  justify-content: center;
  .uni-btn-add {
    width: 640rpx;
    border-radius: 100rpx;
    // background-color: #009bf9;
    background-color: @main-color;
    text {
      font-size: 32rpx;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
    }
  }
}

.nav-top-line {
  // 灰色分割线
  /deep/ .border--left,
  .uni-list--border ::after {
    width: 100%;
    left: 0rpx;
  }
}
// 灰色分割线
/deep/ .border--left,
.uni-list--border ::after {
  width: 90%;
  left: 42rpx;
}

// 设备编码整体
/deep/ .uni-list-item__container {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  padding-left: 42rpx;
  // 设备编码
  /deep/ .uni-list-item__content-title {
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2e334e;
  }
}

// 输入框整体
/deep/ .uni-input {
  padding-top: 24rpx;
  padding-bottom: 24rpx;
  padding-left: 42rpx;
  // placeholder提示
  /deep/ .uni-input-placeholder,
  .input-placeholder {
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9ea3bb;
  }
}

// 提示信息弹窗
.popup-content {
  padding: 20rpx;
  .text {
    color: #ffffff;
    .icons {
      margin-right: 10rpx;
      size: inherit;
      display: inline-block;
      transform: rotate(180deg);
      background-color: #ffffff;
      border-radius: 50%;
    }
  }
}
// 这一行没用,实际上是改了插件里的css,这个只是为了告诉你改了原插件的哪里
.uni-popup .uni-popup__wrapper center {
  border-radius: 40rpx;
}
</style>
