import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { RestaurantLogo } from "./RestaurantLogo";
import { Separator } from "./ui/separator";
import { Sparkles, Leaf, Award, TrendingUp, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface RestaurantStoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

// Section Components for better modularity
interface SectionHeaderProps {
  icon: string;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-[#C4941D] flex items-center justify-center text-white text-xs">
        {icon}
      </div>
      <h3 className="text-[#3E2723]">{title}</h3>
    </div>
  );
}

interface ValueCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl p-4 border border-[#C4941D]/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#C4941D]/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#C4941D]" />
        </div>
        <div>
          <h4 className="text-[#3E2723] mb-1">{title}</h4>
          <p className="text-sm text-[#8B7355]">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface ChefProfileProps {
  name: string;
  title: string;
  bio: string;
  quote: string;
}

function ChefProfile({ name, title, bio, quote }: ChefProfileProps) {
  return (
    <div className="bg-[#FFF4E0] rounded-xl p-5 border border-[#C4941D]/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#C4941D] flex items-center justify-center text-white text-xl shrink-0">
          👨‍🍳
        </div>
        <div className="flex-1">
          <h4 className="text-[#3E2723] mb-1">{name}</h4>
          <p className="text-sm text-[#C4941D] mb-2">{title}</p>
          <p className="text-sm text-[#8B7355] mb-3">{bio}</p>
          <p className="text-sm text-[#3E2723] italic border-l-2 border-[#C4941D] pl-3">
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  );
}

interface SignatureExperienceProps {
  title: string;
  dish: string;
  description: string;
  footer: string;
}

function SignatureExperience({ title, dish, description, footer }: SignatureExperienceProps) {
  return (
    <div className="bg-gradient-to-br from-[#FFF4E0] to-[#FFF9F0] rounded-xl p-6 border-2 border-[#C4941D]/30">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#C4941D] flex items-center justify-center text-white">
            🎖️
          </div>
          <h3 className="text-[#3E2723]">{title}</h3>
        </div>
        <h4 className="text-xl text-[#C4941D]">
          {dish}
        </h4>
        <p className="text-[#3E2723] leading-relaxed max-w-lg mx-auto">
          {description}
        </p>
        <p className="text-sm text-[#8B7355] italic">
          {footer}
        </p>
      </div>
    </div>
  );
}

export function RestaurantStory({ open, onOpenChange, language }: RestaurantStoryProps) {
  const stories = {
    en: {
      title: "Our Story",
      tagline: "Where Culinary Art Meets Digital Intelligence",
      subtitle: "Fine Dining Reimagined",
      intro: "Founded in 2024, Lumière Dorée represents the perfect harmony between time-honored culinary traditions and cutting-edge innovation.",
      paragraph2: "Our name, meaning 'Golden Light' in French, symbolizes the enlightenment we bring to modern dining. Each visit offers every guest experience is illuminated by both the artistry of our chefs and the intelligence of our AI sommelier.",
      visionTitle: "Chef Marie Laurent's vision was simple yet revolutionary:",
      vision: "create an intimate fine dining experience where technology enhances rather than replaces the human touch. Our AI Waiter Assistant learns your preferences, suggests perfect pairings, and ensures every visit feels personally curated.",
      chefName: "Chef Marie Laurent",
      chefTitle: "Executive Chef & Co-Founder",
      chefBio: "Trained at Le Cordon Bleu, Paris. 15 years experience in Michelin-starred restaurants.",
      chefQuote: "Food is poetry, technology is the pen. Together, we write stories worth savoring.",
      valuesTitle: "Our Values",
      values: [
        {
          title: "Excellence",
          description: "Michelin-inspired standards in every dish",
          icon: "award"
        },
        {
          title: "Innovation",
          description: "AI-powered personalization for your journey",
          icon: "sparkles"
        },
        {
          title: "Sustainability",
          description: "Farm-to-table ingredients, zero-waste kitchen",
          icon: "leaf"
        },
        {
          title: "Experience",
          description: "Memories that transcend the meal itself",
          icon: "trending"
        }
      ],
      signatureTitle: "Signature Experience",
      signatureDish: "Le Chef's Golden Soufflé",
      signatureDesc: "A 24-karat gold-dusted dessert soufflé that rises tableside, paired with AI-recommended wine selections",
      signatureFooter: "Every dish is crafted with passion, every recommendation made with precision",
      recognitionTitle: "Recognition",
      recognition: [
        "🏆 2024 Digital Dining Innovation Award",
        "⭐ Featured in Tech & Taste Magazine",
        "🥇 Best AI Integration in Hospitality"
      ]
    },
    de: {
      title: "Unsere Geschichte",
      tagline: "Wo Kulinarische Kunst auf Digitale Intelligenz trifft",
      subtitle: "Fine Dining Neu Gedacht",
      intro: "Gegründet im Jahr 2024, repräsentiert Lumière Dorée die perfekte Harmonie zwischen zeitlosen kulinarischen Traditionen und modernster Innovation.",
      paragraph2: "Unser Name, der auf Französisch 'Goldenes Licht' bedeutet, symbolisiert die Erleuchtung, die wir in die moderne Gastronomie bringen. Jeder Besuch bietet jedem Gast ein Erlebnis, das sowohl von der Kunstfertigkeit unserer Köche als auch von der Intelligenz unseres KI-Sommeliers erleuchtet wird.",
      visionTitle: "Chef Marie Laurents Vision war einfach, aber revolutionär:",
      vision: "Ein intimes Fine-Dining-Erlebnis schaffen, bei dem Technologie die menschliche Note verbessert, anstatt sie zu ersetzen. Unser KI-Kellner-Assistent lernt Ihre Vorlieben, schlägt perfekte Paarungen vor und sorgt dafür, dass sich jeder Besuch persönlich kuratiert anfühlt.",
      chefName: "Chef Marie Laurent",
      chefTitle: "Küchenchefin & Mitbegründerin",
      chefBio: "Ausgebildet am Le Cordon Bleu, Paris. 15 Jahre Erfahrung in Michelin-Stern-Restaurants.",
      chefQuote: "Essen ist Poesie, Technologie ist die Feder. Zusammen schreiben wir Geschichten, die es wert sind, genossen zu werden.",
      valuesTitle: "Unsere Werte",
      values: [
        {
          title: "Exzellenz",
          description: "Michelin-inspirierte Standards in jedem Gericht",
          icon: "award"
        },
        {
          title: "Innovation",
          description: "KI-gestützte Personalisierung für Ihre Reise",
          icon: "sparkles"
        },
        {
          title: "Nachhaltigkeit",
          description: "Vom Hof auf den Tisch, Zero-Waste-Küche",
          icon: "leaf"
        },
        {
          title: "Erlebnis",
          description: "Erinnerungen, die über die Mahlzeit hinausgehen",
          icon: "trending"
        }
      ],
      signatureTitle: "Signature-Erlebnis",
      signatureDish: "Le Chef's Golden Soufflé",
      signatureDesc: "Ein mit 24-Karat-Gold bestäubtes Dessert-Soufflé, das am Tisch aufsteigt, gepaart mit KI-empfohlenen Weinauswahlen",
      signatureFooter: "Jedes Gericht wird mit Leidenschaft zubereitet, jede Empfehlung mit Präzision gemacht",
      recognitionTitle: "Anerkennung",
      recognition: [
        "🏆 2024 Digital Dining Innovation Award",
        "⭐ Featured in Tech & Taste Magazine",
        "🥇 Best AI Integration in Hospitality"
      ]
    },
    zh: {
      title: "我们的故事",
      tagline: "烹饪艺术与数字智能的完美结合",
      subtitle: "重新定义精致餐饮",
      intro: "成立于2024年，Lumière Dorée代表着悠久烹饪传统与尖端创新之间的完美和谐。",
      paragraph2: "我们的名字在法语中意为'金色之光'，象征着我们为现代餐饮带来的启迪。每次光临都让每位客人体验到我们厨师的艺术和AI侍酒师的智慧所照亮的美好时光。",
      visionTitle: "主厨Marie Laurent的愿景简单而革命性：",
      vision: "创造一种亲密的高级餐饮体验，在这里，技术增强而非取代人性化的服务。我们的AI服务员助手学习您的偏好，建议完美的搭配，确保每次光临都感觉是为您量身定制的。",
      chefName: "主厨 Marie Laurent",
      chefTitle: "行政主厨兼联合创始人",
      chefBio: "在巴黎蓝带厨艺学院接受培训。在米其林星级餐厅拥有15年经验。",
      chefQuote: "美食是诗歌，技术是笔。我们一起书写值得品味的故事。",
      valuesTitle: "我们的价值观",
      values: [
        {
          title: "卓越",
          description: "每道菜都符合米其林标准",
          icon: "award"
        },
        {
          title: "创新",
          description: "AI驱动的个性化旅程",
          icon: "sparkles"
        },
        {
          title: "可持续性",
          description: "从农场到餐桌的食材，零浪费厨房",
          icon: "leaf"
        },
        {
          title: "体验",
          description: "超越餐食本身的记忆",
          icon: "trending"
        }
      ],
      signatureTitle: "招牌体验",
      signatureDish: "大厨的金色舒芙蕾",
      signatureDesc: "一款24K金粉装饰的甜点舒芙蕾，在桌边膨胀，搭配AI推荐的葡萄酒",
      signatureFooter: "每道菜都倾注热情制作，每个推荐都精准到位",
      recognitionTitle: "荣誉认可",
      recognition: [
        "🏆 2024年数字餐饮创新奖",
        "⭐ 《科技与美食》杂志特别报道",
        "🥇 酒店业最佳AI集成"
      ]
    },
    vi: {
      title: "Câu Chuyện Của Chúng Tôi",
      tagline: "Nơi Nghệ Thuật Ẩm Thực Gặp Gỡ Trí Tuệ Số",
      subtitle: "Ẩm Thực Cao Cấp Được Tái Hiện",
      intro: "Được thành lập vào năm 2024, Lumière Dorée đại diện cho sự hài hòa hoàn hảo giữa truyền thống ẩm thực lâu đời và đổi mới tiên tiến.",
      paragraph2: "Tên của chúng tôi, có nghĩa là 'Ánh Sáng Vàng' trong tiếng Pháp, tượng trưng cho sự khai sáng mà chúng tôi mang đến cho ẩm thực hiện đại. Mỗi lần ghé thăm mang đến cho mọi vị khách trải nghiệm được chiếu sáng bởi cả nghệ thuật của các đầu bếp và trí tuệ của AI sommelier của chúng tôi.",
      visionTitle: "Tầm nhìn của Đầu bếp Marie Laurent đơn giản nhưng mang tính cách mạng:",
      vision: "tạo ra một trải nghiệm ẩm thực cao cấp thân mật, nơi công nghệ nâng cao chứ không thay thế sự chạm tay của con người. Trợ lý AI Waiter của chúng tôi học sở thích của bạn, đề xuất sự kết hợp hoàn hảo và đảm bảo mỗi lần ghé thăm đều cảm thấy được tùy chỉnh riêng.",
      chefName: "Đầu bếp Marie Laurent",
      chefTitle: "Đầu bếp điều hành & Đồng sáng lập",
      chefBio: "Được đào tạo tại Le Cordon Bleu, Paris. 15 năm kinh nghiệm tại các nhà hàng đạt sao Michelin.",
      chefQuote: "Thức ăn là thơ ca, công nghệ là cây bút. Cùng nhau, chúng ta viết nên những câu chuyện đáng để thưởng thức.",
      valuesTitle: "Giá Trị Của Chúng Tôi",
      values: [
        {
          title: "Xuất sắc",
          description: "Tiêu chuẩn Michelin trong từng món ăn",
          icon: "award"
        },
        {
          title: "Đổi mới",
          description: "Cá nhân hóa bằng AI cho hành trình của bạn",
          icon: "sparkles"
        },
        {
          title: "Bền vững",
          description: "Nguyên liệu từ trang trại đến bàn ăn, bếp không chất thải",
          icon: "leaf"
        },
        {
          title: "Trải nghiệm",
          description: "Ký ức vượt qua chính bữa ăn",
          icon: "trending"
        }
      ],
      signatureTitle: "Trải Nghiệm Đặc Trưng",
      signatureDish: "Le Chef's Golden Soufflé",
      signatureDesc: "Một món tráng miệng soufflé phủ bột vàng 24-karat nở ngay tại bàn, kết hợp với các lựa chọn rượu vang được AI đề xuất",
      signatureFooter: "Mỗi món ăn được chế biến với đam mê, mỗi đề xuất được thực hiện với độ chính xác",
      recognitionTitle: "Sự Công Nhận",
      recognition: [
        "🏆 Giải Đổi Mới Ẩm Thực Số 2024",
        "⭐ Được Giới Thiệu trên Tạp chí Tech & Taste",
        "🥇 Tích Hợp AI Tốt Nhất trong Ngành Khách Sạn"
      ]
    }
  };

  const story = stories[language as keyof typeof stories] || stories.en;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "award":
        return Award;
      case "sparkles":
        return Sparkles;
      case "leaf":
        return Leaf;
      case "trending":
        return TrendingUp;
      default:
        return Award;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-[#FFF9F0] border-2 border-[#C4941D]/30 flex flex-col [&>button]:hidden">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#C4941D]/20 bg-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-14 h-14 shrink-0">
                <RestaurantLogo />
              </div>
              <div>
                <DialogTitle className="text-xl text-[#3E2723] mb-1">
                  Lumière <span className="text-[#C4941D]">Dorée</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-[#8B7355]">
                  {story.tagline}
                </DialogDescription>
                <p className="text-xs text-[#C4941D] tracking-wider uppercase mt-1">
                  {story.subtitle}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full text-[#8B7355]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-6 space-y-6"
          >
            {/* Our Story Section */}
            <section className="space-y-3">
              <SectionHeader icon="📖" title={story.title} />
              <div className="space-y-3 text-[#3E2723] leading-relaxed">
                <p>{story.intro}</p>
                <p>{story.paragraph2}</p>
              </div>
            </section>

            <Separator className="bg-[#C4941D]/20" />

            {/* Vision */}
            <section className="space-y-3">
              <p className="text-[#3E2723] leading-relaxed">
                <span className="font-medium">{story.visionTitle}</span> {story.vision}
              </p>
            </section>

            {/* Chef Profile */}
            <ChefProfile
              name={story.chefName}
              title={story.chefTitle}
              bio={story.chefBio}
              quote={story.chefQuote}
            />

            <Separator className="bg-[#C4941D]/20" />

            {/* Our Values */}
            <section className="space-y-4">
              <SectionHeader icon="✨" title={story.valuesTitle} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story.values.map((value, index) => (
                  <ValueCard
                    key={index}
                    icon={getIcon(value.icon)}
                    title={value.title}
                    description={value.description}
                  />
                ))}
              </div>
            </section>

            <Separator className="bg-[#C4941D]/20" />

            {/* Signature Experience */}
            <SignatureExperience
              title={story.signatureTitle}
              dish={story.signatureDish}
              description={story.signatureDesc}
              footer={story.signatureFooter}
            />

            <Separator className="bg-[#C4941D]/20" />

            {/* Recognition */}
            <section className="space-y-4">
              <SectionHeader icon="🏆" title={story.recognitionTitle} />
              <div className="space-y-2">
                {story.recognition.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-[#8B7355]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C4941D]" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Decorative Footer Element */}
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C4941D]" />
                <div className="w-2 h-2 rotate-45 bg-[#C4941D]" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C4941D]" />
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
