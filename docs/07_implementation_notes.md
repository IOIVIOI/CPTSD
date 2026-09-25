# 07 — 实现笔记：数据模型 + 技术栈 + 缺口

## 一、技术栈（已定，勿自行改选型）

| 项 | 选择 | 说明 |
|----|------|------|
| 框架 | Vite + React + TypeScript | 最小、无后端 |
| 状态 | React Context | 够用 |
| 持久化 | localStorage（JSON） | 敏感数据本地，不上传 |
| 方法数据 | `methods/methods.json` 静态 import | 只读 |
| 样式 | Tailwind 或普通 CSS | 低饱和、柔和、大字号 |
| 路由 | React Router 或 hash | 6 页 |

**红线**：不引后端、不做账号、不上 SSR、不做复杂状态库。核心疗愈流程可离线。

## 二、数据模型（最小）

```
Entry（记录） —many— Method（方法，只读）
FlashbackSession（一次闪回急救）
```

### Entry（用户的一条记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| kind | enum | `critic_attack`（批判者攻击）/ `thought`（想法）/ `gratitude`（感恩）/ `feeling`（感受） |
| raw_text | string | 用户原文（永不覆盖） |
| rewritten_text | string | 改写/纠正后的温和版本（Critic 产出，可空） |
| critic_attack_type | int \| null | 14 种攻击之一（1–14，Critic 用） |
| intensity_before / intensity_after | int \| null | 情绪强度 0–100（可选） |
| created_at | datetime | 时间戳 |

### FlashbackSession（一次闪回急救）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| started_at / ended_at | datetime | 起止 |
| triggers | string[] | 诱因（外在/内在，可空） |
| steps_completed | int[] | 完成的 13 步编号 |
| intensity_before / intensity_after | int | 强度 0–100 |
| grounded | bool | 是否做了接地 |

### Method（只读）

来自 `methods/methods.json`（id / name / category / one_liner / problem_states / when_to_use / trigger_signals / steps / page / tool / referral / confidence / source）。

**关系**：Entry 可关联多个 method（通过 linked_method_ids，可选）；FlashbackSession 关联 A01/A04 方法。MVP 可先不做复杂关联，保持简单。

## 三、缺口与实现顺序

1. **数据层**：Entry / Method / FlashbackSession 模型（Method 读 methods.json）。
2. **安全层（先做）**：危机检测 `detectCrisis()` + 转介组件 + 接地组件（docs/10，程序确定性）。
3. **Rescue 闪回急救**：13 步逐条引导 + 接地 + 强度前后记录。
4. **Critic 内在批判者挑战**：14 攻击卡片 → 思维纠正 → 改写。
5. **Learn 了解自己**：4F 卡 / 毒性羞耻卡 / 感恩清单 / 闪回vs事实卡。
6. **Methods 方法库**：只读展示。
7. **Grieve 哀悼**：四方式引导（最重安全护栏）。
8. **AI 辅助（最后）**：docs/09，核心流程无 AI 也能跑。

## 四、关键实现注意

- **危机检测是纯规则匹配**（关键词表），不依赖 AI，命中即触发转介（docs/10）。
- **接地组件是全局可复用**的（呼吸动画 + 身体扫描），任何页面可一键唤起。
- **"随时可停"**：哀悼/闪回急救等页面，显眼的"停止/退出"即回安全态。
- **大字号、少内容**：闪回急救每一步只显示一条，配大"下一步/跳过"按钮。
