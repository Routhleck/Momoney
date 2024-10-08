# Momoney
[English](README.md) | [中文](README_CN.md)

## 项目简介
这是一个大富翁游戏的财富记录系统，允许玩家管理现金、资产、交易和历史记录。该系统提供了图表显示玩家的总资产和现金变化，并支持数据的导入和导出。

## 功能特性
- 初始化玩家和银行的现金
- 记录每轮的交易和资产变化
- 显示玩家的总资产和现金图表
- 支持数据的导入和导出
- 提供详细的操作日志

## 文件结构
- `index.html` - 主页面，包含游戏的UI结构
- `style.css` - 样式文件，定义了页面的样式
- `main.js` - 主脚本文件，包含主要的逻辑和事件处理
- `scripts/` - 包含各个功能模块的脚本文件
  - `chart.js` - 处理图表的更新和渲染
  - `dataIO.js` - 处理数据的导入和导出
  - `logManager.js` - 处理操作日志
  - `modelManager.js` - 处理模态窗口的显示和关闭
  - `playerManager.js` - 处理玩家的初始化和更新
  - `transaction.js` - 处理交易逻辑

## 安装与运行
1. 克隆项目到本地：
    ```bash
    git clone https://github.com/yourusername/monopoly.git
    ```
2. 打开`index.html`文件即可在浏览器中运行。

## 使用说明
1. 打开页面后，选择玩家数量（2-10）。
2. 点击“初始化现金”按钮，设置每个玩家的初始现金。
3. 使用控制面板进行下一轮、转账、购买资产和资产抵押等操作。
4. 导入和导出数据以保存和加载游戏进度。

## 贡献
欢迎提交问题和拉取请求来改进此项目。有关详细信息，请参阅[贡献指南](CONTRIBUTING.md)。

## 许可证
此项目使用MIT许可证。有关详细信息，请参阅[LICENSE](LICENSE)文件。
