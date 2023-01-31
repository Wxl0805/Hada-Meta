<template>
  <view class="">
    <view class="status_bar"> </view>

    <!-- 顶部导航栏 -->
    <view class="header-fixed">
      <uni-nav-bar height="118rpx" backgroundColor="#ffffff">
        <view class="header-title">
          <span>{{ $t("common.bind-tel") }}</span>
        </view>
        <view slot="left">
          <view class="left" @click="back">
            <span>{{ $t("common.quxiao") }}</span>
          </view>
        </view>
      </uni-nav-bar>
    </view>

    <view class="outer6 flex-col">
      <!-- 输入手机号 -->
      <!-- <view class="mod1 flex-col flex-row">
        <view class="lefttel">
          <view class="area-code" @click="gotoPickcode">
            <span>+</span><span>{{ zone }}</span>
            <view class="area-icon"></view>
          </view>
        </view>
        <view class="tel-input">
          <uni-easyinput :inputBorder="false" v-model="tel" :placeholder="$t('VerificationLogin.tel-placeholder')"></uni-easyinput>
        </view>
      </view> -->

      <!-- 输入验证码 -->
      <!-- <view class="mod3 flex-col">
        <view class="vali-block">
          <view class="telvalicode">
            <uni-easyinput :inputBorder="false" v-model="valicode" :placeholder="$t('mine.inputemail-vericode')"></uni-easyinput>
          </view>
          <image class="icon1" referrerpolicy="no-referrer" src="@/static/images/login/shugang.png" />
          <view class="send-code">
            <button class="send" :class="{ style: styles }" :disabled="forbidden" @click="sendvalidate">{{ validatecode }}</button>
          </view>
        </view>
      </view> -->
	  
	  <view class="input">
	  	<view class="input-left">{{ $t('common.shoujihao') }}</view>
	  	<view class="input-right" style="flex: 3;">
	  		<uni-easyinput :inputBorder="false" v-model="tel" :placeholder="$t('VerificationLogin.tel-placeholder')"></uni-easyinput>
	  	</view>
	  	<!-- <view class="input-right-code"></view> -->
	  </view>
	  <view class="input">
	  	<view class="input-left">{{ $t('common.yanzhengma') }}</view>
	  	<view class="input-right">
	  		<uni-easyinput :inputBorder="false" v-model="valicode" :placeholder="$t('mine.inputemail-vericode')"></uni-easyinput>
	  	</view>
	  		<view class="input-right-code">
	  			<image
	  			  class="icon1"
	  			  referrerpolicy="no-referrer"
	  			  src="../../static/images/login/shugang.png"
	  			/>
	  			<view class="send-code">
	  				<button class="send" :class="{ style: styles }" :disabled="forbidden" @click="sendvalidate">{{ validatecode }}</button>
	  			</view>
	  		</view>
	   </view>

      <button class="section7 flex-col" @click="bind">
        <text class="word5">{{ $t("mine.confirm-btn") }}</text>
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
      tel: "",
      zone: "86",
      validatecode: this.$t("common.sendcode"),
      valicode: "",
      forbidden: false,
      styles: false,
      token: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  onLoad() {
    this.token = uni.getStorageSync("token");
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1, //返回层数，2则上上页
      });
    },
    gotoPickcode() {
      uni.navigateTo({
        url: "/pages/index/country-code",
      });
    },
    upDataCountryCode: function (msg) {
      if (msg) {
        this.zone = msg;
      }
      this.$forceUpdate();
    },

    sendvalidate() {
      if (this.tel == "") {
        uni.showToast({
          title: this.$t("common.telnull"),
          icon: "none",
        });
        return;
      }
      let telreg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      if (!telreg.test(this.tel)) {
        uni.showToast({
          title: this.$t("common.tel-format-error"),
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
        url: this.host + "/app/getsmscode?value=" + this.tel + "&type=bindphone",
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
          this.styles = true;
          this.forbidden = true;
          let num = 60;
          let run = setInterval(() => {
            this.validatecode = num + this.$t("common.chongfa");
            num--;
            if (num == -1) {
              clearInterval(run);
              this.validatecode = this.$t("common.sendcode");
              this.styles = false;

              this.forbidden = false;
            }
          }, 1000);
          if (res.data.msg == "操作成功") {
            uni.showToast({
              title: this.$t("common.send-success"),
              icon: "none",
            });
            return;
          }
          if (res.data.msg == "验证码还在有效期内，请勿重复发送") {
            uni.showToast({
              title: this.$t("common.sendcode-error"),
              icon: "none",
            });
            return;
          }
        },
      });
    },
    bind() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.wait"),
      });
      uni.request({
        header: {
          "Content-Type": "application/json",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/bindphone?phone=" + this.tel + "&code=" + this.valicode,
        method: "GET",
        data: {},
        dataType: "json",
        success: (res) => {
			console.log(res);
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
		  if (this.tel == "") {
		    uni.showToast({
		      title: this.$t("common.telnull"),
		      icon: "none",
		    });
		    return;
		  }
		  let telreg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
		  if (!telreg.test(this.tel)) {
		    uni.showToast({
		      title: this.$t("common.tel-format-error"),
		      icon: "none",
		    });
		    return;
		  }
		  if(res.data.code == 7){
			  if (res.data.msg == "验证码格式错误") {
			    uni.showToast({
			      title: this.$t("common.vericode-error"),
			      icon: "none",
			    });
			    return;
			  }
			  if (res.data.msg == "此手机号已经被绑定过") {
			    uni.showToast({
			      title: this.$t("common.tel-binded"),
			      icon: "none",
			    });
			    return;
			  }
			  uni.showToast({
			    title: this.$t("common.bind-error"),
			    icon: "none",
			  });
			  return;
		  }
		  if(res.data.code == 0){
			  let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
			  let nowPage = pages[pages.length - 1]; //当前页页面实例
			  let prevPage = pages[pages.length - 2]; //上一页页面实例
			  let object = {
			    tel: this.tel,
			  };
			  prevPage.$vm.bindtel(object); // 給上一頁綁定方法otherFun,傳參object
			  uni.navigateBack({
			    delta: 1,
			  });
			  uni.showToast({
			    title: this.$t("common.bind-success"),
			    icon: "none",
			  });
		  }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style scoped>
@import "@/static/css/common.css";
/* @import "@/static/css/index.rpx.css"; */
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
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

.outer6 {
  /* width: 635rpx; */
  /* height: 496rpx; */
  margin: 118rpx 42rpx 0 42rpx;
}

.section4 {
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100px;
  height: 110rpx;
  margin-left: 5rpx;
  width: 625rpx;
}

.group3 {
  width: 282rpx;
  height: 45rpx;
  margin: 32rpx 0 0 42rpx;
}

.ImageText2 {
  width: 90rpx;
  height: 45rpx;
}

.TextGroup2 {
  height: 45rpx;
  width: 58rpx;
}

.info1 {
  width: 58rpx;
  height: 45rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 32rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
}

.group2 {
  width: 20rpx;
  height: 20rpx;
  /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng4e84ef5b2191dd3eb9971c358c8323534e06dcdcefe3dddec3030767feabe3cd)
	    100% no-repeat; */
  background-size: 100% 100%;
  margin-top: 13rpx;
}

.info2 {
  width: 160rpx;
  height: 45rpx;
  color: rgba(136, 141, 167, 1);
  font-size: 32rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
}

.section5 {
  background-color: rgba(245, 249, 250, 1);
  border-radius: 100px;
  height: 110rpx;
  width: 625rpx;
  margin: 24rpx 0 0 5rpx;
}

.mod2 {
  width: 541rpx;
  height: 45rpx;
  margin: 32rpx 0 0 42rpx;
}

.word4 {
  width: 160rpx;
  height: 45rpx;
  color: rgba(136, 141, 167, 1);
  font-size: 32rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 45rpx;
}

/* .icon1 {
  width: 1rpx;
  height: 22rpx;
  margin: 14rpx 0 0 218rpx;
} */

.info3 {
  width: 140rpx;
  height: 40rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  text-align: right;
  white-space: nowrap;
  line-height: 40rpx;
  margin: 5rpx 0 0 22rpx;
}

.section7 {
  background-color: rgba(0, 155, 249, 1);
  border-radius: 100px;
  height: 112rpx;
  /* margin-top: 140rpx; */
  width: 635rpx;
  position: absolute;
  bottom: 300rpx;
  left: 50%;
  transform: translateX(-50%);
}

.word5 {
  width: 142rpx;
  height: 50rpx;
  color: rgba(255, 255, 255, 1);
  font-size: 36rpx;
  font-family: AlibabaPuHuiTiM;
  text-align: left;
  white-space: nowrap;
  line-height: 50rpx;
  margin: 31rpx 0 0 247rpx;
}

.lefttel {
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
.vali-block {
  width: 561rpx;
  height: 110rpx;
  margin: 0 0 0 22rpx;
  display: flex;
  justify-content: baseline;
}
.telvalicode {
  width: 380upx;
  height: 110rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon1 {
  width: 1px;
  height: 30rpx;
  margin: 0 10rpx 0 10rpx;
}
.send-code{
	width: 140rpx;
	height: 110rpx;
	color: rgba(46, 51, 78, 1);
	font-size: 28rpx;
	font-family: PingFangSC-Medium;
	text-align: right;
	white-space: nowrap;
	margin: 0 0 0 20rpx;
	display: flex;
	justify-content: center;
}
.send{
	font-size: 28rpx;
	color: rgba(46, 51, 78, 1);
	line-height: 110rpx;
	border: none;
	outline: none;
}
uni-button:after {
  border: none;
}
.email-all {
  width: 541rpx;
  height: 110rpx;
  margin: 0 0 0 42rpx;
  display: flex;
}
.email-left {
  width: 84rpx;
  height: 110rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 28rpx;
  font-family: PingFangSC-Medium;
  text-align: left;
  white-space: nowrap;
  line-height: 110rpx;
}
.email-input {
  width: 432rpx;
  height: 110rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.password {
  width: 561rpx;
  height: 110rpx;
  margin: 0 0 0 22rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ImageText3 {
  width: 120rpx;
  height: 116rpx;
}
.valiimg {
  width: 77rpx;
  height: 77rpx;
  /* background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngc135989623af2dd453511fc2f446bd2c280accfae2d7eb2a550ba15d36c18744)
		    100% no-repeat; */
  background-size: 100% 100%;
  margin-left: 22rpx;
}
.word7 {
  width: 120rpx;
  height: 33rpx;
  color: rgba(136, 141, 167, 1);
  font-size: 24rpx;
  text-align: left;
  white-space: nowrap;
  line-height: 33rpx;
}
.TextGroup3 {
  height: 33rpx;
  margin-top: 6rpx;
  width: 120rpx;
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
.style {
  color: rgba(0, 155, 249, 1);
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
		flex: 0.6;
		font-size: 30rpx;
		color: rgba(46, 51, 78, 1);
	}
	.input-right{
		display: flex;
		align-items: center;
		flex: 2;
	}
	.input-right-code{
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: center;
	}
	/deep/ .uni-input-input{
		font-size: 30rpx !important;
	}
	
	/deep/ .uni-easyinput__placeholder-class{
		font-size: 30rpx !important;
	}
	
	/deep/ .uni-easyinput__content{
		background-color: transparent !important;
	}
	
	/deep/ .content-clear-icon{
		background-color: #ffffff !important;
	}
	
	uni-button[disabled]:not([type]), uni-button[disabled][type=default]{
		background-color: transparent;
	}
</style>
