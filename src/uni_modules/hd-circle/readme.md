# [组件库官方文档：fant-mini-plus](https://fant-mini-plus.top/fant-mini-plus/components/hd-circle.html)
组件库提供更多vue3组件，比单独引入更加强大

# Circle 环形进度条

圆环形的进度条组件，支持进度渐变动画。
## 代码演示

### 基础用法

通过`v-model`表示进度条的当前进度，`text`属性控制进度条中间文字内容。

```html
<hd-circle v-model="current" :text="`进度：${current}%`"></hd-circle>
```

```ts
const current = ref<number>(10)
```

### 宽度控制

通过`strokeWidth`属性来控制进度条宽度，默认`20rpx`。

```html
<hd-circle v-model="current" :strokeWidth="15"></hd-circle>
```

### 颜色定制

通过`color`属性控制进度条颜色，默认`#1C64FD`，通过`layerColor`属性控制进度条轨道颜色，默认`#EBEEF5`。

```html
<hd-circle v-model="current" color="#1C64FD" layerColor="#EBEEF5"></hd-circle>
```

### 渐变色

`color`属性支持传入对象格式来定义渐变色。

```html
<hd-circle v-model="current" :color="gradientColor"></hd-circle>
```

```ts
const gradientColor = {
  '0%': '#ffd01e',
  '100%': '#ee0a24'
}
```

### 进度条展开方向

通过`clockwise`属性控制进度条展开方向，`clockwise`为`false`时，进度会从逆时针方向开始。

```html
<hd-circle v-model="current" :clockwise="false"></hd-circle>
```

### 大小定制

通过`size`属性控制进度条圆环直径，默认`200rpx`。

```html
<hd-circle v-model="current" :size="300"></hd-circle>
```




## Props

|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|当前进度|`Number`|`false`|0|
|rate|目标进度|`Number` /  `String`|`false`|100|
|size|圆环直径，默认单位为 rpx|`String` /  `Number`|`false`|200|
|color|进度条颜色，传入对象格式可以定义渐变色|`String` /  `Object`|`false`|#1C64FD|
|layerColor|轨道颜色|`String`|`false`|#EBEEF5|
|fill|填充颜色|`String`|`false`|#ffffff|
|speed|动画速度（单位为 rate/s）|`Number`|`false`|50|
|text|文字|`String`|`false`|-|
|strokeWidth|进度条宽度 单位rpx|`Number`|`false`|20|
|strokeLinecap|进度条端点的形状，可选值为 "butt" | "round" | "square"|`'butt'` / `'round'` / `'square'`|`false`|round|
|clockwise|是否顺时针增加|`Boolean`|`false`|false|



## Slots

|Name|Description|Default Slot Content|
|---|---|---|
|default|自定义提示内容|-|




## 联系我

有不明白或者建议可以扫码交流
#### QQ群
<img  src="https://fant-mini-plus.top/img/qq.jpg
" width="220" height="auto">

#### 微信群
<img src="https://fant-mini-plus.top/img/weixin.png
" width="220" height="auto">
