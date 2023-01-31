<template> </template>
<script>
var barcode = null;
export default {
  data() {
    return {
      name: "", //要在扫码界面自定义的内容
      flash: false, //是否打开摄像头
      type: "",
      textscan: "扫码",
      typescan: "scan-listener",
    };
  },
  onLoad(d) {
    var n = d.text;
    this.type = d.type;
    // if (n) {
    // 	this.name = n;
    // }
    // #ifdef APP-PLUS
    // plus.navigator.setFullscreen(true); //全屏
	const currentWebview = this.$mp.page.$getAppWebview(); 
    this.createBarcode(currentWebview); //创建二维码窗口
    this.createView(currentWebview); //创建操作按钮及tips界面
    // #endif
  },

  methods: {
    // 扫码成功回调
    onmarked(type, result) {
      var text = "未知: ";
      switch (type) {
        case plus.barcode.QR:
          text = "QR: ";
          break;
        case plus.barcode.EAN13:
          text = "EAN13: ";
          break;
        case plus.barcode.EAN8:
          text = "EAN8: ";
          break;
      }
      plus.navigator.setFullscreen(false);

      //兄弟传参
      // this.$eventHub.$emit(this.type, {
      // 	result: result
      // });

      uni.$emit(this.type, {
        result: result,
      });
	  
	  let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
	  let nowPage = pages[pages.length - 1]; //当前页页面实例
	  let prevPage = pages[pages.length - 2]; //上一页页面实例
	  let object = {
	  	result: result,
	  };
	  prevPage.$vm.otherFun(object)// 給上一頁綁定方法otherFun,傳參object
	  
      // 跳转到扫码成功页面
      uni.navigateBack({
        // url: "/pages/news/AddAleoFinancial?from=scan&resultCode=" + result,
      	delta: 1,
      	animationType:"none",
		animationDuration:0,
      	success(res) {
      	},
      	fail(res) {
      	},
      });
      barcode.close();
    },
    // 创建二维码窗口
    createBarcode(currentWebview) {
      //自定义窗口大小
      //条码类型常量数组，默认情况支持QR、EAN13、EAN8类型。 通过此参数可设置扫码识别支持的条码类型（注意：设置支持的条码类型越多，扫描识别速度可能将会降低）
      barcode = plus.barcode.create(
        "barcode",
        [plus.barcode.QR, plus.barcode.EAN13, plus.barcode.EAN8],
        {
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          scanbarColor: "#1DA7FF",
          position: "static",
          frameColor: "#1DA7FF",
        }
      );
      barcode.onmarked = this.onmarked;
      barcode.setFlash(this.flash);
      currentWebview.append(barcode);
      barcode.start();
    },
    // 创建操作按钮及tips
    createView(currentWebview) {
      // 创建返回原生按钮
      var backVew = new plus.nativeObj.View(
        "backVew",
        {
          top: "4%",
          left: "10px",
          height: "40px",
          width: "100%",
		  
        },
        [
          {
            tag: "img",
            id: "backBar",
            src: "static/images/backBar.png",
            position: {
              top: "2px",
              left: "3px",
              width: "35px",
              height: "35px",
            },
          },
        ]
      );
	  // 创建打开相册的按钮
	  var photoAlbumView = new plus.nativeObj.View(
	    "photoAlbumView",
	    {
	      top: "80%",
	      left: "64%",
	      width: "20%",
	      height: "10%",
		  // backgroundColor:"rgba(0,0,0,0.8)"
	    },
	    [
			// {
			//   tag: "rect",
			//   id: "circle",
			//   rectStyles:{
			// 	  color:"rgba(0,0,0,0.6)",
			// 	  // color:"#ff0000",
			// 	  radius:"45%"
			//   },
			//   position: {
			//     width: "100%",
			// 	top:"7%",
			//  //    left: "auto",
			//     height: "84%",
			//   },
			// },
	      {
	        tag: "img",
	        id: "photoAlbum",
	        src: "static/images/equipment/scan/album.png",
	        position: {
	          width: "76%",
	          height: "74%",
	        },
	      },
	      {
	        tag: "font",
	        id: "photoAlbum-text",
	        text: this.$t("Equipment.plusScan.album"),
	        textStyles: {
	          size: "10px",
	          color: "#ffffff",
	        },
	        position: {
	          width: "80%",
			  top:"40%",
	          left: "-2%",
	        },
	      },
	    ]
	  );
      // 创建打开手电筒的按钮
      var scanBarVew = new plus.nativeObj.View(
        "scanBarVew",
        {
          top: "80%",
          left: "20%",
          width: "20%",
          height: "10%",
        },
        [
          {
            tag: "img",
            id: "scanBar",
            src: "static/images/equipment/scan/flashlight.png",
            position: {
              width: "76%",
              height: "74%",
              // left: "36%",
            },
          },
          {
            tag: "font",
            id: "font",
            text: this.$t("Equipment.plusScan.tap-to-turn-light-on"),
            textStyles: {
              size: "10px",
              color: "#ffffff",
            },
            position: {
              width: "80%",
              // left: "0%",
			  // left: "-2%",
			  top:'40%'
            },
          },
        ]
      );
      // 创建展示类内容组件
      var content = new plus.nativeObj.View(
        "content",
        {
          top: "4%",
          left: "0px",
          height: "100%",
          width: "100%",
        },
        [
          {
            tag: "font",
            id: "scanTitle",
            text: this.$t("Equipment.plusScan.scan"),
            textStyles: {
              size: "18px",
              color: "#ffffff",
            },
            position: {
              top: "0px",
              left: "0px",
              width: "100%",
              height: "40px",
            },
          },
          {
            tag: "font",
            id: "scanTips",
            text: this.name,
            textStyles: {
              size: "14px",
              color: "#ffffff",
              whiteSpace: "normal",
            },
            position: {
              top: "90px",
              left: "10%",
              width: "80%",
              height: "wrap_content",
            },
          },
        ]
      );
	  
	  // 创建扫码下方的文字组件
      var text = new plus.nativeObj.View(
        "text",
        {
          top: "64%",
          left: "0px",
          height: "100%",
          width: "100%",
        },
        [
          {
            tag: "font",
            id: "scanTitle",
            text: this.$t("Equipment.plusScan.text"),
            textStyles: {
              size: "12px",
              color: "#BEBFC3",
            },
            position: {
              top: "0px",
              left: "0px",
              width: "100%",
              height: "40px",
            },
          },
        ]
      );
      backVew.interceptTouchEvent(true);
      scanBarVew.interceptTouchEvent(true);
      photoAlbumView.interceptTouchEvent(true);
	  
      currentWebview.append(content);
      currentWebview.append(text);
      currentWebview.append(scanBarVew);
      currentWebview.append(photoAlbumView);
      currentWebview.append(backVew);
	  
      backVew.addEventListener(
        "click",
        function (e) {
          //返回按钮
          uni.navigateBack({
            delta: 1,
          });
          barcode.close();
          // plus.navigator.setFullscreen(false);
        },
        false
      );
	  
	  photoAlbumView.addEventListener(
	    "click",
	    function (e) {
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'], //这要注意，camera是拍照，album是打开手机相册
				success: (res) => {
					uni.getImageInfo({
						src:res.tempFilePaths[0],
						success:function(image){
							plus.barcode.scan(image.path, function(type, result) {
								let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
								let nowPage = pages[pages.length - 1]; //当前页页面实例
								let prevPage = pages[pages.length - 2]; //上一页页面实例
								let object = {
									result: result,
								};
								prevPage.$vm.otherFun(object)// 給上一頁綁定方法otherFun,傳參object
								// 跳转到扫码成功页面
								uni.navigateBack({
								  // url: "/pages/news/AddAleoFinancial?from=scan&resultCode=" + result,
									delta: 1,
									animationType:"none",
									animationDuration:0,
									success(res) {
									},
									fail(res) {
									},
								});
								barcode.close();
							}, function(e) {
							});
						}
					})
				}
			});
	      // barcode.close();
	    },
	    false
	  );
	  
      var temp = this;
      scanBarVew.addEventListener(
        "click",
        function (e) {
          //点亮手电筒
          temp.flash = !temp.flash;
          if (temp.flash) {
            scanBarVew.draw([
              {
                tag: "img",
                id: "scanBar",
                 src: "static/images/equipment/scan/flashlightOff.png",
                position: {
                  width: "76%",
                  height: "74%",
                },
              },
				{
				  tag: "font",
				  id: "font",
				  text: temp.$t("Equipment.plusScan.tap-to-turn-light-off"),
				  textStyles: {
				    size: "10px",
				    color: "#ffffff",
				  },
				  position: {
				    width: "80%",
				    // left: "0%",
					// left: "-2%",
					top:'40%'
				  },
				},
            ]);
          } else {
            scanBarVew.draw([
              {
                tag: "img",
                id: "scanBar",
                 src: "static/images/equipment/scan/flashlight.png",
                position: {
                  width: "76%",
                  height: "74%",
                },
              },
			  {
			    tag: "font",
			    id: "font",
			    text: temp.$t("Equipment.plusScan.tap-to-turn-light-on"),
			    textStyles: {
			      size: "10px",
			      color: "#ffffff",
			    },
			    position: {
			      width: "80%",
			      // left: "0%",
			  	// left: "-2%",
			  	top:'40%'
			    },
			  },
            ]);
          }
          if (barcode) {
            barcode.setFlash(temp.flash);
          }
        },
        false
      );
    },
  },
  onBackPress() {
    // #ifdef APP-PLUS
    // 返回时退出全屏
    barcode.close();
    // plus.navigator.setFullscreen(false);
    // #endif
  },
  onUnload() {
    // plus.navigator.setFullscreen(false);
  },
};
</script>

<style scoped></style>
