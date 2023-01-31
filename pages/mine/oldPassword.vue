<template>
  <view class="content">
    <!-- 第一次 -->
    <!-- <view class="box4 flex-col justify-end" v-if="select">
      <view class="group1 flex-row justify-between">
        <text class="word2">{{ $t("mine-editpassword-old") }}</text>
        <text class="word3">{{ $t("mine-editpassword-setnew") }}</text>
      </view>
      <view class="group2 flex-row">
        <view class="main2 flex-col"></view>
      </view>
    </view> -->

    <!-- 第二次 -->
    <!-- <view class="bd8 flex-col justify-end" v-else>
      <view class="wrap1 flex-row justify-between">
        <text class="xiugai-1">{{ $t("mine-editpassword-old") }}</text>
        <text class="word4">{{ $t("mine-editpassword-setnew") }}</text>
      </view>
      <view class="wrap2 flex-row">
        <view class="xiugai-2 flex-col"></view>
      </view>
    </view> -->
	
	<view class="header-bg" v-if="select">
		<text class="xiugai-3">{{ $t("mine-editpassword-title") }}</text>
	</view>
	
    <!-- 原密码 -->
    <view class="layer5 flex-col" v-if="select">
		<view class="input">
			<view class="input-left">{{ $t('common.oldpassword') }}</view>
			<view class="input-right">
				<uni-easyinput type="password" :inputBorder="false" v-model="oldpassword" :placeholder="$t('mine-editpassword-oldinput')"></uni-easyinput>
			</view>
		</view>
		
		
      <!-- <view class="box6">
        <uni-easyinput type="password" :inputBorder="false" v-model="oldpassword" :placeholder="$t('mine-editpassword-oldinput')"></uni-easyinput>
      </view> -->
      <view class="box7 flex-col" :class="{ hasvalue: ChangeOldpassword }" @click="select1"
        ><text class="word6">{{ $t("common.next") }}</text></view
      >
    </view>

    <!-- 设置新密码 -->
    <view class="bd10 flex-col" v-else>
		<view class="input">
			<view class="input-left">{{ $t('common.newpassword') }}</view>
			<view class="input-right">
				<uni-easyinput type="password" :inputBorder="false" v-model="newpassword" :placeholder="$t('mine-editpassword-newinput')"></uni-easyinput>
			</view>
		</view>
		<view class="input">
			<view class="input-left">{{ $t('common.confirmpassword') }}</view>
			<view class="input-right">
				<uni-easyinput type="password" :inputBorder="false" v-model="confirmpassword" :placeholder="$t('mine-editpassword-newconfirminput')"></uni-easyinput>
			</view>
		</view>
      <!-- <view class="InputNumber1 flex-col">
        <uni-easyinput type="password" :inputBorder="false" v-model="newpassword" :placeholder="$t('mine-editpassword-newinput')"></uni-easyinput>
      </view>
      <view class="mod1 flex-col">
        <uni-easyinput type="password" :inputBorder="false" v-model="confirmpassword" :placeholder="$t('mine-editpassword-newconfirminput')"></uni-easyinput>
      </view> -->
      <button class="Button1 flex-col" @click="select2">
        <text class="info2">{{ $t("common.tijiao") }}</text>
      </button>
    </view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      select: true,
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",

      TSpassword: "",
      ChangeOldpassword: false,
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  watch: {
    oldpassword(val) {
      if (val == "") {
        this.ChangeOldpassword = false;
      } else {
        this.ChangeOldpassword = true;
      }
    },
  },
  onLoad() {},
  methods: {
    select1() {
      if (!this.ChangeOldpassword) {
        return;
      }
      if (this.oldpassword == "") {
        uni.showToast({
          title: this.$t("mine-editpassword-newnull"),
          icon: "none",
        });
        return;
      } else {
        uni.request({
          header: {
            "Content-Type": "application/json",
            "x-token": uni.getStorageSync("token"),
            //version
            version: this.version,
          },
          url: this.host + "/app/user/password/check?oldpassword=" + this.oldpassword,
          method: "GET",
          data: {},
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              this.select = false;
              this.TSpassword = this.oldpassword;
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
                title: this.$t("mine-editpassword-oldnew"),
                icon: "none",
              });
            }
          },
        });
      }
    },

    select2() {
      if (this.newpassword == "" && this.confirmpassword == "") {
        uni.showToast({
          title: this.$t("mine-editpassword-newnull"),
          icon: "none",
        });
        return;
      }
      if (this.newpassword != this.confirmpassword) {
        uni.showToast({
          title: this.$t("mine-editpassword-newconfirm"),
          icon: "none",
        });
        return;
      }
      if (this.newpassword.length < 8 || this.newpassword.length > 16) {
        uni.showToast({
          title: this.$t("common.password-input"),
          icon: "none",
        });
        return;
      }
      if (this.newpassword == this.confirmpassword && this.newpassword == this.TSpassword) {
        uni.showToast({
          title: this.$t("mine-editpassword-new-confirm"),
          icon: "none",
        });
        return;
      }
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": uni.getStorageSync("token"),
          //version
          version: this.version,
        },
        url: this.host + "/app/user/password/change",
        method: "POST",
        data: {
          Password: this.TSpassword,
          NewPassword: this.confirmpassword,
        },
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
          uni.setStorageSync("password", this.newpassword);
          uni.showToast({
            icon: "none",
            title: this.$t("common.edit-success"),
          });
          uni.switchTab({
            url: "/pages/mine/index",
          });
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/static/css/common.css";

/deep/ .uni-input-input{
	font-size: 30rpx !important;
}

/deep/ .uni-easyinput__placeholder-class{
	font-size: 30rpx !important;
}

/deep/ .uni-easyinput__content{
	background-color: #ffffff !important;
}

/deep/ .content-clear-icon{
	background-color: #ffffff !important;
}
page {
  background-color: #ffffff;
}
.content {
  border-top: 2upx solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.box4 {
  background-color: rgba(251, 253, 253, 1);
  height: 90rpx;
  margin-top: 2rpx;
  width: 750rpx;
}

.group1 {
  width: 565rpx;
  height: 48rpx;
  margin: 21rpx 0 0 94rpx;
}

.word2 {
  width: 194rpx;
  height: 48rpx;
  color: rgba(0, 155, 249, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 48rpx;
}

.word3 {
  width: 200rpx;
  height: 48rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 48rpx;
}

.group2 {
  width: 71rpx;
  height: 12rpx;
  margin: 9rpx 0 0 156rpx;
}

.main2 {
  background-color: rgba(0, 155, 249, 1);
  width: 71rpx;
  height: 12rpx;
}
.layer5 {
  /* width: 100%; */
  // height: 1034rpx;
  margin: 0 42rpx;
}

.word4 {
  width: 630rpx;
  height: 42rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 30rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 42rpx;
}

.xiugai-3 {
  width: 630rpx;
  height: 42rpx;
  color: rgba(46, 51, 78, 1);
  font-family: "PingFangSC-Regular";
  font-size: 30rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 42rpx;
}

.box6 {
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100px;
  height: 110rpx;
  margin-top: 42rpx;
  width: 625rpx;
  padding: 20upx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.word5 {
  width: 256rpx;
  height: 45rpx;
  color: rgba(136, 141, 167, 1);
  font-size: 32rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
  margin: 32rpx 0 0 42rpx;
}

.box7 {
  background-color: rgba(212, 216, 221, 1);
  border-radius: 100px;
  height: 112rpx;
  width: 635rpx;
  position: absolute;
  bottom: 300rpx;
  transform: translateX(-50%);
  left: 50%;
}

.word6 {
  width: 107rpx;
  height: 50rpx;
  color: rgba(255, 255, 255, 1);
  font-size: 36rpx;
  font-family: AlibabaPuHuiTiM;
  text-align: left;
  white-space: nowrap;
  line-height: 50rpx;
  margin: 31rpx 0 0 264rpx;
}

.bd8 {
  background-color: rgba(251, 253, 253, 1);
  height: 90rpx;
  margin-top: 2rpx;
  width: 750rpx;
}

.wrap1 {
  width: 565rpx;
  height: 48rpx;
  margin: 21rpx 0 0 94rpx;
}

.xiugai-1 {
  width: 194rpx;
  height: 48rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 48rpx;
}

.word4 {
  width: 200rpx;
  height: 48rpx;
  color: rgba(0, 155, 249, 1);
  font-size: 34rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 48rpx;
}

.wrap2 {
  width: 71rpx;
  height: 12rpx;
  margin: 9rpx 0 0 524rpx;
}

.xiugai-2 {
  background-color: rgba(0, 155, 249, 1);
  width: 71rpx;
  height: 12rpx;
}

.bd10 {
  // width: 651rpx;
  // height: 932rpx;
  margin: 0 42rpx 0 42rpx;
}

.InputNumber1 {
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100px;
  height: 110rpx;
  /* margin-top: 24rpx; */
  width: 625rpx;
  padding: 20upx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info1 {
  width: 190rpx;
  height: 45rpx;
  color: rgba(36, 39, 51, 1);
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
}

/* .section2 {
	  width: 1rpx;
	  height: 41rpx;
	  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngfc96eade191544f04069ab3e5e92d9be99331c12f08740349fef4d0480e68c92) -2rpx
	    0rpx no-repeat;
	  background-size: 5rpx 42rpx;
	  margin: 2rpx 0 0 6rpx;
	} */

/* .section3 {
	  width: 44rpx;
	  height: 44rpx;
	  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngd04b17b8be7cfb54208c21ad41e4700248216161659236f5330bd832be922b01)
	    100% no-repeat;
	  background-size: 100% 100%;
	  margin: 1rpx 0 0 300rpx;
	} */

.mod1 {
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100px;
  height: 110rpx;
  margin-top: 24rpx;
  width: 625rpx;
  padding: 20upx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.word5 {
  width: 352rpx;
  height: 45rpx;
  color: rgba(136, 141, 167, 1);
  font-size: 32rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
  margin: 32rpx 0 0 42rpx;
}

.Button1 {
  background-color: rgba(0, 155, 249, 1);
  border-radius: 100px;
  height: 112rpx;
  width: 635rpx;
  // margin: 576rpx auto 0;
  position: absolute;
  bottom: 150px;
  transform: translateX(-50%);
  left: 50%;
}

.info2 {
  width: 71rpx;
  height: 50rpx;
  color: rgba(255, 255, 255, 1);
  font-size: 36rpx;
  font-family: AlibabaPuHuiTiM;
  text-align: left;
  white-space: nowrap;
  line-height: 50rpx;
  margin: 31rpx 0 0 282rpx;
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

.hasvalue {
  background-color: rgba(0, 155, 249, 1);
}

.header-bg{
	width: 100%;
	height: 70rpx;
	background: rgba(245, 249, 250, 1);
	box-sizing: border-box;
	padding-left: 42rpx;
	display: flex;
	align-items: center;
}
.input{
	width: 100%;
	height: 80rpx;
	margin-top: 50rpx;
	display: flex;
	/* align-items: center; */
	border-bottom: 0.5px solid rgba(236, 236, 236, 1);
}
.input-left{
	display: flex;
	align-items: center;
	flex: 0.8;
	font-size: 30rpx;
	color: rgba(46, 51, 78, 1);
}
.input-right{
	display: flex;
	align-items: center;
	flex: 2;
}
</style>
