import React from "react";

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactElement;
  label: string;
}

export const NavBtn: React.FC<NavBtnProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all ${active ? "bg-primary-950 text-white shadow-xl shadow-primary-950/20" : "text-slate-400 hover:text-primary-600 hover:bg-white"}`}
  >
    {React.cloneElement(icon, { size: 18 } as any)} {label}
  </button>
);

export const MobileNavIcon: React.FC<NavBtnProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? "text-primary-600" : "text-slate-400"}`}
  >
    {React.cloneElement(icon, { size: 20 } as any)}
    <span className="text-[9px] font-bold uppercase tracking-tighter">
      {label}
    </span>
  </button>
);
