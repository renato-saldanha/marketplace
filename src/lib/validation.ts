// Sistema de validação de formulários

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

// Regras de validação pré-definidas
export const validationRules = {
  required: (message: string = 'Campo obrigatório'): ValidationRule => ({
    validate: (value: any) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    },
    message
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true; // Skip if empty (use required() for that)
      return value.length >= length;
    },
    message: message || `Deve ter pelo menos ${length} caracteres`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true;
      return value.length <= length;
    },
    message: message || `Deve ter no máximo ${length} caracteres`
  }),

  email: (message: string = 'Email inválido'): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),

  phone: (message: string = 'Telefone inválido'): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true;
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    },
    message
  }),

  number: (message: string = 'Deve ser um número válido'): ValidationRule => ({
    validate: (value: any) => {
      if (!value && value !== 0) return true;
      return !isNaN(Number(value));
    },
    message
  }),

  min: (minimum: number, message?: string): ValidationRule => ({
    validate: (value: any) => {
      if (!value && value !== 0) return true;
      return Number(value) >= minimum;
    },
    message: message || `Deve ser no mínimo ${minimum}`
  }),

  max: (maximum: number, message?: string): ValidationRule => ({
    validate: (value: any) => {
      if (!value && value !== 0) return true;
      return Number(value) <= maximum;
    },
    message: message || `Deve ser no máximo ${maximum}`
  }),

  matches: (pattern: RegExp, message: string = 'Formato inválido'): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true;
      return pattern.test(value);
    },
    message
  }),

  url: (message: string = 'URL inválida'): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),

  oneOf: (options: any[], message?: string): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      return options.includes(value);
    },
    message: message || `Deve ser um dos valores: ${options.join(', ')}`
  }),

  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    validate: validator,
    message
  }),

  matchField: (fieldName: string, getData: () => any, message?: string): ValidationRule => ({
    validate: (value: any) => {
      if (!value) return true;
      const data = getData();
      return value === data[fieldName];
    },
    message: message || `Os campos não correspondem`
  }),

  fileSize: (maxSizeMB: number, message?: string): ValidationRule => ({
    validate: (file: File) => {
      if (!file) return true;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return file.size <= maxSizeBytes;
    },
    message: message || `O arquivo deve ter no máximo ${maxSizeMB}MB`
  }),

  fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
    validate: (file: File) => {
      if (!file) return true;
      return allowedTypes.some(type => file.type.includes(type));
    },
    message: message || `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`
  }),
};

// Função para validar um objeto contra um schema
export function validate(
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field in schema) {
    const rules = schema[field];
    const value = data[field];

    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors[field] = rule.message;
        break; // Para no primeiro erro
      }
    }
  }

  return errors;
}

// Função para validar um único campo
export function validateField(
  value: any,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

// Schemas pré-definidos para formulários comuns
export const schemas = {
  login: {
    email: [
      validationRules.required('Email é obrigatório'),
      validationRules.email()
    ],
    senha: [
      validationRules.required('Senha é obrigatória'),
      validationRules.minLength(6, 'A senha deve ter pelo menos 6 caracteres')
    ]
  },

  registro: {
    nome: [
      validationRules.required('Nome é obrigatório'),
      validationRules.minLength(2, 'Nome deve ter pelo menos 2 caracteres'),
      validationRules.maxLength(100, 'Nome deve ter no máximo 100 caracteres')
    ],
    email: [
      validationRules.required('Email é obrigatório'),
      validationRules.email()
    ],
    telefone: [
      validationRules.required('Telefone é obrigatório'),
      validationRules.phone()
    ],
    senha: [
      validationRules.required('Senha é obrigatória'),
      validationRules.minLength(6, 'A senha deve ter pelo menos 6 caracteres'),
      validationRules.matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
      )
    ],
    confirmarSenha: [
      validationRules.required('Confirmação de senha é obrigatória')
    ]
  },

  produto: {
    nome: [
      validationRules.required('Nome do produto é obrigatório'),
      validationRules.minLength(3, 'Nome deve ter pelo menos 3 caracteres'),
      validationRules.maxLength(200, 'Nome deve ter no máximo 200 caracteres')
    ],
    descricao: [
      validationRules.required('Descrição é obrigatória'),
      validationRules.minLength(10, 'Descrição deve ter pelo menos 10 caracteres'),
      validationRules.maxLength(5000, 'Descrição deve ter no máximo 5000 caracteres')
    ],
    preco: [
      validationRules.required('Preço é obrigatório'),
      validationRules.number(),
      validationRules.min(0.01, 'Preço deve ser maior que zero')
    ],
    categoria: [
      validationRules.required('Categoria é obrigatória')
    ],
    status: [
      validationRules.required('Status é obrigatório'),
      validationRules.oneOf(['ativo', 'inativo', 'vendido', 'rascunho'])
    ]
  },

  perfil: {
    nome: [
      validationRules.required('Nome é obrigatório'),
      validationRules.minLength(2, 'Nome deve ter pelo menos 2 caracteres')
    ],
    email: [
      validationRules.required('Email é obrigatório'),
      validationRules.email()
    ],
    telefone: [
      validationRules.phone()
    ]
  }
};

// Hook para usar validação em componentes React
export function useValidation(schema: ValidationSchema) {
  const validateForm = (data: Record<string, any>): { isValid: boolean; errors: ValidationErrors } => {
    const errors = validate(data, schema);
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const validateFieldValue = (field: string, value: any): string | null => {
    if (!schema[field]) return null;
    return validateField(value, schema[field]);
  };

  return {
    validateForm,
    validateField: validateFieldValue
  };
}
