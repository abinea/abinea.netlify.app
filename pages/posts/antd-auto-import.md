---
title: Antd 按需引入
date: 2022-01-24T17:57:43+00:00
tag: React
---

1. 创建 react 项目（使用 typescript）

```bash
npx create-react-app ts-react-app --template typescript
```

1. 安装 antd 依赖

```bash
npm i antd
```

1. 使用 antd 的组件

```tsx
import Button from "antd/es/button"
import "./App.css"
```

在 App.css 的文件中还需要导入`antd/dist/antd.css`

如果我们想要实现按需导入样式：

-   需要安装`customize-cra`，`react-app-rewired`，`babel-plugin-import`

```bash
npm i react-app-rewired customize-cra babel-plugin-import
```

-   如果安装失败：删除 node_modules 再重新安装

```bash
npm i
```

-   修改 package.json 文件: 将`react-scripts`更换为`react-app-rewired`

```json
"scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
}
```

-   在项目根目录创建一个`config-overrides.js`用于修改默认配置，配置如下：

```jsx
const { override, fixBabelImports } = require("customize-cra")

module.exports = override(
	fixBabelImports("import", {
		libraryName: "antd",
		libraryDirectory: "es",
		style: "css",
	})
)
```

接下来使用组件直接按需导入，并且不需要手动导入样式。
