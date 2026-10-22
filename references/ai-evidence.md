# AI 制作环节与产物对应

[返回目录](../README.md) · [完整制作实录](../docs/00-ai-pipeline.md)

首轮核对日期：2026-10-20；独立暗夜阶段补充：2026-10-22。本页说明“全流程使用 AI”对应了哪些实际工作与产物。表中原项目文件名是历史证据线索，不是本公共仓库包含的可运行命令。

| 环节 | 实际执行方式 | 历史产物线索 |
|---|---|---|
| 角色与造型 | Agent 组织参考和要求，内置图像工具生成候选，人选择 | `generation-prompts.md`、暗夜服装概念与素材记录 |
| 透明度与拆层准备 | Agent 检查通道、编写素材处理和 PSD 准备程序 | `prepare-xingyou-basic-psd.py`、`package-xingyou-refined-native-psd.py` |
| 绑定数据 | Agent 编写绑定准备、网格/变形器数据和采样程序 | `prepare-xingyou-refined-native.mjs`、`sample-xingyou-native-keyforms.mjs` |
| 源工程 | 基于官方导入工程做脚本化结构更新，再回到 Editor 保存与导出 | `build-xingyou-refined-cmo.py`、`finalize-xingyou-native-keyforms.py` |
| 单模型整合 | Agent 盘点已确认模型，提取对象、遮罩、参数与资源，再整理主工程 | `prepare-xingyou-unified-model.mjs`、`build-xingyou-unified-cmo.py` |
| 动作 | Agent 编写统一控制、时间映射和 Motion 导出 | `export-xingyou-unified-motions.mjs`、`actionPacing.mjs` |
| 手部与衣料 | 图像编辑候选配合局部遮罩和原生绑定修订 | 手部、肩袖前后对照与图集记录 |
| 暗夜换装 | Agent 准备新素材、动作袖片与混合手部副本、原生参数和覆盖检查 | `prepareNightNative.mjs`、`buildNightNative.py`、`verifyNightNative.mjs` |
| Web 与高清 | Agent 实现宿主控制、合成、尺寸链与高清对照 | `ocScene.mjs`、`clarityResolve.mjs`、同尺寸对照记录 |
| 双向转场 | 人确认概念，Agent 完成分镜素材与动态实现 | 追光聚拢、翻页迎晨及透明背景修正记录 |
| 第一阶段袖口修补 | 图像工具出候选，Agent 写局部配准、保护皮肤、图集/源工程同步与检查 | `packageBookCuffCleanup.mjs`、`embedBookCuffCleanup.py`、槽位与哈希报告 |
| 独立暗夜脸 | 以确认原画统一坐标回合成，再补隐藏区域、眨眼和可动参数 | 静态 `authoring-report.json` 与独立动态、全身 `native-verification.json` |
| 参考角度驱动的夸奖 | AI 生成角度候选，人确认；配准、专用 UV、原生交接及旧动作回归 | `angle-art-image-provenance.json`、`verifyNightPraiseAngleArt.mjs` |
| 打招呼最小修复 | 从确认版恢复轨迹，仅修肘部并比较非目标几何 | `elbow-local-verification.json` |
| 鼓励与失败候选 | 独立表情与手势、参数依赖、任意允许时刻退出与实际 Alpha 检查 | `independent-exit-verification.json`、`collar-native-alpha-verification.json` |

后续候选的导出、视觉确认与产品同步状态见[暗夜证据快照](night-character-evidence.md)。AI 生成分镜和 AI 操作工具取得的原生截图是两类产物，不能相互替代。

## 人与工具分别承担什么

人持续给视觉判断与范围约束，包括脸型、眼睛甜美程度、肩颈比例、手部自然度、服装选择和转场分镜。制作过程中由用户启用官方 PRO 试用。

Agent 执行研究、编程、素材与工程处理、可用工具操作和检查。官方 Cubism 工具承担其文件编辑与原生导出环节，图像生成工具提供候选像素，浏览器承载实际接入验证。

这些分工共同构成“AI 全流程制作”。它描述 AI 在每个制作环节都参与执行，不代表每次判断与许可操作都无人介入。

## 哪些路线仅做了调研

See-through、PSD2Live、AutoLive2d 等用于比较思路与能力边界。当前证据没有证明本项目全部资产经过这些工具，也没有把它们纳入公开仓库的必选依赖。

历史指标与版本限制见[项目证据](project-evidence.md)；外部一手来源见[来源表](sources.md)。
