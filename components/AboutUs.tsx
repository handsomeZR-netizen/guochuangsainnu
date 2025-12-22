import React from 'react';
import { X, Globe, Users, Heart, Award } from 'lucide-react';

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-3xl font-bold font-serif">关于我们</h2>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Mission */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="text-blue-700" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">我们的使命</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              墨韵智汇致力于传承和发扬南通蓝印花布这一国家级非物质文化遗产。我们通过现代科技与传统工艺的结合，
              让千年蓝印花布焕发新生，走向世界。
            </p>
          </section>

          {/* Global Reach */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="text-green-700" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">全球市场</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              我们的产品已经走向国际，主要服务于欧洲和东南亚市场。通过Shopee等电商平台，
              我们将中国传统文化之美带给全球消费者。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['欧洲', '东南亚', '北美', '大洋洲'].map((region) => (
                <div key={region} className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="font-bold text-blue-900">{region}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="text-purple-700" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">我们的团队</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              我们拥有一支由非遗传承人、设计师、工程师组成的专业团队。结合AI技术与传统工艺，
              为客户提供个性化定制服务，让每一件作品都独一无二。
            </p>
          </section>

          {/* Achievements */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="text-yellow-700" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">荣誉成就</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <p className="text-4xl font-bold text-blue-900 mb-2">500+</p>
                <p className="text-slate-700">全球客户</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <p className="text-4xl font-bold text-green-900 mb-2">20+</p>
                <p className="text-slate-700">非遗传承人</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <p className="text-4xl font-bold text-purple-900 mb-2">98%</p>
                <p className="text-slate-700">客户满意度</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">联系我们</h3>
            <div className="space-y-2 text-slate-600">
              <p>📍 地址：江苏省南通市</p>
              <p>📧 邮箱：contact@moyunzhihui.com</p>
              <p>📱 电话：+86 513-XXXX-XXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
