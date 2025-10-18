'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadService } from '@/lib/api';
import Button from './Button';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  initialImage?: string;
  maxSize?: number; // em MB
  allowedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onUpload,
  onRemove,
  initialImage,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
  disabled = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(initialImage || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError('');
    
    // Validar arquivo
    const validation = uploadService.validarArquivo(file);
    if (!validation.valido) {
      setError(validation.erro || 'Arquivo inválido');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    setUploading(true);
    try {
      const url = await uploadService.fazerUploadImagem(file);
      onUpload(url);
    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro ao fazer upload da imagem. Tente novamente.');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setError('');
    onRemove?.();
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block">
        <span className="label-md text-gray-300 mb-2 block">Imagem do Produto</span>
        
        {!preview ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${dragActive ? 'border-orange-base bg-orange-base/5' : 'border-gray-100 hover:border-orange-base'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleInputChange}
              className="hidden"
              disabled={disabled}
            />
            
            <div className="flex flex-col items-center">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-orange-base border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="body-md text-gray-400">Fazendo upload...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-shape rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="body-md text-gray-400 mb-2">
                    Clique para fazer upload ou arraste a imagem
                  </p>
                  <p className="body-xs text-gray-200">
                    PNG, JPG, GIF ou WebP até {maxSize}MB
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-full h-64 bg-shape rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            {!disabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-orange-base border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="body-xs text-gray-400">Enviando...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </label>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
          <p className="body-xs text-danger">{error}</p>
        </div>
      )}
    </div>
  );
}
