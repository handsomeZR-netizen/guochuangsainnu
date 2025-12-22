import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  createOrder,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  getTotalFundContribution,
  getAllArtisans,
  artisanCompleteProduction,
  passQualityCheck
} from './orderService';
import { CustomizationData, OrderStatus } from '../types';

/**
 * 订单流程属性测试
 * Feature: nantong-blue-calico-refocus
 * 验证需求: 6.5, 9.1, 9.2, 9.3, 9.4
 */

describe('Order Service Property Tests', () => {
  // 清理测试环境
  beforeEach(() => {
    // 重置艺人订单数
    const artisans = getAllArtisans();
    artisans.forEach(artisan => {
      artisan.currentOrders = 0;
    });
  });

  /**
   * 属性 19: 定制订单保存完整性
   * 对于任意用户确认的定制参数，系统应完整保存所有参数并生成包含这些参数的订单记录
   * 验证需求: 6.5
   */
  describe('Property 19: 定制订单保存完整性', () => {
    it('应完整保存所有定制参数', () => {
      // Feature: nantong-blue-calico-refocus, Property 19: 定制订单保存完整性
      fc.assert(
        fc.property(
          // 生成随机定制数据
          fc.record({
            patternId: fc.string({ minLength: 1, maxLength: 20 }),
            patternName: fc.string({ minLength: 1, maxLength: 20 }),
            customText: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            size: fc.record({
              width: fc.integer({ min: 1, max: 500 }),
              height: fc.integer({ min: 1, max: 500 }),
              unit: fc.constant('cm' as const)
            }),
            quantity: fc.integer({ min: 1, max: 100 }),
            notes: fc.option(fc.string({ maxLength: 200 }))
          }),
          fc.string({ minLength: 1, maxLength: 50 }), // productId
          fc.string({ minLength: 1, maxLength: 50 }), // productName
          fc.float({ min: 10, max: 1000 }), // basePrice
          fc.constantFrom('吉祥纹样', '自然纹样', '几何纹样'), // patternCategory
          (customization, productId, productName, basePrice, patternCategory) => {
            // 创建订单
            const order = createOrder(
              customization as CustomizationData,
              productId,
              productName,
              basePrice,
              patternCategory
            );

            // 验证订单ID存在
            expect(order.id).toBeTruthy();
            expect(order.id).toMatch(/^ORDER-/);

            // 验证所有定制参数都被保存
            expect(order.customization.patternId).toBe(customization.patternId);
            expect(order.customization.patternName).toBe(customization.patternName);
            expect(order.customization.customText).toBe(customization.customText);
            expect(order.customization.size.width).toBe(customization.size.width);
            expect(order.customization.size.height).toBe(customization.size.height);
            expect(order.customization.size.unit).toBe(customization.size.unit);
            expect(order.customization.quantity).toBe(customization.quantity);
            expect(order.customization.notes).toBe(customization.notes);

            // 验证产品信息
            expect(order.productId).toBe(productId);
            expect(order.productName).toBe(productName);

            // 验证订单可以被检索
            const retrievedOrder = getOrder(order.id);
            expect(retrievedOrder).toBeDefined();
            expect(retrievedOrder?.id).toBe(order.id);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性 23: 订单艺人分配
   * 对于任意完成的定制订单，系统应自动分配给至少一位南通当地的合作艺人
   * 验证需求: 9.1
   */
  describe('Property 23: 订单艺人分配', () => {
    it('应自动分配南通艺人', () => {
      // Feature: nantong-blue-calico-refocus, Property 23: 订单艺人分配
      fc.assert(
        fc.property(
          fc.record({
            patternId: fc.string({ minLength: 1, maxLength: 20 }),
            patternName: fc.string({ minLength: 1, maxLength: 20 }),
            customText: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            size: fc.record({
              width: fc.integer({ min: 1, max: 500 }),
              height: fc.integer({ min: 1, max: 500 }),
              unit: fc.constant('cm' as const)
            }),
            quantity: fc.integer({ min: 1, max: 100 }),
            notes: fc.option(fc.string({ maxLength: 200 }))
          }),
          fc.constantFrom('吉祥纹样', '自然纹样', '几何纹样'),
          (customization, patternCategory) => {
            const order = createOrder(
              customization as CustomizationData,
              'test-product',
              'Test Product',
              100,
              patternCategory
            );

            // 验证艺人已分配
            expect(order.artisan).toBeDefined();
            expect(order.artisan?.id).toBeTruthy();
            expect(order.artisan?.name).toBeTruthy();
            
            // 验证艺人来自南通
            expect(order.artisan?.location).toBe('南通');
            
            // 验证订单状态为已分配
            expect(order.status).toBe('assigned');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应优先分配给订单少的艺人', () => {
      // Feature: nantong-blue-calico-refocus, Property 23: 订单艺人分配
      const customization: CustomizationData = {
        patternId: 'test-pattern',
        patternName: 'Test Pattern',
        size: { width: 100, height: 100, unit: 'cm' },
        quantity: 1
      };

      // 创建多个订单
      const orders = [];
      for (let i = 0; i < 5; i++) {
        const order = createOrder(
          customization,
          'test-product',
          'Test Product',
          100,
          '吉祥纹样'
        );
        orders.push(order);
      }

      // 验证订单被分配给不同的艺人（负载均衡）
      const artisanIds = orders.map(o => o.artisan?.id);
      const uniqueArtisans = new Set(artisanIds);
      
      // 至少应该有2个不同的艺人被分配
      expect(uniqueArtisans.size).toBeGreaterThanOrEqual(2);
    });
  });

  /**
   * 属性 24+25: 订单工作流状态转换
   * 对于任意订单状态变更（艺人完成→质检、质检通过→物流），
   * 系统应自动触发下一阶段的流程并更新订单状态
   * 验证需求: 9.2, 9.3
   */
  describe('Property 24+25: 订单工作流状态转换', () => {
    it('艺人完成制作应触发质检流程', () => {
      // Feature: nantong-blue-calico-refocus, Property 24+25: 订单工作流状态转换
      fc.assert(
        fc.property(
          fc.record({
            patternId: fc.string({ minLength: 1, maxLength: 20 }),
            patternName: fc.string({ minLength: 1, maxLength: 20 }),
            size: fc.record({
              width: fc.integer({ min: 1, max: 500 }),
              height: fc.integer({ min: 1, max: 500 }),
              unit: fc.constant('cm' as const)
            }),
            quantity: fc.integer({ min: 1, max: 100 })
          }),
          (customization) => {
            // 创建订单
            const order = createOrder(
              customization as CustomizationData,
              'test-product',
              'Test Product',
              100,
              '吉祥纹样'
            );

            // 模拟订单进入制作阶段
            updateOrderStatus(order.id, 'in-production');
            
            // 艺人完成制作
            const updatedOrder = artisanCompleteProduction(order.id);

            // 验证状态已转换为质检
            expect(updatedOrder.status).toBe('quality-check');
            
            // 验证订单更新时间已改变或相等（允许毫秒级相同）
            expect(updatedOrder.updatedAt.getTime()).toBeGreaterThanOrEqual(
              order.createdAt.getTime()
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('质检通过应启动物流', () => {
      // Feature: nantong-blue-calico-refocus, Property 24+25: 订单工作流状态转换
      fc.assert(
        fc.property(
          fc.record({
            patternId: fc.string({ minLength: 1, maxLength: 20 }),
            patternName: fc.string({ minLength: 1, maxLength: 20 }),
            size: fc.record({
              width: fc.integer({ min: 1, max: 500 }),
              height: fc.integer({ min: 1, max: 500 }),
              unit: fc.constant('cm' as const)
            }),
            quantity: fc.integer({ min: 1, max: 100 })
          }),
          (customization) => {
            // 创建订单并推进到质检阶段
            const order = createOrder(
              customization as CustomizationData,
              'test-product',
              'Test Product',
              100,
              '吉祥纹样'
            );

            updateOrderStatus(order.id, 'in-production');
            updateOrderStatus(order.id, 'quality-check');
            
            // 质检通过
            const shippingOrder = passQualityCheck(order.id);

            // 验证状态已转换为物流中
            expect(shippingOrder.status).toBe('shipping');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应拒绝非法的状态转换', () => {
      // Feature: nantong-blue-calico-refocus, Property 24+25: 订单工作流状态转换
      const customization: CustomizationData = {
        patternId: 'test-pattern',
        patternName: 'Test Pattern',
        size: { width: 100, height: 100, unit: 'cm' },
        quantity: 1
      };

      const order = createOrder(
        customization,
        'test-product',
        'Test Product',
        100,
        '吉祥纹样'
      );

      // 尝试从 assigned 直接跳到 shipping（非法）
      expect(() => {
        updateOrderStatus(order.id, 'shipping');
      }).toThrow('无效的状态转换');
    });

    it('完整的工作流应按顺序执行', () => {
      // Feature: nantong-blue-calico-refocus, Property 24+25: 订单工作流状态转换
      const customization: CustomizationData = {
        patternId: 'test-pattern',
        patternName: 'Test Pattern',
        size: { width: 100, height: 100, unit: 'cm' },
        quantity: 1
      };

      const order = createOrder(
        customization,
        'test-product',
        'Test Product',
        100,
        '吉祥纹样'
      );

      // 验证初始状态
      expect(order.status).toBe('assigned');

      // 进入制作
      const inProduction = updateOrderStatus(order.id, 'in-production');
      expect(inProduction.status).toBe('in-production');

      // 完成制作，进入质检
      const inQualityCheck = artisanCompleteProduction(order.id);
      expect(inQualityCheck.status).toBe('quality-check');

      // 质检通过，启动物流
      const shipping = passQualityCheck(order.id);
      expect(shipping.status).toBe('shipping');

      // 完成配送
      const completed = updateOrderStatus(order.id, 'completed');
      expect(completed.status).toBe('completed');
    });
  });

  /**
   * 属性 26: 基金计算正确性
   * 对于任意完成的订单，拨入传承基金的金额应等于订单利润的5%（误差<0.01元）
   * 验证需求: 9.4
   */
  describe('Property 26: 基金计算正确性', () => {
    it('基金贡献应为利润的5%', () => {
      // Feature: nantong-blue-calico-refocus, Property 26: 基金计算正确性
      fc.assert(
        fc.property(
          fc.record({
            patternId: fc.string({ minLength: 1, maxLength: 20 }),
            patternName: fc.string({ minLength: 1, maxLength: 20 }),
            size: fc.record({
              width: fc.integer({ min: 1, max: 500 }),
              height: fc.integer({ min: 1, max: 500 }),
              unit: fc.constant('cm' as const)
            }),
            quantity: fc.integer({ min: 1, max: 100 })
          }),
          fc.float({ min: 10, max: 1000, noNaN: true }), // basePrice - 排除NaN
          (customization, basePrice) => {
            const order = createOrder(
              customization as CustomizationData,
              'test-product',
              'Test Product',
              basePrice,
              '吉祥纹样'
            );

            // 验证基金贡献存在且为正数
            expect(order.fundContribution).toBeGreaterThan(0);

            // 验证基金贡献约为总价的2%（假设成本率60%，利润40%，5%利润=2%总价）
            const expectedContribution = order.totalPrice * 0.4 * 0.05;
            const tolerance = 0.01;
            
            expect(Math.abs(order.fundContribution - expectedContribution)).toBeLessThan(tolerance);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('总基金应等于所有完成订单的基金贡献之和', () => {
      // Feature: nantong-blue-calico-refocus, Property 26: 基金计算正确性
      const customization: CustomizationData = {
        patternId: 'test-pattern',
        patternName: 'Test Pattern',
        size: { width: 100, height: 100, unit: 'cm' },
        quantity: 1
      };

      // 记录初始基金总额
      const initialFund = getTotalFundContribution();

      // 创建多个订单并完成
      const orders = [];
      for (let i = 0; i < 5; i++) {
        const order = createOrder(
          customization,
          'test-product',
          'Test Product',
          100 + i * 10,
          '吉祥纹样'
        );
        
        // 推进订单到完成状态
        updateOrderStatus(order.id, 'in-production');
        updateOrderStatus(order.id, 'quality-check');
        passQualityCheck(order.id);
        updateOrderStatus(order.id, 'completed');
        
        orders.push(order);
      }

      // 计算这批订单的预期基金贡献
      const expectedContribution = orders.reduce((sum, order) => sum + order.fundContribution, 0);
      const actualTotal = getTotalFundContribution();
      const actualContribution = actualTotal - initialFund;

      // 验证新增基金正确（允许浮点误差）
      expect(Math.abs(actualContribution - expectedContribution)).toBeLessThan(0.01);
    });

    it('未完成的订单不应计入基金总额', () => {
      // Feature: nantong-blue-calico-refocus, Property 26: 基金计算正确性
      const customization: CustomizationData = {
        patternId: 'test-pattern',
        patternName: 'Test Pattern',
        size: { width: 100, height: 100, unit: 'cm' },
        quantity: 1
      };

      const initialTotal = getTotalFundContribution();

      // 创建订单但不完成
      const order = createOrder(
        customization,
        'test-product',
        'Test Product',
        100,
        '吉祥纹样'
      );

      // 验证基金总额未变化
      expect(getTotalFundContribution()).toBe(initialTotal);

      // 推进到制作中
      updateOrderStatus(order.id, 'in-production');
      expect(getTotalFundContribution()).toBe(initialTotal);

      // 只有完成后才计入
      updateOrderStatus(order.id, 'quality-check');
      passQualityCheck(order.id);
      updateOrderStatus(order.id, 'completed');
      
      expect(getTotalFundContribution()).toBeGreaterThan(initialTotal);
    });
  });
});
