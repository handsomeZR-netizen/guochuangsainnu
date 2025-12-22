import { Order, OrderStatus, CustomizationData, Artisan } from '../types';

/**
 * 订单服务
 * 处理订单保存、艺人分配、状态转换和基金计算
 * 需求: 6.5, 9.1, 9.2, 9.3, 9.4
 */

// 模拟南通艺人数据库
const NANTONG_ARTISANS: Artisan[] = [
  {
    id: 'artisan-1',
    name: '张师傅',
    experience: 35,
    location: '南通',
    specialties: ['吉祥纹样', '自然纹样'],
    currentOrders: 2,
    rating: 4.9
  },
  {
    id: 'artisan-2',
    name: '李师傅',
    experience: 28,
    location: '南通',
    specialties: ['几何纹样', '吉祥纹样'],
    currentOrders: 1,
    rating: 4.8
  },
  {
    id: 'artisan-3',
    name: '王师傅',
    experience: 42,
    location: '南通',
    specialties: ['自然纹样', '几何纹样'],
    currentOrders: 3,
    rating: 5.0
  },
  {
    id: 'artisan-4',
    name: '陈师傅',
    experience: 20,
    location: '南通',
    specialties: ['吉祥纹样'],
    currentOrders: 0,
    rating: 4.7
  }
];

// 模拟订单存储
const orderStorage: Map<string, Order> = new Map();

/**
 * 生成唯一订单ID
 */
function generateOrderId(): string {
  return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 计算订单总价
 * 基础价格 + 定制费用
 */
function calculateTotalPrice(customization: CustomizationData, basePrice: number): number {
  const area = customization.size.width * customization.size.height / 10000; // 转换为平方米
  const sizeMultiplier = Math.max(1, area * 0.5); // 面积越大价格越高
  const quantityDiscount = customization.quantity >= 10 ? 0.9 : 1; // 10件以上9折
  const customTextFee = customization.customText ? 20 : 0; // 定制文字额外收费
  
  return (basePrice * sizeMultiplier + customTextFee) * customization.quantity * quantityDiscount;
}

/**
 * 计算5%利润拨入传承基金
 * 需求: 9.4
 */
function calculateFundContribution(totalPrice: number, costRatio: number = 0.6): number {
  const profit = totalPrice * (1 - costRatio); // 假设成本率60%
  const contribution = profit * 0.05; // 5%利润拨入基金
  return Math.round(contribution * 100) / 100; // 保留两位小数
}

/**
 * 自动分配艺人
 * 根据艺人的当前订单数、经验和专长进行智能分配
 * 需求: 9.1
 */
function assignArtisan(patternCategory: string): Artisan {
  // 筛选擅长该纹样类型的艺人
  const suitableArtisans = NANTONG_ARTISANS.filter(artisan =>
    artisan.specialties.includes(patternCategory)
  );

  // 如果没有专长匹配的，使用所有艺人
  const candidates = suitableArtisans.length > 0 ? suitableArtisans : NANTONG_ARTISANS;

  // 按当前订单数排序（优先分配给订单少的艺人）
  const sortedArtisans = [...candidates].sort((a, b) => {
    if (a.currentOrders !== b.currentOrders) {
      return a.currentOrders - b.currentOrders;
    }
    // 订单数相同时，优先分配给经验丰富的
    return b.experience - a.experience;
  });

  const selectedArtisan = sortedArtisans[0];
  
  // 更新艺人的当前订单数
  selectedArtisan.currentOrders += 1;

  return selectedArtisan;
}

/**
 * 创建订单
 * 保存完整的定制参数并自动分配艺人
 * 需求: 6.5, 9.1
 */
export function createOrder(
  customization: CustomizationData,
  productId: string,
  productName: string,
  basePrice: number,
  patternCategory: string
): Order {
  const orderId = generateOrderId();
  const totalPrice = calculateTotalPrice(customization, basePrice);
  const fundContribution = calculateFundContribution(totalPrice);
  const artisan = assignArtisan(patternCategory);

  const order: Order = {
    id: orderId,
    customization,
    productId,
    productName,
    totalPrice,
    currency: 'USD',
    status: 'assigned', // 创建后立即分配艺人
    artisan,
    createdAt: new Date(),
    updatedAt: new Date(),
    fundContribution
  };

  // 保存订单
  orderStorage.set(orderId, order);

  return order;
}

/**
 * 获取订单
 */
export function getOrder(orderId: string): Order | undefined {
  return orderStorage.get(orderId);
}

/**
 * 更新订单状态
 * 实现订单工作流状态转换
 * 需求: 9.2, 9.3
 */
export function updateOrderStatus(orderId: string, newStatus: OrderStatus): Order {
  const order = orderStorage.get(orderId);
  if (!order) {
    throw new Error(`订单 ${orderId} 不存在`);
  }

  // 验证状态转换的合法性
  validateStatusTransition(order.status, newStatus);

  // 更新订单状态
  order.status = newStatus;
  order.updatedAt = new Date();

  // 根据状态变化触发相应的流程
  handleStatusTransition(order, newStatus);

  orderStorage.set(orderId, order);

  return order;
}

/**
 * 验证状态转换是否合法
 */
function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    'pending': ['assigned', 'cancelled'],
    'assigned': ['in-production', 'cancelled'],
    'in-production': ['quality-check', 'cancelled'],
    'quality-check': ['passed', 'in-production', 'cancelled'], // 质检不通过可以返回制作
    'passed': ['shipping'],
    'shipping': ['completed'],
    'completed': [],
    'cancelled': []
  };

  const allowedTransitions = validTransitions[currentStatus];
  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `无效的状态转换: ${currentStatus} -> ${newStatus}`
    );
  }
}

/**
 * 处理状态转换时的业务逻辑
 * 需求: 9.2, 9.3
 */
function handleStatusTransition(order: Order, newStatus: OrderStatus): void {
  switch (newStatus) {
    case 'quality-check':
      // 艺人完成制作，触发质检流程
      console.log(`订单 ${order.id} 进入质检流程`);
      // 实际应用中这里会调用质检系统API
      break;

    case 'passed':
      // 质检通过，准备发货
      console.log(`订单 ${order.id} 质检通过`);
      break;

    case 'shipping':
      // 启动跨境物流
      console.log(`订单 ${order.id} 开始物流配送`);
      // 实际应用中这里会调用物流API并发送追踪信息给用户
      sendTrackingInfo(order);
      break;

    case 'completed':
      // 订单完成，释放艺人资源
      if (order.artisan) {
        order.artisan.currentOrders = Math.max(0, order.artisan.currentOrders - 1);
      }
      console.log(`订单 ${order.id} 已完成，基金贡献: $${order.fundContribution}`);
      break;

    case 'cancelled':
      // 订单取消，释放艺人资源
      if (order.artisan) {
        order.artisan.currentOrders = Math.max(0, order.artisan.currentOrders - 1);
      }
      console.log(`订单 ${order.id} 已取消`);
      break;
  }
}

/**
 * 发送物流追踪信息
 * 需求: 9.3
 */
function sendTrackingInfo(order: Order): void {
  // 模拟生成追踪号
  const trackingNumber = `TRACK-${order.id.split('-')[1]}`;
  console.log(`物流追踪号: ${trackingNumber}`);
  // 实际应用中这里会发送邮件或短信给用户
}

/**
 * 获取所有订单
 */
export function getAllOrders(): Order[] {
  return Array.from(orderStorage.values());
}

/**
 * 获取艺人的当前订单
 */
export function getArtisanOrders(artisanId: string): Order[] {
  return Array.from(orderStorage.values()).filter(
    order => order.artisan?.id === artisanId
  );
}

/**
 * 获取基金总额
 * 需求: 9.4
 */
export function getTotalFundContribution(): number {
  const total = Array.from(orderStorage.values())
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.fundContribution, 0);
  
  return Math.round(total * 100) / 100;
}

/**
 * 获取所有南通艺人
 */
export function getAllArtisans(): Artisan[] {
  return NANTONG_ARTISANS;
}

/**
 * 艺人完成制作
 * 自动将订单状态从 in-production 转换为 quality-check
 * 需求: 9.2
 */
export function artisanCompleteProduction(orderId: string): Order {
  return updateOrderStatus(orderId, 'quality-check');
}

/**
 * 质检通过
 * 自动将订单状态从 quality-check 转换为 passed，然后启动物流
 * 需求: 9.3
 */
export function passQualityCheck(orderId: string): Order {
  const order = updateOrderStatus(orderId, 'passed');
  // 自动启动物流
  return updateOrderStatus(orderId, 'shipping');
}
