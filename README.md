# Live2D 制作与 Web 接入实战笔记

从 OC 娘的实际制作过程里，整理可复用的建模、动作、换装、渲染和验收经验。

这里记录过的真实问题包括：转头把脸拉扁、眼睛失去神态、肩袖像贴片、动作掉帧后变慢、换装漏掉手腕与特殊姿态、暗色背景出现白边，以及“预览修好了，但原生模型没修好”。

**适合读者：** 有插画或分层素材，希望制作原生 Cubism 模型并接入网页的个人开发者、技术美术和 AI 辅助创作者。阅读不需要取得 OC 娘资产。

本仓库公开方法、教学示例和检查模板；角色原画、PSD、CMO3、MOC3、商业项目代码及 Cubism Core 不在发布范围内。

## 从哪里开始

| 你的目标 | 建议阅读 |
|---|---|
| 第一次做可交付模型 | [制作流程与交付边界](docs/01-workflow.md) → [拆层与素材](docs/02-artwork.md) → [原生导出](docs/09-native-delivery.md) |
| 头部像平移、脸被压扁 | [九向转头、眼神与头身跟随](docs/03-head-and-eyes.md) |
| 手太扁、肩袖断开、脖子不自然 | [手部与身体接缝](docs/04-body-and-hands.md) |
| 动作慢、切换变色、回不到待机 | [动作与时间系统](docs/05-motion-and-time.md) |
| 想做统一换装 | [单模型与全动作外观](docs/06-appearance.md) |
| 接入网页后变糊 | [高清、透明度与性能](docs/07-rendering.md) |
| 想做日夜双向转场 | [主题转场](docs/08-transitions.md) |
| 想用 AI 减少重复工作 | [AI 与方案调研](docs/11-research.md) |
| 已有问题，直接查修法 | [故障速查表](docs/12-troubleshooting.md) |

## 阅读地图

1. [制作流程与交付边界](docs/01-workflow.md)
2. [拆层、补全与局部精修](docs/02-artwork.md)
3. [九向转头、眼神与头身跟随](docs/03-head-and-eyes.md)
4. [头颈比例、手部与衣料接缝](docs/04-body-and-hands.md)
5. [表情、动作衔接与三个时钟](docs/05-motion-and-time.md)
6. [单一原生主模型与全动作换装](docs/06-appearance.md)
7. [高清渲染、透明边缘与性能](docs/07-rendering.md)
8. [日夜双向转场](docs/08-transitions.md)
9. [原生工程、导出与版本交付](docs/09-native-delivery.md)
10. [回归验证与同条件对照](docs/10-validation.md)
11. [AI 辅助与成熟方案调研](docs/11-research.md)
12. [故障速查表](docs/12-troubleshooting.md)

补充材料：

- [案例：暗夜翻书袖口的绿色残片](cases/01-book-cuff.md)
- [案例：崇拜动作的造型统一与眉眼校准](cases/02-admiration.md)
- [案例：原生马尾层级与网页临时补偿](cases/03-hair-order.md)
- [来源与证据边界](references/sources.md)
- [版本与历史验证摘录](references/project-evidence.md)
- [术语表](docs/glossary.md)
- [验收清单](templates/review-checklist.md) / [问题复盘模板](templates/incident.md) / [交付模板](templates/release.md)

## 先记住五件事

1. 静态神态先通过，再做动作；动画不会自动修复错误的眼型。
2. 能在网页动，不代表已经完成原生绑定；参数必须实际影响目标网格。
3. 一个 MOC3 不等于只靠一个文件就有完整交互；鼠标、外观状态和转场由宿主驱动。
4. 动作时间、物理时间、主题转场时间分开；不要用一个加速倍率乘遍所有系统。
5. 数值回归和视觉验收回答不同问题，两者都要有。

```mermaid
flowchart LR
  A[确认底图] --> B[拆层与回合成]
  B --> C[原生关键形与参数]
  C --> D[同姿态视觉对照]
  D --> E[动作与换装组合]
  E --> F[官方导出和目标宿主验证]
  F --> G[带版本记录的交付]
```

## 可运行的小例子

`examples/` 是独立编写的教学代码，展示时间推进、帧率无关跟随、外观异步提交和文件哈希清单，不依赖 SDK，也不包含商业项目的运行器。

```bash
node --test examples/*.test.mjs
node examples/manifest.mjs ./examples
python scripts/check_docs.py
```

要求 Node.js 22+；文档检查使用 Python 3.10+，均无第三方依赖。第二条输出文件清单和 SHA-256，不会修改被检查目录。示例的测试通过不等于某个 Cubism 模型已经完成绑定。

## 记录方式

- **项目实测**：有本项目的源工程、脚本检查或视觉验收记录支撑；适用范围会写清楚。
- **官方机制**：链接到 Live2D 官方手册或源码。
- **仅调研**：阅读了作者文档，未据此宣称已经在本项目跑通。
- **建议**：从案例提炼的实践方法，参数需要按自己的角色调整。

整理日期：**2026-10-20**。主要历史环境为 Cubism Editor 5.3.04、SDK 5.0 导出目标与 Cubism Core 5.1.0；不是兼容所有版本的承诺。旧候选方案与最终采用结果的区别见[证据记录](references/project-evidence.md)。

欢迎提交可复现问题和改进，见 [CONTRIBUTING](CONTRIBUTING.md)。原创文档使用 CC BY 4.0，独立示例代码使用 MIT，详见 [LICENSE](LICENSE)。
