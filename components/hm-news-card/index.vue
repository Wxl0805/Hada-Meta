<template>
  <div class="hm-news-card">
    <div class="container">
      <!-- <div class="box" @click="onClick"> -->
      <div class="box">
        <div class="imgBox">
          <img class="img" :src="options.imgUrl" />
        </div>
        <img class="imgTop" :src="options.isHot" v-if="options.isHot != 0" />
        <span class="title">{{ options.title }}</span>
        <div class="submain">
          <span class="author">{{ options.author }}</span>
          <span class="date">{{ dateChangeFormat("mm-dd", options.CreatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HmNewsCard",
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
// @import "./index.response.less";
.hm-news-card {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}

.container {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  // box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
}

.box {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  background-color: #ffffff;
  // width: 650rpx;
  // height: 370rpx;
  // border-radius: 20rpx;
}

.imgBox {
  width: 517rpx;
  height: 272rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .img {
    width: 517rpx;
    border-radius: 12rpx;
    height: 272rpx;
  }
}
.imgTop {
  width: 66rpx;
  height: 30rpx;
  position: absolute;
  left: 12rpx;
  top: 17rpx;
}

.title {
  margin-top: 24rpx;
  margin-left: 3rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  max-width: 514rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #121212;
  // line-height: 32rpx;
}

.submain {
  display: flex;
  flex-direction: row;
  // align-items: center;
  margin-top: 14rpx;
  width: 278rpx;
  height: 37rpx;
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9ea3bb;
  line-height: 37rpx;

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
</style>
