export const flagshipCase = {
  id: 'invisible-roommate',
  status: '可执行提案',
  duration: '13—15 分钟',
  sample: '杭州高层住宅',
  cover: 'assets/images/invisible-roommate-cover.webp',
  script: 'content/invisible-roommate-script.md',
  modules: ['选题来源', '核心科学问题', '叙事结构', '拍摄执行', '科学核验', '处理建议'],
  scriptSections: {
    source: { start: '开场：', end: '第一章：' },
    science: { start: '第一章：', end: '入口一：' },
    narrative: { start: '入口一：', end: '蚂蚁：' },
    shooting: { start: '蚂蚁：', end: '建立一套普通人能使用的判断方法' },
    verification: { start: '拍摄前必须完成的核验', end: null },
    treatment: { start: '怎样处理，才算真的解决问题？', end: '片尾互动' },
  },
};

export const ideas = [
  { id:'wanhu-flight', short:'万户飞天', title:'中国人能飞？', pain:'如果穿越成万户的家仆，能用现代物理造出一台安全起飞的“飞椅”吗？', format:'按年代解锁火药、材料、电力与动力学，最终制作安全比例机，或由专业团队完成受控测试。', value:'历史 × 工程 × 大制作，把传奇拆成一条可以验证的技术路线。', type:'历史 × 工程', tier:'PRIORITY' },
  { id:'smell-lab', short:'臭味制造', title:'臭到离谱', pain:'鼻屎味也能卖钱？脚臭、汗臭、狐臭和粑粑味究竟怎么被做出来，又被谁买走？', format:'探访气味实验室，进行安全嗅觉盲测，比较汗液代谢物与狐臭相关气味成分，并拆解香精与化学成分。', value:'强猎奇、强感官画面，最后反转到食品、玩具、驱避与训练中的真实用途。', type:'化学 × 嗅觉', tier:'PRIORITY', image:'assets/images/idea-smell-lab.webp' },
  { id:'blind-box', short:'盲盒手气', title:'玄学手气？', pain:'手气最好和最差的人都提前锁定同一款，谁真的更容易抽中？', format:'双人长期盲抽、公开预测并记录概率与选择行为。', value:'低成本实测却天然有悬念，把“欧皇 / 非酋”拉回样本量、选择偏差与随机性。', type:'概率 × 行为', tier:'PRIORITY', image:'assets/images/idea-blind-box.webp' },
  { id:'pain-threshold', short:'疼痛阈值', title:'你真疼吗？', pain:'同一根针、同一块冰，为什么每个人感受到的疼痛像两个世界？', format:'只进行安全的冷压与压力实验，结合量表、神经科学专家和真实病痛经历，不做危险刺激或医学诊断。', value:'高共鸣与科学深度并存，解释“矫情”和“太能忍”背后的个体差异。', type:'神经科学 × 实测', tier:'PRIORITY' },
  { id:'gaming-reward', short:'游戏成瘾', title:'大脑被偷走', pain:'一局游戏究竟偷走了什么？爱玩和不爱玩的人，大脑奖励系统真的不同吗？', format:'进行游戏前后专注、时间感与情绪实验，由专家区分喜欢、高投入与失控性使用，不污名化玩家。', value:'从公共焦虑切入奖励机制，把道德判断改写成可观察的行为证据。', type:'脑科学 × 游戏', tier:'PRIORITY' },
  { id:'social-brain', short:'社交大脑', title:'情商能改吗？', pain:'智商天注定，但情商能改吗？连续 7 天训练社交大脑，真的会变会说话吗？', format:'设计 7 天可重复的社交训练任务，记录表达、倾听与情绪识别变化，由心理学研究者解释练习效果与局限。', value:'把“高情商”从标签变成可观察、可复盘的行为训练。', type:'心理 × 挑战', tier:'PRIORITY', image:'assets/images/idea-social-brain.webp' },
  { id:'ai-fire', short:'AI 焚决', title:'AI 焚决！', pain:'如何像无良老板那样榨干你的 AI，解放大脑？', format:'连续测试提示词、工作流和自动化协作，把重复劳动交给 AI，同时标注事实核验、隐私和版权边界。', value:'用实测展示 AI 如何放大创作效率，而不是把工具神化成答案。', type:'AI × 效率', tier:'PRIORITY', image:'assets/images/idea-ai-fire.webp' },
  { id:'fear-switch', short:'恐惧症', title:'恐惧开关', pain:'尖嘴、密集、巨物、深海——大脑为什么会对某些画面瞬间拉响警报？', format:'在心理学专家设计与知情同意下进行安全暴露、眼动和心率观察，搭建“恐惧博物馆”。', value:'把难以描述的恐惧变成强视觉场景，同时解释本能、经验与文化如何共同塑造警报。', type:'心理 × 感官', tier:'ARCHIVE', image:'assets/images/idea-fear-switch.webp' },
  { id:'same-illness', short:'中医与西医', title:'同病异路', pain:'同样咳嗽，分别走进中医和西医诊室，会得到两套完全不同的答案吗？', format:'设置同一标准化症状并完整记录两种问诊逻辑，由医生审核边界；不判输赢、不替代诊断，并标明必须就医的情况。', value:'真正的冲突不是谁赢，而是两套知识系统如何定义问题、适用于什么场景。', type:'医学 × 比较', tier:'ARCHIVE', image:'assets/images/idea-tcm-western.webp' },
  { id:'dialect-training', short:'方言', title:'方言特训', pain:'30 天能学会一门最难懂的方言吗？它真能成为“加密频道”？', format:'每日沉浸任务、街头实战和母语者评分，并考据方言通讯在特定语境中的保密价值。', value:'挑战叙事自带连续追看动力，也能把语言学与地方文化拍得有参与感。', type:'语言 × 挑战', tier:'ARCHIVE', image:'assets/images/idea-dialect.webp' },
  { id:'flushed-face', short:'运动脸红', title:'关公上脸', pain:'运动完脸像关公，染料激光真能解决，还是医美话术放大了焦虑？', format:'运动实测后由皮肤科医生判断血管反应与排查边界，明确适应证、风险、预期和“并非人人需要治疗”。', value:'从高频身体经验进入医学机制，同时示范如何审视消费型健康话术。', type:'皮肤科学 × 医美', tier:'ARCHIVE', image:'assets/images/idea-flushed-face.webp' },
  { id:'appendix-bomb', short:'人体炸弹', title:'阑尾到底有什么用？', pain:'一个常被叫作“废物”的器官，为什么还会突然变成需要急诊处理的人体炸弹？', format:'用 3D 动画拆开阑尾结构，结合外科医生讲解它的免疫与肠道微生态作用，并说明急性腹痛的就医边界。', value:'把熟悉的医学名词变成有悬念的身体探索，兼具奇观和科普准确性。', type:'医学 × 3D', tier:'ARCHIVE' },
  { id:'real-skin', short:'真实皮肤', title:'镜头里的你，真的比想象中难看吗？', pain:'放大 100 倍的真实皮肤，会不会让我们重新理解“瑕疵”和容貌焦虑？', format:'在知情同意与隐私保护下拍摄真实皮肤微距，结合皮肤科与心理学解释纹理、毛孔和镜头感知。', value:'用视觉冲击拆解审美滤镜，不把普通皮肤重新包装成新的焦虑。', type:'皮肤 × 视觉', tier:'ARCHIVE', image:'assets/images/idea-real-skin.webp' },
  { id:'eye-tracking', short:'视线失控', title:'一个眼睛站岗，一个眼睛放哨？', pain:'斜视眼球究竟如何运动，为什么两只眼睛会像在执行不同任务？', format:'高速相机记录眼球轨迹，由眼科医生结合 3D 动画解释成因、代偿和需要就医的信号。', value:'把难以凭肉眼理解的视觉机制变成可观看、可验证的运动轨迹。', type:'眼科 × 高速摄影', tier:'ARCHIVE', image:'assets/images/idea-eye-tracking.webp' },
  { id:'fish-behavior', short:'鱼在想啥？', title:'鱼会怕黑吗？', pain:'把鱼放进一半漆黑的观景缸，它为什么宁愿挤在亮处也不游进去？', format:'设置可逆、低应激的明暗选择实验，记录群体行为并由动物行为学研究者解释趋光与风险判断。', value:'低成本却有强画面和连续悬念，让“鱼在想什么”变成可观察的问题。', type:'动物行为 × 实验', tier:'ARCHIVE', image:'assets/images/idea-fish-behavior.webp' },
  { id:'mbti-workplace', short:'性格工位', title:'直击公司 16 种 MBTI 上班！', pain:'E 人和 I 人，真的适合完全不同的工作吗？', format:'设计统一工作任务与情境观察，结合组织心理学澄清 MBTI 的适用边界，不把类型当成招聘或能力诊断。', value:'把流行人格话题拉回真实工作行为，既有街采戏剧性也有方法边界。', type:'职场 × 心理', tier:'ARCHIVE' },
];

