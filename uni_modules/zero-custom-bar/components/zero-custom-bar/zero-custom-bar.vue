<template>
	<view class="container">
		<view
			class="zero_nav"
			:style="{ position: fixed ? 'fixed' : 'relative', height: navBarHeightCustom ? navBarHeightCustom + 'px' : navBarHeight + 'px', background: backgroundColor }"
		>
			<view
				class="tool_bar"
				:style="{
					marginTop: statusBarHeight + menuBotton + 'px',
					height: menuHeight + 'px',
					lineHeight: menuHeight + 'px'
				}"
			>
				<view class="nav_left" v-if="capsuleLeft" :style="{ width: capsuleLeftWidth ? capsuleLeftWidth : menuboxWidth + 'px' }">
					<slot name="left" v-if="$slots.left"></slot>
					<view class="capsule_left" v-else-if="zeroCapsule" :style="{ height: menuHeight + 'px', width: menuWidth + 'px', left: menuRight + 'px' }">
						<view class="icon icon_left" @click="handleBack"><uni-icons color="#000000" :type="zeroCapsuleIconL" size="22"></uni-icons></view>
						<view class="icon_line"></view>
						<view class="icon icon_right" @click="handleHome"><uni-icons color="#000000" :type="zeroCapsuleIconR" size="22"></uni-icons></view>
					</view>
					<view class="single_icon" v-else-if="singleIcon" :style="{ height: menuHeight + 'px', width: menuHeight + 'px', left: menuRight + 'px' }">
						<view class="icon" @click="handleBack"><uni-icons color="#000000" :type="singleIconType" size="22"></uni-icons></view>
					</view>
				</view>
				<view class="nav_center" :style="{ width: toolBarWidth - menuboxWidth + 'px' }" v-if="$slots.default"><slot name="default"></slot></view>
				<view class="nav_center" v-else :style="{ width: toolBarWidth - menuboxWidth + 'px' }">
					<view class="nav_logo" v-if="logo"><image :src="logo" mode="widthFix"></image></view>
					<view class="nav_name" :style="{ color: color }">{{ title }}</view>
				</view>
				<view class="nav_right" v-if="capsuleRight" :style="{ width: capsuleRightWidth ? capsuleRightWidth : menuboxWidth + 'px' }"><slot name="right"></slot></view>
			</view>
		</view>
		<!-- 占位用，使用fixed时生成一个盒子占位 -->
		<view class="temp" v-if="fixed && fiexdHolder" :style="{ height: navBarHeightCustom ? navBarHeightCustom + 'px' : navBarHeight + 'px' }"></view>
	</view>
</template>

<script>
export default {
	name: 'zero-custom-bar',
	emits: ['clickBack', 'clickCustom'],
	props: {
		fixed: {
			type: Boolean,
			default: true
		},
		fiexdHolder: {
			type: Boolean,
			default: true
		},
		backgroundColor: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: '#000000'
		},
		capsuleLeft: {
			type: Boolean,
			default: true
		},
		capsuleRight: {
			type: Boolean,
			default: true
		},
		capsuleLeftWidth: {
			type: Number,
			default: 0
		},
		capsuleRightWidth: {
			type: Number,
			default: 0
		},
		zeroCapsule: {
			type: Boolean,
			default: false
		},
		zeroCapsuleIconL: {
			type: String,
			default: 'back'
		},
		zeroCapsuleIconR: {
			type: String,
			default: 'home'
		},
		singleIcon: {
			type: Boolean,
			default: false
		},
		singleIconType: {
			type: String,
			default: 'back'
		},
		logo: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		navBarHeightCustom: {
			type: Number,
			default: 0
		},
		stopZeroGoBack: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			// 安全高度
			statusBarHeight: 20,
			// 导航栏高度
			navBarHeight: 60,
			// 胶囊距右方间距
			menuRight: 7,
			// 胶囊距底部间距（保持底部间距一致）
			menuBotton: 4,
			// 胶囊高度（自定义内容可与胶囊高度保证一致）
			menuHeight: 32,
			// 胶囊宽度
			menuWidth: 87,
			// 胶囊盒子宽度
			menuboxWidth: 101,
			// 工具栏可用宽度 100% - 胶囊盒子宽度
			toolBarWidth: 0
		};
	},
	created() {
		this.getSysInfo();
	},

	methods: {
		getSysInfo() {
			const systemInfo = uni.getSystemInfoSync();
			// 获取胶囊按钮的位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			// console.log('menuButtonInfo', menuButtonInfo);
			// 安全高度
			this.statusBarHeight = systemInfo.statusBarHeight;
			// 导航栏高度 = 状态栏到胶囊的间距（ 胶囊距上距离 - 状态栏高度 ）*2  +  胶囊高度  +  状态栏高度
			this.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
			this.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight; // 胶囊距底部间距（保持底部间距一致）
			this.menuHeight = menuButtonInfo.height; // 胶囊高度（自定义内容可与胶囊高度保证一致）
			this.menuRight = systemInfo.screenWidth - menuButtonInfo.right; // 胶囊距右方间距
			this.menuboxWidth = menuButtonInfo.width + this.menuRight * 2; // 胶囊盒子宽度
			this.toolBarWidth = systemInfo.screenWidth - this.menuboxWidth; // 工具栏可用宽度 100% - 胶囊盒子宽度
		},
		getNavInfo() {
			const info = [
				{ key: 'statusBarHeight', value: this.statusBarHeight, name: '状态栏(安全)高度' },
				{ key: 'navBarHeight', value: this.navBarHeight, name: '导航栏高度' },
				{ key: 'menuWidth', value: this.menuWidth, name: '胶囊宽度' },
				{ key: 'menuHeight', value: this.menuHeight, name: '胶囊高度' },
				{ key: 'menuRight', value: this.menuRight, name: '胶囊右外边距' },
				{ key: 'menuBotton', value: this.menuBotton, name: '胶囊上下外边距' },
				{ key: 'menuboxWidth', value: this.menuboxWidth, name: '胶囊盒子宽度' },
			];
			return info;
		},
		handleBack() {
			this.$emit('clickBack', true);
			if (!this.stopZeroGoBack) {
				uni.navigateBack();
			}
		},
		handleHome() {
			this.$emit('clickCustom', true);
		}
	}
};
</script>

<style lang="scss" scoped>
$nav_size: 32px;
.zero_nav {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 999;
	overflow: hidden;
}

.tool_bar {
	display: flex;
	flex-flow: row nowrap;
}

.nav_left {
	height: 100%;
	flex-shrink: 0;
	position: relative;
}
.nav_center {
	height: 100%;
	flex: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-flow: row nowrap;
	.nav_logo {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		margin-right:10rpx;
		image {
			// display: block;
			width: 100%;
			height: 100%;
		}
	}
	.nav_name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
		font-size: 34rpx;
	}
}
.nav_right {
	height: 100%;
	flex-shrink: 0;
	position: relative;
}
.capsule_left {
	position: absolute;
	display: flex;
	align-items: center;
	border-radius: 50px;
	border: 0.5px solid rgba(#cccccc, 0.7);
	box-sizing: border-box;
	overflow: hidden;
	z-index: 1;
	.icon {
		width: 50%;
		padding-top: 2px;
		text-align: center;
		background: rgba(255, 255, 255, 0.7);
		&:active {
			filter: brightness(0.7);
		}
	}
	.icon_line {
		width: 0.5px;
		height: 18px;
		background-color: rgba(0, 0, 0, 0.2);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.icon_left {
		padding-left: 5px;
	}
	.icon_right {
		padding-right: 5px;
	}
}
.single_icon {
	position: absolute;
	border: 0.5px solid rgba(#cccccc, 0.7);
	box-sizing: border-box;
	border-radius: 50%;
	overflow: hidden;
	z-index: 1;
	.icon {
		width: 100%;
		height: 100%;
		// padding-top: 2px;
		text-align: center;
		background: rgba(255, 255, 255, 0.7);
		&:active {
			filter: brightness(0.7);
		}
	}
}
</style>
