import { basePath } from "@/http/config.js";
const platform = uni.getSystemInfoSync().platform;
export default {
  // 发起ajax请求获取服务端版本号
  getServerNo: (version, isPrompt = false, callback) => {
    let httpData = {
      version: version.versionCode,
      // 版本名称
      versionName: version.versionName,
      // setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
      setupPage: isPrompt,
    };
    if (platform === "android") {
      httpData.type = 0;
    } else {
      httpData.type = 1;
    }
    /* 接口入参说明
     * version: 应用当前版本号（已自动获取）
     * versionName: 应用当前版本名称（已自动获取）
     * type：平台（0是安卓，1是IOS）
     */
    uni.request({
      url: basePath + "/base1/get_version_info/" + httpData.type,
      method: "GET",
      success: (res) => {
        console.log("成功获取更新接口", res);
        // console.log("成功获取更新接口", res);
        /* 原res的数据说明
         * | 参数名称      |       一定返回     | 类型       | 描述
         * | -------------|------------------- | --------- | ------------- |
         * | versionCode  | y                  | int       | 版本号        |
         * | versionName  | y                  | String    | 版本名称      |
         * | versionInfo  | y                  | String    | 版本信息      |
         * | updateType   | n，这个改为前端写死 | String    | forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
         * | downloadUrl  | y                  | String    | 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
         */

        res.versionCode = res.data.data.VersionCode;
        res.versionName = res.data.data.VersionName;
        res.updateType = "solicit";

        // 获取当前语言
        let nowLanguage = uni.getLocale();
        /* Notes1是简体，Notes2是繁体，以此类推 */
        // 繁体
        if (nowLanguage == "zh-Hant") {
          res.versionInfo = res.data.data.Notes2;
        }
        // 简体
        if (nowLanguage == "zh-Hans") {
          res.versionInfo = res.data.data.Notes1;
        }

        // 如果当前安装的版本>=接口返回的版本,不进行安装包的下载
        if (parseInt(httpData.version) >= parseInt(res.versionCode)) {
          console.log(parseInt(httpData.version));
          console.log(parseInt(res.versionCode));
          console.log("不需要更新");
          return;
        }
        // 如果当前安装的版本<接口返回的版本,进行安装包的下载
        if (parseInt(httpData.version) < parseInt(res.versionCode)) {
          console.log("需要更新");
          // 如果Patch为空,说明没有wgt安装包
          if (res.data.data.Patch == "") {
            // 取apk安装链接
            res.downloadUrl = res.data.data.Url;
          }
          // 如果Patch不为空,说明有wgt安装包
          if (res.data.data.Patch != "") {
            let nowBase = httpData.version.slice(0, 2);
            let updateBase = res.versionCode.slice(0, 2);
            // 对比当前基座版本名称(取前两位)
            // 确保基座大版本一致
            if (nowBase === updateBase) {
              // 取wgt安装链接
              res.downloadUrl = res.data.data.Patch;
            } else {
              // 取apk安装链接
              res.downloadUrl = res.data.data.Url;
            }
          }
          // console.log(res.downloadUrl);
          callback && callback(res);
        }
      },
      fail: (res) => {
        console.log("获取更新接口失败", res);
      },
    });
  },
  // 弹窗主颜色（不填默认粉色）
  appUpdateColor: "009Bf9",
  // 弹窗图标（不填显示默认图标，链接配置示例如： '/static/demo/ic_attention.png'）
  appUpdateIcon: "/static/images/updateDialog.png",
};
