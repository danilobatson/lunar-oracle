'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Wifi, AlertCircle } from 'lucide-react';

interface RealTimeStatusProps {
  lastUpdate?: Date;
  dataFreshness?: 'fresh' | 'recent' | 'stale';
}

export default function RealTimeStatus({ lastUpdate, dataFreshness = 'fresh' }: RealTimeStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (dataFreshness) {
      case 'fresh': return 'bg-green-700 text-green-100';
      case 'recent': return 'bg-yellow-700 text-yellow-100';
      case 'stale': return 'bg-red-700 text-red-100';
      default: return 'bg-slate-700 text-slate-100';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-3 w-3 text-green-400" />;
      case 'connecting': return <Activity className="h-3 w-3 text-yellow-400 animate-pulse" />;
      case 'disconnected': return <AlertCircle className="h-3 w-3 text-red-400" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return 'Unknown';
    const diffMs = currentTime.getTime() - lastUpdate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1">
        {getConnectionIcon()}
        <span className="text-slate-400">Live Data</span>
      </div>

      <Badge variant="secondary" className={getStatusColor()}>
        {dataFreshness.toUpperCase()}
      </Badge>

      <div className="flex items-center gap-1 text-slate-400">
        <Clock className="h-3 w-3" />
        <span>{formatTime(currentTime)}</span>
      </div>

      {lastUpdate && (
        <span className="text-slate-500">Updated {getTimeSinceUpdate()}</span>
      )}
    </div>
  );
}
