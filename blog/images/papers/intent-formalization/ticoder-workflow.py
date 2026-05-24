"""
TiCoder 交互工作流程图
展示测试驱动的意图形式化流程
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle
import numpy as np

plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

fig, ax = plt.subplots(figsize=(14, 10))
ax.set_xlim(0, 14)
ax.set_ylim(0, 10)
ax.axis('off')

# 颜色方案
colors = {
    'user': '#3498db',
    'llm': '#9b59b6',
    'process': '#2ecc71',
    'test': '#e67e22',
    'decision': '#f39c12',
    'output': '#1abc9c',
    'text': '#2c3e50'
}

# 标题
ax.text(7, 9.5, 'TiCoder: Interactive Test-Driven Intent Formalization', 
        fontsize=16, weight='bold', ha='center', va='center', color=colors['text'])
ax.text(7, 9.0, 'From Ambiguity to Precision through Human-AI Collaboration', 
        fontsize=11, ha='center', va='center', color='#7f8c8d')

# 流程步骤
steps = [
    {'name': 'Developer\nNL Prompt', 'x': 2, 'y': 7.5, 'color': colors['user'], 'type': 'input'},
    {'name': 'LLM Generates\nCandidate Code', 'x': 5, 'y': 7.5, 'color': colors['llm'], 'type': 'process'},
    {'name': 'LLM Generates\nCandidate Tests', 'x': 5, 'y': 5.5, 'color': colors['test'], 'type': 'process'},
    {'name': 'User Reviews\n& Classifies', 'x': 8.5, 'y': 5.5, 'color': colors['user'], 'type': 'decision'},
    {'name': 'Prune & Rank\nCandidates', 'x': 11.5, 'y': 5.5, 'color': colors['process'], 'type': 'process'},
    {'name': 'Ranked Code +\nApproved Tests', 'x': 11.5, 'y': 3, 'color': colors['output'], 'type': 'output'},
]

# 绘制步骤框
for step in steps:
    if step['type'] == 'decision':
        # 菱形决策框
        diamond = plt.Polygon([[step['x'], step['y']+0.5], 
                              [step['x']+0.8, step['y']], 
                              [step['x'], step['y']-0.5], 
                              [step['x']-0.8, step['y']]],
                             closed=True, facecolor=step['color'], alpha=0.2,
                             edgecolor=step['color'], linewidth=2)
        ax.add_patch(diamond)
        ax.text(step['x'], step['y'], step['name'], fontsize=9, weight='bold',
                ha='center', va='center', color=step['color'])
    else:
        # 矩形框
        width = 1.8
        height = 0.7
        box = FancyBboxPatch((step['x']-width/2, step['y']-height/2), width, height,
                            boxstyle="round,pad=0.05,rounding_size=0.15",
                            facecolor=step['color'], alpha=0.15,
                            edgecolor=step['color'], linewidth=2)
        ax.add_patch(box)
        ax.text(step['x'], step['y'], step['name'], fontsize=9, weight='bold',
                ha='center', va='center', color=step['color'])

# 绘制箭头连接
arrows = [
    ((2, 7.5), (4, 7.5), 'Natural Language'),
    ((5, 7.1), (5, 6.2), ''),
    ((6, 5.5), (7.7, 5.5), 'Tests for\nambiguous inputs'),
    ((8.5, 5), (8.5, 4), 'Yes/No/Undef'),
    ((9.3, 5.5), (10.5, 5.5), 'Feedback'),
    ((11.5, 5.2), (11.5, 3.7), ''),
    ((10.5, 3), (7, 3), 'Iterate'),
    ((7, 3), (7, 6.8), ''),
]

for start, end, label in arrows:
    if label:
        ax.annotate('', xy=end, xytext=start,
                   arrowprops=dict(arrowstyle='->', color='#7f8c8d', lw=1.5,
                                  connectionstyle='arc3,rad=0'))
        mid_x = (start[0] + end[0]) / 2
        mid_y = (start[1] + end[1]) / 2
        ax.text(mid_x, mid_y + 0.15, label, fontsize=8, ha='center', va='bottom',
                color='#7f8c8d', style='italic')
    else:
        ax.annotate('', xy=end, xytext=start,
                   arrowprops=dict(arrowstyle='->', color='#7f8c8d', lw=1.5))

# 决策标签
decision_labels = [
    (8.5, 4.7, 'Yes'),
    (8.9, 5.2, 'No'),
    (8.9, 4.8, 'Undef'),
]
for x, y, label in decision_labels:
    ax.text(x, y, label, fontsize=8, ha='left', va='center', 
            color=colors['decision'], weight='bold')

# 底部示例框
example_box = FancyBboxPatch((0.5, 0.5), 13, 1.8,
                            boxstyle="round,pad=0.1,rounding_size=0.1",
                            facecolor='#f8f9fa', alpha=0.8,
                            edgecolor='#bdc3c7', linewidth=1)
ax.add_patch(example_box)

ax.text(7, 2.0, 'Example: "Find shared elements from two lists"', 
        fontsize=10, weight='bold', ha='center', va='center', color=colors['text'])
ax.text(7, 1.5, 'Test (1): common([1,2,3],[2,3,4]) == [2,3]  →  User: Yes', 
        fontsize=9, ha='center', va='center', color='#27ae60')
ax.text(7, 1.1, 'Test (2): common([1,2,2],[2,2,3]) == [2,2]  →  User: No', 
        fontsize=9, ha='center', va='center', color='#e74c3c')
ax.text(7, 0.7, 'Result: User disambiguates "set" vs "multiset", TiCoder prunes wrong candidates', 
        fontsize=9, ha='center', va='center', color='#7f8c7d', style='italic')

# 右侧统计信息
stats_box = FancyBboxPatch((11.5, 7), 2.3, 1.5,
                          boxstyle="round,pad=0.1,rounding_size=0.1",
                          facecolor='#e8f5e9', alpha=0.8,
                          edgecolor='#2ecc71', linewidth=1.5)
ax.add_patch(stats_box)
ax.text(12.65, 8.2, 'Results', fontsize=10, weight='bold', ha='center', va='center', color=colors['text'])
ax.text(12.65, 7.7, '40% → 84%', fontsize=12, weight='bold', ha='center', va='center', color='#27ae60')
ax.text(12.65, 7.35, 'correctness improvement', fontsize=8, ha='center', va='center', color='#7f8c8d')

plt.tight_layout()
plt.savefig('/Users/ericbinder/Documents/repos/githubpage/amytis-blog/public/images/papers/intent-formalization/ticoder-workflow.png',
            dpi=150, bbox_inches='tight', facecolor='white')
print("TiCoder workflow diagram saved!")
