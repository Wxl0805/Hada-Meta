<template>
  <view class="content">
    <view class="textarea">
      <uni-easyinput :inputBorder="false" @input="input" :maxlength="200" type="textarea" v-model="value" :placeholder="$t('mine-option-input')"></uni-easyinput>
      <view class="righttext">
        <text>{{ value.length }}</text
        ><text class="maxlength">/200</text>
      </view>
    </view>

    <view class="photo">
      <helang-compress ref="helangCompress"></helang-compress>
      <uni-file-picker @delete="del" @select="select" :value="list" limit="3" :title="$t('mine-option-uploadimg')" returnType="array"></uni-file-picker>
    </view>

    <view class="button" :class="{ unselect: unselect, select: !unselect }">
      <button class="btn" @click="inmine">{{ $t("mine-option-tijiaofankui") }}</button>
    </view>
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
      value: "",
      unselect: true,
      list: [],
      fileList: [],
      num: 0,
      token: "",
      // 记录触发了几次需要更新APP
      appUpdate: 0,
    };
  },
  components: {
    helangCompress,
  },
  watch: {
    num(val) {
      if (val == 0 && this.value == "") {
        this.unselect = true;
        return;
      }
      this.unselect = false;
    },
  },
  onLoad() {
    this.token = uni.getStorageSync("token");
  },
  methods: {
    input(e) {
      if (e == "" && this.num == 0) {
        this.unselect = true;
      } else {
        this.unselect = false;
      }
    },
    async select(e) {
      uni.showLoading({ title: this.$t("common.image-yasuo"), mask: true });
      this.num++;

      // 调用上传方法
      this.$refs.helangCompress
        .compress({
          src: e.tempFiles[0].file.path,
          maxSize: 800,
          fileType: "jpg",
          quality: 0.85,
          minSize: 640,
        })
        .then((res) => {
          uni.hideLoading();
          uni.showToast({
            title: this.$t("common.image-yasuo-success"),
            icon: "success",
          });
          this.imgShow = res;
          let obj = new Object();
          obj.uri = res;
          uni.getFileInfo({
            filePath: this.imgShow,
            success: (res) => {
              obj.name = e.tempFiles[0].file.name;
              obj.size = res.size;
              this.fileList.push(obj);
              uni.hideLoading();
            },
            fail: () => reject(null),
          });
        });
    },
    del(e) {
      this.num--;
      this.fileList.pop();
    },
    callinterface() {
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

      uni.showLoading({
        mask: true,
        title: this.$t("common.loading-submit"),
      });
      uni.uploadFile({
        url: this.host + "/app/upfeedback",
        files: this.fileList,
        header: {
          "x-token": this.token,
          //version
          version: this.version,
        },
        formData: {
          text: this.value,
          // files: this.fileList
        },
        success: (res) => {
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
          if (JSON.stringify(res).includes("图片格式错误")) {
            uni.showToast({
              icon: "none",
              title: this.$t("add.code-imgerror"),
            });
            return;
          }
          uni.showToast({
            icon: "none",
            title: this.$t("common.submit-success"),
          });
          uni.switchTab({
            url: "/pages/mine/index",
          });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    uploadtext() {
      uni.showLoading({
        mask: true,
        title: this.$t("common.loading-submit"),
      });
      uni.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-token": this.token,
          //version
          version: this.version,
        },
        url: this.host + "/app/upfeedback",
        method: "POST",
        data: {
          text: this.value,
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
          uni.showToast({
            icon: "none",
            title: this.$t("common.submit-success"),
          });
          uni.switchTab({
            url: "/pages/mine/index",
          });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    inmine() {
      if (this.unselect == false) {
        if (this.value == "") {
          uni.showToast({
            icon: "none",
            title: this.$t("common.input-option"),
          });
        } else if (this.value != "" && this.num < 1) {
          this.uploadtext();
        } else {
          this.callinterface();
        }
      }
    },
  },
};
</script>

<style lang="less">
@import "@/static/css/common.css";
@import "@/static/css/MainColor.less";
.content {
  border-top: 1px solid #efefef;
  padding-top: 32rpx;
}
.textarea {
  background-color: rgba(243, 245, 247, 1);
  border-radius: 12px;
  height: 513rpx;
  width: 702rpx;
  margin: 0 0 0 24rpx;
  overflow: hidden;
  position: relative;
}
.righttext {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
}
.maxlength {
  color: rgba(158, 163, 187, 1);
  font-size: 26rpx;
  font-family: PingFangSC-Medium;
}
.photo {
  padding: 26rpx;
  color: rgba(46, 51, 78, 1);
  font-family: PingFangSC-Medium;
}

.button {
  position: relative;
  width: 80%;
  height: 100upx;
  left: 10%;
  margin-top: 100rpx;
  border-radius: 50rpx;
  overflow: hidden;
}
.btn {
  width: 100%;
  height: 100%;
  color: #ffffff;
}
.unselect {
  background-color: #e1e1e1;
}
.select {
  // background-color: #009bf9;
  background-color: @main-color;
}
/deep/ .new-style {
  display: none;
}
</style>
