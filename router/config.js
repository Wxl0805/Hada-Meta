export default [
  //启动页面
  {
    path: "/pages/index/Loginstart",
    name: "Loginstart",
  },
  //引导页面
  {
    path: "/pages/index/guide",
    name: "guide",
  },
  //邮箱验证码登录页面
  {
    path: "/pages/index/VerificationLogin",
    name: "emailvaliLogin",
  },
  //Hada Meta服务协议
  {
    path: "/pages/index/HadaMetaProtocal",
    name: "HadaMetaProtocal",
  },
  //Hada Meta隐私政策
  {
    path: "/pages/index/HadaMetaPolicy",
    name: "HadaMetaPolicy",
  },
  //Hada Meta免责声明
  {
    path: "/pages/index/HadaMetaStatement",
    name: "HadaMetaStatement",
  },

  //注册页面
  {
    path: "/pages/index/SignIn",
    name: "SignIn",
  },
  //验证码页面
  {
    path: "/pages/index/Validate",
    name: "Validate",
  },
  //设置账号信息页面
  {
    path: "/pages/index/SignCount",
    name: "SignCount",
  },
  // 首页路由
  {
    path: "/pages/home/index",
    name: "home/index",
  },
  // 设备主页面路由
  {
    path: "/pages/equipment/equipmentMenu",
    name: "equipment/equipmentMenu",
    H5Params: {},
  },
  //我的-主页面
  {
    path: "/pages/mine/index",
    name: "mine/index",
  },
  //我的-主页面-关于应用
  {
    path: "/pages/mine/aboutAPP/aboutAPP",
    name: "mine/aboutAPP/aboutAPP",
  },
  //我的-主页面-关于应用-更新动态
  {
    path: "/pages/mine/aboutAPP/uploadInfo",
    name: "mine/aboutAPP/uploadInfo",
  },
  //我的-主页面-关于应用-服务协议
  {
    path: "/pages/mine/aboutAPP/serviceAgreement",
    name: "mine/aboutAPP/serviceAgreement",
  },
  //我的-主页面-钱包管理
  {
    path: "/pages/mine/WalletManage",
    name: "mine/WalletManage",
  },
  //我的-主页面-修改密码
  {
    path: "/pages/mine/editPassword",
    name: "mine/editPassword",
  },
  //我的-主页面-修改密码-原密码修改
  {
    path: "/pages/mine/oldPassword",
    name: "mine/oldPassword",
  },
  //我的-主页面-修改密码-手机号验证码修改
  {
    path: "/pages/mine/telValidate",
    name: "mine/telValidate",
  },
  //我的-主页面-修改密码-邮箱验证码修改
  {
    path: "/pages/mine/emailValidate",
    name: "mine/emailValidate",
  },
  //我的-主页面-钱包管理-新增钱包
  {
    path: "/pages/mine/EditWallet",
    name: "mine/EditWallet",
  },
  //我的-主页面-个人资料
  {
    path: "/pages/mine/userDate",
    name: "mine/userDate",
  },
  //我的-主页面-个人资料
  {
    path: "/pages/mine/sexSelect",
    name: "mine/sexSelect",
  },
  //我的-主页面-个人资料-绑定手机号
  {
    path: "/pages/mine/telBind",
    name: "mine/telBind",
  },
  //我的-主页面-个人资料-绑定邮箱
  {
    path: "/pages/mine/emailBind",
    name: "mine/emailBind",
  },
  //我的-主页面-子账户管理
  {
    path: "/pages/mine/subAccount",
    name: "mine/subAccount",
  },
  //我的-主页面-子账户管理-编辑子账户
  {
    path: "/pages/mine/editAccount",
    name: "mine/editAccount",
  },
  //我的-主页面-子账户管理-编辑子账户-添加设备-输入设备编码
  {
    path: "/pages/mine/BindProduct",
    name: "mine/BindProduct",
  },
  //我的-主页面-子账户管理-编辑子账户-添加设备-扫码添加
  {
    path: "/pages/mine/ScanAdd",
    name: "mine/ScanAdd",
  },
  // 首页轮播图-电报群路由
  {
    path: "/pages/telegram/addTelegram",
    name: "telegram/addTelegram",
    H5Params: {},
  },
  // 首页轮播图-设备显示路由
  {
    path: "/pages/equipment/equipments",
    name: "equipment/showEquipments",
    H5Params: {},
  },
  // 首页轮播图-设备显示-查看更多路由
  {
    path: "/pages/equipment/equipmentDetails",
    name: "equipment/showEquipmentInfo",
    H5Params: {},
  },
  // 首页-消息路由
  {
    path: "/pages/message/messages",
    name: "message/readMessage",
    H5Params: {},
  },
  // 首页-奖励结算通知路由
  {
    path: "/pages/message/bonusMsg",
    name: "message/bonusMsg",
    H5Params: {},
  }, // 首页-激励结算通知路由
  {
    path: "/pages/message/inspiredMsg",
    name: "message/inspiredMsg",
    H5Params: {},
  },
  // 首页-拓展客户通知路由
  {
    path: "/pages/message/inviteMsg",
    name: "message/inviteMsg",
    H5Params: {},
  },
  // 首页-客户被拓展通知路由
  {
    path: "/pages/message/beInvitedMsg",
    name: "message/beInvitedMsg",
    H5Params: {},
  },
  // 首页-发展客户投资提交通知路由
  {
    path: "/pages/message/CustomerSubmitInvestmentMsg",
    name: "message/CustomerSubmitInvestmentMsg",
    H5Params: {},
  },
  // 首页-投资份额提交成功通知路由
  {
    path: "/pages/message/submitSuccessMsg",
    name: "message/submitSuccessMsg",
    H5Params: {},
  }, // 首页-投资份额审核通过路由
  {
    path: "/pages/message/auditSuccessMsg",
    name: "message/auditSuccessMsg",
    H5Params: {},
  }, 
  // 首页-投资份额审核失败路由
  {
    path: "/pages/message/auditFailMsg",
    name: "message/auditFailMsg",
    H5Params: {},
  },// 首页-公告路由
  {
    path: "/pages/message/announcement",
    name: "message/announcement",
    H5Params: {},
  },
  // 首页-新闻资讯路由
  {
    path: "/pages/news/topNews",
    name: "news/topNews",
    H5Params: {},
  },
  // 首页-新闻资讯列表路由
  {
    path: "/pages/news/topNewsList",
    name: "news/topNewsList",
    H5Params: {},
  },
  // 首页-ETH理财资讯路由
  {
    path: "/pages/news/ETHfinancialNews",
    name: "news/ETHfinancialNews",
    H5Params: {},
  },
  // 首页-Aleo理财资讯路由
  {
    path: "/pages/news/AleoFinancialNews",
    name: "news/AleoFinancialNews",
    H5Params: {},
  },

  // 设备-绑定设备路由
  {
    path: "/pages/equipment/bindEquipment",
    name: "equipment/bindEquipment",
    H5Params: {},
  },
  // 设备-绑定设备-输入编码绑定设备页面路由
  {
    path: "/pages/equipment/inputBindInfo",
    name: "equipment/bindEquipment/inputBindInfo",
    H5Params: {},
  },
  // 设备-子账户详情页面路由
  {
    path: "/pages/equipment/subAccount",
    name: "equipment/subAccount",
    H5Params: {},
  },
  // 设备-子账户详情-设备详情页面路由
  {
    path: "/pages/equipment/subEquipmentInfo",
    name: "equipment/subEquipmentInfo",
    H5Params: {},
  },
  // ETH收益-收益主页面路由
  {
    path: "/pages/income/ETHIncome/income",
    name: "ETH/income",
    H5Params: {},
  },
  // Aleo收益-收益主页面路由
  {
    path: "/pages/income/AleoIncome/income",
    name: "Aleo/income",
    H5Params: {},
  },
  // ETH收益-子账户收益页面路由
  {
    path: "/pages/income/ETHIncome/subAccount",
    name: "ETH/income/subAccount",
    H5Params: {},
  },
  // Aleo收益-投资记录页面路由
  {
    path: "/pages/income/AleoIncome/investmentRecord",
    name: "Aleo/income/investmentRecord",
    H5Params: {},
  },
  // Aleo收益-奖励积分记录页面路由
  {
    path: "/pages/income/AleoIncome/bonusPointsRecord",
    name: "Aleo/income/bonusPointsRecord",
    H5Params: {},
  },
  // Aleo收益-激励积分记录页面路由
  {
    path: "/pages/income/AleoIncome/inspiredPointsRecord",
    name: "Aleo/income/inspiredPointsRecord",
    H5Params: {},
  },
  // Aleo收益-拓展客户列表页面路由
  {
    path: "/pages/income/AleoIncome/expandingCustomerList",
    name: "Aleo/income/expandingCustomerList",
    H5Params: {},
  },
  // Aleo收益-邀请客户页面路由
  {
    path: "/pages/income/AleoIncome/inviteCustomers",
    name: "Aleo/income/inviteCustomers",
    H5Params: {},
  },
  // Aleo收益-邀请记录页面路由
  {
    path: "/pages/income/AleoIncome/inviteCustomersRecord",
    name: "Aleo/income/inviteCustomersRecord",
    H5Params: {},
  },
];
