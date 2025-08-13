'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Calculator,
	DollarSign,
	AlertCircle,
	TrendingUp,
	HelpCircle,
} from 'lucide-react';

interface PositionData {
	entry_zone: string;
	stop_loss: string;
	target_1: string;
	target_2: string;
	position_size: string;
	timeframe: string;
}

interface BeginnerPositionCalculatorProps {
	data: PositionData;
	recommendation: string;
	confidence: number;
}

export default function BeginnerPositionCalculator({
	data,
	recommendation,
	confidence,
}: BeginnerPositionCalculatorProps) {
	const [totalMoney, setTotalMoney] = useState('10000');
	const [riskLevel, setRiskLevel] = useState<
		'conservative' | 'moderate' | 'aggressive'
	>('moderate');

	const calculateInvestment = () => {
		const total = parseFloat(totalMoney) || 0;
		const basePercent = parseFloat(data.position_size?.replace('%', '')) || 0;

		// Adjust based on risk level and confidence
		let adjustedPercent = basePercent;

		if (riskLevel === 'conservative') {
			adjustedPercent = Math.min(basePercent * 0.5, 2); // Max 2%
		} else if (riskLevel === 'aggressive') {
			adjustedPercent = Math.min(basePercent * 1.5, 10); // Max 10%
		}

		// Further adjust based on confidence
		if (confidence < 70) adjustedPercent *= 0.7;
		if (confidence > 85) adjustedPercent *= 1.2;

		return {
			amount: (total * adjustedPercent) / 100,
			percentage: adjustedPercent,
		};
	};

	const investment = calculateInvestment();
	const potentialGain = investment.amount * 0.15; // Assume 15% gain
	const potentialLoss = investment.amount * 0.08; // Assume 8% loss

	const getRiskExplanation = () => {
		switch (riskLevel) {
			case 'conservative':
				return "Play it safe - only invest 1-2% of your money. Good for beginners or if you can't afford to lose money.";
			case 'moderate':
				return 'Balanced approach - invest 2-5% of your money. Good balance of growth potential and safety.';
			case 'aggressive':
				return 'Higher risk, higher reward - invest 5-10% of your money. Only if you can afford to lose it all.';
		}
	};

	const getRecommendationAdvice = () => {
		if (recommendation === 'BUY') {
			return confidence >= 85
				? '🟢 Strong buy signal! Our AI is very confident. Consider investing the recommended amount.'
				: '🟡 Moderate buy signal. Our AI sees potential but be cautious. Maybe start with half the recommended amount.';
		} else if (recommendation === 'SELL') {
			return '🔴 Sell signal detected. If you own this crypto, consider selling some or all of your position.';
		} else {
			return '⏸️ Hold recommendation. Wait for clearer signals before buying or selling.';
		}
	};

	return (
		<Card className='bg-slate-800 border-slate-700 text-white'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Calculator className='h-5 w-5 text-blue-400' />
					💼 Your Personal Investment Calculator
				</CardTitle>
				<p className='text-sm text-slate-400'>
					Tell us your budget and risk level - we'll calculate exactly how much
					to invest
				</p>
			</CardHeader>

			<CardContent className='space-y-6'>
				{/* Total Money Input */}
				<div>
					<label className='text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2'>
						💰 How much money do you have to invest in crypto?
						<p className='text-xs text-slate-400 mt-1'>
							Only enter money you can afford to lose! Crypto is risky.
						</p>
					</label>
					<div className='relative'>
						<DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
						<Input
							type='number'
							value={totalMoney}
							onChange={(e) => setTotalMoney(e.target.value)}
							placeholder='10000'
							className='bg-slate-700 border-slate-600 text-white pl-10'
						/>
					</div>
				</div>

				{/* Risk Level Selection */}
				<div>
					<label className='text-sm font-medium text-slate-300 mb-3 block'>
						🎯 What's your risk tolerance?
					</label>
					<div className='grid grid-cols-1 gap-2'>
						{[
							{
								level: 'conservative',
								label: '🛡️ Conservative (Safest)',
								color: 'green',
							},
							{
								level: 'moderate',
								label: '⚖️ Moderate (Balanced)',
								color: 'blue',
							},
							{
								level: 'aggressive',
								label: '🚀 Aggressive (Riskiest)',
								color: 'red',
							},
						].map(({ level, label, color }) => (
							<Button
								key={level}
								variant={riskLevel === level ? 'default' : 'outline'}
								onClick={() => setRiskLevel(level as any)}
								className={`justify-start ${
									riskLevel === level
										? `bg-${color}-700 text-${color}-100 border-${color}-600`
										: 'border-slate-600 text-slate-400 hover:bg-slate-700'
								}`}>
								{label}
							</Button>
						))}
					</div>
					<p className='text-xs text-slate-400 mt-2'>{getRiskExplanation()}</p>
				</div>

				{/* Investment Calculation Results */}
				<div className='bg-slate-700/50 p-4 rounded-lg border border-slate-600'>
					<h3 className='font-bold text-white mb-3'>
						📊 Your Personalized Investment Plan:
					</h3>

					<div className='grid grid-cols-2 gap-4 mb-4'>
						<div className='text-center'>
							<p className='text-2xl font-bold text-green-400'>
								$
								{investment.amount.toLocaleString(undefined, {
									maximumFractionDigits: 0,
								})}
							</p>
							<p className='text-sm text-slate-400'>Recommended Investment</p>
							<p className='text-xs text-slate-500'>
								({investment.percentage.toFixed(1)}% of your budget)
							</p>
						</div>
						<div className='text-center'>
							<Badge
								variant='secondary'
								className={`text-lg px-4 py-2 ${
									recommendation === 'BUY'
										? 'bg-green-700 text-green-100'
										: recommendation === 'SELL'
										? 'bg-red-700 text-red-100'
										: 'bg-yellow-700 text-yellow-100'
								}`}>
								{recommendation}
							</Badge>
							<p className='text-sm text-slate-400 mt-1'>
								{confidence}% confidence
							</p>
						</div>
					</div>

					{/* Recommendation Explanation */}
					<div className='bg-slate-600/50 p-3 rounded-lg mb-4'>
						<p className='text-sm text-slate-300'>
							<strong>What this means:</strong> {getRecommendationAdvice()}
						</p>
					</div>

					{/* Potential Outcomes */}
					<div className='grid grid-cols-2 gap-4 text-sm'>
						<div className='bg-green-950/50 p-3 rounded-lg border border-green-800'>
							<h4 className='font-medium text-green-400 mb-1'>
								💰 If it goes well:
							</h4>
							<p className='text-green-300'>
								+$
								{potentialGain.toLocaleString(undefined, {
									maximumFractionDigits: 0,
								})}{' '}
								profit
							</p>
							<p className='text-xs text-green-400 mt-1'>
								Based on typical 15% gain
							</p>
						</div>
						<div className='bg-red-950/50 p-3 rounded-lg border border-red-800'>
							<h4 className='font-medium text-red-400 mb-1'>
								📉 If it goes badly:
							</h4>
							<p className='text-red-300'>
								-$
								{potentialLoss.toLocaleString(undefined, {
									maximumFractionDigits: 0,
								})}{' '}
								loss
							</p>
							<p className='text-xs text-red-400 mt-1'>
								Based on typical 8% loss
							</p>
						</div>
					</div>
				</div>

				{/* Trading Signals */}
				<div className='space-y-3'>
					<h4 className='font-medium text-white'>📈 Detailed Trading Plan:</h4>
					<div className='grid grid-cols-1 gap-2 text-sm'>
						<div className='flex justify-between p-2 bg-slate-700/50 rounded'>
							<span className='text-slate-400'>💡 Best price to buy:</span>
							<span className='text-white font-medium'>{data.entry_zone}</span>
						</div>
						<div className='flex justify-between p-2 bg-slate-700/50 rounded'>
							<span className='text-slate-400'>🛑 Stop loss (cut losses):</span>
							<span className='text-red-400 font-medium'>{data.stop_loss}</span>
						</div>
						<div className='flex justify-between p-2 bg-slate-700/50 rounded'>
							<span className='text-slate-400'>🎯 First profit target:</span>
							<span className='text-green-400 font-medium'>
								{data.target_1}
							</span>
						</div>
						<div className='flex justify-between p-2 bg-slate-700/50 rounded'>
							<span className='text-slate-400'>🚀 Big profit target:</span>
							<span className='text-green-400 font-medium'>
								{data.target_2}
							</span>
						</div>
						<div className='flex justify-between p-2 bg-slate-700/50 rounded'>
							<span className='text-slate-400'>⏰ Time frame:</span>
							<span className='text-white font-medium'>{data.timeframe}</span>
						</div>
					</div>
				</div>

				{/* Beginner Warning */}
				<div className='bg-orange-950/50 p-4 rounded-lg border border-orange-800'>
					<div className='flex items-start gap-2'>
						<AlertCircle className='h-4 w-4 text-orange-400 mt-0.5' />
						<div>
							<h4 className='font-medium text-orange-300 mb-1'>
								⚠️ Important for Beginners:
							</h4>
							<ul className='text-xs text-orange-200 space-y-1'>
								<li>• Never invest money you can't afford to lose</li>
								<li>• Start small and learn as you go</li>
								<li>• Always set stop losses to limit your losses</li>
								<li>• Don't panic if the price goes down temporarily</li>
								<li>
									• Consider dollar-cost averaging (buying a little each week)
								</li>
							</ul>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
