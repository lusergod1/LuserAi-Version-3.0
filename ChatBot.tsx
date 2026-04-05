import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

const BOT_RESPONSES: Record<string, string[]> = {
  salam: [
    "🐉 Salam! Mən Luser AI-yəm. Sizə necə kömək edə bilərəm?",
    "🔥 Xoş gəldiniz! Luser AI xidmətinizdədir. Sualınızı soruşun!",
    "⚡ Salam! Ejderha qüvvəsi ilə sizə kömək etməyə hazıram!"
  ],
  help: [
    "🐉 Mən aşağıdakılarla kömək edə bilərəm:\n• Məlumat axtarışı\n• Kod yazma\n• Dizayn məsləhəti\n• Biznes strategiyası\n• Texniki dəstək",
    "⚡ Luser AI imkanları:\n🔥 Sual-cavab\n🔥 Analiz\n🔥 Kreativ yazı\n🔥 Problemin həlli"
  ],
  ai: [
    "🐉 Mən Luser AI - qüdrətli süni zəka sistemi! Ejderha kimi güclü, atəş kimi sürətli!",
    "🔥 Luser AI - ən müasir texnologiyalar ilə yaradılmış AI sistemi. Hər sualınıza cavab verirəm!"
  ],
  qiymet: [
    "💰 Luser AI xidmət paketləri:\n🔥 Basic: Aylıq 29 AZN\n⚡ Pro: Aylıq 79 AZN\n👑 Enterprise: Fərdi qiymət\n\nƏlaqə: 077 509 06 99",
    "📊 Ətraflı məlumat üçün bizimlə əlaqə saxlayın:\n📞 077 509 06 99"
  ],
  elaqe: [
    "📞 Bizimlə əlaqə:\n☎️ Telefon: 077 509 06 99\n🐉 Luser AI Şirkəti\n💬 24/7 dəstək mövcuddur!",
    "📱 Əlaqə məlumatları:\n📞 077 509 06 99\nHər zaman xidmətinizdəyik! 🔥"
  ],
  kod: [
    "💻 Mən aşağıdakı proqramlaşdırma dillərini bilirəm:\n🔥 JavaScript / TypeScript\n🔥 Python\n🔥 React / Vue\n🔥 C++ / Java\n\nHansı dildə kömək lazımdır?",
    "⚡ Kod yazmağa hazıram! Hansı layihə üzərində işləyirsiniz?"
  ],
  tesekkur: [
    "🐉 Xahiş edirəm! Həmişə xidmətinizdəyəm!",
    "🔥 Çox sağ olun! Başqa sualınız varsa, soruşun!",
    "⚡ Zəhmət deyil! Luser AI həmişə burada!"
  ],
  default: [
    "🐉 Maraqlı sual! Luser AI olaraq bu mövzuda ətraflı analiz aparıram...\n\nBu xüsusiyyət tezliklə əlavə ediləcək. Başqa sualınız var mı?",
    "⚡ Anlıyıram! Bu mövzuda sizə kömək etmək üçün daha çox məlumat lazımdır. Zəhmət olmasa, ətraflı izah edin.",
    "🔥 Excellent sual! Luser AI bu sahədə güclüdür. Mütəxəssis dəstəyi üçün:\n📞 077 509 06 99",
    "🐉 Bu barədə çox düşündüm... Ən yaxşı cavabı vermək üçün bir az vaxt lazımdır. Eyni zamanda başqa bir şey soruşa bilərsiniz!",
    "⚡ Qeyd etdim! Luser AI sürekli öyrənir. Bu sualın cavabını sizin üçün araşdırıram!"
  ]
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('salam') || lower.includes('hi') || lower.includes('hello') || lower.includes('xoş')) {
    const arr = BOT_RESPONSES.salam;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes('kömək') || lower.includes('help') || lower.includes('nə edə')) {
    const arr = BOT_RESPONSES.help;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes('ai') || lower.includes('süni') || lower.includes('robot') || lower.includes('luser')) {
    const arr = BOT_RESPONSES.ai;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes('qiymət') || lower.includes('paket') || lower.includes('pul') || lower.includes('neçə')) {
    const arr = BOT_RESPONSES.qiymet;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes('əlaqə') || lower.includes('telefon') || lower.includes('nömrə') || lower.includes('contact')) {
    const arr = BOT_RESPONSES.elaqe;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes('kod') || lower.includes('proqram') || lower.includes('web') || lower.includes('app') || lower.includes('javascript') || lower.includes('python')) {
    const arr = BOT_RESPONSES.kod;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes('təşəkkür') || lower.includes('sağ ol') || lower.includes('thanks') || lower.includes('merci')) {
    const arr = BOT_RESPONSES.tesekkur;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const arr = BOT_RESPONSES.default;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTime(): string {
  return new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: '🐉 Salam! Mən **Luser AI**-yəm — ejderha qüvvəsi ilə çalışan süni zəka!\n\nSizə necə kömək edə bilərəm? 🔥', time: getTime() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const botText = getBotResponse(text);
      const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: botText, time: getTime() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="text-red-400">{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const quickReplies = ['Salam 👋', 'Kömək et 🐉', 'Qiymətlər 💰', 'Əlaqə 📞', 'Kod yaz 💻'];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-red-900/40 bg-black/30">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-red-600 flex items-center justify-center text-lg border-2 border-red-500 pulse-red">
            🐉
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
        </div>
        <div>
          <div className="text-white font-bold text-sm">Luser AI</div>
          <div className="text-green-400 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
            Onlayn • 24/7 aktiv
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-red-800 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2 h-2 rounded-full bg-red-900 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-custom" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center text-sm flex-shrink-0 mt-1 border border-red-600">
                🐉
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'msg-user' : 'msg-bot'} rounded-2xl px-4 py-3`}>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-red-100'}`}>
                {formatText(msg.text)}
              </p>
              <span className={`text-xs mt-1 block ${msg.role === 'user' ? 'text-red-300 text-right' : 'text-red-600'}`}>
                {msg.time}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-sm flex-shrink-0 mt-1 border border-red-800">
                👤
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center text-sm flex-shrink-0 border border-red-600">🐉</div>
            <div className="msg-bot rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="text-red-400 text-xs mr-1">Yazır</span>
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-custom">
        {quickReplies.map(reply => (
          <button
            key={reply}
            onClick={() => { setInput(reply.replace(/[🐉👋💰📞💻]/g, '').trim()); setTimeout(sendMessage, 100); setInput(reply); setTimeout(() => { setInput(''); sendMessage(); }, 50); }}
            className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-red-800 text-red-400 hover:bg-red-900/30 hover:border-red-600 transition-all flex-shrink-0"
            onMouseDown={(e) => { e.preventDefault(); setInput(reply); setTimeout(() => { const t = reply.trim(); const userMsg: Message = { id: Date.now(), role: 'user', text: t, time: getTime() }; setMessages(prev => [...prev, userMsg]); setInput(''); setIsTyping(true); setTimeout(() => { const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: getBotResponse(t), time: getTime() }; setMessages(prev => [...prev, botMsg]); setIsTyping(false); }, 1000); }, 0); }}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-red-900/40">
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Mesajınızı yazın... 🔥"
            className="chat-input flex-1 rounded-xl px-4 py-3 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="fire-btn px-4 py-3 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
