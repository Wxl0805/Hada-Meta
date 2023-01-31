<template>
  <view class="page flex-col">
    <view class="layer1 flex-col"></view>
    <view class="layer2 flex-col">
      <view class="section1 flex-col">
        <view class="section2 flex-row justify-between">
          <text class="txt1" :class="{ select: selectcolor, unselect: unselectcolor }" @click="selecttel">{{ $t("signin.phone") }}</text>
          <text class="word1" :class="{ unselect: selectcolor, select: unselectcolor }" @click="selectemail">{{ $t("signin.email") }}</text>
        </view>

        <!-- 底下的蓝色线 -->
        <view class="block2 flex-col" v-if="selectline"></view>
        <view class="wrap2 flex-col" v-if="unselectline"></view>

        <!-- 输入手机号 -->
        <view class="block3 flex-col flex-row" v-if="select">
          <view class="left">
            <view class="area-code" @click="gotoPickcode">
              <span>+</span><span>{{ zone }}</span>
              <view class="area-icon"></view>
            </view>
          </view>
          <view class="tel-input">
            <uni-easyinput
              @focus="showreg = false"
              @blur="showreg = true"
              :inputBorder="false"
              v-model="Value"
              :placeholder="$t('VerificationLogin.tel-placeholder')"
            ></uni-easyinput>
          </view>
        </view>

        <!-- 输入邮箱 -->
        <view class="block3 flex-col flex-row" v-if="unselect">
          <view class="email">
            <uni-easyinput
              @focus="showreg = false"
              @blur="showreg = true"
              :inputBorder="false"
              v-model="Value"
              :placeholder="$t('VerificationLogin.email-placeholder')"
            ></uni-easyinput>
          </view>
        </view>

        <button class="block4 flex-col" @click="submit">
          <text class="txt2">{{ $t("common.next") }}</text>
        </button>
      </view>
      <view class="section3"> </view>

      <view class="main6 flex-col" @click="back"></view>
      <text class="txt3">{{ $t("signin.title") }}</text>
    </view>

    <view class="regular" v-if="showreg">
      <checkbox-group @change="agreeReg" style="display: flex; flex-direction: row;font-size: 25rpx;">
        <view style="display: inline-block;">
          <checkbox v-model="agree" :checked="agreeregular"></checkbox>
        </view>
        <view style="display: inline-block; word-break: break-all; word-wrap: break-word; width: 598rpx;">
          <span style="color: #888da7;"
            >{{ $t("VerificationLogin.agree") }} <span class="bluetext" @click="protocal">《{{ $t("VerificationLogin.agree-agreement") }}》</span>、
            <span class="bluetext" @click="policy">《{{ $t("VerificationLogin.agree-policy") }}》</span>、
            <span class="bluetext" @click="statement">《{{ $t("VerificationLogin.agree-disclaimer") }}》</span>
          </span>
        </view>
      </checkbox-group>
    </view>

    <uni-popup ref="agreepop" type="dialog">
      <uni-popup-dialog type="warn" :cancelText="close" :confirmText="confirm" :title="info" :content="cont" @confirm="confirm_next"></uni-popup-dialog>
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
      @callback="dialogCallback"
    ></aui-dialog>

    <!-- 提示信息 -->
    <aui-dialog
      ref="infodialog"
      :title="info"
      :msg="infotext"
      :btns="[{ name: this.$t('common.info-know'), color: '#197DE0' }]"
      :mask="true"
      :maskTapClose="false"
      :items="[]"
      :theme="1"
    ></aui-dialog>
  </view>
</template>
<script>
import { aui } from "@/components/aui-dialog/common/aui/js/aui.js";
import auiDialog from "@/components/aui-dialog/aui-dialog.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  components: {
    auiDialog,
  },
  data() {
    return {
      Value: "",
      zone: "86",
      select: false,
      unselect: true,
      selectcolor: false,
      unselectcolor: true,
      selectline: false,
      unselectline: true,
      pop: true,
      agree: "agree",
      agreeregular: false,
      showreg: true,
      // 记录触发了几次需要更新APP
      appUpdate: 0,
	  // 用于判断是哪个系统
	  system: 0,
      auiDialog: {
        title: "",
        msg: "",
        btns: [{ name: "我已知晓" }],
        mask: true,
        maskTapClose: false,
        items: [],
        theme: 1,
      },
      doc:
        this.$t("signin.doc1") +
        "<br>" +
        this.$t("signin.doc2") +
        "<br>" +
        this.$t("signin.doc3") +
        "<br>" +
        this.$t("signin.doc4") +
        "<br>" +
        this.$t("signin.doc5") +
        "<br>" +
        this.$t("signin.doc6") +
        "<br>" +
        this.$t("signin.doc7") +
		"<br>" + 
		this.$t("signin.doc8") +
		"<br>" + 
		this.$t("signin.doc9"),
      cont:
        this.$t("VerificationLogin.agreeinfo") +
        "《" +
        this.$t("VerificationLogin.agree-agreement") +
        "》、" +
        "《" +
        this.$t("VerificationLogin.agree-policy") +
        "》、" +
        "《" +
        this.$t("VerificationLogin.agree-disclaimer") +
        "》",
      info: this.$t("api.message"),
      close: this.$t("common.close"),
      confirm: this.$t("common.confirm"),
      infotext: this.$t("common.infotext"),
    };
  },
  onReady() {
    this.popup();
  },
  onShow() {
  	// 判断是安卓还是ios
  	const platform = uni.getSystemInfoSync().platform;
  	if (platform == "android") {
  	  this.system = 0;
  	} else {
  	  this.system = 1;
  	}
  },
  onBackPress() {
    if (this.pop == true) {
      return true;
    } else {
      return false;
    }
  },
  methods: {
    confirm_next() {
      this.agreeregular = true;
    },
    gotoPickcode() {
      uni.navigateTo({
        url: "./country-code",
      });
    },
    upDataCountryCode: function (msg) {
      if (msg) {
        this.zone = msg;
      }
      this.$forceUpdate();
    },
    back() {
      // uni.navigateTo({
      // 	url:'/pages/index/VerificationLogin',
      // 	animationType:"slide-in-left",
      // })
      uni.navigateBack({
        delta: 1,
      });
    },
    Email() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.wait"),
      });
      uni.request({
        header: {
          "Content-Type": "application/json",
          //version
          version: this.version,
        },
        url: this.host + "/base/send_email_code/?email=" + this.Value + "&operatingSystem=" + this.system,
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
          if (res.data.msg == "邮箱已被注册") {
            uni.showToast({
              icon: "none",
              title: this.$t("signin.email-ready"),
            });
            return;
          } else {
            uni.navigateTo({
              url: `/pages/index/Validate?value=${this.Value}&telfront=${this.zone}&msg=` + res.data.msg,
              success(res) {},
              fail(res) {},
            });
          }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    Tel() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.wait"),
      });
      uni.request({
        header: {
          "Content-Type": "application/json",
          //version
          version: this.version,
        },
        url: this.host + "/base/sendsms?phone=" + this.Value + "&operatingSystem=" + this.system,
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
          if (res.data.msg == "手机号已被注册") {
            uni.showToast({
              icon: "none",
              title: this.$t("signin.tel-ready"),
            });
            return;
          } else {
            uni.navigateTo({
              url: `/pages/index/Validate?value=${this.Value}&telfront=${this.zone}&msg=` + res.data.msg,
              success(res) {},
              fail(res) {},
            });
          }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    selecttel() {
      this.Value = "";
      this.select = true;
      this.unselect = false;
      this.selectcolor = true;
      this.unselectcolor = false;
      this.selectline = true;
      this.unselectline = false;
    },
    selectemail() {
      this.Value = "";
      this.select = false;
      this.unselect = true;
      this.selectcolor = false;
      this.unselectcolor = true;
      this.selectline = false;
      this.unselectline = true;
    },
    submit() {
      if (this.agreeregular == false) {
        this.$refs.agreepop.open();
        return;
      }
      // 邮箱为空
      // 邮箱格式错误
      // 手机号为空
      // 手机号格式错误
      // 成功
      let emailreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      let telreg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      if (this.Value == "" && this.unselect == true) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.emailnull"),
        });
      } else if (!emailreg.test(this.Value) && this.unselect == true) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.email-format-error"),
        });
      } else if (this.Value == "" && this.unselect == false) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.telnull"),
        });
      } else if (!telreg.test(this.Value) && this.unselect == false) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.tel-format-error"),
        });
      } else {
        if (this.unselect == true) {
          this.Email();
          return;
        } else {
          this.Tel();
          return;
        }
      }

      // this.$router.push({path:'/pages/index/Validate', params:{value:this.Value}});
    },
    popup() {
      this.auiDialog.title = this.$t("signin.doc-title");
      this.auiDialog.msg = this.doc;
      this.auiDialog.btns = [{ name: this.$t("signin.doc-footer"), color: "#009BF9" }];
      this.auiDialog.items = [];
      this.$refs.dialog.show();
      this.pop = true;
    },
    dialogCallback() {
      this.pop = false;
    },
    agreeReg(e) {
      if (e.detail.value[0] == "agree") {
        this.agreeregular = true;
      } else {
        this.agreeregular = false;
      }
    },
    protocal() {
      uni.navigateTo({
        url: "/pages/index/HadaMetaProtocal",
      });
    },
    policy() {
      uni.navigateTo({
        url: "/pages/index/HadaMetaPolicy",
      });
    },
    statement() {
      uni.navigateTo({
        url: "/pages/index/HadaMetaStatement",
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/static/css/signincommon.css";
@import "@/static/css/signin.css";
.left {
  width: 120rpx;
  height: 45rpx;
  margin: 32rpx 0 0 42rpx;
  display: inline-block;
}
.area-code {
  width: 58rpx;
  height: 45rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
  font-weight: bold;
  display: inline-block;
}
.area-icon {
  width: 20rpx;
  height: 20rpx;
  background: url("@/static/images/signin/phone.png") 100% no-repeat;
  background-size: 100% 100%;
  margin-top: 13rpx;
  margin-left: 10rpx;
  display: inline-block;
}
.tel-input {
  width: 418rpx;
  height: 110rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap2 {
  background-color: rgba(0, 155, 249, 1);
  border-radius: 100px;
  width: 36rpx;
  height: 12rpx;
  margin: 4rpx 0 0 176rpx;
}
.email {
  width: 552rpx;
  height: 110rpx;
  color: rgba(136, 141, 167, 1);
  font-size: 32rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
  margin: 0 0 0 42rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.block4 {
  background-color: rgba(0, 155, 249, 1);
}
.select {
  color: rgba(46, 51, 78, 1);
}
.unselect {
  color: rgba(158, 163, 187, 1);
}
/* 提示信息弹窗 */
.popup-content {
  padding: 30rpx;
  color: #ffffff;
  .text {
    .icons {
      margin-right: 10rpx;
      size: 28rpx;
      display: inline-block;
      transform: rotate(180deg);
    }
  }
}
.regular {
  width: 100%;
  height: 150rpx;
  font-size: 20rpx;
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  padding: 20rpx 58rpx;
}
.bluetext {
  color: rgba(0, 155, 249, 1);
}
/deep/ .uni-dialog-title-text {
  color: #242733 !important;
}
/deep/ .uni-checkbox-input-checked {
  color: #ffffff !important;
  background: rgba(0, 155, 249, 1);
}
/deep/ .uni-dialog-title-text {
  color: #242733 !important;
}
/deep/ .uni-checkbox-input {
  width: 30rpx;
  height: 30rpx;
  background-color: transparent;
  border-color: transparent;
  background: url("@/static/images/login/login-img/quxiao.png");
  background-size: 100% 100%;
  border-radius: 50%;
  overflow: hidden;
  border-width: 0;
}
/deep/ .uni-checkbox-input-checked {
  background-color: transparent;
  border-color: transparent;
  background: url("@/static/images/login/login-img/queding.png");
  background-size: 100% 100%;
  border-radius: 50%;
}
/deep/ uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
  background-color: transparent;
  border-color: transparent;
}
/deep/ .aui-dialog-title {
  font-size: 17px;
  height: 50px;
  line-height: 50px;
  color: #2e334e;
}
/deep/ .aui-dialog-content {
  font-size: 14px;
  max-height: 45vh;
  margin-bottom: 60rpx;
  color: #9ea3bb;
  padding: 20rpx 65rpx 0 65rpx;
}
/deep/ .aui-dialog-down-btn {
  font-size: 16px;
}
</style>
