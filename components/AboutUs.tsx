import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronDown, 
  ChevronRight,
  Users, 
  Target, 
  Lightbulb, 
  Heart,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Building2,
  Newspaper,
  TrendingUp,
  Handshake,
  Sparkles,
  DollarSign,
  Gift,
  Trophy,
  Medal
} from 'lucide-react';

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, isOpen, onToggle }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
          {icon}
        </div>
        <span className="font-semibold text-slate-900 text-sm sm:text-base">{title}</span>
      </div>
      <div className="text-slate-400">
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-3 sm:p-4 pt-0 border-t border-slate-100">
        {children}
      </div>
    </div>
  </div>
);

interface TeamMemberCardProps {
  name: string;
  role: string;
  school: string;
  major: string;
  achievements: string[];
  skills: string[];
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, school, major, achievements, skills }) => (
  <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
        {name.charAt(0)}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-slate-900 text-base sm:text-lg">{name}</h4>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mt-1">
          <Briefcase size={10} />
          {role}
        </span>
      </div>
    </div>
    
    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
      <div className="flex items-start gap-2">
        <GraduationCap size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-slate-700">{school}</p>
          <p className="text-slate-500 text-xs">{major}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        <Award size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          {achievements.slice(0, 2).map((achievement, idx) => (
            <p key={idx} className="text-slate-600 text-xs leading-relaxed line-clamp-2">{achievement}</p>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-2">
        {skills.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="px-1.5 sm:px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['background']));

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const teamMembers: TeamMemberCardProps[] = [
    {
      name: '张竞尹',
      role: '项目总负责人',
      school: '南京师范大学商学院',
      major: '2023级国际经济与贸易专业',
      achievements: [
        '2024年度全国青年爱国宣传志愿活动"新时代好青年"',
        '江苏省高校"丝路电商"创新挑战赛二等奖',
        '全国大学生电子商务"创新创意创业"挑战赛校级一等奖'
      ],
      skills: ['SPSS', 'Stata', '政策研究', '供应链分析']
    },
    {
      name: '徐子锐',
      role: '技术开发工程师',
      school: '南京师范大学计算机与电子信息学院/人工智能学院',
      major: '2023级人工智能专业',
      achievements: [
        '国家级大学生创新创业项目负责人',
        '全国新文科创新大赛铜奖',
        '全球人工智能算法精英赛二等奖'
      ],
      skills: ['Web开发', 'Python', 'LLM', '人工智能']
    },
    {
      name: '陆衍锦',
      role: '技术总监',
      school: '南京师范大学商学院',
      major: '2023级金融学专业',
      achievements: [
        '全国高校商业精英挑战赛品牌策划竞赛国家级三等奖',
        '全国大学生数学建模竞赛省级三等奖',
        '校级大创项目立项主持人'
      ],
      skills: ['SPSS', 'Stata', 'Office', '计量经济学']
    },
    {
      name: '李语如',
      role: '财务总监',
      school: '南京师范大学商学院',
      major: '2022级人力资源管理专业',
      achievements: [
        '"商院之星"、"优秀志愿者"荣誉称号',
        '全国大学生电子商务挑战赛校级二等奖',
        '会计技能大赛全国总决赛入围'
      ],
      skills: ['SPSS', 'Stata', 'Amos', 'Mplus']
    },
    {
      name: '徐玲琅',
      role: '文化顾问',
      school: '南京师范大学商学院',
      major: '2023级工商管理专业',
      achievements: [
        '全国高校商业精英挑战赛品牌策划竞赛三等奖',
        '"用英语讲好中国故事"华东赛区一等奖',
        '"希望之星"风采展示大会江苏分会区特等奖'
      ],
      skills: ['英语六级600+', '品牌策划', '跨文化沟通']
    },
    {
      name: '吴文寒冰',
      role: '市场总监',
      school: '南京师范大学商学院',
      major: '2023级国际经济与贸易专业',
      achievements: [
        '五矿证券公司实习经历',
        '市场调研报告撰写',
        '数据网络核查及基础数据处理'
      ],
      skills: ['Office', 'SPSS', '市场调研', '数据处理']
    }
  ];

  return createPortal(
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 99999 }}>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* 模态框 */}
      <div className="relative min-h-screen flex items-start sm:items-center justify-center p-2 sm:p-4">
        <div className="relative bg-slate-50 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col my-2 sm:my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-4 sm:p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">关于我们</h2>
                <p className="text-blue-200 text-xs sm:text-sm">青蓝出海 · 南通蓝印花布跨境电商项目</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="hover:bg-white/20 active:bg-white/30 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {/* 项目名称释义 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">项目名称释义</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    "青蓝出海"象征着我们期望青出于蓝，致力于在传统蓝印花布的基础上不断创新，使其突破地域限制，从南通走向世界舞台。
                    <span className="hidden sm:inline">"青"字蕴含双重意蕴：一方面代表蓝印花布中如晴空般深邃、凝重的青色，承载着传统技艺的独特魅力；
                    另一方面象征着新时代的大学生青年，充满创造力与活力，正以崭新的姿态投身于传承与创新之中。</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion Sections */}
            <AccordionItem
              title="团队创建背景"
              icon={<Target size={20} />}
              isOpen={openSections.has('background')}
              onToggle={() => toggleSection('background')}
            >
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  "青蓝出海"项目团队的成立，是顺应跨境电商蓬勃发展的时代潮流，以及南通蓝印花布创新转型与文化传播需求的必然选择。
                </p>
                <p>
                  在全球化与数字化浪潮的推动下，跨境电商已成为国际贸易增长的重要驱动力。蓝印花布作为中国传统文化的瑰宝，
                  以及配饰这一在全球化背景下销量较高的品类，都在跨境电商领域展现出巨大的发展潜力。
                  南通作为蓝印花布的发源地，拥有深厚的产业底蕴。然而，在跨境电商的发展过程中，南通仍面临诸多挑战，
                  如市场拓展困难、跨境电商业务经验不足等问题。
                </p>
                <p>
                  为突破这些瓶颈，一群来自不同专业领域，却都怀揣着对跨境电商事业的热情以及对南通蓝印花布文化传承与发展使命感的人才汇聚在一起。
                  项目团队成员凭借各自在国际经贸、金融学、工商人力等专业领域的知识储备，期望通过协同合作，
                  打造一个集供应链整合、跨境电商运营、文化传播为一体的创新项目，推动南通蓝印花布的转型升级。
                </p>
              </div>
            </AccordionItem>

            <AccordionItem
              title="核心成员介绍"
              icon={<Users size={20} />}
              isOpen={openSections.has('members')}
              onToggle={() => toggleSection('members')}
            >
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                {teamMembers.map((member, idx) => (
                  <TeamMemberCard key={idx} {...member} />
                ))}
              </div>
            </AccordionItem>

            <AccordionItem
              title="团队优势与能力"
              icon={<TrendingUp size={18} />}
              isOpen={openSections.has('advantages')}
              onToggle={() => toggleSection('advantages')}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
                <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-2 sm:mb-3">
                    <Lightbulb size={18} />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">专业互补</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    团队成员专业背景涵盖多个学科领域，能够从不同视角为项目提供全面的解决方案。
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-2 sm:mb-3">
                    <Award size={18} />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">实践经验</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    团队成员在各自领域积累了丰富的实践经验，参与过多个相关项目和竞赛。
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 sm:col-span-2 md:col-span-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-2 sm:mb-3">
                    <Star size={18} />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">创新精神</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    团队成员具有强烈的创新意识和创业精神，勇于尝试新技术、新模式和新方法。
                  </p>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              title="组织文化"
              icon={<Heart size={20} />}
              isOpen={openSections.has('culture')}
              onToggle={() => toggleSection('culture')}
            >
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">文化传承</h4>
                    <p className="text-sm text-slate-600">
                      以传承和弘扬南通蓝印花布文化为核心价值观。通过组织参观南通蓝印花布博物馆、举办文化主题讲座等活动，
                      增强成员对蓝印花布文化的认同感和自豪感，将蓝印花布文化元素融入办公环境中。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 shrink-0">
                    <Handshake size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">团队精神</h4>
                    <p className="text-sm text-slate-600">
                      倡导创新、协作、进取的团队精神。设立创新奖励机制，通过组织跨部门项目小组、团队建设活动等方式，
                      打破部门壁垒，促进成员之间的沟通与合作，在团队内部形成积极向上的竞争氛围。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 shrink-0">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">服务理念</h4>
                    <p className="text-sm text-slate-600">
                      秉持客户至上、质量第一的服务理念。建立客户反馈机制，严格把控每一个环节，
                      从原材料采购到成品交付，都遵循高标准的质量控制体系，确保为客户提供高品质的产品和优质的服务。
                    </p>
                  </div>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              title="薪酬与激励"
              icon={<DollarSign size={20} />}
              isOpen={openSections.has('compensation')}
              onToggle={() => toggleSection('compensation')}
            >
              <div className="space-y-4 pt-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Briefcase size={16} />
                      </div>
                      <h4 className="font-semibold text-slate-900">薪资结构</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                        <span>基本工资：根据岗位价值、专业技能和工作经验确定</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                        <span>绩效工资：与工作表现和项目成果挂钩</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                        <span>福利补贴：完善的福利保障体系</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                        <Gift size={16} />
                      </div>
                      <h4 className="font-semibold text-slate-900">激励机制</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                        <span>物质激励：专项奖励基金、股权期权激励</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                        <span>精神激励：优秀员工评选、荣誉证书、公开表彰</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                        <span>团队激励：团队旅游、团建活动经费</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-full">
                    <Trophy size={14} />
                    创新之星
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-full">
                    <Medal size={14} />
                    团队协作奖
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full">
                    <Star size={14} />
                    优秀员工
                  </span>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              title="项目成果与媒体报道"
              icon={<Newspaper size={18} />}
              isOpen={openSections.has('achievements')}
              onToggle={() => toggleSection('achievements')}
            >
              <div className="space-y-3 sm:space-y-4 pt-2">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  团队成员实地走访南通蓝印花布博物馆、颐高跨境电商产业园等十余家企业和银行，
                  全链路深入了解蓝印花布工艺及产品生产、运输、销售环节。
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900">10+</p>
                    <p className="text-xs text-slate-600 mt-0.5 sm:mt-1">实地走访企业</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-green-900">20+</p>
                    <p className="text-xs text-slate-600 mt-0.5 sm:mt-1">主流媒体报道</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-purple-900">1000+</p>
                    <p className="text-xs text-slate-600 mt-0.5 sm:mt-1">公众号浏览量</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-amber-900">多家</p>
                    <p className="text-xs text-slate-600 mt-0.5 sm:mt-1">企业良好反馈</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-100">中国网</span>
                  <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-100">人民日报</span>
                  <span className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">国家级媒体</span>
                  <span className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">省市级媒体</span>
                </div>
              </div>
            </AccordionItem>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-slate-200 p-3 sm:p-4 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 sm:px-6 py-2 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-lg transition-colors text-sm font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AboutUs;
