# Tap & Read · Emoji 小课堂

一个可以直接部署到 GitHub Pages 的静态手机网页：宝宝点击 Emoji，就会按已选择的语言朗读；中文和 English 可以同时显示、同时朗读，也可以只保留其中一种。

## 功能

- 手机优先的上下分区 UI：上方是尽可能大的 Emoji 学习卡，下方是语言、分类和搜索。
- 支持中文（普通话）和 English，最多同时选择两种语言。
- 点击 Emoji 卡片或上方大 Emoji，使用浏览器 Web Speech API 朗读。
- 朗读会优先选择浏览器可用的 Natural/Online 中文声音；可用声音由 Windows、macOS 或浏览器提供。
- 本地加载 Emojibase v17 的中英文 `compact.json`，移除肤色变体后完整浏览约 1944 个 Emoji。
- 自动处理叠词搜索，例如“猫猫”“杯杯”会按“猫”“杯”寻找相关结果。
- 搜索支持中英文、关键词、多个词组合和近似匹配；无后台、无 API Key。
- 数据加载失败时仍有一组内置常用词可练习。

## GitHub Pages

把仓库中的文件推送到 GitHub，然后在 **Settings → Pages** 选择部署分支的根目录即可。这个项目没有构建步骤，保持 `index.html`、`styles.css`、`app.js` 和 `data/` 在同一层级即可。

完整词库已经同时打包进 `data/emoji-data.js`，因此直接双击 `index.html` 也能显示完整 Emoji。使用静态服务器仍然更接近 GitHub Pages 的运行环境：

```bash
npx serve .
```

然后打开终端显示的本地地址。

## 数据来源

`data/en.json` 和 `data/zh.json` 来自 [Emojibase Data](https://emojibase.dev/docs/datasets/) v17.0.0，数据依据 Unicode CLDR Emoji Annotations。应用运行时完全在浏览器本地搜索，不请求应用后端。
