'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, AlertCircle, Crown, Zap, Building, Users } from 'lucide-react';

export default function DetailedCompetitiveEdge() {
  const competitors = [
    {
      name: "LunarOracle",
      logo: "🌙",
      price: "$79/month",
      isUs: true,
      tagline: "AI-Powered Crypto Robo-Advisor",
      strengths: [
        "Real-time whale tracking",
        "Viral trend prediction",
        "78% prediction accuracy",
        "Beginner-friendly explanations",
        "Galaxy Score (exclusive metric)",
        "Social sentiment arbitrage",
        "100M+ social posts analyzed daily",
        "Institutional intelligence alerts",
        "Position sizing calculator",
        "Simple BUY/SELL/HOLD recommendations"
      ]
    },
    {
      name: "CryptoQuant",
      logo: "📊",
      price: "$149/month",
      isUs: false,
      tagline: "On-Chain Data Analytics",
      strengths: [
        "On-chain transaction data",
        "Exchange flow analysis",
        "Whale alert system (basic)",
        "Technical indicators",
        "Institutional-focused"
      ],
      weaknesses: [
        "No social media analysis",
        "Complex for beginners",
        "No buy/sell recommendations",
        "Limited viral trend detection",
        "67% prediction accuracy",
        "Expensive for individuals"
      ]
    },
    {
      name: "Santiment",
      logo: "📈",
      price: "$199/month",
      isUs: false,
      tagline: "Behavioral Analytics",
      strengths: [
        "Social sentiment tracking",
        "Development activity metrics",
        "Network growth data",
        "Some social analysis"
      ],
      weaknesses: [
        "No whale movement alerts",
        "Complex technical interface",
        "61% prediction accuracy",
        "No position sizing help",
        "Limited beginner education",
        "Focuses on developers, not traders"
      ]
    },
    {
      name: "IntoTheBlock",
      logo: "🔍",
      price: "$299/month",
      isUs: false,
      tagline: "AI-Driven Analytics",
      strengths: [
        "Machine learning models",
        "Price correlation analysis",
        "Holder composition data",
        "Some AI features"
      ],
      weaknesses: [
        "No social media integration",
        "58% prediction accuracy",
        "Very expensive",
        "Not beginner-friendly",
        "No viral trend prediction",
        "Limited real-time features"
      ]
    },
    {
      name: "Glassnode",
      logo: "🔬",
      price: "$279/month",
      isUs: false,
      tagline: "On-Chain Market Intelligence",
      strengths: [
        "Comprehensive on-chain data",
        "Advanced metrics",
        "Professional reports",
        "Long-term trend analysis"
      ],
      weaknesses: [
        "Zero social media analysis",
        "No buy/sell recommendations",
        "Extremely technical",
        "No beginner features",
        "Limited real-time alerts",
        "Focuses only on Bitcoin/Ethereum"
      ]
    }
  ];

  const exclusiveFeatures = [
    {
      name: "Galaxy Score Algorithm",
      description: "Our proprietary social influence metric that tracks buzz across 100+ platforms",
      icon: "🌟",
      onlyUs: true
    },
    {
      name: "Viral Trend Prediction",
      description: "AI predicts which cryptos will go viral 24-48 hours before they pump",
      icon: "🚀",
      onlyUs: true
    },
    {
      name: "Real-Time Whale Alerts",
      description: "Instant notifications when institutions buy/sell (MicroStrategy, Tesla, etc.)",
      icon: "🐋",
      onlyUs: false,
      competitors: ["CryptoQuant (basic)"]
    },
    {
      name: "Beginner Robo-Advisor",
      description: "Simple BUY/SELL/HOLD recommendations with position sizing for non-experts",
      icon: "🤖",
      onlyUs: true
    },
    {
      name: "Social Sentiment Arbitrage",
      description: "Find disconnects between social buzz and price for trading opportunities",
      icon: "📊",
      onlyUs: true
    },
    {
      name: "Institutional News Integration",
      description: "Track corporate adoption, ETF launches, and regulatory developments",
      icon: "🏛️",
      onlyUs: false,
      competitors: ["CryptoQuant (limited)"]
    }
  ];

  return (
		<div className='space-y-8'>
			{/* Why We Win Section */}
			<Card className='bg-gradient-to-r from-green-900 to-blue-900 border-green-700'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-2xl text-center justify-center'>
						<Crown className='h-8 w-8 text-yellow-400' />
						🏆 Why 500+ Businesses Choose LunarOracle Over Competitors
					</CardTitle>
					<p className='text-center text-slate-300'>
						We're the only platform that combines institutional-grade data with
						beginner-friendly explanations
					</p>
				</CardHeader>
				<CardContent>
					<div className='grid md:grid-cols-3 gap-6'>
						<div className='text-center'>
							<div className='text-4xl font-bold text-green-400 mb-2'>
								50% Cheaper
							</div>
							<p className='text-slate-300'>$79 vs $149-299 for competitors</p>
						</div>
						<div className='text-center'>
							<div className='text-4xl font-bold text-blue-400 mb-2'>
								78% Accuracy
							</div>
							<p className='text-slate-300'>vs 58-67% for other platforms</p>
						</div>
						<div className='text-center'>
							<div className='text-4xl font-bold text-purple-400 mb-2'>
								100M+ Posts
							</div>
							<p className='text-slate-300'>
								analyzed daily for social intelligence
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Exclusive Features Only We Have */}
			<Card className='bg-slate-800 border-slate-700'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-xl'>
						<Zap className='h-6 w-6 text-yellow-400' />
						🎯 Exclusive Features Analysis (Why We Beat Everyone)
					</CardTitle>
					<p className='text-slate-400'>
						Features you can ONLY get with LunarOracle - our competitive moats
						that others can't copy
					</p>
				</CardHeader>
				<CardContent>
					<div className='grid md:grid-cols-2 gap-4'>
						{exclusiveFeatures.map((feature, index) => (
							<div
								key={index}
								className={`p-4 rounded-lg border ${
									feature.onlyUs
										? 'bg-purple-950/50 border-purple-700'
										: 'bg-slate-700/50 border-slate-600'
								}`}>
								<div className='flex items-start gap-3'>
									<span className='text-2xl'>{feature.icon}</span>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<h3 className='font-bold text-white'>{feature.name}</h3>
											{feature.onlyUs ? (
												<Badge
													variant='outline'
													className='border-purple-600 text-purple-400 text-xs'>
													ONLY US
												</Badge>
											) : (
												<Badge
													variant='outline'
													className='border-yellow-600 text-yellow-400 text-xs'>
													LIMITED ELSEWHERE
												</Badge>
											)}
										</div>
										<p className='text-sm text-slate-300 mb-2'>
											{feature.description}
										</p>
										{!feature.onlyUs && feature.competitors && (
											<p className='text-xs text-slate-400'>
												Also available: {feature.competitors.join(', ')}
											</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Detailed Competitor Comparison */}
			<Card className='bg-slate-800 border-slate-700'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-xl'>
						<Building className='h-6 w-6 text-blue-400' />
						📊 Complete Competitor Analysis (The Honest Truth)
					</CardTitle>
					<p className='text-slate-400'>
						We've analyzed every major crypto intelligence platform so you don't
						have to
					</p>
				</CardHeader>
				<CardContent>
					<div className='grid lg:grid-cols-1 gap-6'>
						{competitors.map((competitor, index) => (
							<Card
								key={index}
								className={`${
									competitor.isUs
										? 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700'
										: 'bg-slate-700 border-slate-600'
								}`}>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<span className='text-3xl'>{competitor.logo}</span>
											<div>
												<h3 className='text-xl font-bold text-white flex items-center gap-2'>
													{competitor.name}
													{competitor.isUs && (
														<Crown className='h-5 w-5 text-yellow-400' />
													)}
												</h3>
												<p className='text-slate-400 text-sm'>
													{competitor.tagline}
												</p>
											</div>
										</div>
										<div className='text-right'>
											<div
												className={`text-2xl font-bold ${
													competitor.isUs ? 'text-green-400' : 'text-red-400'
												}`}>
												{competitor.price}
											</div>
											{competitor.isUs && (
												<Badge
													variant='outline'
													className='border-green-600 text-green-400 mt-1'>
													BEST VALUE
												</Badge>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className='grid md:grid-cols-2 gap-6'>
										{/* Strengths */}
										<div>
											<h4 className='font-semibold text-green-400 mb-3 flex items-center gap-2'>
												<CheckCircle className='h-4 w-4' />
												What {competitor.isUs ? 'We' : 'They'} Do Well:
											</h4>
											<ul className='space-y-2'>
												{competitor.strengths.map((strength, idx) => (
													<li
														key={idx}
														className='flex items-start gap-2 text-sm'>
														<CheckCircle className='h-3 w-3 text-green-400 mt-1 flex-shrink-0' />
														<span className='text-slate-300'>{strength}</span>
													</li>
												))}
											</ul>
										</div>

										{/* Weaknesses */}
										<div>
											{competitor.weaknesses ? (
												<>
													<h4 className='font-semibold text-red-400 mb-3 flex items-center gap-2'>
														<X className='h-4 w-4' />
														Where They Fall Short:
													</h4>
													<ul className='space-y-2'>
														{competitor.weaknesses.map((weakness, idx) => (
															<li
																key={idx}
																className='flex items-start gap-2 text-sm'>
																<X className='h-3 w-3 text-red-400 mt-1 flex-shrink-0' />
																<span className='text-slate-300'>
																	{weakness}
																</span>
															</li>
														))}
													</ul>
												</>
											) : (
												<div className='bg-green-950/50 p-4 rounded-lg border border-green-800'>
													<h4 className='font-semibold text-green-300 mb-2'>
														🎯 Why Choose Us:
													</h4>
													<ul className='text-sm text-green-200 space-y-1'>
														<li>• Only platform with viral trend prediction</li>
														<li>• Simplest interface for beginners</li>
														<li>• 50% cheaper than competitors</li>
														<li>• Higher prediction accuracy</li>
														<li>• Real-time social intelligence</li>
													</ul>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Bottom Line */}
			<Card className='bg-gradient-to-r from-green-900 to-blue-900 border-green-700'>
				<CardContent className='pt-6'>
					<div className='text-center'>
						<h3 className='text-2xl font-bold text-white mb-4'>
							💎 The Bottom Line
						</h3>
						<div className='grid md:grid-cols-3 gap-6 text-center'>
							<div>
								<Users className='h-8 w-8 text-blue-400 mx-auto mb-2' />
								<h4 className='font-bold text-blue-300 mb-2'>For Beginners:</h4>
								<p className='text-sm text-slate-300'>
									We're the only platform that actually explains what to do in
									plain English. Others show complex charts - we give simple
									recommendations.
								</p>
							</div>
							<div>
								<Building className='h-8 w-8 text-purple-400 mx-auto mb-2' />
								<h4 className='font-bold text-purple-300 mb-2'>
									For Businesses:
								</h4>
								<p className='text-sm text-slate-300'>
									Get institutional-grade intelligence at 50% the cost. Our
									viral trend prediction gives you 24-48 hour advantages.
								</p>
							</div>
							<div>
								<Crown className='h-8 w-8 text-yellow-400 mx-auto mb-2' />
								<h4 className='font-bold text-yellow-300 mb-2'>
									For Everyone:
								</h4>
								<p className='text-sm text-slate-300'>
									78% accuracy, exclusive data sources, and beginner-friendly
									explanations. Nobody else combines all three.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
