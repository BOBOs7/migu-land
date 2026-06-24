import { loc } from '../i18n'
import type { SiteContent } from './types'

export const siteContent: SiteContent = {
  meta: {
    title: 'Ming | Game Designer',
    description:
      'Ming is a game interaction designer with a passion for creating engaging and immersive gaming experiences.',
    ogImage: '/assets/cover/cover-ogimg.png',
  },

  profile: {
    name: loc('Hi! 我是明月。', 'Hi! I\'m Mingyue.'),
    nameEn: 'Hi! I\'m Mingyue.',
    tagline: loc(
      '游戏交互设计师。',
      'A GAME INTERACTION DESIGNER.',
    ),
    tags: [
      loc('UE / Unity'),
      loc('交互设计', 'Interaction Design'),
      loc('系统设计', 'System Design'),
      loc('多端适配', 'Cross-platform Adaptation'),
      loc('设计规范沉淀', 'Design Guidelines'),
      loc('AI 辅助提效', 'AI-assisted Workflow'),
    ],
    avatarSrc: '/assets/profile.png',
  },

  nav: [{ id: 'home', label: loc('首页', 'HOME'), path: '/' }],

  caseStudies: [
    {
      id: 'space-nation',
      category: 'work',
      title: loc('SPACE NATION'),
      tagLabel: loc('系统设计/Unity引擎/PC端', 'System Design / Unity / PC'),
      status: 'released',
      cardIntro: loc(
        '太空歌剧主题开放世界 MMO 海外 PC 端游戏，参与中后期研发至上线，覆盖系统策划与交互设计全链路。',
        'A space-opera open-world MMO for overseas PC players. I joined from mid-to-late development through launch, covering the full workflow from system planning to interaction design.',
      ),
      coverSrc: '/assets/cover/cover-sn.png',
      subtitle: loc('开放世界 MMO [已上线]', 'Open-world MMO [Released]'),
      engine: loc('Unity'),
      platform: loc('海外 PC 端', 'Overseas PC'),
      period: '2023.8 – 2024.8',
      year: '2024',
      role: loc('系统策划', 'System Designer'),
      sortOrder: 1,
      desensitized: false,
      externalUrl: 'https://spacenation.online/',
      modalBlocks: [
        {
          type: 'paragraph',
          text: loc(
            'SPACE NATION 是一款以太空歌剧为主题的开放世界 MMO 海外 PC 端游戏。我在项目中后期研发阶段加入，并参与至正式上线。期间负责多个系统功能的策划方案与交互设计，工作内容覆盖系统规则梳理、配置表设计、交互原型制作、开发跟进、功能验收与版本优化，具备从功能方案完善到 Unity 落地上线的完整项目经验。',
            'SPACE NATION is a space-opera open-world MMO for overseas PC players. I joined during the mid-to-late development stage and stayed through official launch. I was responsible for planning and interaction design for multiple systems, covering rule definition, configuration table design, interaction prototypes, development follow-up, feature acceptance, and version iteration, with end-to-end experience from feature planning to Unity implementation and release.',
          ),
        },
        { type: 'heading', text: loc('社交协作系统设计', 'Social and Teamplay System Design') },
        {
          type: 'paragraph',
          text: loc(
            '负责好友与组队相关系统设计，梳理组队大厅、快捷邀请、入队申请、队长权限、队伍状态反馈、退出与解散等流程，优化跨界面组队路径与多人协作体验。',
            'Designed friend and party-related systems, including party lobby flow, quick invites, join requests, leader permissions, party state feedback, leaving and disbanding flows, improving cross-screen party formation and multiplayer collaboration.',
          ),
        },
        {
          type: 'image',
          src: '/assets/projects/space-nation/SN-1-1.png',
          alt: loc('SPACE NATION · 社交协作系统', 'SPACE NATION · Social and teamplay system'),
        },
        { type: 'heading', text: loc('外观编辑器系统设计', 'Customization Editor System Design') },
        {
          type: 'paragraph',
          text: loc(
            '主导舰船涂装编辑器交互设计，支持多部位选色、贴花编辑、套装替换、实时预览与保存反馈，并参与舰船展示镜头点位、镜头缓动路线与养成闭环设计。',
            'Led the interaction design for the ship livery editor, supporting multi-part color selection, decal editing, preset replacement, real-time previews, and save feedback. I also contributed to ship presentation camera positions, easing paths, and progression loop design.',
          ),
        },
        {
          type: 'image',
          src: '/assets/projects/space-nation/SN-2-1.png',
          alt: loc('SPACE NATION · 外观编辑器', 'SPACE NATION · Customization editor'),
        },
        { type: 'heading', text: loc('运营与系统信息可视化补充', 'Operations and System Information Visualization') },
        {
          type: 'paragraph',
          text: loc(
            '项目上线初期，由于运营人手有限，我临时负责部分玩法的双语引导设计。以下为引导内容节选，相关内容完全使用 Figma 完成设计。',
            'During the early launch period, operations resources were limited, so I temporarily handled bilingual guide design for several gameplay features. The examples below were fully designed in Figma.',
          ),
        },
        {
          type: 'image',
          src: '/assets/projects/space-nation/SN-3.png',
          alt: loc('SPACE NATION · 运营引导节选', 'SPACE NATION · Operations guide excerpt'),
        },
      ],
    },
    {
      id: 'higame',
      category: 'work',
      title: loc('Project HI'),
      tagLabel: loc('交互设计/UE引擎/全平台', 'Interaction Design / Unreal Engine / All Platforms'),
      status: 'nda',
      cardIntro: loc(
        '在研模拟经营 RPG 全平台游戏，负责核心系统、大世界探索、任务叙事与小型玩法等多模块的 PC/主机端交互设计。',
        'An in-development simulation RPG for all platforms. I handled PC and console interaction design across core systems, open-world exploration, quest narrative, and mini-game modules.',
      ),
      coverSrc: '/assets/cover/cover-hi.png',
      subtitle: loc('模拟经营 RPG', 'Simulation RPG'),
      engine: loc('UE'),
      platform: loc('全平台', 'All Platforms'),
      period: '2024.11 – 2026.5',
      year: '2026',
      role: loc('交互策划', 'Interaction Designer'),
      sortOrder: 2,
      desensitized: true,
      modalBlocks: [
        {
          type: 'paragraph',
          text: loc(
            '在研项目 HI 是一款模拟经营 RPG 全平台游戏。我负责核心系统、大世界探索、任务叙事与小型玩法等多模块的 PC/主机端交互设计，参与需求拆解、方案设计、原型搭建、开发跟进、跑测验收与迭代优化。',
            'Project HI is an in-development simulation RPG for all platforms. I was responsible for PC and console interaction design across core systems, open-world exploration, quest narrative, and mini-game modules, participating in requirement breakdown, solution design, prototype building, development follow-up, playtest acceptance, and iterative optimization.',
          ),
        },
        { type: 'heading', text: loc('核心系统交互设计', 'Core System Interaction Design') },
        {
          type: 'paragraph',
          text: loc(
            '负责多个核心系统的交互设计，包括主角捏脸、新手/赛季 BP、个人主页、交易行、剧情总览等。本节以主角捏脸系统为案例，展示从流程、状态、跨端适配到落地协作及后续优化的完整交互设计。',
            'Designed interactions for multiple core systems, including character creation, onboarding and seasonal battle pass, player profile, marketplace, and story overview. This section uses the character creator as a case study, showing the complete interaction design process from flow and state design to cross-platform adaptation, implementation collaboration, and later optimization.',
          ),
        },
        {
          type: 'gallery',
          images: [
            {
              src: '/assets/projects/higame/HI-1-1.png',
              alt: loc('核心系统交互设计 · 概览（脱敏）', 'Core system interaction design · Overview (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-1-2.png',
              alt: loc('核心系统 · 流程拆解（脱敏）', 'Core system · Flow breakdown (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-1-3.png',
              alt: loc('核心系统 · 状态设计（脱敏）', 'Core system · State design (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-1-4.png',
              alt: loc('核心系统 · 跨端适配（脱敏）', 'Core system · Cross-platform adaptation (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-1-5.png',
              alt: loc('核心系统 · 协作与优化（脱敏）', 'Core system · Collaboration and optimization (redacted)'),
            },
          ],
        },
        { type: 'heading', text: loc('开放世界任务与探索交互设计', 'Open-world Quest and Exploration Interaction Design') },
        {
          type: 'paragraph',
          text: loc(
            '日常主要负责任务模块和大世界模块的交互设计。本节以任务和大世界体验迭代为案例，展示从跑测反馈、定位问题到设计优化方案的系统性迭代思路。',
            'My daily work focused mainly on quest and open-world modules. This section uses quest and open-world experience iterations as examples, showing a systematic iteration process from playtest feedback and problem diagnosis to design optimization.',
          ),
        },
        {
          type: 'gallery',
          images: [
            {
              src: '/assets/projects/higame/HI-2-1.png',
              alt: loc('任务与探索 · 跑测反馈（脱敏）', 'Quests and exploration · Playtest feedback (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-2-2.png',
              alt: loc('任务与探索 · 问题定位（脱敏）', 'Quests and exploration · Problem diagnosis (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-2-3.png',
              alt: loc('任务与探索 · 优化方案（脱敏）', 'Quests and exploration · Optimization plan (redacted)'),
            },
          ],
        },
        { type: 'heading', text: loc('叙事玩法与小型玩法交互设计', 'Narrative and Mini-game Interaction Design') },
        {
          type: 'paragraph',
          text: loc(
            '叙事玩法主要包括推理搜证、侦察测试、选角起名、剧情 QTE 等强叙事玩法交互设计；小型玩法主要包括大头贴、打地鼠、冰壶、限时挑战及多种互动装置玩法的交互设计。围绕教学引导、玩法目标、操作反馈、失败提示与结算展示进行设计与迭代。',
            'Narrative gameplay work included interaction design for investigation, evidence search, reconnaissance tests, character selection and naming, story QTEs, and other narrative-heavy experiences. Mini-game work included photo booths, whack-a-mole, curling, timed challenges, and multiple interactive devices, with design iterations around tutorials, goals, input feedback, failure prompts, and result presentation.',
          ),
        },
        {
          type: 'gallery',
          images: [
            {
              src: '/assets/projects/higame/HI-3-1.png',
              alt: loc('叙事/小型玩法 · 案例 01（脱敏）', 'Narrative and mini-game design · Case 01 (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-3-2.png',
              alt: loc('叙事/小型玩法 · 案例 02（脱敏）', 'Narrative and mini-game design · Case 02 (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-3-3.png',
              alt: loc('叙事/小型玩法 · 案例 03（脱敏）', 'Narrative and mini-game design · Case 03 (redacted)'),
            },
            {
              src: '/assets/projects/higame/HI-3-4.png',
              alt: loc('叙事/小型玩法 · 案例 04（脱敏）', 'Narrative and mini-game design · Case 04 (redacted)'),
            },
          ],
        },
        { type: 'heading', text: loc('AI 辅助设计工作流', 'AI-assisted Design Workflow') },
        {
          type: 'paragraph',
          text: loc(
            '本节列举 AI 在工作中的应用案例，包括提升构思、分析设计表达、制作原型、代码实现与优化工具等。AI 全流程开发游戏的具体流程请见 Guru Cafe 项目。',
            'This section lists examples of how I used AI at work, including ideation support, design communication analysis, prototype creation, code implementation, and tool optimization. For a full AI-assisted game development process, see the Guru Cafe project.',
          ),
        },
        {
          type: 'image',
          src: '/assets/projects/higame/HI-4-2.png',
          alt: loc('AI 辅助设计工作流（脱敏）', 'AI-assisted design workflow (redacted)'),
        },
      ],
    },
    {
      id: 'guru-cafe',
      category: 'personal',
      title: loc('Guru Cafe'),
      tagLabel: loc('AI全流程/关卡设计/交互动效', 'End-to-end AI Workflow / Level Design / Interaction Motion'),
      status: 'competition',
      cardIntro: loc(
        '全流程使用 AI 工具开发的休闲合成游戏，参与腾讯光子艺术部 2026 AI 游戏大赛。',
        'A casual merge game developed with AI tools across the full workflow, created for the Tencent Photon Art Department 2026 AI Game Competition.',
      ),
      coverSrc: '/assets/cover/cover-guru.png',
      subtitle: loc('休闲合成游戏 [AI 全流程]', 'Casual Merge Game [End-to-end AI Workflow]'),
      engine: loc('AI 全流程', 'End-to-end AI Workflow'),
      platform: loc('PC 端', 'PC'),
      period: '2026.2 – 2026.5',
      year: '2026',
      role: loc('系统 / 交互 / 动效', 'Systems / Interaction / Motion'),
      sortOrder: 3,
      desensitized: false,
      modalBlocks: [
        {
          type: 'paragraph',
          text: loc(
            'Guru Cafe 是一款全流程使用 AI 工具开发的休闲合成游戏，旨在参与「腾讯光子艺术部 2026 AI 游戏大赛」。',
            'Guru Cafe is a casual merge game developed with AI tools across the full workflow, created for the Tencent Photon Art Department 2026 AI Game Competition.',
          ),
        },
        {
          type: 'paragraph',
          text: loc(
            '团队三名成员：两名同事负责 UI 视觉与音效设计，我负责其余内容设计，包括游戏策划案、关卡设计、文案包装、交互设计、动效设计、demo 版视觉资源规范设计等。',
            'The team had three members: two colleagues handled UI visuals and sound design, while I was responsible for the rest of the design work, including game design documentation, level design, copy packaging, interaction design, motion design, and visual asset specifications for the demo.',
          ),
        },
        {
          type: 'paragraph',
          text: loc(
            '在开发过程中，最有趣的是使用 AI 设计动效表现并优化交互反馈：找动效参考、扒动效 CSS 代码、实现动效、调优动效参数以适配项目。这是我首个全流程使用 AI 开发设计的游戏，实验性内容较多，相关设计思路与 AI 应用案例请见配图。',
            'The most interesting part of development was using AI to design motion and refine interaction feedback: finding motion references, extracting CSS animation patterns, implementing animations, and tuning motion parameters to fit the project. This was my first game designed and developed with AI across the full workflow, so it includes many experiments. Related design thinking and AI use cases are shown in the image.',
          ),
        },
        {
          type: 'image',
          src: '/assets/projects/guru-cafe/HI-4-1-1.png',
          alt: loc('Guru Cafe · AI 应用案例', 'Guru Cafe · AI use cases'),
        },
      ],
    },
    {
      id: 'bird-voyage',
      category: 'personal',
      title: loc('Bird Voyage'),
      tagLabel: loc('卡牌设计/生物科普/学术论文', 'Card Design / Wildlife Education / Academic Research'),
      status: 'personal',
      cardIntro: loc(
        '海洋素养主题观鸟科普向卡牌游戏，硕士毕设选题，研究游戏化「知识卡片」对玩家科普知识的提升效果。',
        'A birdwatching educational card game themed around ocean literacy, created as my master’s thesis project to study how gamified knowledge cards affect players’ science learning.',
      ),
      coverSrc: '/assets/cover/cover-bird.png',
      subtitle: loc('卡牌游戏 × 生物收集', 'Card Game × Wildlife Collection'),
      engine: loc('—'),
      platform: loc('PC 端', 'PC'),
      period: '2023.1 – 2023.5',
      year: '2023',
      role: loc('个人硕士毕业设计', 'Personal Master’s Thesis Project'),
      sortOrder: 4,
      desensitized: false,
      externalUrl: 'https://bobos7.itch.io/bird-voyage',
      modalBlocks: [
        {
          type: 'paragraph',
          text: loc(
            'Bird Voyage 是一款以海洋素养为主题的观鸟科普向卡牌游戏。我毕设选题是设计一款游戏以研究如何提升玩家游玩动机以及科普知识。',
            'Bird Voyage is a birdwatching educational card game themed around ocean literacy. My thesis topic was to design a game and study how it could improve player motivation and science knowledge.',
          ),
        },
        {
          type: 'paragraph',
          text: loc(
            '23 年初那会儿我正沉迷观鸟，同时也期望研究游戏化「知识卡片」是否能增加玩家野生动物相关科普知识，于是一款以动物科普为主题的卡牌游戏应运而生。敬请体验。',
            'In early 2023, I was deeply into birdwatching and wanted to explore whether gamified knowledge cards could increase players’ wildlife-related knowledge. That led to this animal education card game. Please give it a try.',
          ),
        },
      ],
    },
    {
      id: 'tetris-factory',
      category: 'personal',
      title: loc('Tetris Factory'),
      tagLabel: loc('视觉设计/交互设计/Spine动画', 'Visual Design / Interaction Design / Spine Animation'),
      status: 'competition',
      cardIntro: loc(
        'Game Jam Plus 2022 两日原型：俄罗斯方块消除 × 模拟经营，担任视觉与角色设计。',
        'A two-day prototype for Game Jam Plus 2022: Tetris-style clearing × simulation management. I handled visual and character design.',
      ),
      coverSrc: '/assets/cover/cover-tetris.png',
      subtitle: loc('俄罗斯方块 × 模拟经营', 'Tetris × Simulation Management'),
      engine: loc('—'),
      platform: loc('PC 端 / 移动端', 'PC / Mobile'),
      period: '2022.11',
      year: '2022',
      role: loc('交互 / 视觉 / 动画', 'Interaction / Visuals / Animation'),
      sortOrder: 5,
      desensitized: false,
      externalUrl: 'https://zjliuzj.itch.io/tetris-factory',
      modalBlocks: [
        {
          type: 'paragraph',
          text: loc(
            '我负责了 Tetris Factory 的交互与角色设计。不多说了，请看可爱的蛋和龙！',
            'I was responsible for the interaction and character design of Tetris Factory. Enough said. Please enjoy the cute egg and dragon.',
          ),
        },
        {
          type: 'mediaGrid',
          layout: 'grid',
          cols: 3,
          items: [
            {
              kind: 'video',
              mp4: '/assets/projects/tetris-factory/tt-1-1.mp4',
              webm: '/assets/projects/tetris-factory/tt-1-1.webm',
              alt: loc('Tetris Factory · 角色与交互 01', 'Tetris Factory · Character and interaction 01'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/tetris-factory/tt-1-2.mp4',
              webm: '/assets/projects/tetris-factory/tt-1-2.webm',
              alt: loc('Tetris Factory · 角色与交互 02', 'Tetris Factory · Character and interaction 02'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/tetris-factory/tt-1-3.mp4',
              webm: '/assets/projects/tetris-factory/tt-1-3.webm',
              alt: loc('Tetris Factory · 角色与交互 03', 'Tetris Factory · Character and interaction 03'),
            },
          ],
        },
      ],
    },
    {
      id: 'dream-connection',
      category: 'personal',
      title: loc('Dream Connection'),
      tagLabel: loc('像素美术/动画设计/关卡设计', 'Pixel Art / Animation Design / Level Design'),
      status: 'competition',
      cardIntro: loc(
        '团队 2D 平台跳跃游戏，担任美术与关卡设计。',
        'A team-made 2D platformer where I worked on art and level design.',
      ),
      coverSrc: '/assets/cover/cover-dream.png',
      subtitle: loc('2D 像素平台跳跃', '2D Pixel Platformer'),
      engine: loc('—'),
      platform: loc('PC 端 / 主机端', 'PC / Console'),
      period: '2022.1 – 2022.5',
      year: '2022',
      role: loc('美术 / 交互 /关卡', 'Art / Interaction / Level Design'),
      sortOrder: 6,
      desensitized: false,
      externalUrl: 'https://zjliuzj.itch.io/dreamconnection',
      modalBlocks: [
        {
          type: 'video',
          url: 'https://www.youtube.com/watch?v=jTWvmLqBG1E',
          caption: loc('Dream Connection · 游戏演示', 'Dream Connection · Gameplay demo'),
        },
        {
          type: 'paragraph',
          text: loc(
            '2D 平台跳跃游戏《Dream Connection》是一个团队合作项目，我在组内担任视觉和 Jade Level 的关卡设计。视觉方面包括像素动画、角色场景与技能图标设计，关卡方面包括一个大型限时挑战关卡，敬请体验。',
            'The 2D platformer Dream Connection was a team project. I was responsible for visual work and the level design of Jade Level. My visual work included pixel animation, character and environment design, and skill icon design. For level design, I created a large timed challenge level. Please give it a try.',
          ),
        },
        { type: 'heading', text: loc('动画设计', 'Animation Design') },
        {
          type: 'paragraph',
          text: loc('主角各状态动画设计', 'Player character state animations'),
        },
        {
          type: 'mediaGrid',
          layout: 'grid',
          cols: 6,
          pixelArt: true,
          items: [
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/char/sei-dash.mp4',
              webm: '/assets/projects/dream-connection/char/sei-dash.webm',
              alt: loc('Sei · Dash'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/char/sei-float-move.mp4',
              webm: '/assets/projects/dream-connection/char/sei-float-move.webm',
              alt: loc('Sei · Float Move'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/char/sei-float-stand.mp4',
              webm: '/assets/projects/dream-connection/char/sei-float-stand.webm',
              alt: loc('Sei · Float Stand'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/char/sei-jump.mp4',
              webm: '/assets/projects/dream-connection/char/sei-jump.webm',
              alt: loc('Sei · Jump'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/char/sei-run.mp4',
              webm: '/assets/projects/dream-connection/char/sei-run.webm',
              alt: loc('Sei · Run'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/char/sei-stand.mp4',
              webm: '/assets/projects/dream-connection/char/sei-stand.webm',
              alt: loc('Sei · Stand'),
            },
          ],
        },
        {
          type: 'paragraph',
          text: loc('NPC 及装饰物动画设计', 'NPC and decoration animations'),
        },
        {
          type: 'mediaGrid',
          layout: 'grid',
          cols: 7,
          pixelArt: true,
          items: [
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/birds-1.mp4',
              webm: '/assets/projects/dream-connection/npc/birds-1.webm',
              alt: loc('Birds 01'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/birds-2.mp4',
              webm: '/assets/projects/dream-connection/npc/birds-2.webm',
              alt: loc('Birds 02'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/birds-3.mp4',
              webm: '/assets/projects/dream-connection/npc/birds-3.webm',
              alt: loc('Birds 03'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/cow.mp4',
              webm: '/assets/projects/dream-connection/npc/cow.webm',
              alt: loc('Cow'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/donut-1.mp4',
              webm: '/assets/projects/dream-connection/npc/donut-1.webm',
              alt: loc('Donut 01'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/donut-2.mp4',
              webm: '/assets/projects/dream-connection/npc/donut-2.webm',
              alt: loc('Donut 02'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/donut-3.mp4',
              webm: '/assets/projects/dream-connection/npc/donut-3.webm',
              alt: loc('Donut 03'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/dragon.mp4',
              webm: '/assets/projects/dream-connection/npc/dragon.webm',
              alt: loc('Dragon'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/grass.mp4',
              webm: '/assets/projects/dream-connection/npc/grass.webm',
              alt: loc('Grass'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/grass-dandelions.mp4',
              webm: '/assets/projects/dream-connection/npc/grass-dandelions.webm',
              alt: loc('Grass · Dandelions'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/bubble.mp4',
              webm: '/assets/projects/dream-connection/npc/bubble.webm',
              alt: loc('Bubble Item'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/penguin.mp4',
              webm: '/assets/projects/dream-connection/npc/penguin.webm',
              alt: loc('Penguin'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/seagull.mp4',
              webm: '/assets/projects/dream-connection/npc/seagull.webm',
              alt: loc('Seagull'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/dream-connection/npc/star.mp4',
              webm: '/assets/projects/dream-connection/npc/star.webm',
              alt: loc('Star'),
            },
          ],
        },
        { type: 'heading', text: loc('美术设计', 'Art Design') },
        {
          type: 'paragraph',
          text: loc(
            '1-3 空间与物件设计；4 技能图标设计；5-6 氛围设计；7 Tilemap 设计。',
            '1-3 environment and prop design; 4 skill icon design; 5-6 mood design; 7 tilemap design.',
          ),
        },
        {
          type: 'gallery',
          images: [
            {
              src: '/assets/projects/dream-connection/art/DC-2-1.jpg',
              alt: loc('Dream Connection · 空间与物件 01', 'Dream Connection · Environment and props 01'),
            },
            {
              src: '/assets/projects/dream-connection/art/DC-2-2.png',
              alt: loc('Dream Connection · 空间与物件 02', 'Dream Connection · Environment and props 02'),
            },
            {
              src: '/assets/projects/dream-connection/art/DC-2-3.png',
              alt: loc('Dream Connection · 空间与物件 03', 'Dream Connection · Environment and props 03'),
            },
            {
              src: '/assets/projects/dream-connection/art/DC-2-4.jpg',
              alt: loc('Dream Connection · 技能图标', 'Dream Connection · Skill icons'),
            },
            {
              src: '/assets/projects/dream-connection/art/DC-2-5.jpg',
              alt: loc('Dream Connection · 氛围设计 01', 'Dream Connection · Mood design 01'),
            },
            {
              src: '/assets/projects/dream-connection/art/DC-2-6.jpg',
              alt: loc('Dream Connection · 氛围设计 02', 'Dream Connection · Mood design 02'),
            },
            {
              src: '/assets/projects/dream-connection/art/DC-2-7.jpg',
              alt: loc('Dream Connection · Tilemap'),
            },
          ],
        },
      ],
    },
    {
      id: 'reika',
      category: 'personal',
      title: loc('REIKA'),
      tagLabel: loc('叙事设计/2D动画/概念美术', 'Narrative Design / 2D Animation / Concept Art'),
      status: 'personal',
      cardIntro: loc(
        '硕士选修课 - 游戏概念企划项目，包括故事板、2D 动画与设定集。',
        'A game concept project from a master’s elective course, including storyboards, 2D animation, and a concept art collection.',
      ),
      coverSrc: '/assets/cover/cover-reika.png',
      subtitle: loc('2D 动画 · 叙事游戏', '2D Animation · Narrative Game'),
      engine: loc('—'),
      platform: loc('PC 端 / 移动端', 'PC / Mobile'),
      period: '2022.10 – 2023.1',
      year: '2023',
      role: loc('独立创作', 'Solo Creator'),
      sortOrder: 7,
      desensitized: false,
      modalBlocks: [
        {
          type: 'paragraph',
          text: loc(
            'REIKA 是由我在硕士读书期间，在选修课上独自创作完成的一个游戏概念企划项目。',
            'REIKA is a game concept project that I created independently during a master’s elective course.',
          ),
        },
        {
          type: 'paragraph',
          text: loc(
            '这个企划围绕一个名叫栗风的冒险者展开，她的目标是不断冒险并收集薄巧甜豆包。项目包含故事板、2D 动画与概念美术设计。',
            'The concept follows an adventurer named Lifeng, whose goal is to keep adventuring and collect thin sweet bean buns. The project includes storyboards, 2D animation, and concept art design.',
          ),
        },
        { type: 'heading', text: loc('2D 动画设计', '2D Animation Design') },
        {
          type: 'paragraph',
          text: loc('REIKA\'S CANDY BOX 动画', 'REIKA\'S CANDY BOX animation'),
        },
        {
          type: 'video',
          url: 'https://www.bilibili.com/video/BV1wv4y117Wu/',
          caption: loc('REIKA\'S CANDY BOX · B 站完整动画', 'REIKA\'S CANDY BOX · Full animation on Bilibili'),
        },
        {
          type: 'mediaGrid',
          layout: 'row',
          cols: 3,
          items: [
            {
              kind: 'video',
              mp4: '/assets/projects/reika/rk-1-2.mp4',
              webm: '/assets/projects/reika/rk-1-2.webm',
              alt: loc('REIKA · 动画分镜 01', 'REIKA · Animation storyboard 01'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/reika/rk-1-3.mp4',
              webm: '/assets/projects/reika/rk-1-3.webm',
              alt: loc('REIKA · 动画分镜 02', 'REIKA · Animation storyboard 02'),
            },
            {
              kind: 'video',
              mp4: '/assets/projects/reika/rk-1-4.mp4',
              webm: '/assets/projects/reika/rk-1-4.webm',
              alt: loc('REIKA · 动画分镜 03', 'REIKA · Animation storyboard 03'),
            },
          ],
        },
        { type: 'heading', text: loc('故事板设计', 'Storyboard Design') },
        {
          type: 'paragraph',
          text: loc('REIKA\'S CANDY BOX 动画创作前置步骤——故事板。', 'Storyboards created as the pre-production step for the REIKA\'S CANDY BOX animation.'),
        },
        {
          type: 'image',
          src: '/assets/projects/reika/RK-2-1.png',
          alt: loc('REIKA · 故事板', 'REIKA · Storyboard'),
        },
        { type: 'heading', text: loc('概念美术设计', 'Concept Art Design') },
        {
          type: 'paragraph',
          text: loc(
            '关于 REIKA 的世界观、游戏机制、交互物、场景概念设计。',
            'Concept design for REIKA’s worldbuilding, game mechanics, interactive objects, and environments.',
          ),
        },
        {
          type: 'image',
          src: '/assets/projects/reika/RK-3-1.png',
          alt: loc('REIKA · 概念美术', 'REIKA · Concept art'),
        },
        { type: 'heading', text: loc('叙事游戏设计', 'Narrative Game Design') },
        {
          type: 'paragraph',
          text: loc('使用 Twine 制作叙事游戏 demo，请点击下方按钮下载体验。', 'I created a narrative game demo in Twine. Click the button below to download and try it.'),
        },
        {
          type: 'download',
          href: '/assets/projects/reika/RK-4-1.zip',
          label: loc('下载 REIKA Adventure (Twine demo)', 'Download REIKA Adventure (Twine demo)'),
          hint: loc('zip · 132 KB'),
        },
      ],
    },
  ],

  skillsIntro: loc(
    '设计、交互与动效。',
    'Design, interaction, and motion.',
  ),

  skills: [
    {
      id: 'design',
      title: loc('设计软件', 'Design Software'),
      items: [
        'Figma',
        'PS',
        'AI',
        'AE',
        'CSP',
        'Cavalry',
        'Aseprite',
        'Spine',
        'Maya 3D',
      ],
    },
    {
      id: 'ai',
      title: loc('AI 工具', 'AI Tools'),
      items: ['GPT', 'Gemini', 'Claude', 'Cursor'],
    },
    {
      id: 'language',
      title: loc('语言能力', 'Language Skills'),
      items: ['TEM4', 'TEM8', 'IELTS 6.5', loc('PSC 二级甲等', 'PSC Grade 2-A')],
    },
  ],

  contact: {
    email: 'sorbet07@outlook.com',
  },
}
