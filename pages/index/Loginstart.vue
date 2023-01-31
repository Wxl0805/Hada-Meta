<template>
  <view class="content">
    <view class="page flex-col">
      <image
        referrerpolicy="no-referrer"
        :src="header"
      />
        <!-- :class="className" -->
      <!-- <view class="box2 flex-col"></view> -->
    </view>
  </view>
</template>

<script>
	import jian from '@/static/images/login/loginstart/login_start_jian.gif'
	import fan from '@/static/images/login/loginstart/login_start_fan.gif'
export default {
  data() {
    return {
      timer: null,
	  header: fan,
	  // className: 'img2',
	  screenwidth: 0,
	  screenheight: 0
    };
  },
  onLoad() {
	  uni.getSystemInfo({
	  	success: (res) => {
	  		this.screenwidth = res.screenWidth;
	  		this.screenheight = res.screenHeight;
	  	}
	  })
    this.timer = setTimeout(() => {
		// if(uni.getStorageSync('token')){
		// 	uni.reLaunch({
		// 		url: '/pages/home/index'
		// 	})
		// 	return;
		// }
      uni.reLaunch({
        url: "/pages/index/VerificationLogin",
        success(res) {
        },
        fail(res) {
        },
      });
    }, 4000);
	
  },
  onShow() {
	  
  	if(uni.getStorageSync('lang')){
		console.log(111);
  		 if(uni.getStorageSync('lang') == 'zh-Hant'){
			 console.log(222);
  			 this.header = fan;
  			 // this.className = 'img2';
  			 return;
  		 }else{
			 console.log(333);
  			 this.header = jian;
  			 // this.className = 'img1';
  			 return;
  		 } 
  	}
  	this.header = fan;
  	// this.className = 'img1';
  },
  methods: {},
};
</script>

<style scoped>
@import "@/static/css/common.css";
.page {
  background-color: rgba(255, 255, 255, 1);
  position: relative;
  width: 100vw;
  height: 100vh;
  /* overflow: hidden; */
 /* width: 23.4375rem;
  height: 50.75rem; */
  display: flex;
  align-items: center;
}

image{
	width: 100%;
	height: 100%;
	/* width: 100vw;
	height: 100vh; */
}


@media screen and (max-height:700px) {/*当屏幕尺寸小于700px时，应用下面的CSS样式*/

	.img1 {
	width: 508rpx;
	height: 550rpx;
	margin: 77px 0 0 0;
	}
	.img2 {
	  width: 508rpx;
	  height: 559rpx;
	  margin: 77px 0 0 0;
	}
	.box2 {
	  width: 364rpx;
	  height: 54rpx;
	  background: url("@/static/images/loginstart/logobuttom.png") 0rpx 0rpx
	    no-repeat;
	  background-size: 100% 100%;
	  /* margin: 270rpx 0 92rpx 193rpx; */
	  position: absolute;
	  bottom: 140rpx;
	  /* margin-top: 100rpx; */
	}

}

@media screen and (min-height:700px) and (max-height:811px) {/*当屏幕尺寸大于700px，小于811px，应用下面的CSS样式*/

	.img1 {
	width: 508rpx;
	height: 550rpx;
	margin: 125px 0 0 0;
	}
	.img2 {
	  width: 508rpx;
	  height: 559rpx;
	  margin: 125px 0 0 0;
	}
	.box2 {
	  width: 364rpx;
	  height: 54rpx;
	  background: url("@/static/images/loginstart/logobuttom.png") 0rpx 0rpx
	    no-repeat;
	  background-size: 100% 100%;
	  /* margin: 450rpx 0 92rpx 193rpx; */
	  position: absolute;
	  bottom: 140rpx;
	  /* margin-top: 100rpx; */
	}

}

@media screen and (min-height:811px) {/*当屏幕尺寸大于811px时，应用下面的CSS样式*/

	.img1 {
	  width: 508rpx;
	  height: 559rpx;
	  margin: 172px 0 0 0;
	}
	.img2 {
	  width: 508rpx;
	  height: 559rpx;
	  margin: 172px 0 0 0;
	}
	.box2 {
	  width: 364rpx;
	  height: 54rpx;
	  background: url("@/static/images/loginstart/logobuttom.png") 0rpx 0rpx
	    no-repeat;
	  background-size: 100% 100%;
	  /* margin: 570rpx 0 92rpx 193rpx; */
	  position: absolute;
	  bottom: 140rpx;
	  /* margin-top: 100rpx; */
	}
}

</style>
