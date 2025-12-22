import React, { useState } from 'react';
import { CustomizationData, ValidationResult, Pattern } from '../types';

interface CustomizationFormProps {
  patterns: Pattern[];
  onSubmit: (data: CustomizationData) => void;
  onCancel?: () => void;
}

/**
 * 定制表单组件
 * 实现纹样选择、尺寸输入、文字定制
 * 需求: 6.5
 */
export const CustomizationForm: React.FC<CustomizationFormProps> = ({
  patterns,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<CustomizationData>({
    patternId: '',
    patternName: '',
    customText: '',
    size: {
      width: 100,
      height: 100,
      unit: 'cm'
    },
    quantity: 1,
    notes: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // 表单验证
  const validateForm = (): ValidationResult => {
    const validationErrors: string[] = [];

    // 验证纹样选择
    if (!formData.patternId) {
      validationErrors.push('请选择纹样');
    }

    // 验证定制文字（1-20字符）
    if (formData.customText && (formData.customText.length < 1 || formData.customText.length > 20)) {
      validationErrors.push('定制文字必须在1-20个字符之间');
    }

    // 验证尺寸（1-500cm）
    if (formData.size.width < 1 || formData.size.width > 500) {
      validationErrors.push('宽度必须在1-500cm之间');
    }
    if (formData.size.height < 1 || formData.size.height > 500) {
      validationErrors.push('高度必须在1-500cm之间');
    }

    // 验证数量
    if (formData.quantity < 1 || formData.quantity > 100) {
      validationErrors.push('数量必须在1-100之间');
    }

    return {
      valid: validationErrors.length === 0,
      errors: validationErrors
    };
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patternId = e.target.value;
    const pattern = patterns.find(p => p.id === patternId);
    setFormData({
      ...formData,
      patternId,
      patternName: pattern?.name || ''
    });
  };

  const handleSizeChange = (field: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({
      ...formData,
      size: {
        ...formData.size,
        [field]: numValue
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
  };

  const handlePreview = () => {
    const validation = validateForm();
    if (validation.valid) {
      setShowPreview(true);
      setErrors([]);
    } else {
      setErrors(validation.errors);
    }
  };

  const selectedPattern = patterns.find(p => p.id === formData.patternId);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">定制您的蓝印花布</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 纹样选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择纹样 *
          </label>
          <select
            value={formData.patternId}
            onChange={handlePatternChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">请选择纹样</option>
            {patterns.map(pattern => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name} ({pattern.nameEn})
              </option>
            ))}
          </select>
          {selectedPattern && (
            <p className="mt-2 text-sm text-gray-600">
              {selectedPattern.basicInfo.symbolism.join('、')}
            </p>
          )}
        </div>

        {/* 定制文字 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            定制文字（可选，1-20字符）
          </label>
          <input
            type="text"
            value={formData.customText}
            onChange={(e) => setFormData({ ...formData, customText: e.target.value })}
            placeholder="例如：家和万事兴"
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.customText?.length || 0}/20 字符
          </p>
        </div>

        {/* 尺寸输入 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              宽度 (cm) *
            </label>
            <input
              type="number"
              value={formData.size.width}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              min={1}
              max={500}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              高度 (cm) *
            </label>
            <input
              type="number"
              value={formData.size.height}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              min={1}
              max={500}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 数量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            数量 *
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            min={1}
            max={100}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            备注（可选）
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="其他定制需求或说明"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 错误提示 */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">请修正以下错误：</h3>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 预览区域 */}
        {showPreview && selectedPattern && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">定制预览</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">纹样：</span>{selectedPattern.name}</p>
              <p><span className="font-medium">尺寸：</span>{formData.size.width} x {formData.size.height} cm</p>
              {formData.customText && (
                <p><span className="font-medium">定制文字：</span>{formData.customText}</p>
              )}
              <p><span className="font-medium">数量：</span>{formData.quantity} 件</p>
              {formData.notes && (
                <p><span className="font-medium">备注：</span>{formData.notes}</p>
              )}
            </div>
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePreview}
            className="flex-1 px-6 py-3 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium"
          >
            预览定制
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            提交订单
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
