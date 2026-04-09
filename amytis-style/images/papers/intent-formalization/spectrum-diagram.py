"""
意图形式化谱系图
展示从测试到DSL的四层规范层次
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

fig, ax = plt.subplots(figsize=(14, 8))
ax.set_xlim(0, 14)
ax.set_ylim(0, 10)
ax.axis('off')

# 颜色方案
colors = {
    'tests': '#3498db',
    'contracts': '#2ecc71',
    'logical': '#9b59b6',
    'dsl': '#e74c3c',
    'bg_light': '#f8f9fa',
    'text': '#2c3e50',
    'arrow': '#7f8c8d'
}

# 标题
ax.text(7, 9.5, 'Intent Formalization Spectrum', fontsize=18, weight='bold', 
        ha='center', va='center', color=colors['text'])
ax.text(7, 9.0, 'From Lightweight Tests to Verified Synthesis', fontsize=12, 
        ha='center', va='center', color='#7f8c8d')

# 绘制四层层次
layers = [
    {
        'name': 'Tests\n(I/O examples)',
        'y': 7.5,
        'color': colors['tests'],
        'tools': 'TiCoder, nl2postcond',
        'checking': 'Dynamic',
        'coverage': 'Partial'
    },
    {
        'name': 'Code Contracts\n(assertions/pre/post)', 
        'y': 6.0,
        'color': colors['contracts'],
        'tools': 'nl2postcond, ClassInvGen',
        'checking': 'Dynamic/Runtime',
        'coverage': 'Partial'
    },
    {
        'name': 'Logical Contracts\n(Dafny/Verus/F*)',
        'y': 4.5,
        'color': colors['logical'],
        'tools': 'Auto-Verus, VeriStruct',
        'checking': 'Static Verification',
        'coverage': 'Complete'
    },
    {
        'name': 'DSLs\n(Domain-Specific Languages)',
        'y': 3.0,
        'color': colors['dsl'],
        'tools': '3DGen, EverParse',
        'checking': 'Verified Synthesis',
        'coverage': 'Complete'
    }
]

for i, layer in enumerate(layers):
    # 绘制层级框
    box = FancyBboxPatch((1, layer['y']-0.4), 5, 0.8,
                         boxstyle="round,pad=0.05,rounding_size=0.2",
                         facecolor=layer['color'], alpha=0.2,
                         edgecolor=layer['color'], linewidth=2)
    ax.add_patch(box)
    
    # 层级名称
    ax.text(3.5, layer['y'], layer['name'], fontsize=11, weight='bold',
            ha='center', va='center', color=layer['color'])
    
    # 工具
    ax.text(7.5, layer['y']+0.15, f"Tools: {layer['tools']}", fontsize=9,
            ha='left', va='center', color=colors['text'])
    
    # 检查方式
    ax.text(7.5, layer['y']-0.15, f"Checking: {layer['checking']}", fontsize=9,
            ha='left', va='center', color='#7f8c8d')
    
    # 箭头（除最后一层）
    if i < len(layers) - 1:
        ax.annotate('', xy=(3.5, layers[i+1]['y']+0.5), xytext=(3.5, layer['y']-0.5),
                   arrowprops=dict(arrowstyle='->', color=colors['arrow'], lw=2))

# 增加正确性覆盖箭头
ax.annotate('', xy=(12, 3), xytext=(12, 7.5),
           arrowprops=dict(arrowstyle='->', color='#27ae60', lw=3))
ax.text(12.5, 5.25, 'Correctness\nCoverage', fontsize=10, weight='bold',
        ha='center', va='center', color='#27ae60', rotation=90)

# 底部说明
ax.text(7, 1.5, 'LLMs can generate artifacts at every level', fontsize=10,
        ha='center', va='center', color='#7f8c8d', style='italic')

# 图例
legend_items = [
    ('Tests: Concrete I/O examples', colors['tests']),
    ('Contracts: Executable assertions', colors['contracts']),
    ('Logical: Formal specifications', colors['logical']),
    ('DSLs: Complete specifications', colors['dsl'])
]

for i, (label, color) in enumerate(legend_items):
    y_pos = 1.0 - i * 0.25
    ax.add_patch(FancyBboxPatch((10.5, y_pos-0.08), 0.15, 0.15,
                               boxstyle="round,pad=0.02", facecolor=color, alpha=0.6))
    ax.text(10.8, y_pos, label, fontsize=8, ha='left', va='center', color=colors['text'])

plt.tight_layout()
plt.savefig('/Users/ericbinder/Documents/repos/githubpage/amytis-blog/public/images/papers/intent-formalization/spectrum.png',
            dpi=150, bbox_inches='tight', facecolor='white')
print("Spectrum diagram saved!")
