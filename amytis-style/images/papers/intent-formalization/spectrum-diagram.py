"""
Intent Formalization Spectrum Diagram
生成论文中图2的可视化——意图形式化谱系图
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

# 设置中文字体
plt.rcParams['font.family'] = ['Arial Unicode MS', 'SimHei', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# 创建图形
fig, ax = plt.subplots(1, 1, figsize=(14, 8), dpi=150)
ax.set_xlim(0, 14)
ax.set_ylim(0, 10)
ax.axis('off')

# 标题
ax.text(7, 9.5, 'Intent Formalization Spectrum', fontsize=20, fontweight='bold', 
        ha='center', va='center', color='#1a1a2e')
ax.text(7, 9.0, '意图形式化谱系：从部分到完整的规范层次', fontsize=12, 
        ha='center', va='center', color='#555555', style='italic')

# 定义层次颜色
colors = {
    'tests': '#e74c3c',      # 红色 - 测试
    'contracts': '#e67e22',  # 橙色 - 代码契约
    'logical': '#3498db',    # 蓝色 - 逻辑契约
    'dsl': '#27ae60'         # 绿色 - DSL
}

# 箭头基线
arrow_y = 5.5
ax.annotate('', xy=(13, arrow_y), xytext=(1, arrow_y),
            arrowprops=dict(arrowstyle='->', lw=3, color='#2c3e50'))
ax.text(7, 5.1, 'Increasing Correctness Coverage →', fontsize=11, 
        ha='center', va='center', color='#2c3e50', fontweight='bold')

# 四个层次框
def draw_box(ax, x, y, width, height, color, title, subtitle, examples):
    """绘制带圆角的规范层次框"""
    # 主框
    box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                         boxstyle="round,pad=0.02,rounding_size=0.2",
                         facecolor=color, edgecolor='white', linewidth=2,
                         alpha=0.15)
    ax.add_patch(box)
    
    # 边框
    border = FancyBboxPatch((x - width/2, y - height/2), width, height,
                           boxstyle="round,pad=0.02,rounding_size=0.2",
                           facecolor='none', edgecolor=color, linewidth=2.5)
    ax.add_patch(border)
    
    # 标题区域（彩色背景）
    title_box = FancyBboxPatch((x - width/2, y + height/2 - 0.9), width, 0.9,
                               boxstyle="round,pad=0.02,rounding_size=0.15",
                               facecolor=color, edgecolor='none', alpha=0.9)
    ax.add_patch(title_box)
    
    # 标题文字
    ax.text(x, y + height/2 - 0.45, title, fontsize=10, fontweight='bold',
            ha='center', va='center', color='white')
    
    # 副标题
    ax.text(x, y + height/2 - 1.3, subtitle, fontsize=8, 
            ha='center', va='center', color='#555555', style='italic')
    
    # 示例（代码样式）
    for i, ex in enumerate(examples):
        ax.text(x, y + height/2 - 2.0 - i*0.5, f'• {ex}', fontsize=7.5,
                ha='center', va='center', color='#333333', 
                family='monospace')

# 绘制四个层次
draw_box(ax, 2.5, 6.8, 2.8, 3.5, colors['tests'], 
         'Tests', 'Partial (I/O examples)',
         ['remove_duplicates([1,2,3,2,4])', 'should return [1,3,4]',
          'Input/Output pairs', 'Concrete examples'])

draw_box(ax, 5.7, 6.8, 2.8, 3.5, colors['contracts'],
         'Code Contracts', 'Assertions/Pre/Post/Invariants',
         ['assert all(x in result ...)', 'Function-level contracts',
          'Runtime assertions', 'Executable specs'])

draw_box(ax, 8.9, 6.8, 2.8, 3.5, colors['logical'],
         'Logical Contracts', 'Dafny/F*/Verus',
         ['requires forall x :: ...', 'ensures forall y :: ...',
          'Quantifiers & predicates', 'SMT verification'])

draw_box(ax, 12.1, 6.8, 2.8, 3.5, colors['dsl'],
         'DSLs', 'Full Specifications',
         ['3D Domain Language', 'Verified compilation',
          'Correct-by-construction', 'EverParse synthesis'])

# 底部检查方式说明
ax.text(2.5, 2.3, 'Dynamic Checking', fontsize=10, fontweight='bold',
        ha='center', va='center', color=colors['tests'])
ax.text(2.5, 1.8, '动态检查：测试、运行时契约', fontsize=9,
        ha='center', va='center', color='#666666')

ax.text(7.3, 2.3, 'Static Verification', fontsize=10, fontweight='bold',
        ha='center', va='center', color=colors['logical'])
ax.text(7.3, 1.8, '静态验证：SMT求解器、证明助手', fontsize=9,
        ha='center', va='center', color='#666666')

ax.text(12.1, 2.3, 'Verified Synthesis', fontsize=10, fontweight='bold',
        ha='center', va='center', color=colors['dsl'])
ax.text(12.1, 1.8, '验证合成：代码自动生成', fontsize=9,
        ha='center', va='center', color='#666666')

# 系统示例标签
ax.text(2.5, 1.0, 'TiCoder', fontsize=8, ha='center', va='center',
        color='#888888', style='italic')
ax.text(5.7, 1.0, 'nl2postcond', fontsize=8, ha='center', va='center',
        color='#888888', style='italic')
ax.text(8.9, 1.0, 'ClassInvGen', fontsize=8, ha='center', va='center',
        color='#888888', style='italic')
ax.text(8.9, 0.6, 'Auto-Verus', fontsize=8, ha='center', va='center',
        color='#888888', style='italic')
ax.text(12.1, 1.0, 'VeriStruct', fontsize=8, ha='center', va='center',
        color='#888888', style='italic')
ax.text(12.1, 0.6, '3DGen', fontsize=8, ha='center', va='center',
        color='#888888', style='italic')

# 分隔线
ax.plot([7, 7], [0.3, 2.8], '--', color='#cccccc', linewidth=1)

# 底部说明
ax.text(7, 0.15, 'LLMs can help generate artifacts at every level', fontsize=9,
        ha='center', va='center', color='#3498db', style='italic')

plt.tight_layout()

# 保存
output_dir = '/Users/ericbinder/Documents/repos/githubpage/amytis-blog/public/images/papers/intent-formalization'
os.makedirs(output_dir, exist_ok=True)
plt.savefig(f'{output_dir}/spectrum-diagram.png', dpi=150, bbox_inches='tight',
            facecolor='white', edgecolor='none')
print(f'✓ Saved: {output_dir}/spectrum-diagram.png')
plt.close()
