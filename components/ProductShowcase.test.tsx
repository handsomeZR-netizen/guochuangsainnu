/**
 * ProductShowcase 组件单元测试
 * 测试三大场景的渲染、交互和AI功能
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProductShowcase from './ProductShowcase';
import { scenarios } from '../data/scenarioConfig';

describe('ProductShowcase - 场景展示', () => {
  /**
   * 测试需求 4.1: 三个场景卡片的渲染
   */
  describe('场景卡片渲染', () => {
    it('应该渲染三个场景卡片', () => {
      render(<ProductShowcase />);
      
      // 验证三个场景标题都存在
      expect(screen.getByText('手作时光 · 亲子成长')).toBeInTheDocument();
      expect(screen.getByText('宴设青蓝 · 婚宴旅拍')).toBeInTheDocument();
      expect(screen.getByText('空间诗学 · 家居软装')).toBeInTheDocument();
    });

    it('应该显示每个场景的英文标题', () => {
      render(<ProductShowcase />);
      
      expect(screen.getByText('Handcraft Time · Parent-Child Growth')).toBeInTheDocument();
      expect(screen.getByText('Indigo Banquet · Wedding Photography')).toBeInTheDocument();
      expect(screen.getByText('Space Poetics · Home Furnishing')).toBeInTheDocument();
    });

    it('应该显示每个场景的描述', () => {
      render(<ProductShowcase />);
      
      expect(screen.getByText(/让孩子在靛蓝纹样里/)).toBeInTheDocument();
      expect(screen.getByText(/靛蓝画卷替代签到本/)).toBeInTheDocument();
      expect(screen.getByText(/将蓝印花布解构为屏风/)).toBeInTheDocument();
    });

    it('应该显示每个场景的图标', () => {
      render(<ProductShowcase />);
      
      // 验证图标emoji存在
      expect(screen.getByText('🎨')).toBeInTheDocument();
      expect(screen.getByText('💒')).toBeInTheDocument();
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });

    it('初始状态下所有场景应该是收起的', () => {
      render(<ProductShowcase />);
      
      // 验证产品详情不可见（因为场景是收起的）
      expect(screen.queryByText('手作锦囊DIY包')).not.toBeInTheDocument();
      expect(screen.queryByText('靛蓝画卷·签到本')).not.toBeInTheDocument();
      expect(screen.queryByText('软装诗布·屏风')).not.toBeInTheDocument();
    });
  });

  /**
   * 测试需求 4.1, 4.2: 场景切换交互
   */
  describe('场景切换交互', () => {
    it('点击场景卡片应该展开该场景', () => {
      render(<ProductShowcase />);
      
      // 点击亲子场景
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证产品列表显示
      expect(screen.getByText('手作锦囊DIY包')).toBeInTheDocument();
      expect(screen.getByText('儿童科普绘本套装')).toBeInTheDocument();
      expect(screen.getByText('亲子围裙套装')).toBeInTheDocument();
    });

    it('再次点击已展开的场景应该收起', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      
      // 第一次点击展开
      fireEvent.click(parentChildCard!);
      expect(screen.getByText('手作锦囊DIY包')).toBeInTheDocument();
      
      // 第二次点击收起
      fireEvent.click(parentChildCard!);
      expect(screen.queryByText('手作锦囊DIY包')).not.toBeInTheDocument();
    });

    it('展开一个场景应该自动收起其他场景', () => {
      render(<ProductShowcase />);
      
      // 展开亲子场景
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      expect(screen.getByText('手作锦囊DIY包')).toBeInTheDocument();
      
      // 展开婚宴场景
      const banquetCard = screen.getByText('宴设青蓝 · 婚宴旅拍').closest('div');
      fireEvent.click(banquetCard!);
      
      // 验证亲子场景的产品不再显示
      expect(screen.queryByText('手作锦囊DIY包')).not.toBeInTheDocument();
      // 验证婚宴场景的产品显示
      expect(screen.getByText('靛蓝画卷·签到本')).toBeInTheDocument();
    });

    it('应该显示展开/收起按钮图标', () => {
      const { container } = render(<ProductShowcase />);
      
      // 初始状态应该有向下的箭头（ChevronDown）
      const chevronDowns = container.querySelectorAll('svg');
      expect(chevronDowns.length).toBeGreaterThan(0);
    });
  });

  /**
   * 测试需求 4.3, 4.4: 产品详情展示
   */
  describe('产品详情展示', () => {
    it('展开场景后应该显示该场景的所有产品', () => {
      render(<ProductShowcase />);
      
      // 展开亲子场景
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证所有产品都显示
      const parentChildScenario = scenarios.find(s => s.id === 'parent-child');
      parentChildScenario?.products.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it('应该显示产品的价格信息', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证价格显示
      expect(screen.getByText(/USD 88/)).toBeInTheDocument();
      expect(screen.getByText(/USD 45/)).toBeInTheDocument();
      expect(screen.getByText(/USD 120/)).toBeInTheDocument();
    });

    it('应该显示产品的定制信息', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证定制信息
      expect(screen.getByText(/可添加家庭姓氏或孩子姓名的吉祥纹样/)).toBeInTheDocument();
    });

    it('应该显示产品包含的内容', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证包含内容显示 - 使用更具体的查询
      expect(screen.getByText('预制刮浆布料（30x30cm）')).toBeInTheDocument();
      expect(screen.getByText(/天然靛蓝染料包/)).toBeInTheDocument();
    });

    it('应该显示产品的纹样信息', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证纹样标签
      expect(screen.getByText('五福捧寿')).toBeInTheDocument();
      expect(screen.getByText('松鹤长春')).toBeInTheDocument();
      expect(screen.getByText('连年有余')).toBeInTheDocument();
    });
  });

  /**
   * 测试需求 4.5: AI推荐功能可用性
   */
  describe('AI推荐功能', () => {
    it('展开场景后应该显示AI功能区域', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证AI功能标题（支持中英文）
      expect(screen.getByText(/AI智能功能|AI Intelligent Features/)).toBeInTheDocument();
    });

    it('应该显示亲子场景的所有AI功能', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证三个AI功能
      expect(screen.getByText('儿童版文化科普')).toBeInTheDocument();
      expect(screen.getByText('染色效果预览')).toBeInTheDocument();
      expect(screen.getByText('二维码文化百科')).toBeInTheDocument();
    });

    it('应该显示婚宴场景的所有AI功能', () => {
      render(<ProductShowcase />);
      
      const banquetCard = screen.getByText('宴设青蓝 · 婚宴旅拍').closest('div');
      fireEvent.click(banquetCard!);
      
      // 验证三个AI功能
      expect(screen.getByText('宴席3D效果图')).toBeInTheDocument();
      expect(screen.getByText('祝词生成')).toBeInTheDocument();
      expect(screen.getByText('纹样定制推荐')).toBeInTheDocument();
    });

    it('应该显示空间场景的所有AI功能', () => {
      render(<ProductShowcase />);
      
      const spaceCard = screen.getByText('空间诗学 · 家居软装').closest('div');
      fireEvent.click(spaceCard!);
      
      // 验证三个AI功能
      expect(screen.getByText('房间照片分析')).toBeInTheDocument();
      expect(screen.getByText('色调搭配推荐')).toBeInTheDocument();
      expect(screen.getByText('光效模拟')).toBeInTheDocument();
    });

    it('应该显示AI功能的描述信息', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证功能描述
      expect(screen.getByText(/AI生成适合儿童理解的纹样故事/)).toBeInTheDocument();
      expect(screen.getByText(/上传孩子的设计草图/)).toBeInTheDocument();
      expect(screen.getByText(/扫描产品二维码/)).toBeInTheDocument();
    });

    it('应该显示AI功能的图标', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证图标emoji - 使用getAllByText因为有多个相同的emoji
      const bookIcons = screen.getAllByText('📚');
      expect(bookIcons.length).toBeGreaterThan(0);
      
      const artIcons = screen.getAllByText('🎨');
      expect(artIcons.length).toBeGreaterThan(0);
      
      const phoneIcons = screen.getAllByText('📱');
      expect(phoneIcons.length).toBeGreaterThan(0);
    });

    it('每个场景应该至少有3个AI功能', () => {
      scenarios.forEach(scenario => {
        expect(scenario.aiFeatures.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  /**
   * 测试场景配置数据的完整性
   */
  describe('场景配置数据完整性', () => {
    it('应该有三个场景配置', () => {
      expect(scenarios.length).toBe(3);
    });

    it('每个场景应该有必需的字段', () => {
      scenarios.forEach(scenario => {
        expect(scenario.id).toBeDefined();
        expect(scenario.title).toBeDefined();
        expect(scenario.titleEn).toBeDefined();
        expect(scenario.description).toBeDefined();
        expect(scenario.icon).toBeDefined();
        expect(scenario.products).toBeDefined();
        expect(scenario.aiFeatures).toBeDefined();
      });
    });

    it('每个场景应该至少有一个产品', () => {
      scenarios.forEach(scenario => {
        expect(scenario.products.length).toBeGreaterThan(0);
      });
    });

    it('每个产品应该有必需的字段', () => {
      scenarios.forEach(scenario => {
        scenario.products.forEach(product => {
          expect(product.id).toBeDefined();
          expect(product.name).toBeDefined();
          expect(product.nameEn).toBeDefined();
          expect(product.price).toBeGreaterThan(0);
          expect(product.currency).toBeDefined();
          expect(product.description).toBeDefined();
        });
      });
    });
  });

  /**
   * 测试响应式布局
   */
  describe('响应式布局', () => {
    it('应该使用网格布局展示场景卡片', () => {
      const { container } = render(<ProductShowcase />);
      
      // 验证网格容器存在
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('展开的场景应该占据全宽', () => {
      const { container } = render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证展开后的样式类
      const expandedCard = parentChildCard?.closest('.col-span-full');
      expect(expandedCard).toBeInTheDocument();
    });
  });

  /**
   * 测试用户体验细节
   */
  describe('用户体验', () => {
    it('应该显示底部提示文字', () => {
      render(<ProductShowcase />);
      
      expect(screen.getByText(/点击场景卡片查看详细产品和AI功能/)).toBeInTheDocument();
    });

    it('应该显示页面标题和副标题', () => {
      render(<ProductShowcase />);
      
      expect(screen.getByText('三大场景 · 生活美学')).toBeInTheDocument();
      expect(screen.getByText(/从亲子教育到婚宴定制/)).toBeInTheDocument();
    });

    it('产品卡片应该有查看按钮', () => {
      render(<ProductShowcase />);
      
      const parentChildCard = screen.getByText('手作时光 · 亲子成长').closest('div');
      fireEvent.click(parentChildCard!);
      
      // 验证查看按钮存在（支持中英文）
      const viewButtons = screen.getAllByText(/查看|View/);
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });
});
