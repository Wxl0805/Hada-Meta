<template>
  <view class="content">
    <view class="block-all" :style="{height}">
          
          <view class="block" v-for="(item,key) in addressList" :key="key">
            <view class="header-title">
              <text>{{item.Types}}</text>
            </view>
            <view class="footer">
              <view class="footer-left">
                <text>{{ item.Values }}</text>
              </view>
              <view class="footer-right">
                <view @click="copyaddress(item.Values)" class="copy-icon"></view>
              </view>
            </view>
          </view>
    </view>

    <view class="fengexian"></view>

    <view class="footerblock">
      <view class="fener">
        <view class="fener-left">
          <span>{{ $t("add.moneynum") }}</span
          ><span style="color: rgb(47, 172, 255);">*</span>
        </view>
      </view>
	  
	  <view class="fener" style="height: 100rpx;">
	    <view class="fener-middle">
	      <uni-number-box @blur="blur" @focus="showbtn = false" v-model="num" :step="numstep" :min="minnum" :max="maxnum"></uni-number-box>
	    </view>
	    <view class="fener-right">
	      <span style="margin-left: 20rpx;">U</span>
	    </view>
	  </view>

      <view class="upimg">
        <helang-compress ref="helangCompress"></helang-compress>
        <uni-file-picker @delete="del" @select="select" :value="list" limit="3" :title="$t('add.uploadimg')"></uni-file-picker>
      </view>
      <button class="btn" @click="submit" :disabled="disabled" v-if="showbtn">
        {{ $t("common.tijiao") }}
      </button>
    </view>

    <uni-popup ref="Dialog" type="dialog">
      <uni-popup-dialog
        type="info"
        :cancelText="$t('add.title4')"
        :confirmText="$t('add.title5')"
        :title="$t('add.title6')"
        :content="doc"
        @confirm="dialogConfirm"
        @close="dialogClose"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import helangCompress from "@/components/helang-compress/helang-compress.vue";
// #ifdef APP-PLUS
import APPUpdate from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
// #endif
export default {
  data() {
    return {
      // 记录触发了几次需要更新APP
      appUpdate: 0,
      from: "",
      num: 1,
      numstep: 2000,
      minnum: 1,
      maxnum: 200000000,
      list: [],
      fileList: [],
      // gubuy: true,
      // Ubuy: false,
      invitecode: "",
      textscan: "扫码",
      typescan: "scan-listener",
      imgnum: 0,
      disabled: false,
      doc: "",
	  // 收款地址集合
	  addressList: [],
	  height: "",
	  // 传给后端的地址
	  address1: '',
	  address2: '',
	  showbtn: true,
	  
    };
  },
  components: {
    helangCompress,
  },
  onLoad(option) {
    this.from = option.from;
	this.num = 2000;
  },
  onShow() {
    // 获取收款地址
    uni.request({
      url: this.host + "/app/getWithdrawAddress",
      method: "GET",
      header: {
        //token
        "x-token": uni.getStorageSync("token"),
        //version
        version: this.version,
      },
      success: (res) => {
        // code为0为成功
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
          console.log(res);
          this.addressList = res.data.data;
          this.height = (res.data.data.length*170 + 40) + 'rpx';
		  this.addressList.forEach((val,key) => {
			  if(key == 0){
				  this.address1 = val.Values
				  console.log(this.address1);
				  console.log(this.address2);
			  }
			  if(key == 1){
				  this.address2 = val.Values
				  console.log(this.address1);
				  console.log(this.address2);
			  }
		  });
        }
      },
    });
  },
  watch: {
    imgnum(val) {
      console.log(val);
    },
	num(val,oldval){
		
	}
  },

  methods: {
    copyaddress(val) {
      uni.setClipboardData({
        data: val,
        success: function () {},
      });
    },
    async select(e) {
      this.imgnum = e.tempFiles.length + this.imgnum;
      if (e.tempFiles.length == 1) {
        uni.showLoading({ title: this.$t("common.image-yasuo"), mask: true });
        await this.upImgs(e, 0);
        uni.hideLoading();
        console.log(111);
        return;
      } else if (e.tempFiles.length == 2) {
        uni.showLoading({ title: this.$t("common.image-yasuo"), mask: true });
        await this.upImgs(e, 0);
        await this.upImgs(e, 1);
        uni.hideLoading();
        console.log(222);
        return;
      } else if (e.tempFiles.length == 3) {
        uni.showLoading({ title: this.$t("common.image-yasuo"), mask: true });
        await this.upImgs(e, 0);
        await this.upImgs(e, 1);
        await this.upImgs(e, 2);
        uni.hideLoading();
        console.log(333);
        return;
      }
    },

    async upImgs(e, num) {
      // 调用上传方法
      console.log("000");
      await this.$refs.helangCompress
        .compress({
          src: e.tempFiles[num].file.path,
          maxSize: 800,
          fileType: "jpg",
          quality: 0.85,
          minSize: 640,
        })
        .then((res) => {
          console.log("res:", res);
          if (e.tempFiles.length == 1 || (e.tempFiles.length == 2 && num == 1) || (e.tempFiles.length == 3 && num == 2)) {
            uni.showToast({
              title: this.$t("common.image-yasuo-success"),
              icon: "success",
            });
          }
          this.showPlusFlag = false;
          this.imgShow = res;
          let obj = new Object();
          obj.uri = res;
          return new Promise((resolve, reject) => {
            uni.getFileInfo({
              filePath: this.imgShow,
              success: (res) => {
                console.log("上传:", res);
                resolve(res);
                obj.name = e.tempFiles[num].file.name;
                obj.size = res.size;
                this.fileList.push(obj);
                console.log("fileList:", this.fileList);
              },
              fail: () => reject(null),
              complete: () => {
                if (e.tempFiles.length == 1 || (e.tempFiles.length == 2 && num == 1) || (e.tempFiles.length == 3 && num == 2)) {
                  uni.hideLoading();
                }
              },
            });
          });
        })
        .catch((err) => {
          uni.showToast({
            title: this.$t("common.image-yasuo-fail"),
            icon: "none",
          });
        })
        .finally(() => {});
    },
    del(e) {
      this.imgnum--;
      this.fileList.pop();
    },
    blur(e) {
		this.showbtn = true;
      if (e.detail.value == "") {
        this.num = 1;
        return;
      }
    },
    submit() {
      if (this.imgnum < 1) {
        uni.showToast({
          icon: "none",
          title: this.$t("add.img-info"),
        });
        return;
      }
      this.doc = this.$t("add.title1") + this.num + this.$t("add.title2");
      this.$refs.Dialog.open();
    },

    callInterface(num) {
      let flag = true;
      let errorMsg = "";
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].size > 2 * 1024 * 1024) {
          flag = false;
          errorMsg = this.$t("common.image-size");
          break;
        }
      }
      if (!flag) {
        uni.showToast({
          icon: "none",
          title: errorMsg,
        });
        return false;
      }
      uni.showLoading({ title: this.$t("common.loading-submit"), mask: true });
      var uploadTask = uni.uploadFile({
        url: this.host + "/app/recharge",
        files: this.fileList,
        header: {
          "x-token": uni.getStorageSync("token"),
          //version
          version: this.version,
        },
        formData: {
          // code: this.invitecode,
          change_amount: this.num,
		  address1: this.address1,
		  address2: this.address2
        },
        complete: (res) => {
          uni.hideLoading();
        },
        success: (res) => {
          console.log(res);
          if (JSON.stringify(res.data).includes("0")) {
            // this.$refs.dialog.show();
            // this.disabled = false;
			uni.reLaunch({
			  url: "/pages/income/AleoIncome/income",
			});
            uni.showToast({
              icon: "none",
              title: this.$t("common.submit-success"),
            });

            // uni.redirectTo({
            //   url: "/pages/income/AleoIncome/investmentRecord?from=" + this.from,
            // });
            
          } else {
            if (JSON.stringify(res.data).includes("2")) {
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
            if (JSON.stringify(res.data).includes("图片格式错误")) {
              uni.showToast({
                icon: "none",
                title: this.$t("add.code-imgerror"),
              });
            } else if (JSON.stringify(res.data).includes("图片大小超出2M")) {
              // 新增提示
              uni.showToast({
                icon: "none",
                title: this.$t("common.image-size"),
              });
            }
            if (JSON.stringify(res.data).includes("不能填自己的邀请码")) {
              uni.showToast({
                icon: "none",
                title: this.$t("common.notminecode"),
              });
            }
            // this.disabled = false;
          }
        },
        fail: (err) => {
          uni.showToast({
            icon: "none",
            title: this.$t("common.image-up-error"),
          });
        },
      });
      // uploadTask.onProgressUpdate((res) => {

      // if(res.totalBytesExpectedToSend / 1024 / 1024 > 1){
      // 	uploadTask.abort();
      // }
      // });
    },

    dialogConfirm() {
      this.callInterface(this.gu);
    },
    dialogClose() {
      this.$refs.Dialog.close();
    },
  },
};
</script>

<style>
page {
  background-color: #ffffff;
}
uni-button {
  font-size: 28rpx;
}
uni-button[disabled]:not([type]) {
  color: #ffffff;
  background-color: rgb(47, 172, 255);
}
.button-hover {
  background-color: transparent;
}
.block-all {
  width: 100%;
  /* height: 640rpx; */
  background-color: #ffffff;
  border-top: 1px solid rgba(243, 245, 247, 1);
  padding: 0 40rpx 0 40rpx;
  box-sizing: border-box;
}
.block {
  width: 100%;
  height: 170rpx;
  padding: 40rpx 0 0 0;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(243, 245, 247, 1);
}
.header-title {
  width: 100%;
  height: 60rpx;
  color: rgba(46, 51, 78, 1);
  font-size: 30rpx;
}
.footer {
  width: 100%;
  /* height: 100rpx; */
  display: flex;
}
.footer-left {
  flex: 5;
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  word-wrap: break-word;
  word-break: break-all;
  color: rgba(158, 163, 187, 1);
  font-size: 24rpx;
}

.footer-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  /* align-items: center; */
  font-size: 28rpx;
}

.copy-icon{
	width: 44rpx;
	height: 44rpx;
	background: url('@/static/images/income/copy.png') no-repeat;
	background-size: 100% 100%;
}
.footer-left-input > input {
  width: 100%;
  font-size: 30rpx;
}
.uni-input-placeholder {
  color: rgba(158, 163, 187, 1);
}
.footer-left-input {
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;
  /* color: rgba(158, 163, 187, 1); */
  font-size: 30rpx;
}
.footer-right-input {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.scan-img {
  width: 40rpx;
  height: 40rpx;
  background: url("@/static/images/scan.png");
  background-size: 100% 100%;
}
.fengexian {
  width: 100%;
  height: 20rpx;
  background-color: rgba(243, 245, 247, 1);
}
.footerblock {
  width: 100%;
  height: 800rpx;
  padding: 40rpx;
  box-sizing: border-box;
  position: relative;
}
.switch-btn {
  width: 100%;
  height: 150rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.buyway {
  width: 440rpx;
  height: 70rpx;
  border: 1px solid #9ea3bb;
  border-radius: 100px;
  position: relative;
}
.gubuy {
  border-radius: 100px;
  height: 70rpx;
  width: 231rpx;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  /* z-index: 1; */
}
.Ubuy {
  border-radius: 100px;
  height: 70rpx;
  width: 231rpx;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
}
.select {
  color: #ffffff;
  background-color: rgba(0, 155, 249, 1);
}
.unselect {
  color: rgba(136, 141, 167, 1);
}
.fener {
  width: 100%;
  /* height: 100rpx; */
  display: flex;
  font-size: 30rpx;
}
.fener-left {
  flex: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 20rpx;
  color: #2e334e;
}
.fener-middle {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fener-right {
  flex: 3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: rgba(158, 163, 187, 1);
  word-wrap: break-word;
  word-break: break-all;
}
.upimg {
  width: 100%;
  height: 300rpx;
  background-color: #ffffff;
}
.btn {
	width: 80%;
    height: 80rpx;
    position: fixed;
    left: 10%;
    bottom: 100rpx;
    background-color: rgb(47, 172, 255);
    border-radius: 100rpx;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36rpx;
    z-index: 50;
}
</style>
<style lang="scss" scoped>
/deep/ .file-title {
  font-size: 30rpx;
  color: #2e334e;
}
/deep/ .file-count {
  color: rgba(158, 163, 187, 1);
  font-size: 26rpx;
}
/deep/ .text {
  font-size: 28rpx;
}
/deep/ .new-style {
  color: rgb(47, 172, 255);
}
</style>
