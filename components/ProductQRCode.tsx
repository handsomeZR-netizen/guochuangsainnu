/**
 * 产品二维码组件
 * 为每个产品生成唯一二维码，扫描后跳转到文化百科页面
 */

import React, { memo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  generateProductEncyclopediaUrl, 
  generatePatternEncyclopediaUrl,
  generateScenarioProductUrl 
} from '../utils/qrcode';
import { Download, QrCode } from 'lucide-react';

interface ProductQRCodeProps {
  productId: string;
  patternId?: string;
  scenarioId?: string;
  size?: number;
  showDownload?: boolean;
  className?: string;
}

const ProductQRCode: React.FC<ProductQRCodeProps> = ({
  productId,
  patternId,
  scenarioId,
  size = 200,
  showDownload = true,
  className = ''
}) => {
  // 生成二维码URL
  const qrCodeUrl = React.useMemo(() => {
    if (patternId) {
      return generatePatternEncyclopediaUrl(patternId);
    } else if (scenarioId) {
      return generateScenarioProductUrl(scenarioId, productId);
    } else {
      return generateProductEncyclopediaUrl(productId);
    }
  }, [productId, patternId, scenarioId]);

  // 下载二维码
  const handleDownload = () => {
    const svg = document.getElementById(`qrcode-${productId}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${productId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* 二维码标题 */}
      <div className="flex items-center gap-2 text-slate-700">
        <QrCode size={20} />
        <span className="text-sm font-bold">扫码查看文化百科</span>
      </div>

      {/* 二维码 */}
      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-200">
        <QRCodeSVG
          id={`qrcode-${productId}`}
          value={qrCodeUrl}
          size={size}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: '/logo.svg',
            height: size * 0.15,
            width: size * 0.15,
            excavate: true,
          }}
        />
      </div>

      {/* URL显示 */}
      <div className="text-xs text-slate-500 max-w-[200px] break-all text-center">
        {qrCodeUrl}
      </div>

      {/* 下载按钮 */}
      {showDownload && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
        >
          <Download size={16} />
          下载二维码
        </button>
      )}
    </div>
  );
};

export default memo(ProductQRCode);
