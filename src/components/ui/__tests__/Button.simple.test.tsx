import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button - Testes Simples', () => {
  it('deve renderizar o texto do botão', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clique aqui</Button>)
    
    fireEvent.click(screen.getByText('Clique aqui'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>)
    expect(screen.getByText('Desabilitado')).toBeDisabled()
  })

  it('deve mostrar loading quando loading=true', () => {
    render(<Button loading>Carregando</Button>)
    expect(screen.getByText('Carregando')).toBeInTheDocument()
  })
})
