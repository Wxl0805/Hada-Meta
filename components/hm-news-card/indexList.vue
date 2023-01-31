<template>
  <view class="hm-news-card">
    <view class="container">
      <view class="box" @click="onClick">
        <view class="left-box">
          <span class="title">{{ options.title }}</span>
          <view class="submain">
            <span class="author">{{ options.author }}</span>
            <span class="date">{{ dateChangeFormat("mm-dd", options.CreatedAt) }}</span>
          </view>
        </view>
        <div class="imgBox">
          <img class="img" :src="options.imgUrl" />
        </div>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "HmNewsCardList",
  props: {
    dataId: {
      type: String,
    },
    options: {
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
.hm-news-card {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  .container {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    position: relative;
    .box {
      width: 750rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      // align-items: center;
      background-color: #ffffff;
      padding: 32rpx 0rpx;
      // 文章图片
      .imgBox {
        width: 264rpx;
        height: 139rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 32rpx;
        .img {
          border-radius: 8rpx;
          width: 264rpx;
          height: 139rpx;
        }
      }

      .left-box {
		  position: relative;
		  // display: flex;11
		  // flex-direction: column;11
		  // justify-content: center;11
		  
        width: 54%;
        margin-left: 32rpx;
        // 文章标题
        .title {
			// margin-bottom: 10rpx;11
			
          display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
          -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-line-clamp: 2; /* 显示的行数 */
          // max-height: 80rpx; /* 设置最大高度，根据行高，要几行乘以几倍 */
          margin-left: 3rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: pre-wrap;
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #121212;
        }
        // 作者和日期
        .submain {
			// position: absolute;
			// bottom:10rpx;
			// left: 0rpx;
			
          display: flex;
          flex-direction: row;
          margin-top: 8rpx;
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #9ea3bb;

          .author {
            margin-left: 3rpx;
            // width: 150rpx;
            height: 28rpx;
            white-space: nowrap;
          }

          .date {
            margin-left: 20rpx;
            // width: 146rpx;
            height: 28rpx;
            white-space: pre;
          }
        }
      }
    }
  }
}
</style>
