import React from "react";

interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  icon,
}) => (
  <div className="space-y-1 relative">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      required={required}
      type={type}
      placeholder={placeholder}
      className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 transition-colors text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default FormInput;
