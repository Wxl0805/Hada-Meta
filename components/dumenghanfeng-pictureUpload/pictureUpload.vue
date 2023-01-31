<template>
  <view class="pictureUpload">
    <!-- 预览图片 -->
    <view
      class="picturePreview"
      v-for="(item, index) in changeimg"
      :key="index"
    >
      <image
        class="picturePreviewImg"
        @click="picturePreview(index)"
        :src="item"
        @load="imgHaveLoad()"
      ></image>
      <image
        class="picturePreviewDelete"
        @click="pictureDelete(index)"
        src="/static/tabBar/fillInSafetyIssues-4.png"
      ></image>
    </view>
    <!-- 添加图片 -->
    <view v-if="!imgIsShow" class="pictureAdd" @click="pictureUpload">
      <image class="pictureAddImg" src="/static/workbench/add3.png"></image>
    </view>
    <!-- 图片蒙层 -->
    <view v-if="popupFlag" class="popupflag"></view>
  </view>
</template>

<script>
/*
 引用组件
  import pictureUpload from '@/components/pictureUpload/pictureUpload.vue'
	<pictureUpload @pictureUpload="pictureUpload" :imgReatid="imgReatid" :imgCount="imgCount" :uploadImgId="uploadImgId"></pictureUpload>
	父页面
	进入页面就默认加载显示图片
	   this.imgReatid赋值
	    if(this.imgReatid.length!=0){  判断是否是第二次进入同一个页面
	    	this.imglength=this.imgReatid.length  显示已经存在几个图片
	    	this.uploadImgId 赋值
	    }
	在页面内通过接口获取图片数据后展示(如果有图片已经选中并展示,此时默认删除,加载新的图片)
	 this.imgReatid赋值
	 this.imglength=this.imgReatid.length  显示已经存在几个图片
	 this.uploadImgId 赋值
	:imgCount  限制上传图片最大长度(可在父页面自定义)
	:imgReatid 用于判断是否是第二次进入同一个页面用于存储本地的图片路径(用于展示)
	:uploadImgId 用于存放第二次进入同一个页面时存放服务器的id(便于组件方便删除,同时也是第一次使用组件时用于组建通信存储服务器反馈的图片的id值)
	@pictureUpload  用于接收组件传递给父页面的值
	组件
	counting  用于存放点击上传图片时限制的最大数(不断变化)
	count     用于存放点击上传图片时限制的最大数(不变化)
	imgIsShow  用于组件内部照相机隐藏与显示
	changeimg  存储上传图片是临时存储到本地的图片路径(页面展示)
	fileNameId  存储上传服务器后获取的图片id,同时传递给父页面(可以通过fileNameId的长度来获取上传了几个)
	watch
	用于检测在页面内动态获取图片从而进行展示
	created
	用于检测第一时间进入页面时默认展示
	*/
let counting = 0; // 存储父页面传递的值(变化)
export default {
  props: {
    imgCount: {
      type: Number,
    },
    imgReatid: {
      type: Array,
    },
    uploadImgId: {
      type: Array,
    },
    uploadObjList: {
      type: Array,
    },
    objIsShow: {
      type: Boolean,
    },
  },
  data() {
    return {
      popupFlag: false, //图片未成功处理前给页面添加蒙层防止用户点击
      imgIsShow: false,
      changeimg: [], // 图片
      fileNameId: [],
      count: 0, // 存储父页面传递的值(不变)
      cookie: "", //存储cookie
      chooseImgLength: 0, //选中了几张照片
      lengthTemp: 0, //作为图片都渲染到页面等待框消失的标志
      progress: 0,
      objList: [], //传递对象数组图片
    };
  },
  //用于监听在页面内部通过接口默认显示图片
  watch: {
    imgCount(newV, oldV) {
      // watch监听props里的值变化，然后执行操作
      this.count = newV;
    },
    imgReatid(newV, oldV) {
      this.changeimg = [];
      this.changeimg = newV;
      counting = this.imgCount - this.changeimg.length;
      if (oldV.length == 0) {
        this.lengthTemp = this.changeimg.length;
        this.chooseImgLength = this.lengthTemp;
      }
      if (this.changeimg.length == this.count) {
        this.imgIsShow = true;
      } else {
        this.imgIsShow = false;
      }
    },
    uploadImgId(newV, oldV) {
      this.fileNameId = newV;
    },
    uploadObjList(newV, oldV) {
      this.objList = newV;
    },
  },
  created() {
    this.cookie = uni.getStorageSync("cookie");
    // 判断是否重复进入引入组件页面
    if (this.imgReatid.length != 0) {
      this.changeimg = this.imgReatid;
      this.fileNameId = this.uploadImgId;
      if (this.objIsShow) {
        this.objList = this.uploadObjList;
      }
      this.count = this.imgCount;
      counting = this.imgCount - this.changeimg.length;
      this.lengthTemp = this.changeimg.length;
      this.chooseImgLength = this.lengthTemp;
      if (this.changeimg.length == this.count) {
        this.imgIsShow = true;
      }
    } else {
      counting = this.imgCount;
      this.count = this.imgCount;
    }
  },
  methods: {
    // 图片上传
    pictureUpload() {
      var that = this;
      that.popupFlag = true;
      uni.chooseImage({
        count: 1,
        success: (chooseImageRes) => {
          uni.showLoading({ mask: true });
          const tempFilePaths = chooseImageRes.tempFilePaths;
          that.chooseImgLength += tempFilePaths.length;
          tempFilePaths.map((ele) => {
            // 压缩图片
            uni.compressImage({
              src: ele,
              quality: 50,
              success: (res) => {
                this.uploadImg(res.tempFilePath);
              },
            });
          });
        },
        fail() {
          that.popupFlag = false;
        },
      });
    },
    // 上传图片(走接口)
    uploadImg: function (el) {
      var that = this;
      let url = "url路径";
      const uploadTask = uni.uploadFile({
        url: url,
        filePath: el,
        name: "file",
        timeout: 40000,
        header: {
          //有需要配置没需要无需配置
        },
        success: (uploadFileRes) => {
          // 图片上传成功
          uni.hideLoading();
          if (uploadFileRes.statusCode == 200) {
            that.popupFlag = false;
            JSON.parse(uploadFileRes.data).map((ele) => {
              if (this.objIsShow) {
                this.objList.push({
                  atchId: ele.id,
                  fileName: ele.fileName,
                  fileType: "",
                });
              }
              this.fileNameId.push(ele.id);
              this.changeimg.push(el);
            });
            // 判断每次选中图片的多少
            counting = this.count - this.changeimg.length;
            if (counting == 0) {
              counting = 0;
            }
            // this.objIsShow true传递对象,false传递数组
            if (this.objIsShow) {
              let obj = [this.fileNameId, this.objList];
              this.$emit("pictureUpload", obj);
            } else {
              this.$emit("pictureUpload", this.fileNameId);
            }
          } else {
            //上传中出错处理
            uni.showModal({
              title: "提示",
              content: "登录超时，请重新登录",
              showCancel: false,
              success: function (res) {},
            });
          }
        },
        fail: (error) => {
          uni.hideLoading();
          that.popupFlag = false;
          uni.showModal({
            title: "提示",
            content: "网络异常，请重试",
            showCancel: false,
            confirmText: "确定",
          });
        },
      });
      uploadTask.onProgressUpdate(function (res) {
        that.progress = res.progress;
      });
    },
    // 图片加载框
    imgHaveLoad() {
      var that = this;
      // 判断长度,关闭上传
      if (that.progress == 100) {
        this.lengthTemp = this.changeimg.length;
        // 判断长度,关闭上传
        if (that.chooseImgLength == that.count) {
          that.imgIsShow = true;
        }
        //等所有图片上传完加载框再消失
        if (that.chooseImgLength == that.changeimg.length) {
          uni.hideLoading();
        }
      }
    },
    // 删除图片
    pictureDelete: function (e) {
      var that = this;
      this.changeimg.splice(e, 1);
      counting++;
      if (counting == this.count) {
        counting = this.count;
      }
      this.fileNameId.splice(e, 1);
      if (this.objIsShow) {
        this.objList.splice(e, 1);
      }
      this.chooseImgLength--;
      if (this.objIsShow) {
        let obj = [this.fileNameId, this.objList];
        this.$emit("pictureUpload", obj);
      } else {
        this.$emit("pictureUpload", this.fileNameId);
      }
      this.imgIsShow = false;
    },
    // 图片预览
    picturePreview: function (e) {
      let current = e;
      // 预览图片
      uni.previewImage({
        current: current,
        urls: this.changeimg,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function (data) {},
          fail: function (err) {
            console.log(err);
          },
        },
      });
    },
  },
};
</script>

<style>
.pictureUpload {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
}

.pictureAdd {
  width: 130rpx;
  height: 130rpx;
  border-style: solid;
  border-width: 2rpx;
  border-color: #999999;
  margin-top: 30rpx;
  border-radius: 10rpx;
}

.pictureAddImg {
  width: 56rpx;
  height: 56rpx;
  margin-top: 43rpx;
  margin-left: 37rpx;
}

.picturePreview {
  width: 130rpx;
  height: 130rpx;
  margin-right: 40rpx;
  border-radius: 10rpx;
  margin-top: 30rpx;
  position: relative;
  background-color: #f7f8fa;
}

.picturePreviewImg {
  margin-top: 10rpx;
  margin-left: 10rpx;
  width: 110rpx;
  height: 110rpx;
  object-fit: cover;
  border-radius: 10rpx;
}

.picturePreviewDelete {
  position: absolute;
  top: -13rpx;
  right: -13rpx;
  width: 30rpx;
  height: 30rpx;
  border-radius: 10rpx;
}
.popupflag {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 99999999;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
