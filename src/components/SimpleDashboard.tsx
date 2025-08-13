'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
	Search,
	TrendingUp,
	AlertCircle,
	CheckCircle,
	Building,
	Zap,
	Activity,
	Shield,
	HelpCircle,
	BookOpen,
	Lightbulb,
} from 'lucide-react';
import MarketingLanding from './MarketingLanding';
import { InstitutionalIntel, ViralIntel } from './intelligence';
import {
	SocialRadar,
	PerformanceTracker,
	SocialCharts,
	RealTimeStatus,
} from './premium';
import BeginnerPositionCalculator from "@/components/education/BeginnerPositionCalculator";
import CryptoEducation from "@/components/education/CryptoEducation";
import DetailedCompetitiveEdge from "@/components/education/DetailedCompetitiveEdge";
interface ApiResponse {
	symbol: string;
	current_price: number;
	recommendation: 'BUY' | 'SELL' | 'HOLD';
	confidence: number;
	reasoning: string;
	key_metrics: {
		price: string;
		galaxy_score: string;
		alt_rank: string;
		social_dominance: string;
		sentiment: string;
		volume_24h: string;
		market_cap: string;
	};
	institutional_intelligence: {
		whale_moves: string;
		corporate_news: string;
		smart_money: string;
		etf_activity: string;
	};
	viral_intelligence: {
		trending_story: string;
		influencer_mood: string;
		meme_factor: string;
		community_energy: string;
	};
	trading_signals: {
		entry_zone: string;
		stop_loss: string;
		target_1: string;
		target_2: string;
		position_size: string;
		timeframe: string;
	};
	ai_summary: {
		bulls: string[];
		bears: string[];
		catalyst: string;
		outlook: string;
	};
	metadata?: {
		analysis_type: string;
		data_sources: number;
		premium_features: string[];
	};
}

export default function SimpleDashboard() {
	const [symbol, setSymbol] = useState('');
	const [data, setData] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
	const [autoRefresh, setAutoRefresh] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(false);
	const [showEducation, setShowEducation] = useState(false);
	const { toast } = useToast();

	// Auto-refresh functionality
	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (autoRefresh && data) {
			interval = setInterval(() => {
				handleAnalyze(true);
			}, 30000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [autoRefresh, data]);

	const handleStartAnalysis = () => {
		console.log('🚀 Starting analysis view - showing search interface');
		setShowAnalysis(true);
	};

	const handleAnalyze = async (silent = false) => {
		console.log('🔍 Analyzing:', symbol);

		if (!symbol.trim()) {
			if (!silent) {
				toast({
					title: 'Please enter a cryptocurrency symbol',
					description: 'Try BTC, ETH, SOL, or any crypto ticker',
					variant: 'destructive',
				});
			}
			return;
		}

		setLoading(true);
		if (!silent) setError(null);

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ symbol: symbol.toLowerCase() }),
			});

			if (!response.ok) {
				throw new Error(`Analysis failed: ${response.status}`);
			}

			const result = await response.json();
			setData(result);
			setLastUpdate(new Date());
			setShowAnalysis(true);

			if (!silent) {
				toast({
					title: '🎯 Your Crypto Cheat Sheet is Ready!',
					description: `Complete analysis for ${symbol.toUpperCase()} with buy/sell recommendations`,
				});
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Analysis failed';
			setError(errorMessage);
			if (!silent) {
				toast({
					title: 'Oops! Something went wrong',
					description: 'Please try again or try a different crypto symbol',
					variant: 'destructive',
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAnalyze();
		}
	};

	const getRecommendationExplanation = (rec: string, confidence: number) => {
		switch (rec) {
			case 'BUY':
				return confidence >= 85
					? '🟢 Strong buy signal - Multiple bullish indicators aligned'
					: '🟡 Moderate buy signal - Some positive trends detected';
			case 'SELL':
				return confidence >= 85
					? '🔴 Strong sell signal - Multiple risk factors identified'
					: '🟡 Moderate sell signal - Some concerning trends found';
			default:
				return '⏸️ Hold recommendation - Wait for clearer market signals';
		}
	};

	// Enhanced metrics with more LunarOracle exclusives
	const getEnhancedMetrics = (data: ApiResponse) => [
		{
			name: 'LunarCrush Galaxy Score',
			value: data.key_metrics?.galaxy_score || 'N/A',
			description: 'Our exclusive social influence metric (0-100)',
			tooltip:
				"LunarCrush's proprietary algorithm measuring total social influence",
			exclusive: true,
			icon: '🌟',
		},
		{
			name: 'Market Position',
			value: `#${data.key_metrics?.alt_rank || 'N/A'}`,
			description: 'Ranking among all cryptocurrencies',
			tooltip: 'Lower number = bigger, more established crypto',
			exclusive: false,
			icon: '🏆',
		},
		{
			name: 'Social Sentiment Score',
			value: `${data.key_metrics?.sentiment || 'N/A'}`,
			description: 'How bullish people are feeling',
			tooltip: 'Above 70% = very bullish, below 30% = very bearish',
			exclusive: true,
			icon: '😊',
		},
		{
			name: 'Social Dominance',
			value: `${data.key_metrics?.social_dominance || 'N/A'}`,
			description: 'Share of total crypto conversation',
			tooltip: 'Higher % = more attention vs other cryptos',
			exclusive: true,
			icon: '📢',
		},
		{
			name: 'Viral Momentum',
			value: data.viral_intelligence?.meme_factor || 'N/A',
			description: 'Potential for viral social media growth',
			tooltip: 'HIGH = likely to trend and pump, LOW = unlikely to go viral',
			exclusive: true,
			icon: '🚀',
		},
		{
			name: 'Whale Activity',
			value: data.institutional_intelligence?.whale_moves
				? 'DETECTED'
				: 'NORMAL',
			description: 'Large institutional movements',
			tooltip:
				'DETECTED = big money is moving, which often predicts price changes',
			exclusive: true,
			icon: '🐋',
		},
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
			<div className='w-full px-6 py-6'>
				{!showAnalysis ? (
					<div className='w-full max-w-none'>
						<MarketingLanding onStartAnalysis={handleStartAnalysis} />
					</div>
				) : (
					<>
						{/* Enhanced Header */}
						<div className='text-center mb-8 space-y-4'>
							<div className='flex items-center justify-center gap-2 mb-2'>
								<Shield className='h-6 w-6 text-blue-400' />
								<Badge
									variant='secondary'
									className='bg-blue-900 text-blue-200 px-3 py-1'>
									YOUR CRYPTO ROBO-ADVISOR
								</Badge>
							</div>

							<h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent'>
								🌙 LunarOracle
							</h1>
							<p className='text-lg md:text-xl text-slate-400 max-w-3xl mx-auto'>
								We analyze millions of social posts and whale movements to tell
								you exactly when to buy, sell, and how much to invest
							</p>

							{/* Enhanced Value Prop */}
							<div className='flex items-center justify-center gap-6 text-sm text-slate-400 flex-wrap'>
								<div className='flex items-center gap-1'>
									<Activity className='h-4 w-4 text-green-400' />
									<span>Tracking 100M+ social posts daily</span>
								</div>
								<div className='flex items-center gap-1'>
									<Building className='h-4 w-4 text-purple-400' />
									<span>Monitoring institutional whale movements</span>
								</div>
								<div className='flex items-center gap-1'>
									<Zap className='h-4 w-4 text-yellow-400' />
									<span>Predicting viral trends before they explode</span>
								</div>
								<div className='flex items-center gap-1'>
									<Shield className='h-4 w-4 text-blue-400' />
									<span>78% prediction accuracy</span>
								</div>
							</div>

							{/* Real-time Status */}
							{data && (
								<div className='flex justify-center'>
									<RealTimeStatus
										lastUpdate={lastUpdate || undefined}
										dataFreshness={
											lastUpdate && Date.now() - lastUpdate.getTime() < 60000
												? 'fresh'
												: 'recent'
										}
									/>
								</div>
							)}

							{/* Search Bar */}
							<div className='flex flex-col sm:flex-row gap-4 max-w-lg mx-auto'>
								<Input
									type='text'
									placeholder='Enter crypto symbol (BTC, ETH, SOL, ADA...)'
									value={symbol}
									onChange={(e) => setSymbol(e.target.value)}
									onKeyPress={handleKeyPress}
									className='bg-slate-800 border-slate-600 text-white placeholder:text-slate-400'
								/>
								<div className='flex gap-2'>
									<Button
										onClick={() => handleAnalyze()}
										disabled={loading}
										className='bg-blue-600 hover:bg-blue-700 text-white px-6'>
										{loading ? (
											<>
												<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
												Analyzing...
											</>
										) : (
											<>
												<Search className='h-4 w-4 mr-2' />
												Get My Cheat Sheet
											</>
										)}
									</Button>
									{data && (
										<Button
											variant='outline'
											onClick={() => setAutoRefresh(!autoRefresh)}
											className={`border-slate-600 ${
												autoRefresh
													? 'bg-green-900 text-green-200'
													: 'text-slate-400'
											}`}>
											{autoRefresh ? '⏸️ Pause' : '▶️ Live'}
										</Button>
									)}
								</div>
							</div>

							{/* Education Toggle */}
							<div className='mt-4'>
								<Button
									variant='ghost'
									onClick={() => setShowEducation(!showEducation)}
									className='text-blue-400 hover:text-white'>
									<BookOpen className='h-4 w-4 mr-2' />
									{showEducation ? 'Hide' : 'Show'} Crypto Education Guide
								</Button>
								<Button
									variant='ghost'
									onClick={() => setShowAnalysis(false)}
									className='text-slate-400 hover:text-white ml-4'>
									← Back to Homepage
								</Button>
							</div>
						</div>

						{/* Crypto Education Section */}
						{showEducation && (
							<div className='mb-8'>
								<CryptoEducation
									isOpen={showEducation}
									onToggle={() => setShowEducation(!showEducation)}
								/>
							</div>
						)}

						{/* Error State */}
						{error && (
							<Alert className='mb-6 bg-red-950 border-red-800 text-red-200'>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>
									{error} - Please try again or try a different crypto symbol
									like BTC, ETH, or SOL
								</AlertDescription>
							</Alert>
						)}

						{/* Loading State */}
						{loading && !data && (
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
								<div className='lg:col-span-2 space-y-4'>
									<Skeleton className='h-48 bg-slate-800' />
									<Skeleton className='h-32 bg-slate-800' />
									<Skeleton className='h-32 bg-slate-800' />
								</div>
								<div className='space-y-4'>
									<Skeleton className='h-32 bg-slate-800' />
									<Skeleton className='h-32 bg-slate-800' />
								</div>
							</div>
						)}

						{/* Results */}
						{data && (
							<div className='space-y-8'>
								{/* Robo-Advisor Recommendation Card */}
								<Card className='bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white'>
									<CardHeader>
										<div className='text-center'>
											<div className='flex items-center justify-center gap-2 mb-4'>
												<Lightbulb className='h-8 w-8 text-yellow-400' />
												<Badge
													variant='secondary'
													className='bg-yellow-900 text-yellow-200 px-4 py-2 text-lg'>
													YOUR PERSONAL CRYPTO ADVISOR
												</Badge>
											</div>
											<h2 className='text-3xl font-bold mb-2'>
												📋 What Should You Do With {data.symbol.toUpperCase()}?
											</h2>
											<p className='text-slate-400'>
												Based on millions of data points, here's your
												personalized investment recommendation
											</p>
										</div>
									</CardHeader>
									<CardContent>
										<div className='text-center mb-6'>
											<div className='flex items-center justify-center gap-4 mb-4'>
												<div className='text-center'>
													<p className='text-4xl font-bold text-green-400'>
														{data.current_price?.toLocaleString() || 'N/A'}
													</p>
													<p className='text-sm text-slate-400'>
														Current Price
													</p>
												</div>
												<div className='text-center'>
													<Badge
														variant='secondary'
														className={`text-3xl px-8 py-4 font-bold ${
															data.recommendation === 'BUY'
																? 'bg-green-700 text-green-100'
																: data.recommendation === 'SELL'
																? 'bg-red-700 text-red-100'
																: 'bg-yellow-700 text-yellow-100'
														}`}>
														{data.recommendation === 'BUY'
															? '✅ BUY NOW'
															: data.recommendation === 'SELL'
															? '❌ SELL NOW'
															: '⏸️ WAIT & HOLD'}
													</Badge>
													<p className='text-sm text-slate-400 mt-2'>
														{data.confidence} confidence
													</p>
												</div>
											</div>

											{/* Simple Explanation */}
											<div className='bg-slate-700/50 p-6 rounded-lg'>
												<h3 className='font-bold text-blue-400 mb-3 text-xl'>
													🤖 Why Our AI Recommends This:
												</h3>
												<p className='text-slate-200 text-lg leading-relaxed mb-4'>
													{data.reasoning}
												</p>
												<div className='bg-slate-600/50 p-4 rounded-lg'>
													<p className='text-slate-300'>
														<strong>In Simple Terms:</strong>{' '}
														{getRecommendationExplanation(
															data.recommendation,
															data.confidence
														)}
													</p>
												</div>
											</div>
										</div>

										{/* Enhanced LunarOracle Exclusive Metrics */}
										<div className='mb-6'>
											<h3 className='font-bold text-white mb-4 text-xl text-center'>
												🌟 LunarOracle Exclusive Intelligence Metrics
											</h3>
											<p className='text-center text-slate-400 mb-6'>
												Data you can't get anywhere else - powered by millions
												of social posts and institutional tracking
											</p>
											<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
												{getEnhancedMetrics(data).map((metric, index) => (
													<div
														key={index}
														className={`p-4 rounded-lg border ${
															metric.exclusive
																? 'bg-purple-950/50 border-purple-800'
																: 'bg-slate-700/50 border-slate-600'
														}`}>
														<div className='flex items-center gap-2 mb-2'>
															<span className='text-lg'>{metric.icon}</span>
															<p className='text-slate-400 text-sm font-medium'>
																{metric.name}
															</p>
															{metric.exclusive && (
																<Badge
																	variant='outline'
																	className='border-purple-600 text-purple-400 text-xs'>
																	EXCLUSIVE
																</Badge>
															)}
															<span title={metric.tooltip}>
																<HelpCircle className='h-3 w-3 text-slate-500' />
															</span>
														</div>
														<p className='font-bold text-white text-xl'>
															{metric.value}
														</p>
														<p className='text-xs text-slate-400 mt-1'>
															{metric.description}
														</p>
													</div>
												))}
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Main Analysis Grid */}
								<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
									{/* Main Analysis Column */}
									<div className='lg:col-span-2 space-y-6'>
										{/* Intelligence Components */}
										<InstitutionalIntel
											data={data.institutional_intelligence}
										/>
										<ViralIntel data={data.viral_intelligence} />

										{/* Enhanced AI Summary */}
										<Card className='bg-slate-800 border-slate-700 text-white'>
											<CardHeader>
												<CardTitle className='flex items-center gap-2'>
													<TrendingUp className='h-5 w-5 text-blue-400' />
													🤖 Complete AI Analysis Summary
												</CardTitle>
												<p className='text-slate-400 text-sm'>
													Our AI processed millions of data points to create
													this analysis
												</p>
											</CardHeader>
											<CardContent className='space-y-6'>
												<div>
													<h4 className='font-semibold text-green-400 mb-3 text-lg'>
														🐂 Reasons to Buy (Bullish Factors):
													</h4>
													<div className='space-y-3'>
														{data.ai_summary?.bulls?.map((bull, index) => (
															<div
																key={index}
																className='flex items-start gap-3 p-4 bg-green-950/50 rounded-lg border border-green-800/30'>
																<CheckCircle className='h-5 w-5 text-green-400 mt-0.5 flex-shrink-0' />
																<div>
																	<p className='text-sm text-slate-300 font-medium'>
																		{bull}
																	</p>
																	<p className='text-xs text-green-300 mt-1'>
																		{index === 0
																			? '💪 Strong fundamental driver'
																			: index === 1
																			? '📈 Technical momentum indicator'
																			: '🌊 Market sentiment factor'}
																	</p>
																</div>
															</div>
														)) || (
															<p className='text-sm text-slate-400'>
																No strong bullish signals detected right now
															</p>
														)}
													</div>
												</div>

												<div>
													<h4 className='font-semibold text-red-400 mb-3 text-lg'>
														🐻 Risks to Watch (Bearish Factors):
													</h4>
													<div className='space-y-3'>
														{data.ai_summary?.bears?.map((bear, index) => (
															<div
																key={index}
																className='flex items-start gap-3 p-4 bg-red-950/50 rounded-lg border border-red-800/30'>
																<AlertCircle className='h-5 w-5 text-red-400 mt-0.5 flex-shrink-0' />
																<div>
																	<p className='text-sm text-slate-300 font-medium'>
																		{bear}
																	</p>
																	<p className='text-xs text-red-300 mt-1'>
																		{index === 0
																			? '⚠️ Major risk factor to monitor'
																			: '🔍 Secondary concern'}
																	</p>
																</div>
															</div>
														)) || (
															<p className='text-sm text-slate-400'>
																No major risks identified in current analysis
															</p>
														)}
													</div>
												</div>

												<div className='pt-4 border-t border-slate-700'>
													<div className='grid md:grid-cols-2 gap-6'>
														<div className='bg-blue-950/50 p-4 rounded-lg border border-blue-800'>
															<h4 className='font-semibold text-blue-400 mb-2'>
																🎯 Key Price Catalyst:
															</h4>
															<p className='text-sm text-slate-300'>
																{data.ai_summary?.catalyst ||
																	'General market sentiment'}
															</p>
															<p className='text-xs text-blue-300 mt-2'>
																The main event likely to move the price
															</p>
														</div>
														<div className='bg-purple-950/50 p-4 rounded-lg border border-purple-800'>
															<h4 className='font-semibold text-purple-400 mb-2'>
																📈 Market Outlook:
															</h4>
															<p className='text-sm text-slate-300'>
																{data.ai_summary?.outlook ||
																	'Monitoring market developments'}
															</p>
															<p className='text-xs text-purple-300 mt-2'>
																Where our AI thinks the price is heading
															</p>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>

									{/* Sidebar with Enhanced Components */}
									<div className='space-y-6'>
										{/* Enhanced Position Calculator */}
										<BeginnerPositionCalculator
											data={data.trading_signals}
											recommendation={data.recommendation}
											confidence={data.confidence}
										/>

										<PerformanceTracker />
									</div>
								</div>

								{/* Advanced Features */}
								<SocialRadar apiData={data} />

								<div>
									<h2 className='text-2xl font-bold text-white mb-2 flex items-center gap-2'>
										<Activity className='h-6 w-6 text-blue-400' />
										📊 Professional Social Intelligence Charts
									</h2>
									<p className='text-slate-400 mb-4'>
										See how social media buzz predicts price movements - data
										worth thousands from Bloomberg Terminal
									</p>
									<SocialCharts apiData={data} />
								</div>

								<div>
									<h2 className='text-2xl font-bold text-white mb-2 flex items-center gap-2'>
										<Shield className='h-6 w-6 text-green-400' />
										🏆 Why LunarOracle Beats Every Competitor
									</h2>
									<p className='text-slate-400 mb-4'>
										Compare us to CryptoQuant, Santiment, IntoTheBlock and see
										why 500+ businesses choose LunarOracle
									</p>
									<DetailedCompetitiveEdge />
								</div>
							</div>
						)}

						{/* Demo Instructions */}
						{!data && !loading && showAnalysis && (
							<Card className='bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white max-w-4xl mx-auto'>
								<CardHeader>
									<CardTitle className='text-center flex items-center justify-center gap-2'>
										<Shield className='h-5 w-5 text-blue-400' />
										🚀 Get Your First Crypto Investment Recommendation
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='text-center space-y-4 text-slate-300'>
										<p className='text-xl'>
											We'll analyze millions of social posts and whale movements
											to tell you exactly what to do
										</p>
										<p className='text-slate-400'>
											Enter any crypto symbol above and get buy/sell
											recommendations with position sizing in 30 seconds
										</p>
										<div className='flex flex-wrap justify-center gap-3 mt-6'>
											<Badge
												variant='outline'
												className='cursor-pointer hover:bg-slate-700 border-blue-600 text-blue-400 px-6 py-3 text-lg'
												onClick={() => setSymbol('btc')}>
												📈 Try Bitcoin (BTC)
											</Badge>
											<Badge
												variant='outline'
												className='cursor-pointer hover:bg-slate-700 border-purple-600 text-purple-400 px-6 py-3 text-lg'
												onClick={() => setSymbol('eth')}>
												⚡ Try Ethereum (ETH)
											</Badge>
											<Badge
												variant='outline'
												className='cursor-pointer hover:bg-slate-700 border-green-600 text-green-400 px-6 py-3 text-lg'
												onClick={() => setSymbol('sol')}>
												🚀 Try Solana (SOL)
											</Badge>
											<Badge
												variant='outline'
												className='cursor-pointer hover:bg-slate-700 border-orange-600 text-orange-400 px-6 py-3 text-lg'
												onClick={() => setSymbol('ada')}>
												💎 Try Cardano (ADA)
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</>
				)}
			</div>
		</div>
	);
}
