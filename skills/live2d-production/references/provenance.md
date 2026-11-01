# 方法来源与边界

本 skill 由 [live2d-production-notes](https://github.com/XiaoZheBrother/live2d-production-notes) 的 2026-10-22 至 11-02 增量审计独立整理。原项目包含私有角色与工程；本包不包含这些资产或完整编译器。检查器与教学示例不证明任意真实模型已经通过。

[See-through](https://github.com/shitagaki-lab/see-through) 本机拆层试验跑通，但完整头部大幅转动未通过；它可以提供素材候选，不是本 skill 的强制依赖。[Cubism Skinning](https://docs.live2d.com/en/cubism-editor-manual/skinning/) 和 [Deform Paths](https://docs.live2d.com/en/cubism-editor-manual/deformpath/) 提供原生控制工具，不自动解决不同角度的材质身份。

证据等级保留：实际采用、仅调研、历史候选/失败、建议。数值、原生导出、动态渲染、用户接受、产品接入和发布分别记录。具体参数、版本适配与性能数据不能普遍化。

本文档及工作流为原创整理，CC BY 4.0；scripts 中原创代码 MIT。包根目录附许可摘要，完整条款链接在其中。
