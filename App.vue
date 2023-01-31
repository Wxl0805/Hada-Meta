<script>
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	export default {
		// 全局变量每股多少U
		globalData: {
			// 假数据
			perNum: 2000,
		},

		onLaunch: function() {
			// 获取设备信息
			// #ifdef APP-PLUS
			uni.getSystemInfo({
				success: function (res) {
					// console.log(res);
					uni.setStorageSync('deviceId',res.deviceId);
					uni.setStorageSync('deviceBrand',res.deviceBrand);
				}
			})
			// #endif

			/* 获取当前手机是否有通知权限 */
			// #ifdef APP-PLUS
			// 判断App是否打开了通知权限
			if(!uni.getStorageSync('isPush')){
				this.noticeIsOpen();
			}
			// #endif 
			/* 获取当前手机是否有通知权限 */

			uni.getPushClientId({
				success: (res) => {
					var push_clientid = res.cid
					console.log('客户端推送标识:', push_clientid)
					uni.setStorageSync('cid',push_clientid)
				},
				fail(err) {
					console.log(err)
				}
			})
			
			// uni-app客户端获取push客户端标记
			uni.onPushMessage((res) => {
				console.log("收到推送消息：", res) //监听推送消息
			})
			
			// 消息推送点击跳转
			// #ifdef APP-PLUS
				plus.push.addEventListener("receive", function(msg) {				
					console.log(msg,11111)
					// id = msg.payload.id; //在外面提前声明个变量进行存储  看例子
				}, false);
				// 点击系统通知的推送跳转到指定的界面
				plus.push.addEventListener("click", function(msg) {				
					uni.navigateTo({
						url: '/pages/message/messages'
					})
					plus.push.clear();
				}, false);
			// #endif
			
			// #ifdef APP-PLUS
			// 设置禁止app端横屏
			plus.screen.lockOrientation("portrait-primary");
			// 设置app端隐藏底部按钮栏
			plus.navigator.hideSystemNavigation();
			// #endif
			// 设置语言
			if (uni.getStorageSync("lang")) {
				if (uni.getStorageSync("lang") == "zh-Hant") {
					uni.setLocale("zh-Hant");
					return;
				} else {
					uni.setLocale("zh-Hans");
					return;
				}
			}
			uni.setLocale("zh-Hant");

			// #ifdef APP-PLUS
			APPUpdate();
			// #endif
		},
		onShow: function() {
		},
		onHide: function() {},
		methods: {
			// 静默更新函数
			downLoadUpdata(url) {
				console.log("download--->" + url);
				plus.runtime.getProperty(plus.runtime.appid, function() {
					uni.downloadFile({
						url: url,
						// header: {
						// referer:"https://haiyi-api.zhimeizhushou.com"
						// },
						success: (downloadResult) => {
							console.log("downloadResult=---->" + downloadResult);
							if (downloadResult.statusCode === 200) {
								console.log("downloadResult=---->" + downloadResult.tempFilePath);
								plus.runtime.install(
									downloadResult.tempFilePath, {
										force: false,
									},
									function() {
										console.log("install success...");
										plus.runtime.restart();
									},
									function(e) {
										console.error("install fail..." + JSON.stringify(e));
									}
								);
							}
						},
					});
				});
			},
			noticeIsOpen() {

				switch (uni.getSystemInfoSync().platform) {

					//判断安卓是否开通应用通知权限

					case 'android':

						var main = plus.android.runtimeMainActivity();

						var pkName = main.getPackageName();

						var NotificationManagerCompat = plus.android.importClass(
							"androidx.core.app.NotificationManagerCompat");

						var packageNames = NotificationManagerCompat.from(main);

						//手机没有开启通知的权限

						if (!packageNames.areNotificationsEnabled()) {

							var uid = main.getApplicationInfo().plusGetAttribute("uid");

							var Intent = plus.android.importClass('android.content.Intent');

							var Build = plus.android.importClass("android.os.Build");

							uni.showModal({

								title: '提示',

								content: '检测到应用未开启通知权限，请开启通知权限',

								success: function(res) {

									if (res.confirm) {

										console.log('用户点击确定');
										uni.setStorageSync('isPush',true);
										//android 8.0引导

										if (Build.VERSION.SDK_INT >= 26) {

											var intent = new Intent(
												'android.settings.APP_NOTIFICATION_SETTINGS');

											intent.putExtra('android.provider.extra.APP_PACKAGE',
												pkName);

										} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  

											var intent = new Intent(
												'android.settings.APP_NOTIFICATION_SETTINGS');

											intent.putExtra("app_package", pkName);

											intent.putExtra("app_uid", uid);

										} else { //(<21)其他--跳转到该应用管理的详情页

											var Settings = plus.android.importClass(
												"android.provider.Settings");

											var Uri = plus.android.importClass("android.net.Uri");

											var intent = new Intent();

											intent.setAction(Settings
												.ACTION_APPLICATION_DETAILS_SETTINGS);

											var uri = Uri.fromParts("package", main.getPackageName(),
												null);

											intent.setData(uri);

										}

										// 跳转到该应用的系统通知设置页  

										main.startActivity(intent);

									} else if (res.cancel) {

										console.log('用户点击取消');

									}

								}

							});

						}

						break;

						//判断IOS是否开通应用通知权限

					// case 'ios':

					// 	// 识别IOS通知权限是否打开

					// 	var UIApplication = plus.ios.import("UIApplication");

					// 	var app = UIApplication.sharedApplication();

					// 	var enabledTypes = 0;

					// 	if (app.currentUserNotificationSettings) {

					// 		var settings = app.currentUserNotificationSettings();

					// 		enabledTypes = settings.plusGetAttribute("types");

					// 		console.log("enabledTypes1:" + enabledTypes);

					// 		if (enabledTypes == 0) {

					// 			plus.nativeUI.confirm("推送设置没有开启，是否去开启？", function(e) {

					// 				if (e.index == 0) {

					// 					var NSURL2 = plus.ios.import("NSURL");

					// 					var setting2 = NSURL2.URLWithString("app-settings:");

					// 					var application2 = UIApplication.sharedApplication();

					// 					application2.openURL(setting2);

					// 					plus.ios.deleteObject(setting2);

					// 					plus.ios.deleteObject(NSURL2);

					// 					plus.ios.deleteObject(application2);

					// 				}

					// 			}, {

					// 				"buttons": ["Yes", "No"],

					// 				"verticalAlign": "center"

					// 			});

					// 		}

					// 		plus.ios.deleteObject(settings);

					// 	} else {

					// 		enabledTypes = app.enabledRemoteNotificationTypes();

					// 		if (enabledTypes == 0) {

					// 			console.log("推送未开启!");

					// 		} else {

					// 			console.log("已经开启推送功能!")

					// 		}

					// 		console.log("enabledTypes2:" + enabledTypes);

					// 	}

					// 	plus.ios.deleteObject(app)

					// 	break;

					default:

						break;
				}
			}
		},
	};
</script>

<style>
	@import url("./static/css/reset.css");
	@import url("./static/css/iconfont.css");
	@import url("static/css/swiperdot.css");
	@import url("@/components/aui-dialog/common/aui/css/aui.css");
	@import url("@/components/aui-dialog/common/aui/css/aui.iconfont.css");

	/* @import url("static/css/font.css"); */

	/*每个页面公共css */
	.content-clear-icon {
		background-color: rgba(245, 249, 250, 1) !important;
	}

	.uni-easyinput__content {
		background-color: rgba(245, 249, 250, 1) !important;
	}

	.uni-easyinput__content.is-textarea {
		background-color: rgba(243, 245, 247, 1) !important;
		height: 350rpx !important;
	}

	.uni-textarea-textarea {
		font-size: 32rpx !important;
		height: 350rpx !important;
	}

	.uni-easyinput__content-textarea {
		height: 350rpx !important;
		padding: 20upx !important;
	}

	.uni-textarea-placeholder.uni-easyinput__placeholder-class {
		font-size: 32rpx !important;
	}

	.zero_switch {
		width: 87rpx !important;
		height: 48rpx !important;
		border: 0 !important;
	}

	.dot {
		width: 40rpx !important;
		height: 40rpx !important;
	}

	uni-checkbox .uni-checkbox-input {
		border-radius: 50%;
		width: 20rpx;
		height: 20rpx;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		font-size: 20rpx;
	}

	uni-checkbox .uni-checkbox-wrapper {
		vertical-align: sub;
	}
</style>
