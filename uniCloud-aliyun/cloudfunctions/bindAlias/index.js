'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__A20F141"}) //注意这里需要传入你的应用appId
exports.main = async (event, context) => {
	return await uniPush.cidBindAlias(
		[
			{
				"cid": JSON.parse(event.body).cid,
				"alias": JSON.parse(event.body).alias
			}
		]
	)
};
