# SVG点击功能调试指南

## 调试步骤

1. **打开浏览器控制台**
   - Chrome: 按 F12 或右键选择"检查"
   - 在Console标签页查看日志

2. **刷新页面后应该看到的日志**
   ```
   [SVGStationHandler] 页面加载完成，准备初始化
   [SVGStationHandler] 延迟初始化开始
   [SVGStationHandler] 初始化开始
   [SVGStationHandler] 绑定事件
   [SVGStationHandler] 添加模式切换按钮
   [index.html] SVG主视图加载完成
   [index.html] 调用SVGClickInjector
   [SVGClickInjector] 开始注入点击处理器
   [SVG内部脚本] 开始执行
   [SVG内部脚本] 找到text元素数量: XXX
   [SVG内部脚本] 点击事件绑定完成
   ```

3. **测试点击功能**
   - 将鼠标移到地铁站名上，应该看到鼠标变成手形指针
   - 点击站名时，控制台应该显示：
     ```
     [SVG内部脚本] 点击了站点: 站名
     [SVGClickInjector] 收到站点点击消息: 站名
     [SVGStationHandler] selectStation被调用，站点名: 站名
     ```

4. **如果点击无反应**
   - 检查控制台是否有错误信息
   - 确认SVG文件加载成功（Network标签页查看）
   - 尝试缩小地图后再点击（有时svg-pan-zoom会拦截事件）

## 实现原理

系统使用了多种方法确保点击事件能被捕获：

1. **SVG内部脚本注入**：直接在SVG文档内部添加点击处理
2. **PostMessage通信**：SVG内部通过postMessage与主页面通信
3. **事件委托**：在SVG文档上使用事件委托捕获点击
4. **多次尝试绑定**：通过定时器多次尝试获取SVG文档

## 常见问题

1. **Q: 为什么要用这么复杂的方法？**
   A: 因为SVG通过embed标签加载，且有svg-pan-zoom库处理缩放，普通的事件绑定可能被拦截。

2. **Q: 点击后站名没有填入输入框？**
   A: 检查gzmtr.js中的站名是否与SVG中的站名完全一致（包括空格）。

3. **Q: 可以禁用svg-pan-zoom吗？**
   A: 可以，但会失去缩放功能。当前方案保留了缩放功能。 