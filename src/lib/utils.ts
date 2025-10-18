// Utilitários para o sistema de marketplace
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatar preço em reais
export function formatar_preco(preco: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
}

// Formatar data
export function formatar_data(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data);
}

// Validar email
export function validar_email(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Gerar ID único
export function gerar_id(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Simular delay para requisições
export function simular_delay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// URL base do servidor backend
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

/**
 * Converte uma URL de imagem relativa em absoluta
 * @param imagemUrl - URL da imagem (pode ser relativa ou absoluta)
 * @returns URL absoluta da imagem ou undefined se não houver URL
 */
export function obter_url_imagem_completa(imagemUrl?: string): string | undefined {
  if (!imagemUrl) return undefined;
  
  // Se já for uma URL completa (http/https), retornar como está
  if (imagemUrl.startsWith('http://') || imagemUrl.startsWith('https://')) {
    return imagemUrl;
  }
  
  // Se for uma URL blob (preview local), retornar como está
  if (imagemUrl.startsWith('blob:')) {
    return imagemUrl;
  }
  
  // Se for uma URL data (base64), retornar como está
  if (imagemUrl.startsWith('data:')) {
    return imagemUrl;
  }
  
  // Adicionar o prefixo do servidor
  const url = imagemUrl.startsWith('/') ? imagemUrl : `/${imagemUrl}`;
  return `${SERVER_BASE_URL}${url}`;
}