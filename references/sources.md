# 来源与证据边界

[返回目录](../README.md)

本仓库文字是制作经验的重新整理，没有复制外部教程全文。以下一手页面在 2026-10-20 检索或读取核对；它们可能继续更新。

2026-10-22 增补的页面单列在下表之后；其余旧链接不因本轮文档修改自动成为重新核验的来源。

## 官方文档与源码

| 来源 | 用途 | 不据此推导什么 |
|---|---|---|
| [素材分割](https://docs.live2d.com/en/cubism-editor-manual/divide-the-material/) | 按可动部件准备素材、补隐藏区域 | 自动分层能直接完成绑定 |
| [X/Y 关键形](https://docs.live2d.com/en/cubism-editor-manual/keyform-xydirection/) | 九向组合与关键形制作入口 | 本项目参数值适合所有角色 |
| [剪贴蒙版](https://docs.live2d.com/en/cubism-editor-manual/clipping-mask/) | 虹膜裁切、边缘和隐藏蒙版行为 | 所有白边都来自同一原因 |
| [表情设置与导出](https://docs.live2d.com/en/cubism-editor-manual/setting-and-exporting-facial-expressions/) | 参数叠加方式与表情文件 | 任意模型都能直接套同一表情 |
| [Web 模型说明](https://docs.live2d.com/en/cubism-sdk-manual/model-web/) | MOC、模型实例与资源入口 | 只拿 MOC 就有完整网页交互 |
| [model3.json 规格](https://github.com/Live2D/CubismSpecs/blob/master/FileFormats/model3.json.md) | 运行文件引用与分组 | 本仓库实现了完整 SDK |
| [Cubism Web Samples](https://github.com/Live2D/CubismWebSamples) | 官方 Web 接入参考 | 示例角色素材可任意再分发 |
| [FREE / PRO 对比](https://www.live2d.com/en/cubism/comparison/) | 编辑器预算与功能核对入口 | 永久不变的许可或版本结论 |

### 2026-10-22 新增核对

| 来源 | 用途 | 本轮采用边界 |
|---|---|---|
| [X/Y 制作教程](https://docs.live2d.com/en/cubism-editor-tutorials/xy/) | 参数关键形组合与变形器管理、部件相对运动 | 支持资源与组织方法讨论，不证明本项目所有关键形正确 |
| [应用 3D 旋转表现](https://docs.live2d.com/en/cubism-editor-manual/apply-3d-rotation-expression/) | 评估从设定形状生成转头形变的官方工具 | 仅调研；相关操作会更新关键形，不能无条件覆盖已确认的手工形态 |
| [Blend Shape](https://docs.live2d.com/en/cubism-editor-manual/blend-shape/) | 差分形态、权重与默认形态影响 | 仅调研；默认形态变化会影响结果，不据此声称自动还原确认侧脸 |

本轮参考角度原画方案属于项目取舍，不能写成官方要求，也不说明上述官方工具普遍不适合转头。

## AI 工具的一手项目页

- [See-through](https://github.com/shitagaki-lab/see-through)：角色分层与补全，作者明确未覆盖完整绑定。
- [PSD2Live](https://github.com/tsunehimatoi/psd2live)：作者描述自动绑定、编辑和导出能力；本项目未完成完整往返验证。
- [AutoLive2d](https://github.com/Fenglin-Maple/AutoLive2d)：参考 AI 辅助制作经验；不能由其网页演示推导原生 Cubism 兼容。

以上均不是赞助推荐，也没有本仓库测得的提速倍数或成功率。

## 项目记录的来源

公开总结依据本项目制作期的确认意见、修复说明、版本化源工程记录、参数探测、图集校验、动作回归与浏览器目视记录。原记录包含未公开资产与本机路径，本仓库只保留必要的方法和去标识化摘录。

原始材料的阶段性题名包括：Live2D 工作流调研、精修全身原生待机、统一原生主模型、高清同尺寸对照、崇拜右眼与白眉校准、暗夜袖身与袖口精修、马尾层级与书缘精修、翻书袖口清理。

后续增加独立暗夜脸与全身待机、翻书仰头视线、打招呼肘部最小修复、夸奖三角度原画、鼓励退出回归及失败领口 Alpha 检查。取代关系和未完成状态见[后续证据](night-character-evidence.md)。

AI 参与制作的具体环节与程序产物对应见 [AI 制作证据](ai-evidence.md)。公共仓库中的任务提示模板是经验提炼，不作为历史对话的逐字转录。

读者可以复用模板和独立示例验证自己的模型，但不能用本仓库的示例测试代替原项目资产检查。详细历史范围见[项目证据](project-evidence.md)。
