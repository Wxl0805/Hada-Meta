<template>
	<view class="locale-list">
	  <view class="locale-item" v-for="(item, index) in locales" :key="index" @click="onMyLocaleChange(item)">
	    <text class="text">{{item.text}}</text>
	    <text class="icon-check" v-if="item.code == applicationLocale"></text>
	  </view>
	  
	  <uni-popup ref="pop" type="dialog">
	    <uni-popup-dialog type="warn" :cancelText="$t('common.quxiao')" :confirmText="$t('common.confirm-1')" :title="$t('common.qiehuanInfo')" :content="$t('common.qiehuanCont')" @confirm="confirm"></uni-popup-dialog>
	  </uni-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				systemLocale: '',
				applicationLocale: '',
				code: '',
			}
		},
		computed:{
		  locales() {
		    return [
				// {
		  //       text: this.$t('locale.en'),
		  //       code: 'en'
		  //     },
		      {
		        text: this.$t('locale.zh-hans'),
		        code: 'zh-Hans'
		      },
		      {
		        text: this.$t('locale.zh-hant'),
		        code: 'zh-Hant'
		      },
		    ]
		  }
		},
		onLoad() {
		  //获取系统信息
		  let systemInfo = uni.getSystemInfoSync();
		  //获取语言
		  this.systemLocale = systemInfo.language;
		  //获取当前设置的语言
		  this.applicationLocale = uni.getLocale();
		  //客户端平台
		  this.isAndroid = systemInfo.platform.toLowerCase() === 'android';
		  //用于监听应用语言切换
		  uni.onLocaleChange((e) => {
		    this.applicationLocale = e.locale;
		  })
		},
		methods: {
		  onMyLocaleChange(e) {
			  if(e.code == this.applicationLocale){
				  return;
			  }else{
				  this.code = e.code;
				  this.$refs.pop.open();
			  }
		  },
		  confirm(){
			  uni.setStorageSync('lang',this.code);
			  uni.setLocale(this.code);
			  this.$i18n.locale = this.code;
		  }
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-dialog-title-text {
	  color: #242733 !important;
	}
	.locale-item {
	  display: flex;
	  flex-direction: row;
	  padding: 20rpx 20rpx;
	  box-sizing: border-box;
	  border-bottom: 1px solid #f8f8f8;
	}
	
	.locale-item .text {
	  flex: 1;
	}
	
	.icon-check {
	  margin-right: 5px;
	  border: 2px solid #007aff;
	  border-left: 0;
	  border-top: 0;
	  height: 12px;
	  width: 6px;
	  transform-origin: center;
	  /* #ifndef APP-NVUE */
	  transition: all 0.3s;
	  /* #endif */
	  transform: rotate(45deg);
	}
</style>