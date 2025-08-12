'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { lunarCrushEnhanced } from '@/lib/lunarcrush-enhanced';

export default function ResourceMonitor() {
  const [resourceStatus, setResourceStatus] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      try {
        const status = lunarCrushEnhanced.getResourceStatus();
        setResourceStatus(status);
      } catch (error) {
        console.error('Failed to get resource status:', error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!resourceStatus) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-slate-800 border border-slate-600 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
        title="Resource Monitor"
      >
        <Activity className="h-5 w-5 text-blue-400" />
      </button>

      {/* Resource Monitor Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-slate-900 border border-slate-600 rounded-lg shadow-xl">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span>Resource Monitor</span>
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Worker Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">Worker URL</span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800 rounded p-2 font-mono">
                {resourceStatus.workerUrl}
              </div>
            </div>

            {/* Throttle Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Pending Requests</span>
              </div>
              <div className="text-xs text-slate-400">
                {resourceStatus.throttleStatus.pendingRequests.length > 0 ? (
                  <div className="space-y-1">
                    {resourceStatus.throttleStatus.pendingRequests.map((req: string, i: number) => (
                      <div key={i} className="bg-yellow-500/20 text-yellow-400 rounded p-2">
                        {req}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-green-400">No pending requests</div>
                )}
              </div>
            </div>

            {/* Resource Management Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Resource Management</span>
              </div>
              <div className="text-xs text-blue-400 bg-blue-500/20 rounded p-2">
                {resourceStatus.resourceManagement}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Throttling prevents Worker CPU exhaustion</div>
              <div>• LLM falls back to direct MCP tools if needed</div>
              <div>• 2s minimum interval between requests</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
