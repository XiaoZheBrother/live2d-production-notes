# 将经验装成可调用的 skill

[返回目录](../README.md) · [入口](../skills/live2d-production/SKILL.md)

## 当前能做什么

`live2d-production` 是可携带的 Agent 工作流和检查工具。适合原画/拆层规划、局部精修、Cubism 原生交付、动作中断、主题切换与验收。它会利用宿主已有工具执行工作，不自带图像生成模型、MOC 编译器、官方 SDK 或角色资产。

与 halfbody skill 的区别是交付约束：后者有面向特定半身立绘和 VTS 的 rigkit；本包面向已有全身复杂角色及产品接入，优先保留确认外观与可编辑源工程。当前包不能单独把任意图像生成原生模型，也没有完成跨 Agent/跨宿主全流程兼容认证。

## 安装

把仓库的 `skills/live2d-production/` 整个复制到目标 Agent 的 skill 目录，不要只复制 SKILL.md：

- Codex：`~/.codex/skills/live2d-production/`
- Claude Code：`~/.claude/skills/live2d-production/`（通用 Markdown 入口；本轮未在 Claude Code 实跑）

若目标位置已存在，先比较版本并保留旧版，不直接覆盖用户改动。此次只制作仓库内 skill，不自动修改用户全局配置。

也可生成只含 skill 资源的 ZIP（已有同名文件不会覆盖）：

```bash
python scripts/package_skill.py .local/live2d-production.zip
```

解压后将 `live2d-production/` 目录放到相应位置。打包器只收录入口、许可、元数据、参考文档与 Python 脚本，不包含缓存或项目资料。

示例任务：

```text
使用 $live2d-production 修复这个角色主题切换后的丢脸问题。
保留当前原生模型、表情和动作节奏，复现多模型交接，验证返回待机后的头身眼睛跟随。
```

```text
使用 $live2d-production 精修转头的发缘。
先核对确认的三个角度与独立发束归属，不改变脸和身体；只交付底图候选，确认后再绑定。
```

## 只读包检查

Python 3.10+，无第三方依赖：

```bash
python skills/live2d-production/scripts/inspect_package.py /path/to/character.model3.json
```

成功退出码 0 只表示引用与文件结构通过；缺文件、空文件、无效结构、逃出模型目录的引用返回 1。SHA-256 用于版本对照，不是视觉评分。故意使用合成的假 MOC 也能通过结构检查，测试明确防止把这种结果称为原生或视觉验收。

## 本包的验证范围

- `scripts/check_docs.py`：本地链接及明显发布边界错误。
- `python -m unittest discover -s scripts -p 'test_*.py'`：合成运行包、缺失/无效引用、目录越界、只读性与 CLI 退出码。
- `node --test examples/*.test.mjs`：独立工程原理，包括旧堆视图与动作意图交接。
- skill frontmatter/入口检查：名称、描述、资源可达，不代表实际制作一个角色已成功。

发布物应只包含该 skill 目录。外部项目作为链接参考；不打包 OC 私有素材、权重、Core 或商业工程。

### 2026-11-02 本地检查记录

45 份 Markdown 链接检查通过，23 项 Node 教学测试通过。Python 检查器 5 项通过，1 项因 Windows 不允许创建文件符号链接而跳过；遍历路径、绝对路径和远程引用拒绝测试实际执行通过。skill frontmatter、UI 元数据与内部资源链接有效。

ZIP 含 9 个 skill 资源文件，解压到独立临时目录后，内部链接与检查器 CLI 均可运行。对当前私有模型包做了只读结构检查：39 个引用文件齐全；仍明确输出原生导出未验证、视觉接受未知。本轮没有运行一次完整的新角色制作，也没有安装到全局 skill 目录或上线角色产品。知识库和 skill 的发布结果以仓库提交及对应 CI 为准。
