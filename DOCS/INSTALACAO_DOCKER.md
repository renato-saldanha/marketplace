# 📦 Guia de Instalação do Docker - Windows

## ⚠️ Status Atual

O Docker **não está instalado** ou não está configurado corretamente no sistema.

## 🎯 Instalação do Docker Desktop (Recomendado)

### Passo 1: Download

1. Acesse: https://www.docker.com/products/docker-desktop/
2. Clique em **Download for Windows**
3. Aguarde o download do instalador

### Passo 2: Requisitos do Sistema

Antes de instalar, verifique:

- ✅ Windows 10/11 (64-bit)
- ✅ WSL 2 habilitado (recomendado)
- ✅ Virtualização habilitada na BIOS
- ✅ 4GB+ de RAM

### Passo 3: Habilitar WSL 2 (Recomendado)

Abra o PowerShell como **Administrador** e execute:

```powershell
# Habilitar WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Habilitar Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Reiniciar o computador
Restart-Computer
```

Após reiniciar, abra o PowerShell como **Administrador** novamente:

```powershell
# Definir WSL 2 como padrão
wsl --set-default-version 2

# Instalar distribuição Ubuntu (opcional)
wsl --install -d Ubuntu
```

### Passo 4: Instalar Docker Desktop

1. Execute o instalador baixado
2. Marque a opção **Use WSL 2 instead of Hyper-V** (recomendado)
3. Siga o assistente de instalação
4. Reinicie o computador quando solicitado

### Passo 5: Configurar Docker Desktop

1. Abra o Docker Desktop
2. Aguarde a inicialização (pode levar alguns minutos)
3. Aceite os termos de uso
4. (Opcional) Faça login com conta Docker Hub

### Passo 6: Verificar Instalação

Abra o PowerShell e execute:

```powershell
docker --version
docker compose version
```

Se ver as versões, está tudo OK! ✅

---

## 🐧 Alternativa: Docker Toolbox (Sistemas mais antigos)

Se seu sistema não suporta Docker Desktop:

1. Acesse: https://github.com/docker/toolbox/releases
2. Baixe o Docker Toolbox
3. Instale seguindo o assistente
4. Use o **Docker Quickstart Terminal**

---

## ⚙️ Configurações Recomendadas

### Recursos do Docker Desktop

1. Abra Docker Desktop
2. Vá em **Settings** (ícone de engrenagem)
3. Em **Resources**:
   - **CPUs**: Mínimo 2, recomendado 4
   - **Memory**: Mínimo 4GB, recomendado 8GB
   - **Disk**: Mínimo 20GB

### WSL Integration

1. Em **Settings** > **Resources** > **WSL Integration**
2. Marque as distribuições que deseja usar
3. Clique em **Apply & restart**

---

## 🔍 Troubleshooting

### Erro: "WSL 2 installation is incomplete"

```powershell
# Baixar e instalar o kernel WSL 2
# Link: https://aka.ms/wsl2kernel
# Após instalar, reinicie o Docker Desktop
```

### Erro: "Docker Desktop não inicia"

1. Verifique se a virtualização está habilitada na BIOS
2. Reinicie o serviço:
   ```powershell
   Restart-Service -Name com.docker.service
   ```
3. Reinicie o computador

### Erro: "Cannot connect to Docker daemon"

```powershell
# Verifique se o Docker Desktop está rodando
Get-Process "*docker*"

# Se não estiver, abra o Docker Desktop
```

### Erro de permissão

1. Execute o PowerShell como **Administrador**
2. Adicione seu usuário ao grupo docker-users:
   ```powershell
   net localgroup docker-users "SEU_USUARIO" /add
   ```
3. Faça logout e login novamente

---

## ✅ Checklist Pós-Instalação

Após instalar o Docker, execute:

```powershell
# 1. Verificar versões
docker --version
docker compose version

# 2. Testar Docker
docker run hello-world

# 3. Ver informações do sistema
docker info

# 4. Listar containers
docker ps -a

# 5. Listar imagens
docker images
```

---

## 🚀 Próximos Passos

Após instalar o Docker com sucesso:

### 1. Voltar para o diretório do projeto
```powershell
cd F:\Projetos\marketplace
```

### 2. Usar o script de inicialização
```powershell
.\docker-start.ps1
```

### 3. OU iniciar manualmente
```powershell
# Primeira vez (com build)
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Acessar aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:8000/docs
```

---

## 📚 Recursos Úteis

- [Documentação Oficial Docker](https://docs.docker.com/)
- [Docker Desktop para Windows](https://docs.docker.com/desktop/install/windows-install/)
- [WSL 2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Hub](https://hub.docker.com/)

---

## 💡 Dicas

1. ✅ Docker Desktop usa recursos do sistema mesmo quando não está rodando containers
2. ✅ Você pode pausar o Docker Desktop quando não estiver usando
3. ✅ Use WSL 2 para melhor performance
4. ✅ Configure recursos (RAM, CPU) de acordo com sua necessidade
5. ✅ Mantenha o Docker Desktop atualizado

---

## 🆘 Precisa de Ajuda?

Se tiver problemas:

1. Verifique os logs do Docker Desktop
2. Consulte a [documentação oficial](https://docs.docker.com/desktop/troubleshoot/overview/)
3. Busque no [Docker Forum](https://forums.docker.com/)
4. Verifique [Stack Overflow](https://stackoverflow.com/questions/tagged/docker)

---

## ⏭️ Depois de Instalar

1. ✅ Reinicie o PowerShell/Terminal
2. ✅ Execute: `docker --version` para confirmar
3. ✅ Volte ao projeto e execute: `.\docker-start.ps1`
4. ✅ Aguarde o build e inicialização
5. ✅ Acesse: http://localhost:3000

**Tudo pronto para desenvolver! 🎉**

