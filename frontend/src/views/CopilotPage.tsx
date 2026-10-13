import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal, 
  ShieldCheck, 
  Coins, 
  Zap, 
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

const STARTER_PROMPTS = [
  {
    icon: Zap,
    title: 'Arc Hardhat Config',
    prompt: 'Generate a complete hardhat.config.js for deploying contracts on Arc Mainnet with Chain ID 5042 and the official RPC URL.'
  },
  {
    icon: Coins,
    title: 'USDC Precompile Script',
    prompt: 'Write an ethers.js v6 script in TypeScript that connects to Arc Mainnet and checks a wallet balance using the native USDC precompile at 0x3600000000000000000000000000000000000000.'
  },
  {
    icon: ShieldCheck,
    title: 'Micro-Escrow Contract',
    prompt: 'Write a production-ready Solidity smart contract for a milestone escrow on Arc L1 that releases payments in native USDC.'
  },
  {
    icon: Terminal,
    title: 'Sub-Second Finality Explained',
    prompt: 'Explain how Arc L1 achieves sub-second deterministic finality and how frontend dApps can optimize their UI confirmation states.'
  }
];

const CopilotPage = () => {
  const { getAccessToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `### Welcome to Arc Copilot! ⚡\n\nI am your AI assistant specialized in the **Arc L1 Blockchain**.\n\nAsk me anything about:\n- Smart contracts in Solidity tailored for Arc\n- Interacting with the **native USDC precompile** (\`0x3600...0000\`)\n- Network deployment configs (Hardhat, Foundry, viem/wagmi)\n- Sub-second block finality & architecture\n\nClick any quick prompt below or type your question!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = await getAccessToken();
      const history = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await axios.post(
        `${backendUrl}/api/copilot/chat`,
        { prompt: text, history },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: res.data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Copilot request failed:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Error**: ${err.response?.data?.error || 'Failed to reach Arc Copilot. Please verify the server connection.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors bg-grid-pattern">
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-[#676fff] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            Arc L1 AI Copilot
          </span>
        </div>
        {/* Starter Chips (shown when few messages) */}
        {messages.length <= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {STARTER_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.prompt)}
                  disabled={loading}
                  className="flex items-start gap-3 p-3 text-left rounded-xl border border-neutral-200 dark:border-[#1e1e1e] bg-white dark:bg-[#111] hover:border-indigo-400 dark:hover:border-[#676fff]/60 hover:bg-neutral-50 dark:hover:bg-[#151515] transition-all text-xs group cursor-pointer shadow-xs"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-[#676fff] group-hover:scale-105 transition-transform shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-0.5">
                      {item.title}
                    </span>
                    <span className="text-neutral-500 dark:text-[#777] line-clamp-2">
                      {item.prompt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[400px]">
          {messages.map((m) => {
            const isBot = m.role === 'model';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-[#676fff] shrink-0 mt-1">
                    <Sparkles size={16} />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 max-w-[88%] sm:max-w-[80%] text-sm leading-relaxed shadow-xs ${
                    isBot
                      ? 'bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#202020] text-neutral-800 dark:text-neutral-200'
                      : 'bg-indigo-600 dark:bg-[#676fff] text-white'
                  }`}
                >
                  {isBot ? (
                    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 text-indigo-600 dark:text-[#676fff]">{children}</h3>,
                          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="mb-0.5">{children}</li>,
                          code: ({ className, children }) => {
                            const codeString = String(children).replace(/\n$/, '');
                            const isBlock = className || codeString.includes('\n');
                            const codeBlockId = `code-${Math.random().toString(36).substring(7)}`;

                            if (isBlock) {
                              return (
                                <div className="relative my-3 rounded-xl overflow-hidden border border-neutral-300 dark:border-[#222] bg-[#0d1117] text-neutral-100 shadow-md">
                                  <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-[#21262d] text-[11px] font-mono text-neutral-400">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 inline-block" />
                                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 inline-block" />
                                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 inline-block" />
                                      <span className="ml-2 px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 font-mono uppercase tracking-wider">
                                        {className?.replace('language-', '') || 'solidity'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleCopyCode(codeString, codeBlockId)}
                                      className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-neutral-800"
                                    >
                                      {copiedId === codeBlockId ? (
                                        <>
                                          <Check size={12} className="text-emerald-400" />
                                          <span className="text-emerald-400 text-[10px]">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={12} />
                                          <span className="text-[10px]">Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3 overflow-x-auto text-xs font-mono leading-relaxed">
                                    <code>{children}</code>
                                  </pre>
                                </div>
                              );
                            }
                            return (
                              <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1a1a1a] text-indigo-600 dark:text-[#676fff] font-mono text-xs">
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-neutral-500 dark:text-[#777] italic">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-[#676fff] shrink-0 animate-pulse">
                <RefreshCw size={14} className="animate-spin" />
              </div>
              <span>Arc Copilot is formulating smart contract code...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222] rounded-2xl p-2 shadow-lg flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask Arc Copilot to generate smart contracts, scripts, or debug Arc code..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-[#676fff] dark:hover:bg-[#5560ee] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            title="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopilotPage;
