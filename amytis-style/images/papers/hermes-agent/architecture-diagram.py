"""
Hermes Agent Architecture Diagram
生成系统架构图，展示核心组件和交互关系
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Circle
import numpy as np
import os

# 设置中文字体
plt.rcParams['font.family'] = ['Arial Unicode MS', 'STHeiti', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# 创建图形
fig, ax = plt.subplots(1, 1, figsize=(16, 12), dpi=150)
ax.set_xlim(0, 16)
ax.set_ylim(0, 12)
ax.axis('off')

# 颜色方案
colors = {
    'core': '#3498db',      # 蓝色 - 核心层
    'agent': '#e74c3c',     # 红色 - Agent层
    'tools': '#27ae60',     # 绿色 - 工具层
    'gateway': '#9b59b6',   # 紫色 - 网关层
    'memory': '#f39c12',    # 橙色 - 记忆层
    'external': '#95a5a6',  # 灰色 - 外部服务
    'bg_light': '#f8f9fa',
    'border': '#2c3e50'
}

def draw_box(ax, x, y, width, height, color, text, fontsize=8, 
             text_color='white', bold=True, alpha=0.9, border_color=None):
    """绘制带圆角的组件框"""
    border = border_color or color
    box = FancyBboxPatch((x - width/2, y - height/2), width, height,
                         boxstyle="round,pad=0.02,rounding_size=0.1",
                         facecolor=color, edgecolor=border, 
                         linewidth=2 if bold else 1, alpha=alpha)
    ax.add_patch(box)
    
    weight = 'bold' if bold else 'normal'
    ax.text(x, y, text, fontsize=fontsize, fontweight=weight,
            ha='center', va='center', color=text_color, wrap=True,
            linespacing=1.2)
    return box

def draw_arrow(ax, x1, y1, x2, y2, color='#666666', style='->', lw=1.5, label=''):
    """绘制箭头"""
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle=style, lw=lw, color=color,
                               connectionstyle="arc3,rad=0"))
    if label:
        mid_x, mid_y = (x1+x2)/2, (y1+y2)/2
        ax.text(mid_x, mid_y+0.15, label, fontsize=7, 
                ha='center', va='center', color='#555555', style='italic')

# 标题
ax.text(8, 11.6, 'Hermes Agent System Architecture', fontsize=20, 
        fontweight='bold', ha='center', va='center', color='#1a1a2e')
ax.text(8, 11.2, 'Nous Research · Self-Improving AI Agent Framework', 
        fontsize=11, ha='center', va='center', color='#666666', style='italic')

# ===== 核心AI层 (顶部) =====
ax.text(8, 10.6, 'Core AI Layer', fontsize=11, fontweight='bold', 
        ha='center', va='center', color=colors['core'])

draw_box(ax, 4, 9.8, 2.8, 1.0, colors['core'], 
         'AIAgent\n(run_agent.py)', fontsize=9)
draw_box(ax, 8, 9.8, 2.8, 1.0, colors['core'], 
         'Model Tools\n(model_tools.py)', fontsize=9)
draw_box(ax, 12, 9.8, 2.8, 1.0, colors['core'], 
         'SessionDB\n(hermes_state.py)', fontsize=9)

# ===== Agent内部组件层 =====
ax.text(3, 8.8, 'Agent Internals', fontsize=10, fontweight='bold', 
        ha='center', va='center', color=colors['agent'])

# Agent组件
agent_components = [
    ('Prompt Builder', 1.8, 8.0),
    ('Memory Manager', 3.8, 8.0),
    ('Context Compressor', 5.8, 8.0),
    ('Skill Utils', 7.8, 8.0),
]
for name, x, y in agent_components:
    draw_box(ax, x, y, 1.6, 0.7, colors['agent'], name, fontsize=8, alpha=0.8)

# ===== 工具层 (中部) =====
ax.text(12, 8.8, 'Tool Registry', fontsize=10, fontweight='bold', 
        ha='center', va='center', color=colors['tools'])

# 工具分类
tool_categories = [
    ('File Ops', 9.5, 8.0),
    ('Terminal', 11.0, 8.0),
    ('Web Search', 12.5, 8.0),
    ('Browser', 14.0, 8.0),
    ('Vision', 15.0, 8.0),
]
for name, x, y in tool_categories:
    draw_box(ax, x, y, 1.3, 0.7, colors['tools'], name, fontsize=7, alpha=0.8)

# 特殊工具
special_tools = [
    ('delegate_task\n(Subagent)', 9.5, 6.9, colors['agent']),
    ('session_search\n(FTS5)', 11.5, 6.9, colors['memory']),
    ('skill_manage\n(Learning)', 13.5, 6.9, colors['memory']),
    ('memory\n(Recall)', 15.0, 6.9, colors['memory']),
]
for name, x, y, color in special_tools:
    draw_box(ax, x, y, 1.6, 0.8, color, name, fontsize=7, alpha=0.85)

# ===== 网关层 (右侧) =====
ax.text(14.5, 5.8, 'Gateway Layer', fontsize=10, fontweight='bold', 
        ha='center', va='center', color=colors['gateway'])

gateway_platforms = [
    ('Telegram', 13.5, 5.0),
    ('Discord', 14.7, 5.0),
    ('Slack', 13.5, 4.2),
    ('WhatsApp', 14.7, 4.2),
    ('Signal', 13.5, 3.4),
    ('Home\nAssistant', 14.7, 3.4),
]
for name, x, y in gateway_platforms:
    draw_box(ax, x, y, 1.0, 0.65, colors['gateway'], name, fontsize=7, alpha=0.8)

# ===== 记忆层 (左侧) =====
ax.text(2.5, 5.8, 'Memory & Learning', fontsize=10, fontweight='bold', 
        ha='center', va='center', color=colors['memory'])

memory_components = [
    ('SOUL.md\nIdentity', 1.5, 5.0),
    ('MEMORY.md\nLong-term', 3.0, 5.0),
    ('USER.md\nProfile', 1.5, 4.2),
    ('Skills\n(Procedural)', 3.0, 4.2),
    ('Session Search\n(FTS5)', 2.25, 3.4),
]
for name, x, y in memory_components:
    draw_box(ax, x, y, 1.3, 0.7, colors['memory'], name, fontsize=7, alpha=0.8)

# ===== 终端后端层 (底部) =====
ax.text(5, 2.6, 'Terminal Backends', fontsize=10, fontweight='bold', 
        ha='center', va='center', color=colors['external'])

backends = [
    ('Local', 1.5, 1.8),
    ('Docker', 2.8, 1.8),
    ('SSH', 4.1, 1.8),
    ('Daytona', 5.4, 1.8),
    ('Modal', 6.7, 1.8),
    ('Singularity', 8.0, 1.8),
]
for name, x, y in backends:
    draw_box(ax, x, y, 1.1, 0.6, colors['external'], name, fontsize=7, alpha=0.7)

# ===== 外部服务层 =====
ax.text(12.5, 2.6, 'External Services', fontsize=10, fontweight='bold', 
        ha='center', va='center', color=colors['external'])

services = [
    ('OpenRouter\n(200+ Models)', 10.5, 1.8),
    ('Nous Portal', 12.0, 1.8),
    ('MCP\nServers', 13.5, 1.8),
    ('Honcho\nDialectic', 15.0, 1.8),
]
for name, x, y in services:
    draw_box(ax, x, y, 1.3, 0.7, colors['external'], name, fontsize=7, alpha=0.7)

# ===== 箭头连接 =====
# AIAgent到Agent内部
draw_arrow(ax, 4, 9.3, 3.8, 8.35, color=colors['agent'])
draw_arrow(ax, 4, 9.3, 1.8, 8.35, color=colors['agent'])

# Model Tools到Tool Registry
draw_arrow(ax, 8, 9.3, 11, 8.35, color=colors['tools'])

# SessionDB到Memory
draw_arrow(ax, 12, 9.3, 2.25, 8.35, color=colors['memory'])

# Tool Registry到特殊工具
draw_arrow(ax, 11, 7.65, 11.5, 7.3, color=colors['tools'])

# Memory到Skills
ax.annotate('', xy=(3.0, 4.6), xytext=(2.25, 3.75),
            arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['memory'],
                           connectionstyle="arc3,rad=0.2"))

# Gateway到AIAgent
draw_arrow(ax, 13.5, 5.35, 9.4, 9.3, color=colors['gateway'], 
           style='->', label='messages')

# Terminal Backends到File/Terminal工具
ax.annotate('', xy=(9.5, 7.65), xytext=(5.4, 2.1),
            arrowprops=dict(arrowstyle='->', lw=1.5, color=colors['external'],
                           connectionstyle="arc3,rad=-0.3"))

# 外部服务到Model Tools
draw_arrow(ax, 12, 2.15, 8, 9.3, color=colors['external'], 
           style='->', label='LLM calls')

# ===== 特色功能标签 =====
ax.text(8, 0.6, 'Key Features:', fontsize=9, fontweight='bold', 
        ha='center', va='center', color='#333333')

features = [
    'Self-Improving Skills',
    'Cross-Session Memory',
    'Subagent Delegation',
    'Multi-Platform Gateway',
    'Context Compression',
    'FTS5 Search'
]

x_start = 3.5
for i, feat in enumerate(features):
    x = x_start + i * 2.0
    ax.text(x, 0.2, f'• {feat}', fontsize=8, 
            ha='center', va='center', color='#555555')

plt.tight_layout()

# 保存
output_dir = '/Users/ericbinder/Documents/repos/githubpage/amytis-blog/public/images/papers/hermes-agent'
os.makedirs(output_dir, exist_ok=True)
plt.savefig(f'{output_dir}/architecture-diagram.png', dpi=150, bbox_inches='tight',
            facecolor='white', edgecolor='none')
print(f'✓ Saved: {output_dir}/architecture-diagram.png')
plt.close()
