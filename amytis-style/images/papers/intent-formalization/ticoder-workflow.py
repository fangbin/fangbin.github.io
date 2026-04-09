"""
TiCoder Interactive Workflow Diagram
生成论文中图3的可视化——TiCoder交互式意图形式化流程
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle
import numpy as np
import os

# 设置中文字体
plt.rcParams['font.family'] = ['Arial Unicode MS', 'STHeiti', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# 创建图形
fig, ax = plt.subplots(1, 1, figsize=(14, 9), dpi=150)
ax.set_xlim(0, 14)
ax.set_ylim(0, 10)
ax.axis('off')

# 颜色方案
colors = {
    'user': '#3498db',      # 蓝色 - 开发者
    'llm': '#e74c3c',       # 红色 - LLM生成
    'test': '#f39c12',      # 橙色 - 测试
    'decision': '#9b59b6',  # 紫色 - 决策
    'output': '#27ae60',    # 绿色 - 输出
    'bg_light': '#f8f9fa',
    'bg_dark': '#e9ecef'
}

def draw_box(ax, x, y, width, height, color, text, fontsize=9, text_color='white', bold=True):
    """绘制带圆角的流程框"""
    # 阴影效果
    shadow = FancyBboxPatch((x - width/2 + 0.05, y - height/2 - 0.05), width, height,
                           boxstyle="round,pad=0.02,rounding_size=0.15",
                           facecolor='#00000020', edgecolor='none')
    ax.add_patch(shadow)
    
    # 主框
    box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                         boxstyle="round,pad=0.02,rounding_size=0.15",
                         facecolor=color, edgecolor='white', linewidth=2)
    ax.add_patch(box)
    
    # 文字
    weight = 'bold' if bold else 'normal'
    ax.text(x, y, text, fontsize=fontsize, fontweight=weight,
            ha='center', va='center', color=text_color, wrap=True)

def draw_arrow(ax, x1, y1, x2, y2, color='#666666', style='->', lw=2, label='', label_offset=(0, 0.3)):
    """绘制带标签的箭头"""
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle=style, lw=lw, color=color,
                               connectionstyle="arc3,rad=0"))
    if label:
        ax.text((x1+x2)/2 + label_offset[0], (y1+y2)/2 + label_offset[1], 
                label, fontsize=8, ha='center', va='center', 
                color='#555555', style='italic')

# 标题
ax.text(7, 9.5, 'TiCoder: Interactive Test-Driven Intent Formalization', 
        fontsize=18, fontweight='bold', ha='center', va='center', color='#1a1a2e')
ax.text(7, 9.0, '交互式测试驱动的意图形式化流程', fontsize=12, 
        ha='center', va='center', color='#666666', style='italic')

# ===== 左侧：用户输入 =====
ax.text(2.5, 8.0, 'Developer', fontsize=11, fontweight='bold', 
        ha='center', va='center', color=colors['user'])
draw_box(ax, 2.5, 7.2, 2.5, 1.0, colors['user'], 
         'Natural Language\nPrompt', fontsize=9)

# ===== 中间：LLM生成 =====
ax.text(7, 8.0, 'LLM Generation', fontsize=11, fontweight='bold', 
        ha='center', va='center', color=colors['llm'])
draw_box(ax, 5.5, 7.2, 2.0, 1.0, colors['llm'], 
         'Candidate\nCode', fontsize=9)
draw_box(ax, 8.5, 7.2, 2.0, 1.0, colors['llm'], 
         'Candidate\nTests', fontsize=9)

# ===== 右侧：用户审核 =====
ax.text(11.5, 8.0, 'User Validation', fontsize=11, fontweight='bold', 
        ha='center', va='center', color=colors['decision'])
draw_box(ax, 11.5, 7.2, 2.0, 1.0, colors['decision'], 
         'Approve/Reject\nTests', fontsize=9)

# ===== 循环反馈区域 =====
# 背景框
loop_bg = FancyBboxPatch((3.5, 4.0), 7.0, 2.5,
                          boxstyle="round,pad=0.02,rounding_size=0.1",
                          facecolor='#f0f4f8', edgecolor='#d0d8e0', 
                          linewidth=2, linestyle='--')
ax.add_patch(loop_bg)
ax.text(7, 6.2, 'Iterative Refinement Loop', fontsize=10, fontweight='bold',
        ha='center', va='center', color='#5a6c7d')

# 循环内的元素
draw_box(ax, 5.0, 5.3, 1.8, 0.7, colors['test'], 
         'Generate Tests\n(target ambiguity)', fontsize=8)
draw_box(ax, 7.0, 5.3, 1.8, 0.7, colors['test'], 
         'Yes / No / Undef', fontsize=8)
draw_box(ax, 9.0, 5.3, 1.8, 0.7, colors['test'], 
         'Prune & Rank\nCandidates', fontsize=8)

# ===== 底部：输出 =====
draw_box(ax, 7, 2.8, 4.5, 1.0, colors['output'], 
         'Ranked Code + Approved Tests\n(Regression Tests)', fontsize=10)

# ===== 箭头连接 =====
# 输入到生成
draw_arrow(ax, 3.75, 7.2, 4.4, 7.2, label='')

# 生成到审核
draw_arrow(ax, 9.6, 7.2, 10.4, 7.2, label='')

# 审核到循环
draw_arrow(ax, 11.5, 6.7, 11.5, 6.0, label='')
draw_arrow(ax, 11.5, 6.0, 10.0, 5.3, label='', label_offset=(0.3, 0.2))

# 循环内部箭头
draw_arrow(ax, 5.9, 5.3, 6.1, 5.3, label='')
draw_arrow(ax, 7.9, 5.3, 8.1, 5.3, label='')

# 反馈循环（虚线）
ax.annotate('', xy=(4.0, 5.3), xytext=(5.0, 4.5),
            arrowprops=dict(arrowstyle='->', lw=1.5, color='#999999',
                           linestyle='--', connectionstyle="arc3,rad=0.3"))
ax.text(4.2, 4.6, 'iterate', fontsize=8, ha='center', va='center', 
        color='#888888', style='italic')

# 循环到输出
draw_arrow(ax, 9.0, 4.9, 9.0, 3.8, label='')

# ===== 右侧说明 =====
# 效果指标
metrics_bg = FancyBboxPatch((11.5, 4.0), 2.0, 2.5,
                             boxstyle="round,pad=0.02,rounding_size=0.1",
                             facecolor='#e8f5e9', edgecolor='#4caf50', 
                             linewidth=2)
ax.add_patch(metrics_bg)
ax.text(12.5, 6.2, 'Results', fontsize=10, fontweight='bold',
        ha='center', va='center', color='#2e7d32')
ax.text(12.5, 5.6, 'Correct evaluation:\n40% → 84%', fontsize=8,
        ha='center', va='center', color='#388e3c')
ax.text(12.5, 5.0, 'Cognitive load ↓\n(p=0.007)', fontsize=8,
        ha='center', va='center', color='#388e3c')
ax.text(12.5, 4.4, 'Preferred by\nmajority', fontsize=8,
        ha='center', va='center', color='#388e3c')

# ===== 底部示例 =====
example_bg = FancyBboxPatch((1.5, 0.5), 11, 1.8,
                             boxstyle="round,pad=0.02,rounding_size=0.1",
                             facecolor='#fff3e0', edgecolor='#ff9800', 
                             linewidth=1.5)
ax.add_patch(example_bg)
ax.text(7, 2.0, 'Example: "Find the shared elements from two lists"', 
        fontsize=9, fontweight='bold', ha='center', va='center', color='#e65100')
ax.text(7, 1.4, 'Test (1): common([1,2,3],[2,3,4]) == [2,3]  → User: Yes', 
        fontsize=8, ha='center', va='center', color='#5d4037', family='monospace')
ax.text(7, 0.9, 'Test (2): common([1,2,2],[2,2,3]) == [2,2]  → User: No', 
        fontsize=8, ha='center', va='center', color='#5d4037', family='monospace')

plt.tight_layout()

# 保存
output_dir = '/Users/ericbinder/Documents/repos/githubpage/amytis-blog/public/images/papers/intent-formalization'
os.makedirs(output_dir, exist_ok=True)
plt.savefig(f'{output_dir}/ticoder-workflow.png', dpi=150, bbox_inches='tight',
            facecolor='white', edgecolor='none')
print(f'✓ Saved: {output_dir}/ticoder-workflow.png')
plt.close()
