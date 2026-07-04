'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

function CampaignTrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-28 w-full mt-4 bg-black/30 border border-white/5 p-2 rounded relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="period" hide />
          <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '4px' }}
            labelStyle={{ color: '#aaa', fontFamily: 'monospace', fontSize: '10px' }}
            itemStyle={{ color: '#a855f7', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="engagement" 
            stroke="#a855f7" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorEngagement)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CampaignPreviewModalProps {
  campaign: any;
  objective: string;
  onClose: () => void;
  onApprove: (id: string) => void;
}

function CampaignPreviewModal({ campaign, objective, onClose, onApprove }: CampaignPreviewModalProps) {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gami-bg border-4 border-black w-full max-w-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative scanline">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 border-2 border-black flex items-center justify-center bg-white text-black font-display font-bold hover:bg-gami-accent hover:text-white transition-colors shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gami-purple neo-border flex items-center justify-center text-xl font-bold">
            ✨
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-gami-accent">AI Generated Campaign Concept</span>
            <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight">{campaign.title}</h3>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black/40 border border-white/10 p-4 neo-border">
            <span className="block font-mono text-[10px] uppercase text-gray-500 mb-1">Target Campaign Type</span>
            <span className="px-2.5 py-1 bg-gami-purple text-xs font-mono font-bold uppercase">{campaign.type}</span>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Original Campaign Objective</h4>
            <p className="font-mono text-xs text-gray-300 bg-black/20 p-3 border border-white/5">{objective || "Not specified"}</p>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Detailed Description</h4>
            <p className="text-sm text-gray-300 leading-relaxed bg-black/10 p-4 border border-white/5">{campaign.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 border border-white/10 p-4">
              <span className="block font-mono text-[10px] uppercase text-gray-500 mb-1">Target Audience</span>
              <p className="text-sm font-bold text-white">{campaign.targetAudience}</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-4">
              <span className="block font-mono text-[10px] uppercase text-gray-500 mb-1">Duration</span>
              <p className="text-sm font-bold text-white">{campaign.duration}</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-4">
              <span className="block font-mono text-[10px] uppercase text-gray-500 mb-1">Suggested Rewards</span>
              <p className="text-sm font-bold text-green-400">{campaign.suggestedRewards}</p>
            </div>
          </div>

          {campaign.predictedMetrics && (
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">AI Prediction Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gami-purple/10 border-2 border-gami-purple/30 p-4">
                  <span className="block font-mono text-[10px] uppercase text-gami-accent mb-1">Estimated Reach</span>
                  <p className="text-base font-display font-bold text-white">{campaign.predictedMetrics.estimatedReach}</p>
                </div>
                <div className="bg-gami-purple/10 border-2 border-gami-purple/30 p-4">
                  <span className="block font-mono text-[10px] uppercase text-gami-accent mb-1">Expected Conversion</span>
                  <p className="text-base font-display font-bold text-white">{campaign.predictedMetrics.expectedConversion}</p>
                </div>
                <div className="bg-gami-purple/10 border-2 border-gami-purple/30 p-4">
                  <span className="block font-mono text-[10px] uppercase text-gami-accent mb-1">Engagement Lift</span>
                  <p className="text-base font-display font-bold text-green-400">{campaign.predictedMetrics.engagementLift}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={onClose}
              className="flex-grow border-2 border-white/20 font-display font-bold uppercase text-xs py-4 hover:border-white transition-colors"
            >
              Back to Suggestions
            </button>
            <button 
              onClick={() => {
                onApprove(campaign.id);
                onClose();
              }}
              className="flex-grow bg-white text-black font-display font-bold uppercase text-xs py-4 neo-border shadow-brutal hover:bg-gami-accent hover:text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Approve & Deploy Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsView() {
  const [objective, setObjective] = useState('');
  const [dataContext, setDataContext] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<any | null>(null);

  const generateCampaigns = async () => {
    if (!objective) return;
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective, dataContext: dataContext || 'General audience, mixed engagement levels.' })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setCampaigns(data.campaigns);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const approveCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, approved: true } : c));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gami-bg neo-border p-6 shadow-brutal">
          <h2 className="font-display font-bold text-2xl uppercase italic mb-6">AI Campaign Architect</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase text-gray-500 mb-2">Campaign Objective</label>
              <textarea 
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="e.g. Increase repeat purchases during the summer season..."
                className="w-full bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple transition-colors resize-none h-24"
              ></textarea>
            </div>
            
            <div>
              <label className="block font-mono text-[10px] uppercase text-gray-500 mb-2">Data Context (Optional)</label>
              <textarea 
                value={dataContext}
                onChange={e => setDataContext(e.target.value)}
                placeholder="e.g. Current users: 10k, low engagement on weekends..."
                className="w-full bg-black/40 border-2 border-white/10 p-3 font-mono text-sm outline-none focus:border-gami-purple transition-colors resize-none h-24"
              ></textarea>
            </div>

            <button 
              onClick={generateCampaigns}
              disabled={isGenerating || !objective}
              className="w-full py-4 gami-gradient text-white font-display font-bold uppercase italic neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : 'Generate Campaigns'}
            </button>
            
            {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {campaigns.length === 0 && !isGenerating && (
          <div className="bg-black/40 border-2 border-dashed border-white/20 h-64 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 gami-gradient neo-border flex items-center justify-center text-2xl mb-4">✨</div>
            <p className="font-display font-bold text-lg uppercase text-gray-400">No campaigns generated</p>
            <p className="text-xs font-mono text-gray-500 mt-2">Enter your objective and data context to generate AI-powered campaign templates.</p>
          </div>
        )}

        {isGenerating && (
          <div className="bg-black/40 border-2 border-dashed border-gami-purple h-64 flex flex-col items-center justify-center text-center p-6 animate-pulse">
             <div className="w-12 h-12 gami-gradient neo-border flex items-center justify-center text-2xl mb-4 animate-spin">⚡</div>
             <p className="font-display font-bold text-lg uppercase text-gami-accent">Analyzing Data & Generating Concepts...</p>
          </div>
        )}

        {campaigns.length > 0 && !isGenerating && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-widest text-gray-400 border-b border-white/10 pb-4">AI Suggestions</h3>
            {campaigns.map((campaign, idx) => (
              <div key={idx} className={`bg-gami-bg neo-border p-6 relative transition-all ${campaign.approved ? 'border-green-500 shadow-[4px_4px_0px_0px_#22c55e]' : 'shadow-brutal hover:shadow-brutal-purple'}`}>
                {campaign.approved && (
                  <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 font-display font-bold text-xs uppercase italic">Approved ✓</div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gami-purple neo-border flex items-center justify-center shrink-0 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-2xl uppercase">{campaign.title}</h4>
                    <span className="inline-block mt-1 px-2 py-1 bg-white/10 text-[10px] font-mono uppercase text-gami-accent">{campaign.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{campaign.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/50 border border-white/10 p-3">
                    <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Target Audience</p>
                    <p className="text-xs font-bold">{campaign.targetAudience}</p>
                  </div>
                  <div className="bg-black/50 border border-white/10 p-3">
                    <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Suggested Rewards</p>
                    <p className="text-xs font-bold text-green-400">{campaign.suggestedRewards}</p>
                  </div>
                  <div className="bg-black/50 border border-white/10 p-3">
                    <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Duration</p>
                    <p className="text-xs font-bold">{campaign.duration}</p>
                  </div>
                </div>

                {/* Predicted User Engagement Trend & Performance Metrics for Approved Campaigns */}
                {campaign.approved && (
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[10px] uppercase text-gami-accent">Predicted Engagement Growth (15 Days)</span>
                      {campaign.predictedMetrics?.engagementLift && (
                        <span className="text-xs font-bold text-green-400 font-mono">{campaign.predictedMetrics.engagementLift} lift</span>
                      )}
                    </div>
                    {campaign.engagementGrowthTrend && (
                      <CampaignTrendChart data={campaign.engagementGrowthTrend} />
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/20 p-2 border border-white/5">
                        <span className="block font-mono text-[9px] uppercase text-gray-500">Reach Goal</span>
                        <span className="text-xs font-bold">{campaign.predictedMetrics?.estimatedReach || "N/A"}</span>
                      </div>
                      <div className="bg-black/20 p-2 border border-white/5">
                        <span className="block font-mono text-[9px] uppercase text-gray-500">Target Conv.</span>
                        <span className="text-xs font-bold">{campaign.predictedMetrics?.expectedConversion || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!campaign.approved && (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedPreviewCampaign(campaign)}
                      className="flex-1 bg-gami-purple text-white font-display font-bold uppercase text-xs py-3 neo-border hover:bg-gami-accent hover:text-white transition-all shadow-brutal hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      Preview & Analyze
                    </button>
                    <button 
                      onClick={() => approveCampaign(campaign.id || idx.toString())}
                      className="flex-1 bg-white text-black font-display font-bold uppercase text-xs py-3 neo-border hover:bg-gami-accent hover:text-white transition-colors"
                    >
                      Quick Deploy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Detailed Preview Modal */}
      {selectedPreviewCampaign && (
        <CampaignPreviewModal 
          campaign={selectedPreviewCampaign} 
          objective={objective}
          onClose={() => setSelectedPreviewCampaign(null)}
          onApprove={approveCampaign}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeProject, setActiveProject] = useState('HyperQuest Alpha');
  const [env, setEnv] = useState('production');
  const [keyHidden, setKeyHidden] = useState(true);
  const [notification, setNotification] = useState(false);
  const [projectDropdown, setProjectDropdown] = useState(false);

  const apiKey = 'pk_live_6e3cfb9c6cff4b24b80e0e12';
  const projects = ['HyperQuest Alpha', 'Gami Royale', 'Social Earn'];
  
  const stats = {
    xp: '1.24M',
    users: '42.8K',
    calls: '892.1K'
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };

  return (
    <div className="min-h-screen flex bg-gami-bg text-white font-sans selection:bg-gami-accent selection:text-white hexagon-bg">
      {/* Left Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} h-screen sticky top-0 bg-gami-bg border-r-4 border-black flex flex-col transition-all duration-300 z-50`}>
        <div className="p-6 border-b-4 border-black flex items-center gap-4">
          <div className="w-10 h-10 gami-gradient neo-border flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm6 14.1L12 19.7l-6-3.6V7.9l6-3.6 6 3.6v8.2zM12 7l-4 2.4v5.2l4 2.4 4-2.4V9.4L12 7z"/>
            </svg>
          </div>
          {sidebarOpen && <span className="font-display font-bold text-2xl tracking-tight italic">GAMI</span>}
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { name: 'Overview' },
            { name: 'Campaigns' },
            { name: 'API Keys' },
            { name: 'SDKs' },
            { name: 'Analytics' },
            { name: 'Webhooks' }
          ].map((item, idx) => (
            <button key={idx} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-4 p-3 neo-border transition-all group ${activeTab === item.name ? 'bg-gami-purple shadow-brutal text-white' : 'hover:bg-white/5 text-gray-400'}`}>
              <div className="w-6 h-6 shrink-0 bg-white/20"></div>
              {sidebarOpen && <span className="font-display font-bold text-sm uppercase tracking-wider">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-4 border-black">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-all text-gray-400">
            <div className="w-6 h-6 shrink-0 bg-white/20"></div>
            {sidebarOpen && <span className="font-display font-bold text-sm uppercase tracking-wider">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-h-screen">
        <header className="h-20 bg-black/40 border-b-4 border-black sticky top-0 z-40 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <button onClick={() => setProjectDropdown(!projectDropdown)} className="flex items-center gap-3 bg-gami-bg neo-border px-4 py-2 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <span className="font-display font-bold uppercase tracking-tight">{activeProject}</span>
                <span className="text-xs">▼</span>
              </button>
              {projectDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gami-bg neo-border shadow-brutal z-50">
                  {projects.map(p => (
                    <button key={p} onClick={() => { setActiveProject(p); setProjectDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-gami-purple font-display font-bold uppercase text-xs border-b border-black last:border-0">{p}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex neo-border overflow-hidden text-[10px] font-mono font-bold uppercase">
              <button onClick={() => setEnv('sandbox')} className={`px-3 py-1.5 transition-colors ${env === 'sandbox' ? 'bg-yellow-500 text-black' : 'bg-transparent text-white'}`}>Sandbox</button>
              <button onClick={() => setEnv('production')} className={`px-3 py-1.5 border-l border-black transition-colors ${env === 'production' ? 'bg-gami-purple text-white' : 'bg-transparent text-white'}`}>Production</button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-xs uppercase text-gray-400">Mainnet Live</span>
            </div>
            <Link href="/studio" className="px-4 py-1.5 border border-white font-mono text-xs uppercase hover:bg-white hover:text-black transition-all">Go to Studio</Link>
          </div>
        </header>

        <div className="p-8 flex-grow space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-display font-bold text-5xl italic uppercase">{activeTab === 'Campaigns' ? 'Campaign Generation' : 'Builder Dashboard'}</h1>
              <p className="font-mono text-xs text-gami-accent mt-2">/ PROJECTS / {activeProject.toUpperCase().replace(' ', '_')} / {activeTab.toUpperCase()}</p>
            </div>
            {activeTab === 'Overview' && (
              <button className="gami-gradient neo-border px-6 py-3 font-display font-bold uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                + New Integration
              </button>
            )}
          </div>

          {activeTab === 'Overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gami-bg neo-border p-6 shadow-brutal-purple group hover:bg-gami-purple/5 transition-colors">
              <span className="font-mono text-xs text-gray-500 uppercase block mb-1">Total XP Distributed</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl">{stats.xp}</span>
                <span className="text-green-500 text-sm font-mono">+12.4%</span>
              </div>
              <div className="w-full h-1 bg-white/5 mt-4">
                <div className="h-full gami-gradient w-3/4"></div>
              </div>
            </div>
            <div className="bg-gami-bg neo-border p-6 shadow-brutal group hover:bg-gami-purple/5 transition-colors">
              <span className="font-mono text-xs text-gray-500 uppercase block mb-1">Active Players (24h)</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl">{stats.users}</span>
                <span className="text-gami-accent text-sm font-mono">+2.1%</span>
              </div>
              <div className="w-full h-1 bg-white/5 mt-4">
                <div className="h-full bg-white w-1/2"></div>
              </div>
            </div>
            <div className="bg-gami-bg neo-border p-6 shadow-brutal group hover:bg-gami-purple/5 transition-colors">
              <span className="font-mono text-xs text-gray-500 uppercase block mb-1">API Requests</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl">{stats.calls}</span>
                <span className="text-gray-500 text-sm font-mono">99.9% uptime</span>
              </div>
              <div className="w-full h-1 bg-white/5 mt-4">
                <div className="h-full bg-gami-accent w-5/6"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-gami-bg neo-border shadow-brutal">
                <div className="p-6 border-b-4 border-black flex justify-between items-center bg-white/5">
                  <h2 className="font-display font-bold text-xl uppercase italic">API Key Management</h2>
                  <button className="text-xs font-mono text-gami-accent hover:underline">Revoke All Keys</button>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-gray-500 mb-2">Secret Key ({env})</label>
                      <div className="flex gap-2">
                        <div className="flex-grow bg-black neo-border px-4 py-3 font-mono text-sm text-gami-accent flex items-center overflow-hidden">
                          <span className="truncate">{keyHidden ? '••••••••••••••••••••••••••••••••' : apiKey}</span>
                        </div>
                        <button onClick={() => setKeyHidden(!keyHidden)} className="bg-gami-bg neo-border px-4 flex items-center justify-center hover:bg-white/5 transition-colors">
                          <span className="text-xs">{keyHidden ? 'SHOW' : 'HIDE'}</span>
                        </button>
                        <button onClick={copyKey} className="bg-white text-black neo-border px-6 font-display font-bold uppercase text-xs hover:bg-gami-accent hover:text-white transition-all">Copy</button>
                      </div>
                      <p className="mt-3 text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Never share this key. It grants full write access to the protocol events bus.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gami-bg neo-border p-6 shadow-brutal">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white text-black neo-border flex items-center justify-center font-bold">JS</div>
                    <div>
                      <h3 className="font-display font-bold uppercase text-sm">Web SDK (JS/TS)</h3>
                      <span className="font-mono text-[10px] text-green-500 font-bold">CONNECTED // v1.4.2</span>
                    </div>
                  </div>
                  <button className="w-full py-2 border-2 border-white/20 font-mono text-xs uppercase hover:border-white transition-all">View Docs</button>
                </div>
                <div className="bg-gami-bg neo-border p-6 shadow-brutal opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white/10 neo-border flex items-center justify-center font-bold">U</div>
                    <div>
                      <h3 className="font-display font-bold uppercase text-sm">Unity Engine</h3>
                      <span className="font-mono text-[10px] text-gray-500 font-bold">DISCONNECTED</span>
                    </div>
                  </div>
                  <button className="w-full py-2 border-2 border-white/20 font-mono text-xs uppercase">Initialize</button>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="bg-black neo-border shadow-brutal flex flex-col h-[520px]">
                <div className="p-4 border-b-4 border-black flex items-center justify-between bg-white/5">
                  <h2 className="font-display font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Protocol Event Stream
                  </h2>
                  <span className="font-mono text-[10px] text-gray-500">REAL-TIME</span>
                </div>
                <div className="flex-grow p-4 font-mono text-[11px] overflow-y-auto space-y-2">
                  {[
                    { t: '14:20:01', ev: 'USER_REWARD_CLAIM', p: '0x4f...a2' },
                    { t: '14:20:05', ev: 'XP_BATCH_SETTLE', p: 'L2_CHAIN' },
                    { t: '14:20:12', ev: 'QUEST_COMPLETED', p: 'HyperQuest' },
                    { t: '14:20:18', ev: 'AI_REWARD_OPTIMIZE', p: 'AGENT_V2' },
                    { t: '14:20:25', ev: 'USER_LOGIN', p: '0x9a...d4' },
                    { t: '14:20:33', ev: 'TOKEN_BURN_FEE', p: 'PROTOCOL' }
                  ].map((event, i) => (
                    <div key={i} className="flex gap-3 hover:bg-white/5 p-1 transition-colors group">
                      <span className="text-gray-600">{event.t}</span>
                      <span className="text-gami-accent font-bold">{event.ev}</span>
                      <span className="text-gray-400 ml-auto group-hover:text-white">{event.p}</span>
                    </div>
                  ))}
                  <div className="flex gap-3 animate-pulse italic text-gray-700">
                    <span>14:20:41</span>
                    <span>AWAITING NEXT EVENT...</span>
                  </div>
                </div>
                <div className="p-4 border-t-2 border-black/20 bg-white/5">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span>AVG LATENCY</span>
                    <span className="text-green-500">142ms</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
            </>
          )}

          {activeTab === 'Campaigns' && (
            <CampaignsView />
          )}
        </div>
      </main>

      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gami-accent neo-border px-8 py-4 shadow-brutal flex items-center gap-4">
          <div className="w-8 h-8 bg-black flex items-center justify-center font-bold text-white">✓</div>
          <span className="font-display font-bold uppercase text-black tracking-wider">Copied to Clipboard</span>
        </div>
      )}
    </div>
  );
}
