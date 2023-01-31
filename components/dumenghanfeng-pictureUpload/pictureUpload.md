## 简介

改插件为基于 uniapp 封装的图片上传组件,包含正常的图片上传,预览,删除功能,适用于.vue 文件,如要在.nvue 中使用需自己进行排版

## 引用组件

import pictureUpload from '@/components/pictureUpload/pictureUpload.vue'

## 引用页面

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

## 组件

    counting  用于存放点击上传图片时限制的最大数(不断变化)
    count     用于存放点击上传图片时限制的最大数(不变化)
    imgIsShow  用于组件内部照相机隐藏与显示
    changeimg  存储上传图片是临时存储到本地的图片路径(页面展示)
    fileNameId  存储上传服务器后获取的图片id,同时传递给父页面(可以通过fileNameId的长度来获取上传了几个)
    watch
    用于检测在页面内动态获取图片从而进行展示
    created
    用于检测第一时间进入页面时默认展示
