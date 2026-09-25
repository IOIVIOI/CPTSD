# CPTSD 自我疗愈工具

基于 Pete Walker《不原谅也没关系》（Complex PTSD: From Surviving to Thriving）的 CPTSD 自助疗愈网站。

**产品一句话**：在情绪被过去劫持时，温柔地带你回到当下；并条理化地管理毒性羞耻感与内在批判者。

**内容来源**：`cptsd_text.txt`（原书 EPUB 提取文本）；方法已整理到 `CPTSD方法库.md`（29 个方法）与 `methods/methods.json`（结构化数据）。

---

## 当前仓库结构（以实际存在为准）

```
├── README.md               ← 本文件（Codex 入口）
├── src/                    ← Vite + React + TypeScript 应用
│   ├── components/         ← 安全、接地、布局等共用组件
│   ├── context/            ← React Context + localStorage 持久化
│   ├── data/               ← 13 步、14 攻击、4F、哀悼等确定性数据
│   ├── lib/                ← 危机检测与存储
│   └── pages/              ← 六个 MVP 页面
├── CPTSD方法库.md          ← 29 个方法的结构化记录（临床内容权威）
├── cptsd_text.txt          ← 原书全文（核对用）
├── 不原谅也没关系…epub      ← 原书
├── methods/
│   └── methods.json        ← 29 个方法的结构化数据（App 直接 import）
└── docs/
    ├── 06_mvp_scope.md           ← MVP 范围（做 / 不做）
    ├── 07_implementation_notes.md ← 数据模型 + 技术栈 + 实现顺序
    ├── 08_screen_spec.md         ← 6 页页面规格 + 验收脚本
    ├── 09_ai_tool_routing.md     ← AI 路由（辅助型，含护栏）
    └── 10_safety_guardrails.md   ← 安全护栏（优先级最高，必读）
```

## 当前实现状态

- 六个 MVP 页面已完成：Home / Rescue / Critic / Grieve / Learn / Methods。
- 危机检测、转介、全局接地、随时可停均由程序确定性处理。
- 核心疗愈流程不依赖 AI；Critic 默认使用手动识别和改写。
- 记录与自评状态保存在本机 localStorage，不上传服务器。
- 视觉采用暖色玻璃设计语言，结构参考 PSJ Glass UI，颜色改为陶土、杏色、金棕与鼠尾草绿。
- AI 的 `identify_critic_attack` / `rewrite_thought` 接口供应商尚未确定，因此未接入网络模型。

## 本地运行

```bash
npm install
npm run dev
```

验证命令：

```bash
npm test
npm run build
```

## 手机安装与离线使用

生成 PWA 移动版本：

```bash
npm run build:mobile
npm run preview:mobile
```

手机与电脑在同一局域网时，可访问电脑的局域网 IP（例如
`http://192.168.1.10:4173/`），再通过浏览器菜单添加到主屏幕。iPhone 使用
Safari 的“分享 → 添加到主屏幕”，Android 使用 Chrome 的“添加到主屏幕”。

说明：Service Worker 离线缓存只在 HTTPS 或 localhost 安全上下文生效。若要长期脱离电脑使用，需要把 `dist/` 部署到任意 HTTPS 静态托管；项目已包含 PWA
manifest、桌面图标和离线 Service Worker，部署后首次打开即可缓存核心页面。

---

# Codex Start Here

### 1. 项目产品目标

做一个**非聊天式**的 CPTSD 自助工具。核心不是"跟 AI 聊天"，而是把书里的疗愈方法做成**确定性的交互工具**（闪回急救引导、内在批判者挑战、接地练习等）。AI 只做两个辅助：识别批判者攻击类型、把自我批判改写得更温和。

北极星：**情绪被过去劫持时，温柔地带人回到当下。**

### 2. 当前 MVP 范围

六个页面，覆盖两条最高频路径：

1. **Home（此刻）** —— 大按钮"我正闪回" + "内在批判者在攻击我"，快速入口。
2. **Rescue（闪回急救）** —— 13 个闪回管理步骤 + 接地（危机工具，最高优先级）。
3. **Critic（内在批判者挑战）** —— 14 种内在批判者攻击 + 思维纠正（最高频日常工具）。
4. **Grieve（哀悼与情绪）** —— 愤怒/哭泣/口头宣泄/感受（含重安全护栏）。
5. **Learn（了解自己）** —— 4F 类型、毒性羞耻、感恩、闪回 vs 事实（心理教育）。
6. **Methods（方法库）** —— 29 个方法只读参考。

详细范围见 `docs/06_mvp_scope.md`。

### 3. 开发前必须阅读哪些文件

**开始编码前，先读：**

- `docs/10_safety_guardrails.md`（安全护栏，最高优先级）
- `docs/06_mvp_scope.md`
- `docs/07_implementation_notes.md`
- `docs/08_screen_spec.md`
- `docs/09_ai_tool_routing.md`

**然后再读**：`methods/methods.json`、`CPTSD方法库.md`。

### 4. 第一开发阶段应该做什么

1. 搭最小骨架（技术栈见 docs/07）。
2. **先做 Rescue（闪回急救）+ 接地**（这是危机工具，安全优先级最高）。
3. 再做 **Critic（内在批判者挑战）**（最高频日常工具）。
4. 然后 **Learn + Methods**（心理教育 + 参考）。
5. 再做 **Grieve（哀悼）**（含最重安全护栏）。
6. 最后接 AI 辅助（docs/09；核心流程无 AI 也要能跑）。

每个页面先跑通"空状态 → 正常 → 完成"，且**安全护栏从第一行代码就内置**。

### 5. 哪些功能明确不应该现在做

- **不做诊断、不做治疗、不给医疗建议**（详见 docs/10）。
- **不做聊天机器人**（AI 只做辅助路由，不自由对话）。
- **不引导深挖创伤记忆**（哀悼只做温和释放，不做创伤回放）。
- **不做**账号 / 云同步 / 社交 / 复杂 SaaS / 推送轰炸（MVP 本地单用户）。
- **不把"感恩/积极思考"做成强迫性指令**（须注明"不在闪回时做"）。

### 6. 当前已经确定的 UX 原则

1. **安全优先**：危机检测、接地、"随时可停"、转介，从第一屏就内置。
2. **温柔、无羞耻**：文案不指责、不强迫积极、不否定感受；把闪回/羞耻/批判者正常化为"创伤后的适应反应"。
3. **确定性工具打底**：核心疗愈流程（闪回急救、接地、思维纠正）完全确定性、可离线；AI 只做辅助。
4. **大字号、低刺激**：闪回中用户"上头"，界面要少、字要大、节奏要慢。
5. **一步一件事**：不一次给 13 步，逐条引导，可跳过。
6. **随时能回到安全**：任何页面都能一键到接地或首页。

### 7. 当前仍存在的产品不确定性

1. **AI 是否接入、用哪家**——未定；核心流程不依赖 AI（详见 docs/09）。
2. **视觉/品牌**——刻意未指定；docs/08 只定义结构与状态。建议低饱和、低刺激、柔和色调。
3. **界面语言**——默认简体中文。
4. **数据持久化**——先本地单用户（localStorage），账号/云同步不做。

### 8. 如果发现文档冲突，遵循什么优先级

高 → 低：

1. `docs/10_safety_guardrails.md` —— **安全权威，最高优先级**。
2. `CPTSD方法库.md` —— 临床方法内容权威（书中方法不可被 UI 改动）。
3. `docs/06_mvp_scope.md` —— 范围权威（决定"做不做"）。
4. `docs/08_screen_spec.md` —— 页面行为权威。
5. `docs/09_ai_tool_routing.md` —— AI 路由权威。
6. `README.md` —— 索引/摘要，可能滞后。

> 冲突处理：安全 > 临床方法 > 范围 > 页面 > AI。任何与安全冲突的实现，一律砍掉或改掉。

---

**开发指令**：Codex 在开始编码前，应先读取 `docs/10_safety_guardrails.md`、`docs/06_mvp_scope.md`、`docs/07_implementation_notes.md`、`docs/08_screen_spec.md`、`docs/09_ai_tool_routing.md`，然后再读 `methods/methods.json` 和其他文档。
