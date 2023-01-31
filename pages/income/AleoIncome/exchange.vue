<template>
  <view class="all">
    <view class="block">
      <view class="block-left">
        <span>{{ $t("common.exchange-way") }}</span>
      </view>
      <view class="block-right" @click="pop = true">
        <span style="margin-right: 5rpx;">{{ way }}</span>
        <view class="right-jiantou"></view>
      </view>
    </view>
    <view class="block" v-if="otherPerson">
      <view class="block-left">
        <span>{{ $t("common.exchange-person") }}</span>
      </view>
      <view class="block-right" @click="personPop">
        <span style="margin-right: 5rpx;">{{ person }}</span>
        <view class="right-jiantou"></view>
      </view>
    </view>
    <view class="block">
      <view class="block-left">
        <span>{{ $t("common.now-title") }}</span>
      </view>
      <view class="block-right">
        <span style="margin-right: 8rpx;">{{ nowU }}</span
        ><span>U</span>
      </view>
    </view>
    <view class="block">
      <view class="block-left-exchange">
        <span>{{ $t("common.exchange") }}</span
        ><span style="color: rgb(47, 172, 255);">*</span>
      </view>
      <view class="block-middle-num">
        <uni-number-box @focus="btn = false" @blur="blur" v-model="num" :step="numstep" :min="minnum" :max="maxnum"></uni-number-box>
      </view>
      <view class="block-middle-cont">
        <span style="font-size: 34rpx;margin-right: 10rpx;">G</span><span>({{ Unum }}U)</span>
      </view>
      <view class="block-right-button">
        <button @click="calMax">{{ $t("common.max") }}</button>
      </view>
    </view>

    <button class="btn" @click="submit" v-if="btn">{{ $t("common.tijiao") }}</button>

    <!-- 选择兑换方式 -->
    <view class="bottompop" v-if="pop">
      <view
        class="block1"
        @click="
          way = $t('common.exchange-mine');
          pop = false;
          otherPerson = false;
          person = $t('common.plsselect');
        "
        >{{ $t("common.exchange-mine") }}</view
      >
      <view
        class="block2"
        @click="
          way = $t('common.exchange-other');
          pop = false;
          otherPerson = true;
        "
        >{{ $t("common.exchange-other") }}</view
      >
      <view class="exit" @click="pop = false">{{ $t("common.quxiao") }}</view>
    </view>
    <view class="maskBottompop" v-if="pop" @click="pop = false"></view>

    <!-- 提示信息 -->
    <aui-dialog
      ref="infodialog"
      :title="$t('common.exchange-other')"
      :msg="$t('common.exchange-cont')"
      :btns="[{ name: $t('signin.doc-footer'), color: 'rgba(0, 122, 255, 1)' }]"
      :mask="true"
      :maskTapClose="false"
      :items="[]"
      :theme="1"
      @callback="iKnow"
    ></aui-dialog>

    <!-- 兑换提示 -->
    <uni-popup ref="Dialog" type="dialog">
      <uni-popup-dialog
        type="info"
        :cancelText="$t('mine.set-think')"
        :confirmText="$t('common.confirm-exchange')"
        :title="$t('common.exchange-info')"
        :content="doc"
        @confirm="dialogConfirm"
        @close="dialogClose"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      num: 1,
      numstep: 1,
      minnum: 1,
      Unum: '',
      maxnum: 50000,
      nowU: "",
      person: this.$t("common.plsselect"),
      way: this.$t("common.exchange-mine"),
      pop: false,
      doc: "",
      otherPerson: false,
      id: "",
      // 提交按钮
      btn: true,
	  // 每股多少U
	  perNum: '',
    };
  },
  watch: {
    num(val) {
      console.log(val);
      this.Unum = this.num * this.perNum;
    },
  },
  onLoad() {
  	// this.perNum = getApp().globalData.perNum;
	// this.Unum = getApp().globalData.perNum;
	// console.log(getApp().globalData.perNum);
  },
  onShow() {
	this.numValue();
    uni.request({
      // url:this.host+'/app/getInvestDetails',
      url: this.host + "/app/rechargeOverview",
      header: {
        "x-token": uni.getStorageSync("token"),
        //version
        version: this.version,
      },
      data: {},
      success: (res) => {
        console.log("res", res);
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
        this.nowU = Number(res.data.data.rechargeBalance);
      },
    });
  },
  methods: {
    blur(e) {
      if (e.detail.value == "") {
        this.num = 1;
        // console.log(this.num);
      }
      this.btn = true;
      // this.getkeyboard();
    },
    // 计算最大值
    calMax() {
      this.num = Math.floor(this.nowU / this.perNum);
    },
    // 弹出代人兑换弹窗
    personPop() {
      this.$refs.infodialog.show();
    },
    iKnow() {
      uni.navigateTo({
        url: "/pages/income/AleoIncome/expandingCustomerList",
      });
    },
    // 提交
    async submit() {
		await this.numValue();
		console.log(this.Unum );
		console.log(this.nowU );
      if (this.Unum > this.nowU) {
        uni.showToast({
          icon: "none",
          title: this.$t("common.edubuzu"),
        });
        return;
      }
      if (this.otherPerson == true && this.id == "") {
        uni.showToast({
          icon: "none",
          title: this.$t("common.selectPerson"),
        });
        return;
      }
      this.doc = this.$t("common.exchange-frontcont") + this.num * this.perNum + this.$t("common.exchange-middlecont") + this.num + this.$t("common.exchange-lastcont");
      this.$refs.Dialog.open();
    },
    dialogConfirm() {
      if (this.otherPerson) {
        this.dairen();
      } else {
        this.zizhu();
      }
    },
    dialogClose() {
      this.$refs.Dialog.close();
    },
    // 调用兑换接口-自主兑换
    zizhu() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.jiazai-loading"),
      });
      uni.request({
        // url:this.host+'/app/getInvestDetails',
        url: this.host + "/app/exchangesShare",
        method: "POST",
        header: {
          "x-token": uni.getStorageSync("token"),
          //version
          version: this.version,
        },
        data: {
		  customerId: 0,
          type: "0",
		  shareAmount: this.num,
          u_amount: this.num * this.perNum,
		  exchangesToId: 0,
        },
        success: (res) => {
          console.log("res", res.data);
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
			  return;
            }
			uni.showToast({
				icon:"none",
				title: this.$t('exchange-error')
			})
            return;
          }
          if (res.data.code == 0) {
            
            uni.reLaunch({
              url: "/pages/income/AleoIncome/income",
            });
			uni.showToast({
			  icon: "none",
			  title: this.$t("common.exchange-success"),
			});
          }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    // 调用兑换接口-代人兑换
    dairen() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.jiazai-loading"),
      });
      uni.request({
        // url:this.host+'/app/getInvestDetails',
        url: this.host + "/app/exchangesShare",
        method: "POST",
        header: {
          "x-token": uni.getStorageSync("token"),
          //version
          version: this.version,
        },
        data: {
          customerId: 0,
          type: "1",
          shareAmount: this.num,
          u_amount: this.num * this.perNum,
          exchangesToId: this.id,
        },
        success: (res) => {
          console.log(this.id);
          console.log("res", res);
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
			  return;
            }
			uni.showToast({
				icon:"none",
				title: this.$t('exchange-error')
			})
            return;
          }
          if (res.data.code == 0) {
            
            uni.reLaunch({
              url: "/pages/income/AleoIncome/income",
            });
			uni.showToast({
			  icon: "none",
			  title: this.$t("common.exchange-success"),
			});
          }
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    // 由兑换人页面携带过来的参数
    otherFun(object) {
      if (object) {
        this.person = object.NickName;
        this.id = parseInt(object.ID);
        // this.invitecode = object.result;
        // console.log(object);
      } else {
        return;
      }
    },
	// 每股多少U
	numValue(){
		// 获取每股多少U
		return new Promise((resolve,reject) => {
			uni.request({
			// url:this.host+'/app/getInvestDetails',
			url: this.host + "/app/price/perShare",
			header: {
				"x-token": uni.getStorageSync("token"),
				//version
				version: this.version,
			},
			data: {},
			success: (res) => {
				console.log("res", res);
				resolve(res);
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
				getApp().globalData.perNum = Number(res.data.data);
				this.perNum = Number(res.data.data);
				this.Unum = Number(res.data.data);
			},
			});
		}) 
	},
    // 显示和隐藏提交按钮
    getkeyboard() {
      // this.exit = true;
      uni.onKeyboardHeightChange((res) => {
        console.log(res.height);
        if (res.height != 0) {
          this.btn = false;
          return;
        }
        this.btn = true;
      });
    },
  },
};
</script>

<style>
page {
  background: rgba(243, 245, 247, 1);
}
.block {
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  border-top: 1px solid #f3f5f7;
  padding: 0 40rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.block-left {
  width: 200rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #9ea3bb;
  font-size: 30rpx;
}
.block-right {
  width: 200rpx;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* color: #9ea3bb; */
  font-size: 30rpx;
}
.right-jiantou {
  width: 25rpx;
  height: 25rpx;
  background: url("@/static/images/rightjiantou-black.png") 100% no-repeat;
  background-size: 100% 100%;
}
.block-left-exchange {
  flex: 1.3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #9ea3bb;
  font-size: 30rpx;
  /* margin-right: 20rpx; */
}
.block-middle-num {
  flex: 2;
  display: flex;
  align-items: center;
}
.block-middle-cont {
  flex: 3;
  display: flex;
  align-items: center;
  margin-left: 15rpx;
  justify-content: center;
  color: rgba(158, 163, 187, 1);
  font-size: 30rpx;
}
.block-right-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.block-right-button > button {
  background-color: #ffffff;
  color: rgb(47, 172, 255);
  font-size: 30rpx;
}
.bottompop {
  width: 750rpx;
  height: 402rpx;
  position: fixed;
  bottom: 0;
  margin-bottom: 40rpx;
  padding: 23rpx 20rpx 0;
  box-sizing: border-box;
  z-index: 1000;
}
/* @keyframes pop {
		0% {
			transform: translateY(-100%);
		}
		30% {
			transform: translateY(-60%);
		}
		60% {
			transform: translateY(-30%);
		}
		100% {
			transform: translateY(0);
		}
	} */
.block1 {
  width: 100%;
  height: 114rpx;
  background: #ffffff;
  border-bottom: 1px solid #efefef;
  border-radius: 26rpx 26rpx 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  color: rgba(0, 122, 255, 1);
}
.block2 {
  width: 100%;
  height: 114rpx;
  background: #ffffff;
  border-radius: 0 0 26rpx 26rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  color: rgba(0, 122, 255, 1);
}
.exit {
  width: 100%;
  height: 114rpx;
  background: #ffffff;
  border-radius: 26rpx;
  margin-top: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(31, 31, 31, 1);
  font-size: 40rpx;
}
.maskBottompop {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.btn {
  width: 80%;
  height: 90rpx;
  position: fixed;
  left: 10%;
  bottom: 155rpx;
  background: rgba(0, 155, 249, 1);
  border-radius: 50px;
  color: #ffffff;
  font-size: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="less">
/deep/ .aui-dialog-main {
  min-width: 270px;
}
/deep/ .aui-dialog-title {
  font-size: 17px;
  color: rgba(0, 0, 0, 1);
  font-weight: bold;
}
/deep/ .aui-dialog-content {
  padding: 14px 0 20px 0;
  font-size: 13px;
  color: rgba(0, 0, 0, 1);
  text-align: center !important;
}
/deep/ .aui-dialog-down-btn {
  font-size: 17px;
}
</style>
