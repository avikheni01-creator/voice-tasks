export default function GlobalStyles() {
  return (
    <style>{`
      @keyframes ripple {
        0%   { transform: scale(1);   opacity: 0.6; }
        100% { transform: scale(2.2); opacity: 0;   }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0);    }
        50%       { transform: translateY(-4px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-4px); }
        to   { opacity: 1; transform: translateX(0);    }
      }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar       { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #2a2438; border-radius: 2px; }
    `}</style>
  )
}
