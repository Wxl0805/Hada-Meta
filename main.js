import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;

// 导入路由基础路径
import { basePath } from "./http/config.js";
Vue.prototype.host = basePath;

// 导入version
import { version as baseVersion } from "./http/config.js";
let version = null;
// #ifdef APP-PLUS
	// 获取本地应用资源版本号
  plus.runtime.getProperty(plus.runtime.appid, function (inf) {
        version = inf.versionCode;
		Vue.prototype.version = version;	
  });
// #endif
// 如果不是真机,那么拿不到本地应用资源版本号,走下面的逻辑去拿http/version.js里的版本号
if(version==null){
  version = baseVersion;
  Vue.prototype.version = version;
}


// 导入国际化设置
import messages from "./locale/index";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);



// 第一步：引入 Vuex
import Vuex from "vuex";
Vue.use(Vuex);

// 第二步：引入 Vusui-app-layer 弹层
import vusLayerInit from "./components/vusui-app-layer/vusui-layer.js";
import vusLayer from "./components/vusui-app-layer/vusui-layer.vue";
Vue.use(vusLayerInit);
Vue.component("vus-layer", vusLayer); //设置组件名称

// 第三步：new Vuex.Store()
const store = new Vuex.Store();

App.mpType = "app";


let i18nConfig = {
  messages,
  silentTranslationWarn: true,
};

if(uni.getStorageSync('lang')==undefined || uni.getStorageSync('lang')==""||uni.getStorageSync('lang')==null) {
	uni.setStorageSync('lang',"zh-Hant");
	i18nConfig.locale = "zh-Hant";
} else {
	i18nConfig.locale =uni.getStorageSync('lang');
}

const i18n = new VueI18n(i18nConfig);

const app = new Vue({
  store,
  i18n,
  ...App,
});
app.$mount();
