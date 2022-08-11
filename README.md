> CSDN解析地址

本库详细说明请转至CSDN：[https://blog.csdn.net/weixin_43783814/article/details](https://blog.csdn.net/weixin_43783814/article/details)

示例图：
![low-code编辑](./README/1.png)
![low-code schema 渲染](./README/2.png)
![图编辑](./README/3.png)


> 阅读代码并修改的笔记

# 总体架构

基于umi进行架构，`/pages/index.js` 中只有一个link到初始表单页面，根据umi的页面逻辑，`/pages`下的所有jsx文件都能够通过umi路由进行指向并渲染

初始表单页面通过`/components`中的`form-table`与`form-dialog`组件协助，完成表单显示与修改的功能，其中表单选项的操作部分逻辑写在了`_config`文件中，将表单的初始操作对象传进去进行操作

`edit`界面需要完成信息的传递工作，因此需要将组件数据注册在这里，组件操作所有相关函数都写在这里，以便通信之后完成数据的改写操作

中间的显示通过Iframe完成，而Iframe组件只负责新建iframe并完成信息的传递，实际页面显示是通过路由定向到`/visual-page/checked-comp`完成，对应的页面则依靠Drop与`/mobile_components`完成页面渲染，对应的数据操作都`window.parent.postMessage`传递到上层，上层完成对应数据的修改操作

而中间显示页面通过`/mobile_components`封装好的传入`data`进行渲染，右端的修改组件，根据`/mobile_components`预先写好的`schema.json`配合表单属性进行配置，表单组件根据新建的属性与配置完成渲染

# 改写
- 类组件改写为函数组件，对于this的绑定通过闭包函数方式解决
- state通过useState完成，生命周期通过useEffect完成
- message的监听与解除通过useEffect的返回函数完成
- 外部依赖的移动端组件迁移到`@/mobile_components`下

> react 基于组件的可视化设计

## [demo 地址](https://koki-5ghulbfed42032ec-1301619189.tcloudbaseapp.com/#/visual-page/edit?pageId=807102f66241a729026a85cf5e4b3926)

## feature

1. 整体框架基于[umijs](https://umijs.org/)
2. 表单组件基于[Formily 2+ schema](https://v2.formilyjs.org/zh-CN)
3. 拖拽基于[html5 drag&drop 属性](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
4. 移动端组件基于[antd-mobile](https://mobile.ant.design/)



> 仿照架构进行图编辑的开发

## 参考
1. 整体组件通信框架基于Iframe
2. 表单组件基于[Formily 2+ schema](https://v2.formilyjs.org/zh-CN)
3. 图实时显示组件基于[react-graph-vis](https://github.com/crubier/react-graph-vis)


> 基于JsonSchema的代码表示页面

## 正在开发中，可以先看demo页面


## to do
丰富组件库

## Build Setup

```bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn start

# build for production with minification
yarn build
```
