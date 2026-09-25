export interface FourFProfile {
  id: "fight" | "flight" | "freeze" | "fawn";
  letter: string;
  name: string;
  defense: string;
  summary: string;
  signals: string[];
  strength: string;
  direction: string;
}

export const fourFProfiles: FourFProfile[] = [
  {
    id: "fight",
    letter: "Fight",
    name: "战",
    defense: "自恋型防御",
    summary:
      "遇到威胁时更容易用力量、控制、愤怒或批判夺回安全感。它曾经帮助你不再成为最弱的那一个。",
    signals: [
      "被触发时容易发火、讽刺或逼迫别人",
      "很难容忍失控或不完美",
      "常在关系里占据强势位置，却仍感到被遗弃",
    ],
    strength: "有行动力、保护欲和争取公平的能力",
    direction:
      "练习暂停，把愤怒还给真正伤害过你的人，并学习看见他人的感受与界限。",
  },
  {
    id: "flight",
    letter: "Flight",
    name: "逃",
    defense: "强迫型防御",
    summary:
      "遇到威胁时更容易忙碌、担心、计划或追求完美，用行动和思考远离痛苦。你并不是天生停不下来。",
    signals: [
      "一停下来就觉得不安或内疚",
      "反复检查、担心未来、难以放松",
      "把忙碌和高效当成安全与价值的证明",
    ],
    strength: "执行力、准备能力和解决问题的才能",
    direction:
      "练习把速度降到“空档”，允许休息，并让情绪而不是完美要求决定节奏。",
  },
  {
    id: "freeze",
    letter: "Freeze",
    name: "僵",
    defense: "解离型防御",
    summary:
      "在无法反击或逃跑时，身体可能选择冻结、麻木、躲藏或放空。这是保护系统在过载时的关闭反应。",
    signals: [
      "突然脑子空白、身体动不了或像隔着一层玻璃",
      "倾向孤立、长时间睡、刷屏或躲进幻想",
      "很难感到需要、欲望和愤怒",
    ],
    strength: "观察力、忍耐力和丰富的内在世界",
    direction:
      "从很小的身体动作、关系安全和可预测的节奏开始，慢慢恢复意志与连接。",
  },
  {
    id: "fawn",
    letter: "Fawn",
    name: "讨好",
    defense: "关系依赖型防御",
    summary:
      "遇到威胁时更容易照顾、迎合和服从，用满足别人来换取安全与连接。你不是没有自我，只是曾经不被允许拥有自我。",
    signals: [
      "很难拒绝或表达不同意见",
      "很快察觉别人的需要，却忽略自己的",
      "冲突后反复道歉，甚至替别人承担错误",
    ],
    strength: "共情、照顾、合作和建立关系的能力",
    direction:
      "从察觉自己的偏好开始，练习说“不”和保留选择权，不再把自我牺牲当作爱。",
  },
];

export interface RecoverySign {
  id: number;
  title: string;
  detail: string;
}

export const recoverySigns: RecoverySign[] = [
  {
    id: 1,
    title: "正念增加，无意识反应减少",
    detail: "更早发现自己在闪回或进入旧反应，即使它还没有立刻停下。",
  },
  {
    id: 2,
    title: "内在批判者开始缩减",
    detail: "自我攻击不再完全主导，越来越多时候能识别并拒绝它。",
  },
  {
    id: 3,
    title: "大脑对自己更友好",
    detail: "面对小错误或低落时，更容易出现理解而不是迫害自己。",
  },
  {
    id: 4,
    title: "情绪智力在增长",
    detail: "更能辨认、承受和表达情绪，而不必马上压抑或转移。",
  },
  {
    id: 5,
    title: "身体更放松，心理更平和",
    detail: "过度警觉、紧绷或持续消耗出现一些松动。",
  },
  {
    id: 6,
    title: "健康的自我意识在成长",
    detail: "更清楚自己喜欢什么、需要什么，也更能为自己做选择。",
  },
  {
    id: 7,
    title: "人生叙事更自我怜悯",
    detail: "不再只把自己讲成有缺陷的人，而能看到创伤与幸存的力量。",
  },
  {
    id: 8,
    title: "能用脆弱建立亲密",
    detail: "在足够安全的关系中，更敢让对方看见真实的感受。",
  },
  {
    id: 9,
    title: "拥有足够好的安全关系",
    detail: "至少有一些关系能提供尊重、回应和相对稳定。",
  },
];
