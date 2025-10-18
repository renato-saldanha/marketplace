'use client';

import { ReactNode } from 'react';
import { 
  ArrowRight, Plus, Check, X, Filter, Edit, Trash2, Package, 
  LogOut, Settings, Bell, User, Grid, List, Save, Eye, Search,
  RefreshCw, Home, Lock, Download
} from 'lucide-react';

interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'arrow-right' | 'plus' | 'check' | 'x' | 'filter' | 'edit' | 'trash' | 'package' | 'logout' | 'settings' | 'bell' | 'user' | 'grid' | 'list' | 'save' | 'eye' | 'search' | 'refresh' | 'home' | 'lock' | 'download';
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const iconMap = {
  'arrow-right': ArrowRight,
  'plus': Plus,
  'check': Check,
  'x': X,
  'filter': Filter,
  'edit': Edit,
  'trash': Trash2,
  'package': Package,
  'logout': LogOut,
  'settings': Settings,
  'bell': Bell,
  'user': User,
  'grid': Grid,
  'list': List,
  'save': Save,
  'eye': Eye,
  'search': Search,
  'refresh': RefreshCw,
  'home': Home,
  'lock': Lock,
  'download': Download,
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  onMouseOver,
  onMouseOut,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  const classeBase = 'inline-flex items-center justify-between gap-2 font-action-md rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const classesVariantes = {
    primary: 'bg-orange-base text-white hover:bg-orange-dark focus:ring-orange-base',
    secondary: 'bg-white text-orange-base border-2 border-orange-base hover:bg-orange-base hover:text-white focus:ring-orange-base',
    outline: 'bg-white text-gray-400 border border-gray-100 hover:bg-shape focus:ring-gray-100',
  };

  const classesTamanho = {
    sm: 'px-4 py-2 text-action-sm',
    md: 'px-6 py-3 text-action-md',
    lg: 'px-8 py-4 text-action-md',
  };

  const classeDesabilitado = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      disabled={disabled || loading}
      className={`${classeBase} ${classesVariantes[variant]} ${classesTamanho[size]} ${classeDesabilitado} ${className}`}
    >
      {children}
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        IconComponent && <IconComponent className="w-5 h-5" />
      )}      
    </button>
  );
}
