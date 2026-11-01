# 自查、证据与可交付状态

对每轮只记录实际完成的检查。表情/动画反馈属于视觉判断；如果用户拒绝，不能用数值检查覆盖拒绝。

| 层级 | 要记录 | 不代表 |
|---|---|---|
| 文件结构 | 路径、引用、SHA-256、版本 | Core 能读或已绑定 |
| 源工程/导出 | 编辑器版本、保存/导出目标、输出哈希 | 视觉像底图 |
| 数值 | 支持域、姿态、空间区域、容差、基线差异 | 连续全域或美术通过 |
| 渲染 | 指定宿主、背景、比例、视角、时间点 | 其他宿主也正确 |
| 动态 | 正常/半速、转出/返回/取消、帧时间证据 | 逐帧人工看完或固定 60 fps |
| 接受/集成 | 谁确认哪个版本、本地/预发/线上 | 其他候选或环境已通过 |

局部修复检查原缺口、补层、回接区和保护区；对遮挡不可见结论加入可见阳性对照。针对已经存在的缺陷，先证明同姿态同网格数据一致再标“继承”，不能跳过整类网格。

正常与半速检查全身及风险近景（眼睫/嘴、脸缘/前发、发根/发饰、下颌/领口、肩袖/腕、手书）。端点和中点不够覆盖时，对变化最快与用户报错位置加密。录像用实际解码时间戳，报告平均/最大帧间隔；加速检查时钟的自动回归另标，不冒充正常速度视觉验收。

最终材料一旦变更，旧报告只对应旧候选；静态补图不能借用旧录像。远程用户直接收原生截图/录屏，AI 分镜不能作为实现证明。

交付记录可采用以下字段，不要求机械地全部填满与当前任务无关的项：

```json
{
  "version": "candidate-id",
  "baseline": "accepted-id-and-hashes",
  "changes": ["target region or behavior"],
  "protected": ["face", "arm path", "timing"],
  "supportDomain": "declared parameter and event scope",
  "checks": [{"kind": "render", "artifact": "relative/path", "scope": "specific poses", "result": "pass"}],
  "nativeExport": "pending",
  "visualAcceptance": "pending",
  "productIntegration": "not-requested",
  "remaining": ["specific unverified item"]
}
```

保留失败路线的输入、版本、失败帧/参数与原因。若用户要求暂停，恢复明确的接受基线并保留试验，不继续将内部失败页标成交付预览。
