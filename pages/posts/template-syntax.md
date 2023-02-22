---
title: 模板语法
date: 2021-11-9T21:35:00.000+08:00
tag: JS
duration: 4min
---

# 模板语法

模板语法允许我们声明式地将数据绑定到对应 DOM 节点上，在渲染时，JavaScript 会将变量值或计算出的表达式结果替换掉声明部分。较为常见的模板语法有`mustcache`风格的`{{}}` 以及`DSL`风格的`html dsl`等。

以`mustcache`为例，比较简单的模板语法可以使用正则匹配的方式，替换掉`{{}}`，通过`new Function`创建一个`render`函数传参，实现文本插值。对循环等指令，同样可以通过这样解析替换实现，这里未给出。

```html
<body>
	<div id="root">
		<div class="w-100 h-100" id="wrapper">
			{{show+2}}
			<p>msg</p>
		</div>
		<div>这是{{description}}</div>
	</div>
</body>
<script>
	const data = {
		show: 2,
		description: "一个简单的模板语法",
	}
	function render(el, data) {
		el = document.querySelector(el)
		const str = el.innerHTML
		let html = str
			.replace(/"/g, '\\"')
			.replace(/\s+/g, " ")
			.replace(/\{\{(.)*?\}\}/g, (value) =>
				value.replace("{{", '"+(').replace("}}", ')+"')
			)
		html = `var target="${html}";return target;`

		const parse = new Function(...Object.keys(data), html)
		el.innerHTML = parse(...Object.values(data))
	}
	render("#root", data)
</script>
```

Vue1 最核心的实现就是基于这种简单地处理 token 流实现，然而对于比较复杂的渲染，解析的次数会逐渐变多，带来性能问题。

于是很快诞生的 Vue2，引入了虚拟 DOM，即将真实 DOM 解析成 AST（`Abstract Syntax Tree`），方便后续对模板进行处理，减少了多次解析字符串带来的性能消耗，同时将`HTML`变成一棵树的数据结构之后更加方便于遍历。

例如下面给出的这段 HTML 代码：

```html
<div class="root" name="root">
	<p>1</p>
	<div>11</div>
</div>
```

解析成的最简单的 AST：（parent 为父节点引用，暂不列出）

```json
{
	"type": "tag",
	"tagName": "div",
	"attr": {
		"className": "root",
		"name": "root"
	},
	"parent": null,
	"children": [
		{
			"type": "tag",
			"tagName": "p",
			"attr": {},
			"parent": {},
			"children": [
				{
					"type": "text",
					"tagName": "text",
					"parent": {},
					"content": "1"
				}
			]
		},
		{
			"type": "tag",
			"tagName": "div",
			"attr": {},
			"parent": {},
			"children": [
				{
					"type": "text",
					"tagName": "text",
					"parent": {},
					"content": "11"
				}
			]
		}
	]
}
```

基于 AST 的模板语法需要解析 HTML 成为 AST，然后将 AST 转化为字符串，将字符串作为函数执行，这个过程依旧需要用到 Function，下边的例子只是借助了 JavaScript 取得 DOM 结构生成 AST，没有自行解析 HTML。

```html
<body>
	<div id="root" class="root-node">
		<div>{{show}}</div>
		<div>{{description}}</div>
		hello
	</div>
</body>
<script>
	const data = {
		show: 1,
		description: "一个简单的模板语法",
	}

	function parseAST(root) {
		const node = {}
		node.parent = null
		if (root.nodeName === "#text") {
			// 处理文本节点
			node.type = "text"
			node.tagName = "text"
			node.content = root.textContent
				.replace(/\s+/g, " ")
				.replace(/"/g, '\\"')
		} else {
			node.type = "tag"
			node.tagName = root.localName
			node.children = []
			node.attr = {}
			Array.prototype.forEach.call(
				root.attributes,
				(item) => (node.attr[item.nodeName] = item.nodeValue)
			)
		}
		Array.prototype.forEach.call(root.childNodes, (element) => {
			const parsedNode = parseAST(element)
			parsedNode.parent = root
			node.children.push(parsedNode)
		})
		return node
	}

	function generateHTMLTemplate(AST) {
		var template = ""
		AST.forEach((node) => {
			if (node.type === "tag") {
				template += `<${node.tagName}>`
				template += generateHTMLTemplate(node.children)
				template += `</${node.tagName}>`
			} else {
				if (node.content.match(/\{\{(.)*?\}\}/)) {
					var expression = node.content.replace(
						/\{\{(.)*?\}\}/g,
						(value) =>
							value.replace("{{", '"+(').replace("}}", ')+"')
					)
					template += expression
				} else {
					template += node.content
				}
			}
		})
		return template
	}

	function render(el, template, data) {
		html = `var target="${template}";return target;`
		const parse = new Function(...Object.keys(data), html)
		el.innerHTML = parse(...Object.values(data))
	}
	const root = document.querySelector("#root")
	var AST = parseAST(root)
	var template = generateHTMLTemplate([AST])
	render(root, template, data)
</script>
```

虽然看起来最后都需要使用`Function`去处理字符串，而得到 AST 后还需要解析`HTML`然后再拼接字符串，增加了计算的时间，但是如果仅仅是完全基于处理字符串的方式实现的模板语法，在数据进行变更时都需要进行`render`，每次`render`的时候都需要重新渲染整个 DOM。

虽然在上边的简单实现中`AST`也是重新渲染了整个模版，但目前主流的框架例如`Vue`就是基于`AST`的方式，首先解析`template`为`AST`，然后对于`AST`进行静态节点标记，通过重用已标记静态的节点跳过比对，从而进行渲染优化，然后生成虚拟 DOM。当数据进行变更时虚拟 DOM 会进行`diff`算法的比对，找到数据有变更的节点，然后进行最小化渲染，这样就不需要在数据变更时将整个模板进行渲染，从而增加了渲染的效率。
