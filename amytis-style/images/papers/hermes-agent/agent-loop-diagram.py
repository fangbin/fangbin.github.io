"""
Hermes Agent Loop Flow Diagram
展示核心Agent循环和决策流程
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Circle, Polygon
import numpy as np
import os

# 设置中文字体
plt.rcParams['font.family'] = ['Arial Unicode MS', 'STHeiti', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# 创建图形
fig, ax = plt.subplots(1, 1, figsize=(12, 14), dpi=150)
ax.set_xlim(0, 12)
ax.set_ylim(0, 14)
ax.axis('off')

# 颜色方案
colors = {
    'start': '#27ae60',
    'process': '#3498db',
    'decision': '#f39c12',
    'llm': '#9b59b6',
    'tool': '#e74c3c',
    'end': '#95a5a6',
    'memory': '#1abc9c',
    'agent': '#e67e22',
}

def draw_round_box(ax, x, y, width, height, color, text, fontsize=9):
    """绘制圆角矩形"""
    box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                         boxstyle="round,pad=0.02,rounding_size=0.15",
                         facecolor=color, edgecolor='white', linewidth=2)
    ax.add_patch(box)
    ax.text(x, y, text, fontsize=fontsize, fontweight='bold',
            ha='center', va='center', color='white', wrap=True,
            linespacing=1.1)

def draw_diamond(ax, x, y, size, color, text, fontsize=8):
    """绘制菱形决策框"""
    diamond = Polygon([
        [x, y + size],
        [x + size*1.2, y],
        [x, y - size],
        [x - size*1.2, y]
    ], facecolor=color, edgecolor='white', linewidth=2)
    ax.add_patch(diamond)
    ax.text(x, y, text, fontsize=fontsize, fontweight='bold',
            ha='center', va='center', color='white', wrap=True)

def draw_circle(ax, x, y, radius, color, text, fontsize=9):
    """绘制圆形"""
    circle = Circle((x, y), radius, facecolor=color, edgecolor='white', linewidth=2)
    ax.add_patch(circle)
    ax.text(x, y, text, fontsize=fontsize, fontweight='bold',
            ha='center', va='center', color='white')

def draw_arrow(ax, x1, y1, x2, y2, color='#666666', label='', offset=(0, 0)):
    """绘制箭头"""
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', lw=1.8, color=color))
    if label:
        mid_x, mid_y = (x1+x2)/2 + offset[0], (y1+y2)/2 + offset[1]
        ax.text(mid_x, mid_y, label, fontsize=8, ha='center', va='center', 
                color='#444444', style='italic')

# 标题
ax.text(6, 13.5, 'AIAgent Conversation Loop', fontsize=18, 
        fontweight='bold', ha='center', va='center', color='#1a1a2e')
ax.text(6, 13.1, 'Core Execution Flow (run_agent.py)', fontsize=11, 
        ha='center', va='center', color='#666666', style='italic')

# ===== 流程开始 =====
draw_circle(ax, 6, 12.3, 0.4, colors['start'], 'Start', fontsize=8)

# 初始化
draw_round_box(ax, 6, 11.5, 2.5, 0.6, colors['process'], 
               'Initialize\nAIAgent', fontsize=8)
draw_arrow(ax, 6, 11.9, 6, 11.8, color='#666')

# 构建系统提示
draw_round_box(ax, 6, 10.7, 3.0, 0.7, colors['process'], 
               'Build System Prompt\n(Identity + Memory + Skills + Context)', fontsize=8)
draw_arrow(ax, 6, 11.2, 6, 11.05, color='#666')

# 用户输入
draw_round_box(ax, 6, 9.7, 2.5, 0.6, colors['memory'], 
               'Receive User Message', fontsize=8)
draw_arrow(ax, 6, 10.35, 6, 10.0, color='#666')

# 记忆预取
draw_round_box(ax, 6, 8.8, 2.8, 0.7, colors['memory'], 
               'MemoryManager.prefetch_all()\n(Recall relevant context)', fontsize=8)
draw_arrow(ax, 6, 9.4, 6, 9.15, color='#666')

# 检查上下文压缩
draw_diamond(ax, 6, 7.8, 0.5, colors['decision'], 
             'Context >\nThreshold?', fontsize=7)
draw_arrow(ax, 6, 8.45, 6, 8.3, color='#666')

# 压缩分支 (右侧)
draw_round_box(ax, 9, 7.8, 2.2, 0.6, colors['process'], 
               'ContextCompressor\n.summarize()', fontsize=8)
draw_arrow(ax, 6.6, 7.8, 7.9, 7.8, color=colors['decision'], label='Yes')
ax.annotate('', xy=(6, 7.3), xytext=(9, 7.5),
            arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['process'],
                           connectionstyle="arc3,rad=0.3"))

# 主循环：调用LLM
draw_round_box(ax, 6, 6.8, 2.5, 0.7, colors['llm'], 
               'LLM API Call\n(chat.completions.create)', fontsize=8)
draw_arrow(ax, 6, 7.3, 6, 7.15, color='#666', label='No', offset=(-0.3, 0))

# 检查工具调用
draw_diamond(ax, 6, 5.8, 0.5, colors['decision'], 
             'Tool Calls\nin Response?', fontsize=7)
draw_arrow(ax, 6, 6.45, 6, 6.3, color='#666')

# 工具执行分支
draw_round_box(ax, 9.5, 5.8, 2.5, 0.8, colors['tool'], 
               'Execute Tool Calls\n(handle_function_call)\nParallel/Sequential', fontsize=8)
draw_arrow(ax, 6.6, 5.8, 8.25, 5.8, color=colors['decision'], label='Yes')

# 并行安全说明
ax.text(9.5, 5.2, 'Parallel: read_file, web_search\nSequential: clarify, terminal', 
        fontsize=7, ha='center', va='center', color='#666666', style='italic')

# 循环回LLM
draw_arrow(ax, 9.5, 5.4, 9.5, 6.8, color=colors['tool'])
ax.annotate('', xy=(7.25, 6.8), xytext=(9.5, 6.8),
            arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['tool'],
                           connectionstyle="arc3,rad=0.2"))

# 返回给用户
draw_round_box(ax, 6, 4.6, 2.5, 0.6, colors['llm'], 
               'Return Response\nto User', fontsize=8)
draw_arrow(ax, 6, 5.3, 6, 4.9, color='#666', label='No')

# 记忆同步
draw_round_box(ax, 6, 3.6, 2.8, 0.7, colors['memory'], 
               'MemoryManager.sync_all()\n(Save turn to memory)', fontsize=8)
draw_arrow(ax, 6, 4.3, 6, 3.95, color='#666')

# 技能创建检查
draw_diamond(ax, 6, 2.6, 0.5, colors['decision'], 
             'Complex Task?\n(5+ tool calls)', fontsize=7)
draw_arrow(ax, 6, 3.25, 6, 3.1, color='#666')

# 技能创建分支
draw_round_box(ax, 9.5, 2.6, 2.2, 0.6, colors['memory'], 
               'Auto-create\nSkill', fontsize=8)
draw_arrow(ax, 6.6, 2.6, 8.4, 2.6, color=colors['decision'], label='Yes')
ax.annotate('', xy=(6, 1.8), xytext=(9.5, 2.3),
            arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['memory'],
                           connectionstyle="arc3,rad=0.3"))

# 结束
draw_circle(ax, 6, 1.4, 0.4, colors['end'], 'End', fontsize=8)
draw_arrow(ax, 6, 2.1, 6, 1.8, color='#666', label='No', offset=(-0.3, 0))

# ===== 左侧：迭代预算 =====
ax.text(1.5, 9, 'Iteration Budget', fontsize=9, fontweight='bold', 
        ha='center', va='center', color='#555555')

budget_box = FancyBboxPatch((0.5, 7.5), 2.0, 1.2,
                             boxstyle="round,pad=0.02,rounding_size=0.1",
                             facecolor='#f0f4f8', edgecolor='#3498db', linewidth=1.5)
ax.add_patch(budget_box)
ax.text(1.5, 8.4, 'max_iterations\n(default: 90)', fontsize=8, 
        ha='center', va='center', color='#333333')
ax.text(1.5, 7.95, 'consume() / refund()', fontsize=7, 
        ha='center', va='center', color='#666666')

# 连接预算到主流程
ax.annotate('', xy=(3.75, 8.8), xytext=(2.5, 8.1),
            arrowprops=dict(arrowstyle='->', lw=1.2, color='#3498db',
                           connectionstyle="arc3,rad=-0.2"))

# ===== 右侧：子代理 =====
ax.text(10.5, 3.8, 'Subagent Delegation', fontsize=9, fontweight='bold', 
        ha='center', va='center', color=colors['agent'])

subagent_box = FancyBboxPatch((9.5, 2.5), 2.0, 1.0,
                               boxstyle="round,pad=0.02,rounding_size=0.1",
                               facecolor='#fdeaea', edgecolor=colors['agent'], linewidth=1.5)
ax.add_patch(subagent_box)
ax.text(10.5, 3.25, 'delegate_task()', fontsize=8, 
        ha='center', va='center', color='#333333', fontweight='bold')
ax.text(10.5, 2.9, 'Isolated context\nOwn iteration budget', fontsize=7, 
        ha='center', va='center', color='#666666')

# 底部说明
ax.text(6, 0.5, 'Key Design: Synchronous loop with optional parallel tool execution | Parent blocks until subagents complete', 
        fontsize=8, ha='center', va='center', color='#555555', style='italic')

plt.tight_layout()

# 保存
output_dir = '/Users/ericbinder/Documents/repos/githubpage/amytis-blog/public/images/papers/hermes-agent'
os.makedirs(output_dir, exist_ok=True)
plt.savefig(f'{output_dir}/agent-loop-diagram.png', dpi=150, bbox_inches='tight',
            facecolor='white', edgecolor='none')
print(f'✓ Saved: {output_dir}/agent-loop-diagram.png')
plt.close()
