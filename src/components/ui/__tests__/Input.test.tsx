import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../Input'

describe('Input - Testes Simples', () => {
  it('deve renderizar com placeholder', () => {
    render(<Input placeholder="Digite aqui" />)
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument()
  })

  it('deve renderizar com label', () => {
    render(<Input label="Nome" />)
    expect(screen.getByText('Nome')).toBeInTheDocument()
  })

  it('deve renderizar com valor inicial', () => {
    render(<Input value="Valor inicial" onChange={() => {}} />)
    expect(screen.getByDisplayValue('Valor inicial')).toBeInTheDocument()
  })

  it('deve chamar onChange quando o valor muda', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'novo valor' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('deve mostrar erro quando error é fornecido', () => {
    render(<Input error="Campo obrigatório" />)
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
  })

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
