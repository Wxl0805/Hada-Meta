<template>
  <view class="block">
      <view class="box" @click="jumpToPage(message.imgUrl)">
          <view class="slot-body">
            <view class="body-title">
              <text :class="message.isReaded == 1 ? 'isRead-title' : ''">
                {{ message.title }}
              </text>
            </view>
            <view class="body-content">
              <text :class="message.isReaded == 1 ? 'isRead-content' : ''" :style="message.msgType == 'msg' ? 'display: block;' : 'display: none;'">
                {{ message.content }}
              </text>
            </view>
          </view>
		  <view class="footer-time">
		    <text>
		      {{ dateChangeFormat("mm-dd HH:MM:SS", message.CreatedAt) }}
		    </text>
		  </view>
      </view>
  </view>
</template>
<script>
export default {
  name: "messageListBlock",
  props: {
    message: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      uni.navigateTo({
        url: this.options.url,
      });
    },
	// 跳转到对应页面
	jumpToPage(url) {
		console.log("跳转",url);
		uni.navigateTo({
			url:url,
			success: (res) => {
				// console.log("success",res);
			},
			fail: (res) => {
				// console.log("fail",res);
			}
		})
	},
    // 转换日期格式
    dateChangeFormat(format, date) {
      date = new Date(date);
      const dataItem = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString(),
      };
      Object.keys(dataItem).forEach((item) => {
        const ret = new RegExp(`(${item})`).exec(format);
        if (ret) {
          format = format.replace(ret[1], ret[1].length === 1 ? dataItem[item] : dataItem[item].padStart(ret[1].length, "0"));
        }
      });
      return format;
    },
  },
};
</script>
<style lang="less" scoped>
	.isRead-title {
	  color: #9699a6;
	}
	.isRead-content {
	  color: #c4c6d3;
	}
	
	.slot-body {
		margin-left: 42rpx;
		margin-top: 42rpx;
		// margin-bottom: 42rpx;
	  .body-title {
	    font-size: 30rpx;
	    font-family: PingFangSC-Medium, PingFang SC;
	    font-weight: 500;
	    color: #2e334e;
	  }
	  .body-content {
	    display: block;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    width: 488rpx;
	    height: 40rpx;
	    font-size: 28rpx;
	    font-family: PingFangSC-Regular, PingFang SC;
	    font-weight: 400;
	    color: #888da7;
	    line-height: 40rpx;
	  }
	}
	.footer-time {
		margin-right: 42rpx;
		margin-top: 42rpx;
	  font-size: 24rpx;
	  font-family: PingFangSC-Medium, PingFang SC;
	  font-weight: 500;
	  color: #9ea3bb;
	  text-align: right;
	}
	
	.box{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
