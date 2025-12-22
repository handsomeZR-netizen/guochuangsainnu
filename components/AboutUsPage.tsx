import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronDown, ChevronUp, Users, Target, Award, 
  Briefcase, TrendingUp, Globe2, Heart, Lightbulb, 
  DollarSign, Trophy, Newspaper, MapPin
} from 'lucide-react';

interface AboutUsPageProps {
  onClose: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  major: string;
  year: string;
  position: string;
  achievements: string[];
  skills: string[];
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['background']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const teamMembers: TeamMember[] = [
    {
      name: '张竞尹',
      role: '项目总负责人',
      major: '国际经济与贸易',
      year: '2023级',
      position: '团支部书记、学生会行政部部长',
      achievements: [
        '2024年度全国青年爱国宣传志愿活动"新时代好青年"',
        '江苏省高校"丝路电商"创新挑战赛二等奖',
        '全国大学生电子商务"创新创意创业"挑战赛校级一等奖'
      ],
      skills: ['跨境电商政策研究', '供应链数据分析', 'SPSS', 'Stata']
    },
    {
      name: '陆衍锦',
      role: '技术总监',
      major: '金融学',
      year: '2023级',
      position: '班级组织委员、校辩论队优秀队员',
      achievements: [
        '全国高校商业精英挑战赛品牌策划竞赛国家级三等奖',
        '全国大学生数学建模竞赛省级三等奖',
        '主持校级大创项目立项'
      ],
      skills: ['计量经济学', '数据分析', 'SPSS', 'Stata', 'Office']
    },
    {
      name: '李语如',
      role: '财务总监',
      major: '人力资源管理',
      year: '2022级',
      position: '班级心理委员',
      achievements: [
        '全国大学生电子商务"创新、创意及创业"挑战赛校级二等奖',
        '会计技能大赛全国总决赛入围',
        '参与全国案例库入库案例编写'
      ],
      skills: ['财务分析', 'SPSS', 'Stata', 'Amos', 'Mplus']
    },
    {
      name: '徐玲琅',
      role: '文化顾问',
      major: '工商管理',
      year: '2023级',
      position: '班长、创业者联盟项目部部长、辩论队队长',
      achievements: [
        '全国高校商业精英挑战赛品牌策划竞赛三等奖',
        '江苏省高校"丝路电商"创新挑战赛二等奖',
        '"用英语讲好中国故事"华东赛区一等奖',
        '英语四六级600分以上'
      ],
      skills: ['跨文化沟通', '品牌建设', '英语', '市场营销']
    },
    {
      name: '吴文寒冰',
      role: '市场总监',
      major: '国际经济与贸易',
      year: '2023级',
      position: '班级心理委员',
      achievements: [
        '五矿证券公司实习经验',
        '市场调研报告撰写',
        '数据网络核查'
      ],
      skills: ['市场调研', '数据处理', 'Office', 'SPSS']
    }
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">返回</span>
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <h1 className="text-2xl font-bold text-slate-900">关于青蓝出海</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-12 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe2 size={40} />
            <h2 className="text-4xl font-bold">青蓝出海</h2>
          </div>
          <p className="text-xl text-blue-100 leading-relaxed">
            传承南通蓝印花布文化，以创新驱动跨境电商发展，让中国传统工艺走向世界舞台
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">20+</p>
              <p className="text-blue-200 text-sm">主流媒体报道</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">10+</p>
              <p className="text-blue-200 text-sm">企业合作</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">1000+</p>
              <p className="text-blue-200 text-sm">公众号浏览量</p>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* 团队创建背景 */}
          <CollapsibleSection
            id="background"
            title="团队创建背景"
            icon={<Target size={24} />}
            expanded={expandedSections.has('background')}
            onToggle={() => toggleSection('background')}
          >
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Lightbulb size={18} />
                  项目名称寓意
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  "青蓝出海"象征着青出于蓝，致力于在传统蓝印花布的基础上不断创新。
                  "青"字蕴含双重意蕴：既代表蓝印花布中如晴空般深邃的青色，
                  也象征着新时代大学生青年的创造力与活力。
                </p>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  在全球化与数字化浪潮的推动下，跨境电商已成为国际贸易增长的重要驱动力。
                  蓝印花布作为中国传统文化的瑰宝，在跨境电商领域展现出巨大的发展潜力。
                  南通作为蓝印花布的发源地，拥有深厚的产业底蕴。
                </p>
                <p className="text-slate-700 leading-relaxed">
                  为突破市场拓展困难、跨境电商业务经验不足等瓶颈，一群来自不同专业领域的人才汇聚在一起。
                  团队成员凭借各自在国际经贸、金融学、工商人力等专业领域的知识储备，
                  通过协同合作，打造一个集供应链整合、跨境电商运营、文化传播为一体的创新项目。
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* 核心团队成员 */}
          <CollapsibleSection
            id="team"
            title="核心团队成员"
            icon={<Users size={24} />}
            expanded={expandedSections.has('team')}
            onToggle={() => toggleSection('team')}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                      <p className="text-blue-700 font-medium">{member.role}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="text-blue-700" size={24} />
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Award size={16} className="text-blue-600" />
                      <span>{member.major} {member.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} className="text-blue-600" />
                      <span>{member.position}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-2">主要成就：</p>
                    <ul className="space-y-1">
                      {member.achievements.slice(0, 2).map((achievement, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <Trophy size={12} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* 团队优势 */}
          <CollapsibleSection
            id="advantages"
            title="团队优势与能力"
            icon={<TrendingUp size={24} />}
            expanded={expandedSections.has('advantages')}
            onToggle={() => toggleSection('advantages')}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">专业互补</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  团队成员涵盖国际经贸、金融、工商管理等多个学科领域，
                  在战略规划、财务管理、文化传播等方面协同合作。
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-white" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">实践经验</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  参与多个相关项目和竞赛，取得优异成绩。
                  具备敏锐的市场洞察力和高效的问题解决能力。
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="text-white" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">创新精神</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  勇于尝试新技术、新模式，将区块链溯源、数字化服务平台等
                  前沿技术融入项目中。
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* 组织文化 */}
          <CollapsibleSection
            id="culture"
            title="组织文化"
            icon={<Heart size={24} />}
            expanded={expandedSections.has('culture')}
            onToggle={() => toggleSection('culture')}
          >
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Heart size={20} className="text-red-500" />
                  文化传承为核心
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  以传承和弘扬南通蓝印花布文化为核心价值观。通过参观博物馆、举办文化讲座等活动，
                  增强成员对蓝印花布文化的认同感和自豪感。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Lightbulb size={20} className="text-yellow-500" />
                  创新协作进取
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  倡导创新、协作、进取的团队精神。设立创新奖励机制，
                  通过跨部门项目小组和团队建设活动，促进成员之间的沟通与合作。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award size={20} className="text-blue-500" />
                  客户至上质量第一
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  将满足客户需求作为一切工作的出发点。建立客户反馈机制，
                  严格把控产品质量，确保为客户提供高品质的产品和优质的服务。
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* 激励机制 */}
          <CollapsibleSection
            id="incentive"
            title="薪酬与激励"
            icon={<DollarSign size={24} />}
            expanded={expandedSections.has('incentive')}
            onToggle={() => toggleSection('incentive')}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-green-600" />
                  薪资结构
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-900">基本工资</p>
                      <p className="text-sm text-slate-600">根据岗位价值、专业技能和工作经验确定</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-900">绩效工资</p>
                      <p className="text-sm text-slate-600">与个人和团队绩效挂钩</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-900">福利补贴</p>
                      <p className="text-sm text-slate-600">完善的福利保障体系</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-600" />
                  激励机制
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-900">物质激励</p>
                      <p className="text-sm text-slate-600">专项奖励基金、股权期权激励</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-900">精神激励</p>
                      <p className="text-sm text-slate-600">优秀员工评选、荣誉证书表彰</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-slate-900">团队激励</p>
                      <p className="text-sm text-slate-600">团队旅游、团建活动经费</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* 媒体报道 */}
          <CollapsibleSection
            id="media"
            title="媒体影响力"
            icon={<Newspaper size={24} />}
            expanded={expandedSections.has('media')}
            onToggle={() => toggleSection('media')}
          >
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">实地调研</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    团队成员实地走访南通蓝印花布博物馆、颐高跨境电商产业园等十余家企业和银行，
                    全链路深入了解蓝印花布工艺及产品生产、运输、销售环节。
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">媒体报道</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    获得多地多家企业良好反馈，获中国网、人民日报等国家级、省市级20余家主流媒体报道。
                    自主运营公众号已获得1000+浏览量，形成一定的媒介影响力。
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

// Collapsible Section Component
interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  expanded,
  onToggle,
  children
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-700">{icon}</div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>
        {expanded ? (
          <ChevronUp className="text-slate-400" size={24} />
        ) : (
          <ChevronDown className="text-slate-400" size={24} />
        )}
      </button>
      
      {expanded && (
        <div className="px-6 pb-6 animate-slideIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default AboutUsPage;
