// Система расчёта стоимости 3D-печати
// Детерминированная функция расчёта на основе конфигурации

import { pricingConfig, materials } from '../studio/studioKnowledge';

export interface PriceCalculationInput {
  materialId: string;
  weightGrams: number;
  complexity: 'low' | 'medium' | 'high';
  quantity: number;
  urgent: boolean;
  postProcessing?: {
    sanding?: boolean;
    priming?: boolean;
    painting?: boolean;
    acetoneSmoothing?: boolean;
  };
}

export interface PriceBreakdown {
  materialCost: number;
  complexityMultiplier: number;
  quantityDiscount: number;
  urgencyMultiplier: number;
  postProcessingCost: number;
  subtotal: number;
  total: number;
  currency: string;
}

export interface PriceEstimate {
  breakdown: PriceBreakdown;
  estimatedTime?: string;
  notes: string[];
}

/**
 * Рассчитывает стоимость 3D-печати
 * 
 * Формула:
 * basePrice = materialPrice * weight * complexityMultiplier
 * withUrgency = basePrice * urgencyMultiplier (если срочно)
 * withDiscount = withUrgency * quantityDiscount (если количество >= 10)
 * total = withDiscount + postProcessingCost
 */
export function calculatePrintPrice(input: PriceCalculationInput): PriceEstimate {
  const material = materials.find(m => m.id === input.materialId);
  
  if (!material) {
    throw new Error(`Material not found: ${input.materialId}`);
  }

  const notes: string[] = [];

  // Базовая стоимость материала
  const materialCost = material.pricePerGram * input.weightGrams;
  notes.push(`Материал: ${material.name} (${material.pricePerGram}₽/г × ${input.weightGrams}г = ${materialCost}₽)`);

  // Множитель сложности
  const complexityMultiplier = pricingConfig.complexityMultipliers[input.complexity];
  const complexityLabels = {
    low: 'Простая',
    medium: 'Средняя',
    high: 'Высокая',
  };
  notes.push(`Сложность: ${complexityLabels[input.complexity]} (×${complexityMultiplier})`);

  // Промежуточная сумма
  let subtotal = materialCost * complexityMultiplier;

  // Срочность
  const urgencyMultiplier = input.urgent ? pricingConfig.urgencyMultiplier : 1.0;
  if (input.urgent) {
    subtotal *= urgencyMultiplier;
    notes.push(`Срочность: +50%`);
  }

  // Скидка за количество
  let quantityDiscount = 1.0;
  if (input.quantity >= 50) {
    quantityDiscount = pricingConfig.quantityDiscounts.min50;
    notes.push(`Скидка за количество: 15% (${input.quantity} шт)`);
  } else if (input.quantity >= 20) {
    quantityDiscount = pricingConfig.quantityDiscounts.min20;
    notes.push(`Скидка за количество: 10% (${input.quantity} шт)`);
  } else if (input.quantity >= 10) {
    quantityDiscount = pricingConfig.quantityDiscounts.min10;
    notes.push(`Скидка за количество: 5% (${input.quantity} шт)`);
  }

  subtotal *= quantityDiscount;
  subtotal *= input.quantity;

  // Постобработка
  let postProcessingCost = 0;
  if (input.postProcessing) {
    if (input.postProcessing.sanding) {
      postProcessingCost += pricingConfig.postProcessing.sanding;
      notes.push(`Шлифовка: ${pricingConfig.postProcessing.sanding}₽`);
    }
    if (input.postProcessing.priming) {
      postProcessingCost += pricingConfig.postProcessing.priming;
      notes.push(`Грунтовка: ${pricingConfig.postProcessing.priming}₽`);
    }
    if (input.postProcessing.painting) {
      postProcessingCost += pricingConfig.postProcessing.painting;
      notes.push(`Покраска: ${pricingConfig.postProcessing.painting}₽`);
    }
    if (input.postProcessing.acetoneSmoothing) {
      postProcessingCost += pricingConfig.postProcessing.acetoneSmoothing;
      notes.push(`Ацетоновая баня: ${pricingConfig.postProcessing.acetoneSmoothing}₽`);
    }
  }

  // Итого
  const total = subtotal + postProcessingCost;

  const breakdown: PriceBreakdown = {
    materialCost,
    complexityMultiplier,
    quantityDiscount,
    urgencyMultiplier,
    postProcessingCost,
    subtotal,
    total: Math.round(total),
    currency: material.currency,
  };

  return {
    breakdown,
    notes,
  };
}

/**
 * Форматирует цену для отображения
 */
export function formatPrice(price: number, currency: string = 'RUB'): string {
  if (currency === 'RUB') {
    return `${price.toLocaleString('ru-RU')} ₽`;
  }
  return `${price} ${currency}`;
}

/**
 * Оценивает время печати (очень приблизительно)
 * Реальное время зависит от многих факторов
 */
export function estimatePrintTime(weightGrams: number, materialId: string): string {
  const material = materials.find(m => m.id === materialId);
  if (!material) return 'Неизвестно';

  // Очень грубая оценка: ~10г в час для FDM
  const hours = weightGrams / 10;
  
  if (hours < 1) {
    return 'менее 1 часа';
  } else if (hours < 24) {
    return `примерно ${Math.round(hours)} ч`;
  } else {
    const days = Math.round(hours / 24);
    return `примерно ${days} дн`;
  }
}

/**
 * Рекомендует материал на основе задачи
 */
export function recommendMaterial(task: {
  requiresStrength?: boolean;
  requiresFlexibility?: boolean;
  requiresHeatResistance?: boolean;
  requiresUVResistance?: boolean;
  requiresFoodSafe?: boolean;
  requiresChemicalResistance?: boolean;
  budgetPriority?: 'low' | 'medium' | 'high';
  appearancePriority?: boolean;
}): string[] {
  const recommendations: string[] = [];

  // Приоритеты
  if (task.requiresFlexibility) {
    recommendations.push('tpu');
  }

  if (task.requiresHeatResistance) {
    if (task.requiresHeatResistance && task.budgetPriority === 'low') {
      recommendations.push('abs');
    } else {
      recommendations.push('nylon');
    }
  }

  if (task.requiresStrength && !task.requiresFlexibility) {
    if (task.budgetPriority === 'high') {
      recommendations.push('carbon');
    }
    recommendations.push('nylon');
  }

  if (task.requiresFoodSafe) {
    recommendations.push('petg');
  }

  if (task.requiresUVResistance) {
    recommendations.push('abs', 'petg');
  }

  if (task.requiresChemicalResistance) {
    recommendations.push('petg', 'abs');
  }

  if (task.appearancePriority) {
    recommendations.push('pla');
  }

  // Базовые рекомендации
  if (task.budgetPriority === 'low' && recommendations.length === 0) {
    recommendations.push('pla', 'petg', 'abs');
  }

  // Убираем дубликаты
  return Array.from(new Set(recommendations));
}

/**
 * Рекомендует принтер на основе задачи
 */
export function recommendPrinter(task: {
  maxDimension?: { x: number; y: number; z: number };
  materialId: string;
  requiresHighQuality?: boolean;
  requiresMultiColor?: boolean;
  requiresHighTemp?: boolean;
  quantity?: number;
}): string[] {
  const recommendations: string[] = [];

  // Проверка размера
  if (task.maxDimension) {
    const maxX = task.maxDimension.x;
    const maxY = task.maxDimension.y;
    const maxZ = task.maxDimension.z;

    if (maxX > 300 || maxY > 300 || maxZ > 300) {
      recommendations.push('creality-k1-max', 'z-bolt-s300-ht');
    } else if (maxX > 256 || maxY > 256 || maxZ > 256) {
      recommendations.push('creality-k1-max', 'z-bolt-s300-ht');
    }
  }

  // Высокотемпературные материалы
  if (task.requiresHighTemp) {
    recommendations.push('z-bolt-s300-ht');
  }

  // Многоцветная печать
  if (task.requiresMultiColor) {
    recommendations.push('bambu-a1-combo');
  }

  // Высокое качество
  if (task.requiresHighQuality) {
    recommendations.push('bambu-h2s', 'bambu-p1s');
  }

  // Серия
  if (task.quantity && task.quantity > 10) {
    recommendations.push('creality-k1-max', 'bambu-p1s');
  }

  // Базовые рекомендации
  if (recommendations.length === 0) {
    recommendations.push('bambu-p1s', 'bambu-h2s');
  }

  // Убираем дубликаты
  return Array.from(new Set(recommendations));
}
