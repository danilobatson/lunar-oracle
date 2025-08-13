'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, TrendingUp, Users, Zap, Building } from 'lucide-react';

interface CryptoEducationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function CryptoEducation({ isOpen }: CryptoEducationProps) {
  if (!isOpen) return null;

  const educationSections = [
    {
      title: "🌟 LunarOracle Exclusive Metrics Explained",
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      items: [
        {
          name: "Galaxy Score",
          explanation: "Our secret sauce! Measures how much buzz a crypto has across ALL social media. Like a popularity contest score (0-100). High score = lots of attention = often leads to price increases.",
          exclusive: true
        },
        {
          name: "Social Dominance",
          explanation: "What % of ALL crypto talk is about this coin. If Bitcoin has 20% social dominance, it means 1 out of 5 crypto posts mention Bitcoin. Higher = more attention.",
          exclusive: true
        },
        {
          name: "Viral Momentum",
          explanation: "Our AI predicts if this crypto will 'go viral' on social media. HIGH = likely to trend and pump, MEDIUM = some buzz, LOW = probably won't trend.",
          exclusive: true
        },
        {
          name: "Whale Activity",
          explanation: "Tracks when 'whales' (people/companies with millions of dollars) buy or sell. When whales move, prices usually follow within 24-48 hours.",
          exclusive: true
        }
      ]
    },
    {
      title: "📊 Standard Crypto Metrics (Made Simple)",
      icon: <BookOpen className="h-5 w-5 text-blue-400" />,
      items: [
        {
          name: "Market Cap",
          explanation: "Total value of all coins combined. Like a company's total stock value. Bigger market cap = more stable, smaller = more risky but more upside potential.",
          exclusive: false
        },
        {
          name: "Volume",
          explanation: "How much money was traded in the last 24 hours. High volume = lots of buying/selling activity = more reliable price movements.",
          exclusive: false
        },
        {
          name: "Alt Rank",
          explanation: "Where this crypto ranks by size. #1 = Bitcoin, #2 = Ethereum, etc. Lower number = bigger, more established crypto.",
          exclusive: false
        }
      ]
    },
    {
      title: "🤖 How Our Robo-Advisor Works",
      icon: <Lightbulb className="h-5 w-5 text-yellow-400" />,
      items: [
        {
          name: "Step 1: Data Collection",
          explanation: "We analyze 100M+ social media posts, track whale movements, monitor news, and watch institutional adoption signals in real-time.",
          exclusive: true
        },
        {
          name: "Step 2: AI Analysis",
          explanation: "Our AI finds patterns humans miss. It connects social buzz to price movements, predicts viral trends, and spots when big money is moving.",
          exclusive: true
        },
        {
          name: "Step 3: Simple Recommendations",
          explanation: "Instead of showing you confusing charts, we tell you exactly what to do: BUY, SELL, or HOLD. Plus how much to invest and when.",
          exclusive: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎓 Crypto Made Simple</h2>
        <p className="text-slate-400">
          New to crypto? No problem. We'll explain everything so you can invest with confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {educationSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-l-2 border-slate-600 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      {item.exclusive && (
                        <Badge variant="outline" className="border-purple-600 text-purple-400 text-xs">
                          EXCLUSIVE
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-green-900 border-green-700">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-bold text-green-200 mb-2">💡 Why This Matters for Beginners</h3>
            <p className="text-green-300 text-sm">
              Traditional crypto analysis requires years of experience. Our robo-advisor does all the hard work for you.
              Just follow our BUY/SELL recommendations and position sizing - we handle the complex analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
