<template>
		<view class="box-item" :style="{ color: color }">
			<li :class="{ 'number-item': !isNaN(items), 'mark-item': isNaN(items) }" v-for="(items, index) in orderNum" :key="index">
				<span>
					<!-- <i ref="numberItem" class="ScrollNumbers" :style="transformNum">0123456789</i> -->
					<i ref="numberItem" class="ScrollNumbers">{{items}}</i>
				</span>
			</li>
		</view>
</template>
<script>
	export default {
		props: {
			color: {
				type: String,
			},
			value: {
				type: Number,
				default: function() {
					return {
						value: 0,
					};
				},
			},
		},
		watch: {
			value(newVal) {
				this.toOrderNum(parseInt(newVal));
			},
		},
		data() {
			return {
				orderNum: [0, 0, 0, 0, 0, 0], // 默认订单总数
				transformNum:''
			};
		},
		mounted() {
			setTimeout(() => {
				this.toOrderNum(parseInt(this.value));
			}, 50);
			// console.log(this.value);
		},
		methods: {
			// 设置文字滚动
			setNumberTransform() {
				const numberItems = this.$refs.numberItem; // 拿到数字的ref，计算元素数量
				const numberArr = this.orderNum.filter((item) => !isNaN(item));

				// 结合CSS 对数字字符进行滚动,显示订单数量
				// for (let index = 0; index < numberItems.length; index++) {
					// const elem = numberItems[index];
					
					const query = uni.createSelectorQuery().in(this).selectAll('.ScrollNumbers');
					// console.log(query);

					query.fields({
						'computedStyle':['transform'],
					},res => {
						// console.log(res[0].transform);

						for (let index = 0; index < res.length; index++) {

							res[index].transform=`transform:translate(-50%, -${numberArr[index] * 10}%)`

						}
						// console.log(res[0].transform);
					}).exec();

					// elem.style = `transform:translate(-50%, -${numberArr[index] * 10}%)`;
				// }
			},
			// 处理总订单数字
			toOrderNum(num) {
				num = num.toString();
				// 把订单数变成字符串
				if (num.length < 6) {
					num = "0" + num; // 如未满八位数，添加"0"补位
					this.toOrderNum(num); // 递归添加"0"补位
				} else if (num.length === 6) {
					// 订单数中加入逗号
					this.orderNum = num.split(""); // 将其便变成数据，渲染至滚动数组
					this.setNumberTransform();
				} else {
					// 订单总量数字超过八位显示异常
					console.log("订单总量数字过大，显示异常，请联系客服");
				}
			},
		},
	};
</script>
<style scoped lang='scss'>
	/*订单总量滚动数字设置*/

	/* @font-face {
		font-family: "FakeHope";
		src: url("../../static/FakeHope/FakeHope.woff2") format("woff2"),
			url("../../static/FakeHope/FakeHope.woff") format("woff"),
			url("../../static/FakeHope/FakeHope.ttf") format("truetype"),
			url("../../static/FakeHope/FakeHope.eot") format("embedded-opentype"),
			url("../../static/FakeHope/FakeHope.svg") format("svg");
		font-weight: normal;
		font-style: normal;label
	} */

	.box-item {
		position: relative;
		/* height: 300rpx; */
		font-size: 60rpx;
		/* line-height: 41rpx; */
		text-align: center;
		list-style: none;
		color: #2d7cff;
		align-items: center;
		// writing-mode: vertical-lr;
		// text-orientation: upright;
		margin: 0 auto;
		/* width: 400rpx; */
		display: flex;
		justify-content: center;
		/*文字禁止编辑*/
		-moz-user-select: none;
		/*火狐*/
		-webkit-user-select: none;
		/*webkit浏览器*/
		-ms-user-select: none;
		/*IE10*/
		-khtml-user-select: none;
		/*早期浏览器*/
		user-select: none;

		/* overflow: hidden; */
		.box-item-title {
			cursor: pointer;
			letter-spacing: 2rpx;
			font-size: 1rem;
			width: 70rpx;
			line-height: 65rpx;
			color: #fff;
			writing-mode: initial;
			display: inline-block;
		}
	}

	/* 默认逗号设置 */
	.mark-item {
		width: 10rpx;
		height: 65rpx;

		margin-right: 5rpx;
		line-height: 10rpx;
		font-size: 48rpx;
		position: relative;

		&>span {
			position: absolute;
			width: 100%;
			bottom: 0;
			writing-mode: vertical-rl;
			text-orientation: upright;
		}
	}

	/*滚动数字设置*/
	.number-item {
		max-width: 95rpx;
		flex-grow: 1;
		height: 95rpx;
		margin-top: 24rpx;
		margin-right: 12rpx;
		background: #2d7cff;
		list-style: none;
		background: #ffffff;
		border-radius: 12rpx;
		/* border: 1rpx solid #6483a5 !important; */
		/* box-shadow: inset 0 0 3rpx 1rpx rgba(0, 255, 254, 0.66); */

		&>span {
			position: relative;
			display: inline-block;
			margin-right: 10rpx;
			width: 100%;
			height: 100%;
			writing-mode: vertical-rl;
			text-orientation: upright;
			overflow: hidden;

			&>i {
				/* font-family: "FakeHope"; */
				font-family: "PingFangSC-Medium, PingFang SC";
				font-style: normal;
				position: absolute;
				top: 16rpx;
				left: 50%;
				transform: translate(-50%, 0);
				transition: transform 1s ease-in-out;
				letter-spacing: 20rpx;
				color: #009BF9;
			}
		}
	}

	.number-item:last-child {
		margin-right: 0;
	}
</style>
