class ServicoUpload {
  async fazerUploadImagem(arquivo: File): Promise<string> {
    try {
      const base64 = await this.converterParaBase64(arquivo);
      return base64;
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      throw new Error('Falha no upload da imagem');
    }
  }

  async converterParaBase64(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Extrair apenas a parte base64 (sem o prefixo data:image/...;base64,)
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
        } else {
          reject(new Error('Erro ao converter arquivo para base64'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(arquivo);
    });
  }

}

export const servicoUpload = new ServicoUpload();
