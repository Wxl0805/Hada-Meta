<template>
  <view class="content">
    <view class="status_bar"> </view>

    <!-- 顶部导航栏 -->
    <view class="header-fixed">
      <uni-nav-bar height="118rpx" backgroundColor="#ffffff">
        <view class="header-title">
          <span>编辑子账户</span>
        </view>
        <view slot="left">
          <view class="left" @click="back" v-if="change">
            <span>取消</span>
          </view>

          <view class="left" @click="backtop" v-if="!change">
            <span>返回</span>
          </view>
        </view>
        <view slot="right">
          <view class="right" @click="save" v-if="change">
            <span>保存</span>
          </view>
        </view>
      </uni-nav-bar>
    </view>

    <!-- 取消弹窗 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        cancelText="取消"
        confirmText="确定"
        title="退出确认"
        content="资料尚未保存,是否确认退出？"
        @confirm="dialogConfirm"
        @close="dialogClose"
      ></uni-popup-dialog>
    </uni-popup>

    <!-- 删除设备弹窗 -->
    <uni-popup ref="deletedialog" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        cancelText="我再想想"
        confirmText="确认解绑"
        title="解绑设备"
        content="您确认解绑该设备吗，解绑后将无法继续获得收益"
        @confirm="deleteconfirm(productcode)"
        @close="deleteclose"
      ></uni-popup-dialog>
    </uni-popup>

    <!-- 删除子账户弹窗-->
    <uni-popup ref="deleteaccount" type="dialog">
      <uni-popup-dialog
        :type="msgType"
        cancelText="我再想想"
        confirmText="确认删除"
        title="删除子账户"
        content="您确认删除该子账户吗，删除后不可恢复"
        @confirm="deleteAconfirm(1)"
        @close="deleteAclose"
      ></uni-popup-dialog>
    </uni-popup>

    <!-- 解绑成功提示信息 -->
    <!-- <mpopup  ref="deletep" :isdistance="true"></mpopup> -->

    <!-- 删除子账户提示信息 -->
    <!-- <mpopup  ref="deletea" :isdistance="true"></mpopup> -->

    <view class="baseinfo">
      <span>基本信息</span>
    </view>

    <view class="but" @click="deleteaccount">
      <button>删除子账户</button>
    </view>

    <view class="editcontent-1" @click="openinput">
      <view class="content-left"> <span>名称</span><span style="color: rgba(0, 155, 249, 1);">*</span> </view>
      <view class="content-right">
        <span>{{ subaccountName }}</span>
      </view>
    </view>
    <view class="editcontent-2">
      <view class="content-left"> <span>投资产品</span><span style="color: rgba(0, 155, 249, 1);">*</span> </view>
      <view class="content-right">
        <span class="product">{{ productname }}</span>
      </view>
    </view>

    <view class="products">
      <span>所含设备</span>
      <view @click="addProduct" class="add">
        <span>添加设备</span>
        <view class="section5"></view>
      </view>
    </view>

    <view class="All-products">
      <view class="product-block" v-for="(value, key) in machines" :key="value.machineCode">
        <view class="pro-left">
          <view class="pro-title">
            <span>{{ value.MachineName }}</span>
            <view class="delete" @click="deletepro(value.MachineCode)"></view>
          </view>
          <view class="pro-cont1">
            <span>设备编号:</span><span>{{ value.MachineCode }}</span>
          </view>
          <view class="pro-cont2">
            <span>设备型号:</span><span>{{ value.Model }}</span>
          </view>
        </view>
      </view>
    </view>

    <!-- 输入框示例 -->
    <uni-popup ref="inputDialog" type="dialog">
      <uni-popup-dialog mode="input" title="修改名称" placeholder="请输入要修改的名称" @confirm="dialogInputConfirm"></uni-popup-dialog>
    </uni-popup>

    <aui-dialog
      ref="dialog"
      :title="auiDialog.title"
      :msg="auiDialog.msg"
      :btns="auiDialog.btns"
      :mask="auiDialog.mask"
      :maskTapClose="auiDialog.maskTapClose"
      :items="auiDialog.items"
      :theme="auiDialog.theme"
    ></aui-dialog>
  </view>
</template>

<script>
// import mpopup from '../../components/xuan-popup/xuan-popup.vue'
import { aui } from "@/components/aui-dialog/common/aui/js/aui.js";
import auiDialog from "@/components/aui-dialog/aui-dialog.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  // components:{
  //     mpopup
  // },
  components: {
    auiDialog,
  },
  data() {
    return {
      subaccountId: 0,
      type: "center",
      msgType: "message",
      list: "",
      machines: [],
      token: "",
      productcode: "",
      productname: "",
      subaccountName: "",
      value: "",
      change: false,
      auiDialog: {
        title: "",
        msg: "",
        btns: [{ name: "确定" }],
        mask: true,
        maskTapClose: true,
        items: [],
        theme: 1,
      },
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },

  onLoad(options) {
    this.subaccountId = options.subaccountId;
    this.subaccountName = options.subaccountName;
    this.productname = options.productName;
  },
  onBackPress() {
    if (this.change == false) {
      return false;
    } else {
      this.$refs.alertDialog.open();
      return true;
    }
  },
  onShow() {
    this.token = uni.getStorageSync("token");
  },
  onReady() {
    uni.request({
      header: {
        "Content-Type": "application/json",
        "x-token": this.token,
        //version
        version: this.version,
      },
      url: this.host + "/app/user/product/machine/list/" + this.subaccountId,
      method: "GET",
      data: {},
      dataType: "json",
      success: (res) => {
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
        this.machines = res.data.data;
      },
    });
  },
  methods: {
    back() {
      this.$refs.alertDialog.open();
    },
    save() {
      if (this.subaccountName == "") {
        uni.showToast({
          title: "名称不能为空",
          icon: "none",
        });
        return;
      }
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/user/account/modify/" + this.subaccountName + "/" + this.subaccountId,
        method: "POST",
        data: {},
        dataType: "json",
        success: (res) => {
          // this.$refs.popup.open();
          // setTimeout(()=>{
          // 	this.$refs.popup.close();
          // 	this.change = false;
          // },1000);
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
            title: "保存成功",
            icon: "none",
          });
          this.change = false;
        },
      });
    },
    dialogConfirm() {
      uni.navigateTo({
        url: "/pages/mine/subAccount",
        animationType: "slide-in-left",
      });
    },
    dialogClose() {
      this.$refs.alertDialog.close();
    },
    addProduct() {
      uni.navigateTo({
        url: "/pages/mine/AddProduct",
        success(res) {},
        fail(res) {},
      });
      // this.$router.push('/pages/mine/AddProduct');
    },
    deletepro(machinecode) {
      this.$refs.deletedialog.open();
      this.productcode = machinecode;
    },
    deleteclose() {
      this.$refs.deletedialog.close();
    },
    deleteconfirm(machinecode) {
      // this.$refs.deletep.open({
      //     type:'success',
      //     content:'解绑成功',
      //     timeout:2000,
      // });
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/user/product/unbind/machine?subid=" + this.subaccountId + "&machinecode=" + machinecode,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
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
            title: "解绑成功",
            icon: "success",
          });
        },
        complete: () => {
          uni.request({
            header: {
              "Content-Type": "application/json",
              "x-token": this.token,
              //version
              version: this.version,
            },
            url: this.host + "/app/user/product/machine/list/" + this.subaccountId,
            method: "GET",
            data: {},
            dataType: "json",
            success: (res) => {
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
              this.machines = res.data.data;
            },
          });
        },
      });
    },
    deleteaccount() {
      this.$refs.deleteaccount.open();
    },
    deleteAconfirm(theme) {
      // uni.showModal({title:'删除失败',
      // content:'当前子账户绑定有设备，请先解除绑定',
      // showCancel:false,
      // confirmColor: '#009bf9',
      // confirmText:'我知道了'});
      let _this = this;
      if (_this.machines == null) {
        uni.request({
          header: {
            "Content-Type": "application/json",
            "x-token": _this.token,
            //version
            version: _this.version,
          },
          url: _this.host + "/app/user/account/delete/" + _this.subaccountId,
          method: "POST",
          data: {},
          dataType: "json",
          success: (res) => {
            if (res.data.code == 2) {
              console.log("需要更新版本");
              _this.appUpdate++;
              // 控制只出现一次弹窗
              if (_this.appUpdate >= 0 && _this.appUpdate < 2) {
                // #ifdef APP-PLUS
                APPUpdate(true);
                // #endif
              }
              return;
            }
            uni.showToast({
              title: "删除成功",
              icon: "success",
            });
            uni.navigateBack({
              delta: 1,
            });
          },
        });
      } else {
        _this.auiDialog.title = "删除失败";
        _this.auiDialog.msg = "当前子账户绑定有设备，请先解除绑定";
        _this.auiDialog.btns = [{ name: "我知道了", color: "#197DE0" }];
        _this.auiDialog.items = [];
        _this.auiDialog.theme = theme;
        _this.$refs.dialog.show();
      }
    },
    deleteAclose() {
      this.$refs.deleteaccount.close();
    },
    openinput() {
      this.$refs.inputDialog.open();
    },
    dialogInputConfirm(val) {
      this.subaccountName = val;
      this.change = true;
    },
    backtop() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style>
@import "@/static/css/MainColor.less";
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
}
page {
  background-color: rgba(243, 245, 247, 1);
  width: 750rpx;
}
.header-fixed {
  width: 100%;
  position: fixed;
  top: var(--status-bar-height);
  z-index: 100;
}
.header-title {
  width: 100%;
  display: flex;
  align-self: center;
  justify-content: center;
}
.header-title > span {
  width: 204rpx;
  height: 48rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: center;
  white-space: nowrap;
  line-height: 48rpx;
}
.left,
.right {
  width: 68rpx;
  height: 48rpx;
  color: rgba(0, 155, 249, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: center;
  white-space: nowrap;
}
.content {
  width: 100%;
  position: relative;
}
.popup-content {
  align-items: center;
  justify-content: center;
  padding: 30upx;
  height: 40upx;
  background-color: #fff;
}
.text {
  font-size: 24upx;
  color: #333;
}
.baseinfo {
  width: 100%;
  height: 100upx;
  top: calc(118rpx + var(--status-bar-height));
  position: absolute;
  background: #ffffff;
}
.baseinfo > span {
  position: absolute;
  top: 24upx;
  left: 40upx;
  color: rgba(46, 51, 78, 1);
  font-size: 38rpx;
  font-family: PingFangSC-Medium;
}
.editcontent-1 {
  width: 100%;
  height: 100upx;
  background: #ffffff;
  position: absolute;
  top: calc(220rpx + var(--status-bar-height));
}
.editcontent-2 {
  width: 100%;
  height: 100upx;
  background: #ffffff;
  position: absolute;
  top: calc(320rpx + var(--status-bar-height));
}
.content-left {
  width: 200upx;
  height: 40upx;
  position: absolute;
  left: 40upx;
  top: 30upx;
  font-family: "PingFangSC-Medium";
}
.content-right {
  width: 350upx;
  height: 50upx;
  position: absolute;
  right: 60upx;
  top: 25upx;
  text-align: right;
  line-height: 50upx;
  color: #9ea3bb;
  font-family: "PingFangSC-Medium";
}
.right-icon {
  width: 50upx;
  height: 50upx;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
}
.right-icon > img {
  width: 50upx;
  height: 50upx;
}
.products {
  width: 100%;
  height: 100upx;
  position: absolute;
  top: calc(470rpx + var(--status-bar-height));
  background-color: #ffffff;
}
.products > span {
  position: absolute;
  top: 24upx;
  left: 40upx;
  color: rgba(46, 51, 78, 1);
  font-size: 38rpx;
  font-family: PingFangSC-Medium;
}
.products > .add {
  width: 200upx;
  height: 80upx;
  color: rgba(0, 155, 249, 1);
  font-size: 30rpx;
  font-family: PingFangSC-Medium;
  position: absolute;
  right: 15rpx;
  top: 10upx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.All-products {
  width: 100%;
  /* height: calc(100vh - 570rpx - var(--status-bar-height)); */
  height: 666rpx;
  position: absolute;
  top: calc(570rpx + var(--status-bar-height));
  overflow: scroll;
}
.product-block {
  width: 100%;
  height: 200upx;
  background: #ffffff;
  border-top: 1upx solid transparent;
  position: relative;
  border-top: 1upx solid rgba(243, 245, 247, 1);
  border-bottom: 1upx solid rgba(243, 245, 247, 1);
  padding-top: 30upx;
}
.pro-left {
  width: 670upx;
  height: 200upx;
  padding-left: 40upx;
}
.pro-title {
  position: relative;
  height: 50upx;
}
.delete {
  width: 40upx;
  height: 40upx;
  position: absolute;
  right: 0;
  top: 0;
  background: url("@/static/images/delete.png");
  background-size: 100% 100%;
}
.pro-title > span {
  color: balck;
  font-family: "PingFangSC-Medium";
}
.pro-cont1 {
  margin-bottom: 10upx;
  margin-top: 6rpx;
}
.pro-cont1 > span {
  font-family: "PingFangSC-Medium";
  color: #9ea3bb;
  font-size: 30upx;
}
.pro-cont2 > span {
  font-family: "PingFangSC-Medium";
  color: #9ea3bb;
  font-size: 30upx;
}

.but {
  position: absolute;
  width: 80vw;
  height: 112upx;
  top: calc(1300rpx + var(--status-bar-height));
  left: 10%;
  margin-bottom: 100rpx;
}
.but > button {
  height: 112upx;
  background: #00aaff;
  border-radius: 60rpx;
  color: #ffffff;
  font-size: 36rpx;
  font-family: AlibabaPuHuiTiM;
  line-height: 112rpx;
}
.section5 {
  width: 34rpx;
  height: 34rpx;
  background: url("@/static/images/jiahao.png") 100% no-repeat;
  background-size: 100% 100%;
  margin-left: 10rpx;
}
/deep/ uni-modal .uni-modal__hd {
  padding: 1em 1.6em 0.3em !important;
}
/deep/ uni-modal .uni-modal {
  text-align: center !important;
}
</style>
