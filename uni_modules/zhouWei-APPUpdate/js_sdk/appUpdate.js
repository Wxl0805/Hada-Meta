// #ifdef APP-PLUS
import componentConfig from "@/utils/componentConfig";

// 纯js国际化
import { initVueI18n } from "@dcloudio/uni-i18n";
import messages from "@/locale/index.js";
const { t } = initVueI18n(messages);

const platform = uni.getSystemInfoSync().platform;
// 主颜色
const $mainColor = componentConfig.appUpdateColor ? componentConfig.appUpdateColor : "FF5B78";
// 弹窗图标url
const $iconUrl = componentConfig.appUpdateIcon ? componentConfig.appUpdateIcon : "/uni_modules/zhouWei-APPUpdate/static/ic_ar.png";

// 获取当前应用的版本号
export const getCurrentNo = function (callback) {
  // 获取本地应用资源版本号
  plus.runtime.getProperty(plus.runtime.appid, function (inf) {
    callback &&
      callback({
        versionCode: inf.versionCode,
        versionName: inf.version,
      });
  });
};
// 从服务器下载应用资源包（wgt文件）
const getDownload = function (data) {
  let dtask;
  if (data.updateType == "forcibly" || data.updateType == "solicit") {
    let popupData = {
      progress: true,
      buttonNum: 2,
    };
    if (data.updateType == "solicit") {
      popupData.buttonNum = 0;
    }
    let lastProgressValue = 0;
    let popupObj = downloadPopup(popupData);
    dtask = plus.downloader.createDownload(
      data.downloadUrl,
      {
        filename: "_doc/update/",
      },
      function (download, status) {
        if (status == 200) {
          popupObj.change({
            progressValue: 100,
            // progressTip: "正在安装文件...",
            progressTip: t("app.install"),
            progress: true,
            buttonNum: 0,
          });
          plus.runtime.install(
            download.filename,
            {},
            function () {
              popupObj.change({
                // contentText: "应用资源更新完成！",
                progressTip: t("app.update-success"),
                buttonNum: 0,
                progress: false,
              });
              // 重启APP
              popupObj.reboot();
            },
            function (e) {
              popupObj.cancel();
              // plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
              plus.nativeUI.alert(t("app.install-fail") + e.code + "]：" + e.message);
            }
          );
        } else {
          popupObj.change({
            // contentText: "文件下载失败...",
            progressTip: t("app.download-fail"),
            buttonNum: 0,
            progress: false,
          });
        }
      }
    );
    dtask.start();
    dtask.addEventListener("statechanged", function (task, status) {
      switch (task.state) {
        case 1: // 开始
          popupObj.change({
            progressValue: 0,
            // progressTip: "准备下载...",
            progressTip: t("app.ready-to-download"),
            progress: true,
          });
          break;
        case 2: // 已连接到服务器
          popupObj.change({
            progressValue: 0,
            // progressTip: "开始下载...",
            progressTip: t("app.download-start"),
            progress: true,
          });
          break;
        case 3:
          // 进度条百分比
          const progressPercentage = parseInt((task.downloadedSize / task.totalSize) * 100);
          // 已下载
          const progress = parseFloat(task.downloadedSize / 1024 / 1024).toFixed(2) + "MB";
          // 总共
          const totalProgress = parseFloat(task.totalSize / 1024 / 1024).toFixed(2) + "MB";

          lastProgressValue = progressPercentage;
          popupObj.change({
            progressValue: progressPercentage,
            // progressTip: "已下载" + progress + "%",蓝色文字部分
            progressTip: progress + "/" + totalProgress,
            // 灰色总大小部分
            progressTipTotal: "/" + totalProgress,
            progress: true,
          });

          break;
      }
    });

    // 重启APP
    popupObj.reboot = function () {
      plus.runtime.restart();
    };
  }
};
// 文字换行
function drawtext(text, maxWidth) {
  let textArr = text.split("");
  let len = textArr.length;
  // 上个节点
  let previousNode = 0;
  // 记录节点宽度
  let nodeWidth = 0;
  // 文本换行数组
  let rowText = [];
  // 如果是字母，侧保存长度
  let letterWidth = 0;
  // 汉字宽度
  let chineseWidth = 14;
  // otherFont宽度
  let otherWidth = 7;
  for (let i = 0; i < len; i++) {
    if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
      if (letterWidth > 0) {
        if (nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth) {
          rowText.push({
            type: "text",
            content: text.substring(previousNode, i),
          });
          previousNode = i;
          nodeWidth = chineseWidth;
          letterWidth = 0;
        } else {
          nodeWidth += chineseWidth + letterWidth * otherWidth;
          letterWidth = 0;
        }
      } else {
        if (nodeWidth + chineseWidth > maxWidth) {
          rowText.push({
            type: "text",
            content: text.substring(previousNode, i),
          });
          previousNode = i;
          nodeWidth = chineseWidth;
        } else {
          nodeWidth += chineseWidth;
        }
      }
    } else {
      if (/\n/g.test(textArr[i])) {
        rowText.push({
          type: "break",
          content: text.substring(previousNode, i),
        });
        previousNode = i + 1;
        nodeWidth = 0;
        letterWidth = 0;
      } else if (textArr[i] == "\\" && textArr[i + 1] == "n") {
        rowText.push({
          type: "break",
          content: text.substring(previousNode, i),
        });
        previousNode = i + 2;
        nodeWidth = 0;
        letterWidth = 0;
      } else if (/[a-zA-Z0-9]/g.test(textArr[i])) {
        letterWidth += 1;
        if (nodeWidth + letterWidth * otherWidth > maxWidth) {
          rowText.push({
            type: "text",
            content: text.substring(previousNode, i + 1 - letterWidth),
          });
          previousNode = i + 1 - letterWidth;
          nodeWidth = letterWidth * otherWidth;
          letterWidth = 0;
        }
      } else {
        if (nodeWidth + otherWidth > maxWidth) {
          rowText.push({
            type: "text",
            content: text.substring(previousNode, i),
          });
          previousNode = i;
          nodeWidth = otherWidth;
        } else {
          nodeWidth += otherWidth;
        }
      }
    }
  }
  if (previousNode < len) {
    rowText.push({
      type: "text",
      content: text.substring(previousNode, len),
    });
  }
  return rowText;
}

// 大弹窗容器高度
let popupViewHeight = 348;
// 大弹窗容器的Padding
const viewContentPadding = 20;
// 大弹窗容器内部的内容距离左侧的位置
const viewContentLeft = 29;
// 大弹窗容器宽度
const popupViewWidth = 320;

// 是否更新弹窗
function updatePopup(data, callback) {
  // 弹窗遮罩层
  let maskLayer = new plus.nativeObj.View("maskLayer", {
    //先创建遮罩层
    top: "0px",
    left: "0px",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  });

  // 以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
  const screenWidth = plus.screen.resolutionWidth;
  const screenHeight = plus.screen.resolutionHeight;

  // 弹窗容器的Padding
  // const viewContentPadding = 20;
  // 弹窗容器的宽度
  const viewContentWidth = parseInt(popupViewWidth - viewContentPadding * 2);
  // 描述的列表
  const descriptionList = drawtext(data.versionInfo, viewContentWidth);
  // 弹窗容器高度
  // let popupViewHeight = 348;
  popupViewHeight = 348;

  let popupViewContentList = [
    {
      src: $iconUrl,
      id: "logo",
      tag: "img",
      position: {
        top: "0px",
        left: "auto",
        width: "320px",
        height: "348px",
      },
    },
    // 发现新版本
    {
      tag: "font",
      id: "title",
      // text: "发现新版本",
      text: t("app.title"),
      textStyles: {
        size: "21px",
        color: "#2E334E",
        weight: "normal",
        whiteSpace: "normal",
        align: "left",
      },
      position: {
        top: "70px",
        left: viewContentLeft + "px",
        width: "210px",
        height: "30px",
      },
    },
    // 版本底下那个黄色底色
    {
      tag: "rect", //绘制底边按钮
      rectStyles: {
        radius: "20px",
        color: "#FF9528",
      },
      position: {
        top: "110px",
        left: viewContentLeft + "px",
        width: "65px",
        height: "20px",
      },
    },
    // 版本名称
    {
      tag: "font",
      text: "V" + data.versionName,
      textStyles: {
        size: "12px",
        color: "#FFFFFF",
        weight: "normal",
        whiteSpace: "normal",
        align: "left",
      },
      position: {
        top: "112px",
        left: "41px",
        width: "50px",
        height: "20px",
      },
    },
    // 更新内容：
    {
      tag: "font",
      // text: "更新内容：",
      text: t("app.upload-title"),
      textStyles: {
        size: "14px",
        color: "#9EA3BB",
        weight: "normal",
        whiteSpace: "normal",
        align: "left",
      },
      position: {
        top: "160px",
        left: viewContentLeft + "px",
        width: "70px",
        height: "20px",
      },
    },
  ];
  const textHeight = 18;
  let contentTop = 190;
  descriptionList.forEach((item, index) => {
    if (index > 0) {
      popupViewHeight += textHeight;
      contentTop += textHeight;
    }
    popupViewContentList.push({
      tag: "font",
      id: "content" + index + 1,
      text: item.content,
      textStyles: {
        size: "14px",
        color: "#2E334E",
        // lineSpacing: "20%",
        align: "left",
      },
      position: {
        top: contentTop + "px",
        left: viewContentLeft + "px",
        width: viewContentWidth + "px",
        height: textHeight + "px",
      },
    });
    if (item.type == "break") {
      contentTop += 10;
      popupViewHeight += 10;
    }
  });

  // 弹窗内容
  let popupView = new plus.nativeObj.View("popupView", {
    //创建底部图标菜单
    tag: "rect",
    top: (screenHeight - popupViewHeight) / 2 + "px",
    // (屏幕宽度-弹窗宽度)/2
    left: (screenWidth - popupViewWidth) / 2 + "px",
    height: "348px",
    // 320px
    width: popupViewWidth + "px",
    position: "absolute",
    // backgroundColor:"#ffff00"
  });

  // 更新按钮
  let updateBtn = new plus.nativeObj.View(
    "updateBtn",
    {
      top: (screenHeight - popupViewHeight) / 2 + 280 + "px",
      height: "45px",
      width: "100%",
      // backgroundColor:'red'
    },
    [
      {
        tag: "rect",
        id: "confirmBox1",
        rectStyles: {
          radius: "50px",
          color: "#009BF9",
        },
        position: {
          left: "auto",
          height: "45px",
          width: "288px",
        },
      },
      {
        tag: "font",
        id: "confirmText1",
        // text: "立即升级",
        text: t("app.button"),
        textStyles: {
          size: "16px",
          color: "#FFFFFF",
          lineSpacing: "0%",
          whiteSpace: "normal",
        },
        position: {
          left: "auto",
          height: "45px",
          width: "288px",
        },
      },
    ]
  );
  // 绘制弹窗
  popupView.draw(popupViewContentList);

  // 立即升级按钮被点击事件
  updateBtn.addEventListener("click", function (e) {
    console.log("立即升级按钮被点击");
    // 立即升级
    callback && callback();
  });
  // 显示弹窗
  maskLayer.show();
  popupView.show();
  // 绘制更新按钮
  updateBtn.show();
}

// 进度条宽
const progressBarWidth = 275;
// 进度条高
const progressBarHeight = 8;
// 进度条top
const progressBarTop = 40;
// 进度条left = (大弹窗宽度 - 进度条宽 ) / 2
const progressBarLeft = (popupViewWidth - 275) / 2;

// 文件下载的弹窗绘图
function downloadPopupDrawing(data) {
  // 以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
  const screenWidth = plus.screen.resolutionWidth;
  const screenHeight = plus.screen.resolutionHeight;
  // // 弹窗容器的Padding
  // const viewContentPadding = 20;

  // 进度条弹窗容器的宽度
  const viewContentWidth = 275;

  // 弹窗容器高度
  let popupViewHeight = 30; // -------------------------------------修改进度条弹窗高度
  // let progressTip = data.progressTip || "准备下载...";
  let progressTip = data.progressTip || t("app.ready-to-download");
  let elementList = [
    {
      tag: "rect", //背景色
      color: "#FFFFFF",
      position: {
        // 320px
        width: popupViewWidth + "px",
      },
    },
  ];
  // 是否有进度条
  if (data.progress) {
    // popupViewHeight += viewContentPadding + 40;
    // -------------------------------------------------------------------------------------------进度条未开始下载时
    elementList = elementList.concat([
      {
        tag: "font",
        id: "progressValue",
        text: progressTip,
        textStyles: {
          align: "right",
          size: "14px",
          color: $mainColor,
          whiteSpace: "normal",
        },
        position: {
          top: "10px",
          right: "0px",
          height: "30px",
        },
      },
      {
        tag: "rect", //绘制进度条背景
        id: "progressBg",
        color: "#f1f1f1",
        rectStyles: {
          radius: "4px",
        },
        position: {
          top: progressBarTop + "px",
          left: progressBarLeft + "px",
          width: progressBarWidth + "px",
          height: progressBarHeight + "px",
        },
      },
    ]);
  }
  return {
    // popupViewHeight: popupViewHeight,
    popupViewWidth: popupViewWidth,
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    viewContentWidth: viewContentWidth,
    viewContentPadding: viewContentPadding,
    elementList: elementList,
  };
}
// 文件下载的弹窗
function downloadPopup(data) {
  // 弹窗遮罩层
  let maskLayer = new plus.nativeObj.View("maskLayer", {
    //先创建遮罩层
    top: "0px",
    left: "0px",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  });
  let popupViewData = downloadPopupDrawing(data);
  // 弹窗内容
  let popupView = new plus.nativeObj.View("popupView", {
    //创建底部图标菜单
    tag: "rect",
    // “立即更新”按钮top - 10
    // 与立即升级按钮保持top一致,- 10是为了还原UI
    top: (popupViewData.screenHeight - popupViewHeight) / 2 + 280 - 10 + "px",
    // (屏幕宽度-弹窗宽度)/2
    left: (popupViewData.screenWidth - popupViewWidth) / 2 + "px",
    height: "60px",
    width: "320px",
    backgroundColor: "green",
  });
  let progressValue = 0;
  let progressTip = 0;
  let contentText = 0;
  let buttonNum = 2;
  if (data.buttonNum >= 0) {
    buttonNum = data.buttonNum;
  }
  popupView.draw(popupViewData.elementList);
  let callbackData = {
    change: function (res) {
      let progressElement = [];
      if (res.progressValue) {
        progressValue = res.progressValue;
        // 绘制进度条
        // ----------------------------------------------------------------------------进度条正在下载时,蓝色进度条部分
        progressElement.push({
          tag: "rect", //绘制进度条背景
          id: "progressValueBg",
          rectStyles: {
            radius: "4px",
            color: $mainColor,
          },
          position: {
            top: progressBarTop + "px",
            left: progressBarLeft + "px",
            width: popupViewData.viewContentWidth * (res.progressValue / 100) + "px",
            height: progressBarHeight + "px",
          },
        });
      }
      if (res.progressTip) {
        progressTip = res.progressTip;
        // ----------------------------------------------------------------------------进度条正在下载时,蓝色文字部分
        progressElement.push({
          tag: "font",
          id: "progressValue",
          text: res.progressTip,
          textStyles: {
            align: "right",
            size: "14px",
            color: $mainColor,
            whiteSpace: "normal",
          },
          position: {
            top: "10px",
            right: "-12px",
            height: "30px",
          },
        });
        // ----------------------------------------------------------------------------进度条正在下载时,灰色总大小文字部分
        progressElement.push({
          tag: "font",
          id: "progressValueTotal",
          text: res.progressTipTotal,
          textStyles: {
            align: "right",
            size: "14px",
            color: "#888DA7",
            whiteSpace: "normal",
          },
          position: {
            top: "10px",
            right: "-12px",
            height: "30px",
          },
        });
      }
      // 重绘更改后的进度条
      popupView.draw(progressElement);
    },
    cancel: function () {
      maskLayer.hide();
      popupView.hide();
    },
  };
  popupView.show();
  // 改变进度条
  return callbackData;
}
export default function (isPrompt = false) {
  getCurrentNo((versionInfo) => {
    componentConfig.getServerNo(versionInfo, isPrompt, (res) => {
      if (res.updateType == "forcibly" || res.updateType == "silent") {
        if (/\.solicit$/i.test(res.downloadUrl)) {
          getDownload(res);
        } else if (/\.html$/i.test(res.downloadUrl)) {
          plus.runtime.openURL(res.downloadUrl);
        } else {
          if (platform == "android") {
            getDownload(res);
          } else {
            plus.runtime.openURL(res.downloadUrl);
          }
        }
      } else if (res.updateType == "solicit") {
        updatePopup(res, function () {
          if (/\.wgt$/i.test(res.downloadUrl)) {
            getDownload(res);
          } else if (/\.html$/i.test(res.downloadUrl)) {
            plus.runtime.openURL(res.downloadUrl);
          } else {
            if (platform == "android") {
              getDownload(res);
            } else {
              plus.runtime.openURL(res.downloadUrl);
            }
          }
        });
      }
    });
  });
}
// #endif
