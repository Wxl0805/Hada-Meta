<template>
  <view class="page flex-col justify-between">
    <view class="main1 flex-col">
      <view class="mod8 flex-row"> </view>
    </view>
    <view class="main2 flex-col">
      <view class="block2 flex-col">
        <view class="login-block" v-if="isface">
          <!-- 输入手机号 -->
          <view class="mod1 flex-col flex-row" v-if="telshow">
            <view class="left">
              <view class="area-code" @click="gotoPickcode">
                <span>+</span><span>{{ zone }}</span>
                <view class="area-icon"></view>
              </view>
            </view>
            <view class="tel-input">
              <uni-easyinput :inputBorder="false" v-model="tel" :placeholder="$t('VerificationLogin.tel-placeholder')"></uni-easyinput>
            </view>
          </view>

          <!-- 输入邮箱 -->
          <view class="mod1 flex-col flex-row" v-if="emailshow">
            <view class="email-all">
              <view class="email-left">
                <span>Email</span>
              </view>
              <image class="icon1" referrerpolicy="no-referrer" src="@/static/images/login/shugang.png" />
              <view class="email-input">
                <uni-easyinput :inputBorder="false" v-model="email" :placeholder="$t('VerificationLogin.email-placeholder')"></uni-easyinput>
              </view>
            </view>
          </view>

          <!-- 输入验证码 -->
          <view class="mod3 flex-col" v-if="inputvali">
            <!-- 邮箱验证码 -->
            <view class="vali-block" v-if="emailshow">
              <view class="telvalicode">
                <uni-easyinput :inputBorder="false" v-model="emailvalicode" :placeholder="$t('VerificationLogin.vericode-placeholder')"></uni-easyinput>
              </view>
              <image class="icon1" referrerpolicy="no-referrer" src="@/static/images/login/shugang.png" />
              <view class="send-code">
                <button class="send" :disabled="forbiddenemail" @click="sendvalidateemail">{{ validatecodeemail }}</button>
              </view>
            </view>

            <!-- 手机验证码 -->
            <view class="vali-block" v-if="telshow">
              <view class="telvalicode">
                <uni-easyinput :inputBorder="false" v-model="telvalicode" :placeholder="$t('VerificationLogin.vericode-placeholder')"></uni-easyinput>
              </view>
              <image class="icon1" referrerpolicy="no-referrer" src="@/static/images/login/shugang.png" />
              <view class="send-code">
                <button class="send" :disabled="forbiddentel" @click="sendvalidatetel">{{ validatecodetel }}</button>
              </view>
            </view>
          </view>

          <!-- 输入密码 -->
          <view class="mod3 flex-col" v-if="inputpassword">
            <view class="password">
              <uni-easyinput type="password" :inputBorder="false" v-model="password" :placeholder="$t('VerificationLogin.password-placeholder')"></uni-easyinput>
            </view>
          </view>

          <view class="main15 flex-row justify-between">
            <text class="word2" @click="switchemail" v-if="telshow">{{ $t("VerificationLogin.email-login") }}</text>
            <text class="word2" @click="switchtel" v-if="emailshow">{{ $t("VerificationLogin.tel-login") }}</text>
            <text class="word3" @click="signin">{{ $t("VerificationLogin.sign-out") }}</text>
          </view>

          <button class="mod5 flex-col" @click="submit">
            <text class="info4">{{ $t("VerificationLogin.sign-in") }}</text>
          </button>

          <view class="regular">
            <checkbox-group @change="agreeReg" style="display: flex; flex-direction: row; font-size: 25rpx;">
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
        </view>

        <view class="face-login" v-else>
          <view class="face-logo" @click="facevali">
            <view class="faceLogo"></view>
            <view class="face-text">{{ $t("VerificationLogin.faceid") }}</view>
          </view>
        </view>

        <view class="main16 flex-row">
          <view class="layer3 flex-col"></view>
          <text class="info5">{{ $t("VerificationLogin.otherway-login") }}</text>
          <view class="layer4 flex-col"></view>
        </view>
        <view class="main17 flex-row justify-between">
          <view class="ImageText17 flex-col justify-between" @click="telegram" v-if="false">
            <view class="box1 flex-col"></view>
            <view class="TextGroup17 flex-col">
              <text class="info6">Telegram</text>
            </view>
          </view>

          <!-- 显示密码登录 -->
          <view class="ImageText18 flex-col justify-between" @click="switchvali" v-if="showpassword">
            <view class="main5 flex-col"></view>
            <view class="TextGroup18 flex-col">
              <text class="txt3">{{ $t("VerificationLogin.password-login") }}</text>
            </view>
          </view>

          <!-- 显示验证码登录 -->
          <view class="ImageText3 flex-col justify-between" @click="switchpassword" v-if="showvali">
            <view class="valiimg flex-col"> </view>
            <view class="TextGroup3 flex-col">
              <text class="word7">{{ $t("VerificationLogin.veri-login") }}</text>
            </view>
          </view>

          <view class="ImageText19 flex-col justify-between" @click="facelogin" v-if="false">
            <view class="outer5 flex-col"></view>
            <view class="TextGroup19 flex-col">
              <text class="word4">{{ $t("VerificationLogin.face-login") }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="mod9 flex-col"><view class="section1 flex-col"></view></view>

    <uni-popup ref="agreepop" type="dialog">
      <uni-popup-dialog type="warn" :cancelText="close" :confirmText="confirm" :title="info" :content="cont" @confirm="confirm_login"></uni-popup-dialog>
    </uni-popup>

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
  // import OCR from '@/js_sdk/leiqch-baiduOCR/BaiDu-OCR/BaiDu-OCR.js';
  // import images from '@/static/images/login/logo.png'
  // 获取 module
  // const faceDetectSdk = uni.requireNativePlugin('baidu-face-detect-plugin');
  // const modal = uni.requireNativePlugin('modal');

  // APP升级相关内容
  // #ifdef APP-PLUS
  import APPUpdate, { getCurrentNo } from "@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate";
  // #endif
  export default {
    components: {
      auiDialog,
    },
    data() {
      return {
        constants: {},
        telshow: false,
        emailshow: true,
        tel: "",
        email: "",
        password: "",
        emailvalicode: "",
        telvalicode: "",
        showpassword: false,
        showvali: true,
        inputvali: false,
        inputpassword: true,
        zone: "86",
        validatecodeemail: this.$t("common.sendcode"),
        validatecodetel: this.$t("common.sendcode"),

        forbiddenemail: false,
        forbiddentel: false,

        styles: false,
        isface: true,
        agree: "agree",
        agreeregular: false,
        check: false,
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
        // 记录触发了几次需要更新APP
        appUpdate: 0,
        // 用于判断是哪个系统
        system: 0,
      };
    },
    methods: {
      // 暂无账号，立即注册
      signin() {
        uni.navigateTo({
          url: "/pages/index/SignIn",
          success(res) {},
          fail(res) {},
        });
        // this.$router.push('/pages/index/SignIn')
      },
      emailLogin() {
        if (this.email == "") {
          uni.showToast({
            icon: "none",
            title: this.$t("common.emailnull"),
          });
          return;
        }
        uni.showLoading({
          mask: true,
          title: this.$t("common.loading"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/customer_login_bypwd?pwd=" + this.password + "&value=" + this.email + "&types=email&operatingSystem=" + this.system,
          method: "GET",
          data: {},
          timeout: 3000,
          dataType: "json",
          success: (res) => {
            console.log(res);
            if (res.data.code == 0) {
              uni.setStorageSync("token", res.data.data.token);
              uni.setStorageSync("user", res.data.data.user);
              uni.setStorageSync("email", this.email);
              uni.setStorageSync("password", this.password);
              // #ifdef APP-PLUS
              this.checkLoginMachine(res.data.data.token);
              // #endif
              uni.switchTab({
                url: "/pages/home/index",
                success(res) {},
                fail(res) {},
              });
            } else {
              if (res.data.code == 7) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.email-password-bucunzai"),
                });
                return;
              }
              if (res.data.code == 4) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.beizhuxiao"),
                });
                return;
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
            }
          },
          complete: () => {
            uni.hideLoading();
          },
          fail: (e) => {
            uni.showToast({
              icon: "none",
              title: this.$t("common.error-login"),
            });
          },
        });
      },
      phoneLogin() {
        if (this.tel == "") {
          uni.showToast({
            icon: "none",
            title: this.$t("common.telnull"),
          });
          return;
        }
        uni.showLoading({
          mask: true,
          title: this.$t("common.loading"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/customer_login_bypwd?pwd=" + this.password + "&value=" + this.tel + "&types=telephone&operatingSystem=" + this.system,
          method: "GET",
          data: {},
          dataType: "json",
          timeout: 3000,
          success: (res) => {
            console.log(res);
            if (res.data.code == 0) {
              uni.setStorageSync("token", res.data.data.token);
              uni.setStorageSync("user", res.data.data.user);
              uni.setStorageSync("tel", this.tel);
              uni.setStorageSync("password", this.password);
              // #ifdef APP-PLUS
              this.checkLoginMachine(res.data.data.token);
              // #endif
              uni.switchTab({
                url: "/pages/home/index",
                success(res) {},
                fail(res) {},
              });
            } else {
              if (res.data.code == 7) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.tel-password-bucunzai"),
                });
                return;
              }
              if (res.data.code == 4) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.beizhuxiao"),
                });
                return;
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
            }
          },
          complete: () => {
            uni.hideLoading();
          },
          fail: () => {
            uni.showToast({
              icon: "none",
              title: this.$t("common.error-login"),
            });
          },
        });
      },
      emailverilogin() {
        if (this.email == "") {
          uni.showToast({
            icon: "none",
            title: this.$t("common.emailnull"),
          });
          return;
        }
        uni.showLoading({
          mask: true,
          title: this.$t("common.loading"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/customer_login_bycode?types=email&value=" + this.email + "&code=" + this.emailvalicode + "&operatingSystem=" + this.system,
          method: "GET",
          data: {},
          timeout: 3000,
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              uni.setStorageSync("token", res.data.data.token);
              uni.setStorageSync("user", res.data.data.user);
              uni.setStorageSync("username", this.email);
              // #ifdef APP-PLUS
              this.checkLoginMachine(res.data.data.token);
              // #endif
              uni.switchTab({
                url: "/pages/home/index",
                success(res) {},
                fail(res) {},
              });
            } else {
              if (res.data.code == 7) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.email-code-bucunzai"),
                });
                return;
              }
              if (res.data.code == 4) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.beizhuxiao"),
                });
                return;
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
            }
          },
          complete: () => {
            uni.hideLoading();
          },
          fail: (e) => {
            uni.showToast({
              icon: "none",
              title: this.$t("common.error-login"),
            });
          },
        });
      },
      telverilogin() {
        if (this.tel == "") {
          uni.showToast({
            icon: "none",
            title: this.$t("common.telnull"),
          });
          return;
        }
        uni.showLoading({
          mask: true,
          title: this.$t("common.loading"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/customer_login_bycode?types=telephone&value=" + this.tel + "&code=" + this.telvalicode + "&operatingSystem=" + this.system,
          method: "GET",
          data: {},
          timeout: 3000,
          dataType: "json",
          success: (res) => {
            if (res.data.code == 0) {
              uni.setStorageSync("token", res.data.data.token);
              uni.setStorageSync("user", res.data.data.user);
              uni.setStorageSync("username", this.tel);
              // #ifdef APP-PLUS
              this.checkLoginMachine(res.data.data.token);
              // #endif
              uni.switchTab({
                url: "/pages/home/index",
                success(res) {},
                fail(res) {},
              });
            } else {
              if (res.data.code == 7) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.tel-code-bucunzai"),
                });
                return;
              }
              if (res.data.code == 4) {
                uni.showToast({
                  icon: "none",
                  title: this.$t("common.beizhuxiao"),
                });
                return;
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
            }
          },
          complete: () => {
            uni.hideLoading();
          },
          fail: (e) => {
            uni.showToast({
              icon: "none",
              title: this.$t("common.error-login"),
            });
          },
        });
      },
      onchange() {},
      // 确定
      confirm_login() {
        this.agreeregular = true;
      },
      // 登录
      submit() {
        if (this.agreeregular == false) {
          this.$refs.agreepop.open();
          return;
        }
        if (this.emailshow == true) {
          if (this.inputvali == true) {
            this.emailverilogin();
            return;
          }
          this.emailLogin();
        } else {
          if (this.inputvali == true) {
            this.telverilogin();
            return;
          }
          this.phoneLogin();
        }
      },
      switchemail() {
        this.telshow = false;
        this.emailshow = true;
      },
      switchtel() {
        this.telshow = true;
        this.emailshow = false;
      },
      switchvali() {
        this.isface = true;
        this.showpassword = false;
        this.showvali = true;
        this.inputvali = false;
        this.inputpassword = true;
      },
      switchpassword() {
        this.isface = true;
        this.showpassword = true;
        this.showvali = false;
        this.inputvali = true;
        this.inputpassword = false;
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
      sendvalidateemail() {
        if (this.email == "") {
          uni.showToast({
            title: this.$t("common.emailnull"),
            icon: "none",
          });
          return;
        }
        let emailreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!emailreg.test(this.email)) {
          uni.showToast({
            title: this.$t("common.email-format-error"),
            icon: "none",
          });
          return;
        }

        uni.showLoading({
          mask: true,
          title: this.$t("common.send"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/sendlogincode?types=email&value=" + this.email + "&operatingSystem=" + this.system,
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
            if (res.data.msg == "用户不存在") {
              uni.showToast({
                title: this.$t("common.user-bucunzai"),
                icon: "none",
              });
              return;
            }
            this.styles = true;
            this.forbiddenemail = true;
            let num = 60;
            let run1 = setInterval(() => {
              this.validatecodeemail = num + this.$t("common.chongfa");
              num--;
              if (num == -1) {
                clearInterval(run1);
                this.validatecodeemail = this.$t("common.sendcode");
                this.styles = false;
                this.forbiddenemail = false;
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
          complete: () => {
            uni.hideLoading();
          },
        });
      },
      sendvalidatetel() {
        if (this.tel == "") {
          uni.showToast({
            title: this.$t("common.telnull"),
            icon: "none",
          });
          return;
        }
        // 中国大陆手机正则
        let telreg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        // 新加坡手机正则
        let telregSG = /^[89]\d{7}$/;
        // 美国手机正则
        let telregUS = /^(\(\d{3}\)[ .-]?|\d{3}[ .-]?)?\d{3}[ .-]?\d{4}$/;

        // if(this.zone == '86'){
        //		验证中国手机号是否正确
        // }else if(this.zone == '65'){
        //		验证新加坡手机号是否正确
        // }else if(this.zone == '1'){
        //		验证美国手机号是否正确
        // }

        // 验证中国手机号是否正确
        if (!telreg.test(this.tel)) {
          uni.showToast({
            title: this.$t("common.tel-format-error"),
            icon: "none",
          });
          return;
        }
        uni.showLoading({
          mask: true,
          title: this.$t("common.send"),
        });
        uni.request({
          header: {
            "Content-Type": "application/json",
            //version
            version: this.version,
          },
          url: this.host + "/base/sendlogincode?types=telephone&value=" + this.tel + "&operatingSystem=" + this.system,
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
            if (res.data.msg == "用户不存在") {
              uni.showToast({
                title: this.$t("common.tel-bucunzai"),
                icon: "none",
              });
              return;
            }
            this.styles = true;
            this.forbiddentel = true;
            let num = 60;
            let run2 = setInterval(() => {
              this.validatecodetel = num + this.$t("common.chongfa");
              num--;
              if (num == -1) {
                clearInterval(run2);
                this.validatecodetel = this.$t("common.sendcode");
                this.styles = false;
                this.forbiddentel = false;
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
      facelogin() {
        this.$refs.infodialog.show();
        // this.isface = false;
      },
      facevali() {
        this.checkRequestPermissions();
        this.initFace();
        // this.faceliveness()
        this.recycler();
        // this.setFaceConfig()
      },
      //检查权限(仅android使用)
      checkRequestPermissions() {
        const PPFace = uni.requireNativePlugin("PP-BaiduFaceV2");
        PPFace.checkRequestPermissions((res) => {
          //res.code //返回编码 200 为成功
          console.log(res.code);
        });
      },
      //初始化插件（请务必先执行一次，还原参数时也可调用）
      initFace() {
        const PPFace = uni.requireNativePlugin("PP-BaiduFaceV2");
        PPFace.init(
          {
            androidLicenseFileName: "idl-license.face-android",
            androidLicenseId: "hada-meta-face-android", //*需要修改 android百度申请到的liceenseid
            iosLicenseFileName: "idl-license.face-ios",
            iosLicenseId: "hada-meta-face-ios", //*需要修改 ios百度申请到的liceenseid
          },
          (res) => {
            //res.code //返回编码 200 为成功
            console.log(res.code);
          }
        );
        // 初始化错误码（主要关注local auth failed 后面的数字 ）：
        // 0    成功
        // 1    license未初始化
        // 2    license数据解密失败
        // 3    license数据格式错误
        // 4    license-key(api-key)校验错误
        // 5    算法ID校验错误
        // 6    MD5校验错误
        // 7    设备ID校验错误
        // 8    包名(应用名)校验错误
        // 9    过期时间不正确
        // 10   功能未授权
        // 11   授权已过期
        // 12   本地文件读取失败
        // 13   远程数据拉取失败
        // 14   本地时间校验错误
        // 0xff 其他错误
      },
      //活体识别+采集
      faceliveness() {
        const PPFace = uni.requireNativePlugin("PP-BaiduFaceV2");
        PPFace.faceliveness(
          {
            livenessList: ["Eye", "Mouth", "HeadUp", "HeadDown", "HeadLeft", "HeadRight"], //活体要求动作集合，可按需删减 注意：HeadLeftOrRight新版百度已经不支持
            isLivenessRandom: false, //是否开启动作随机 默认false
            isEnableSound: false, //是否开启语音播报 默认 true
          },
          (res) => {
            console.log(res.code);
            console.log("data:image/jpg;base64," + res.base64Image);
            //res.code //返回编码 200 为成功
            //res.base64Image //全景图像 可以加前缀 data:image/jpg;base64, 进行预览
            //res.base64ImageCrop //裁剪后图像（少量黑边，或者没有） 可以加前缀 data:image/jpg;base64, 进行预览
          }
        );
      },
      //人脸采集
      recycler() {
        const PPFace = uni.requireNativePlugin("PP-BaiduFaceV2");
        PPFace.recycler(
          {
            isEnableSound: false, //是否开启语音播报 默认 true
          },
          (res) => {
            console.log(res.code);
            console.log("data:image/jpg;base64," + res.base64Image);
            // if()
            //res.code //返回编码 200 为成功
            //res.base64Image //全景图像 可以加前缀 data:image/jpg;base64, 进行预览
            //res.base64ImageCrop //裁剪后图像（少量黑边，或者没有） 可以加前缀 data:image/jpg;base64, 进行预览
          }
        );
      },
      //该方法主要针对一些识别参数以及皮肤进行修改，参数是官方默认的请尽量不要修改
      setFaceConfig() {
        const PPFace = uni.requireNativePlugin("PP-BaiduFaceV2");
        //该方法参数并非每次全部要写，按需设置即可，注：该方法设置的参数在init后将重置
        PPFace.setFaceConfig(
          {
            VALUE_MIN_FACE_SIZE: 200, //设置可检测的最小人脸阈值 VALUE_MIN_FACE_SIZE 默认 200
            VALUE_NOT_FACE_THRESHOLD: 0.6, // 设置可检测到人脸的阈值 VALUE_NOT_FACE_THRESHOLD 默认 0.6
            VALUE_BLURNESS: 0.3, // 设置模糊度阈值 VALUE_BLURNESS 默认 0.3
            VALUE_BRIGHTNESS: 82, // 设置光照阈值（范围0-255 仅android）VALUE_BRIGHTNESS 默认 82
            VALUE_OCCLUSION: 0.5, // 设置遮挡阈值 VALUE_OCCLUSION 默认 0.5
            VALUE_HEAD_PITCH: 8, // 设置人脸姿态角阈值 VALUE_HEAD_PITCH 默认 8
            VALUE_HEAD_YAW: 8, // 设置人脸姿态角阈值 VALUE_HEAD_YAW 默认 8
            VALUE_CLOSE_EYES: 0.7, // 设置闭眼阈值 VALUE_CLOSE_EYES 默认 0.7 ios无效
            VALUE_CACHE_IMAGE_NUM: 3, // 设置图片缓存数量 VALUE_CACHE_IMAGE_NUM 默认3
            VALUE_OPEN_MASK: true, // 设置口罩判断开关 VALUE_OPEN_MASK 默认 true
            VALUE_MASK_THRESHOLD: 0.7, // 设置口罩口罩阈值 VALUE_MASK_THRESHOLD 默认 0.7
            VALUE_SCALE: 1.0, // 原图缩放系数 VALUE_SCALE 默认 1.0
            VALUE_CROP_HEIGHT: 640, // 抠图高的设定，为了保证好的抠图效果，我们要求高宽比是4：3，所以会在内部进行计算，只需要传入高即可 VALUE_CROP_HEIGHT 默认640
            VALUE_CROP_ENLARGERATIO: 1.5, // 抠图人脸框与背景比例 VALUE_CROP_ENLARGERATIO 默认1.5
            VALUE_FAR_RATIO: 0.4, //  检测框远近比率 默认0.4 （v2.16新增参数）
            livenessList: ["Eye", "Mouth", "HeadUp", "HeadDown", "HeadLeft", "HeadRight"], //动作集合 livenessList 默认全部动作
            isLivenessRandom: false, // 设置动作活体是否随机 isLivenessRandom 默认 false
            isEnableSound: true, // 设置开启提示音 isEnableSound 默认 true
            hasBottomText: true, // 设置是否显示底部文字 默认 true
            bottomText: "— 修改了底部文字 —", // 设置底部文字内容 默认 "— 百度大脑技术支持 —"
            COLOR_BG: "#8CD790", // 背景颜色 默认 #FFFFFF
            COLOR_CIRCLE_LINE: "#77AF9C", //活体检测周围小竖线的颜色 默认 #CCCCCC
            COLOR_CIRCLE_SELECT_LINE: "#285943", //活体检测周围小竖线完成后的颜色 默认 #00BAF2
            topTextColor: "#383A3F", //顶部提示文字颜色 默认 #000000
            topSecondTextColor: "#566270", // //顶部第二行小字提示颜色 默认 #666666
            hasBottomImg: true, //是否显示底部图片 默认true（可通过替换res跟换图片）
          },
          (res) => {
            //res.code //返回编码 200 为成功
          }
        );
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
      telegram() {
        this.$refs.infodialog.show();
      },
      checkLoginMachine(token) {
        uni.request({
          header: {
            "Content-Type": "application/json",
            "x-token": token,
            //version
            version: this.version,
          },
          url: this.host + "/base/checkLoginMachine?operatingSystem=" + this.system,
          method: "POST",
          data: {
            CID: uni.getStorageSync("cid"),
            MachineNumber: uni.getStorageSync("deviceId"),
            MachineName: uni.getStorageSync("deviceBrand"),
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
            console.log(res);
          },
        });
      },
    },
    onBackPress() {
      return true;
    },
    onLoad(option) {
      // #ifdef APP-PLUS
      APPUpdate(true);
      // #endif

      if (option.email) {
        this.email = option.email;
        return;
      }
      if (option.tel) {
        this.telshow = true;
        this.emailshow = false;
        this.tel = option.tel;
        return;
      }
      if (uni.getStorageSync("email")) {
        this.email = uni.getStorageSync("email");
        this.password = uni.getStorageSync("password");
        return;
      }
      if (uni.getStorageSync("tel")) {
        this.telshow = true;
        this.emailshow = false;
        this.tel = uni.getStorageSync("tel");
        this.password = uni.getStorageSync("password");
        return;
      }

      // let currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
      // currentWebview.setStyle({ popGesture: 'none' })
    },
    onShow() {
      // #ifdef APP-PLUS
      // 判断是安卓还是ios
      const platform = uni.getSystemInfoSync().platform;
      if (platform == "android") {
        this.system = 0;
      } else {
        this.system = 1;
      }
      // #endif
    },
  };
</script>
<style lang="scss" scoped>
  @import "@/static/css/MainColor.less";
  // @font-face {
  // 	font-family: 'iconfont';
  // 	src: url('~@/static/common/font/iconfont.ttf') format('truetype');
  // }
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
  // /deep/ .is-checked .radio__inner {
  // 		 background: none !important;
  // }
  // /deep/ uni-checkbox .uni-checkbox-input{
  // 	border: 1px solid rgba(0, 155, 249, 1);
  // }
  // /deep/ uni-checkbox .uni-checkbox-input:focus{
  // 	border: 1px solid black;
  // }
  // /deep/ uni-checkbox .uni-checkbox-input:hover{
  // 	border-color: #d1d1d1;
  // }
</style>
<style scoped>
  @import "@/static/css/common.css";
  @import "@/static/css/index.rpx.css";
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
    font-weight: bold;
    line-height: 45rpx;
    display: inline-block;
  }
  .area-icon {
    width: 20rpx;
    height: 20rpx;
    background: url("@/static/images/login/login-img/phone.png") 100% no-repeat;
    background-size: 100% 100%;
    margin-top: 13rpx;
    margin-left: 10rpx;
    display: inline-block;
  }
  .tel-input {
    width: 422rpx;
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
    width: 1rpx;
    height: 22rpx;
    margin: 44rpx 10rpx 0 10rpx;
  }
  .send-code {
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
  .send {
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
    font-weight: bold;
    white-space: nowrap;
    line-height: 110rpx;
  }
  .email-input {
    width: 436rpx;
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
    background: url("@/static/images/login/login-img/vali.png") 100% no-repeat;
    background-size: 100% 100%;
    margin-left: 22rpx;
  }
  .word7 {
    width: 120rpx;
    height: 33rpx;
    color: rgba(136, 141, 167, 1);
    font-size: 24rpx;
    text-align: center;
    white-space: nowrap;
    line-height: 33rpx;
  }
  .TextGroup3 {
    height: 33rpx;
    margin-top: 6rpx;
    width: 120rpx;
    text-align: center;
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

  .face-login {
    width: 100%;
    height: 641rpx;
  }
  .face-logo {
    width: 236rpx;
    height: 236rpx;
    margin: 0 auto;
  }
  .faceLogo {
    width: 138rpx;
    height: 138rpx;
    margin: 0 auto;
    background: url("@/static/images/login/login-img/facelogin.png");
    background-size: 100% 100%;
  }
  .face-text {
    width: 212rpx;
    height: 42rpx;
    font-size: 30rpx;
    /* color: #009bf9; */
    color: var(--main-color);
    font-family: PingFangSC-Regular;
    margin: 54rpx auto 0 auto;
    text-align: center;
  }
  .regular {
    width: 100%;
    height: 100rpx;
    font-size: 20rpx;
    box-sizing: border-box;
    padding-top: 30rpx;
  }
  .bluetext {
    color: rgba(0, 155, 249, 1);
  }
</style>
