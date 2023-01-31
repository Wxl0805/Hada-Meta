// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__A20F141"}) //注意这里需要传入你的应用appId
exports.main = async (event, context) => {
	return await uniPush.sendMessage({
		"getui_alias": JSON.parse(event.body).alias, 	//填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"title": JSON.parse(event.body).title,	
		"content": JSON.parse(event.body).content,
		"force_notification": true,
		"badge": +1,
	})
};