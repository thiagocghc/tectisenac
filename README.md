# Landing Page — Thiago Almeida

Site de apresentação de **Thiago Almeida, especialista em tecnologia da informação e consultor de infraestrutura de TI**. O objetivo é apresentar os serviços e levar o visitante a pedir um orçamento, pelo WhatsApp ou pelo formulário de contato.

Todo o conteúdo é em português do Brasil (`lang="pt-BR"`).

## Páginas

| Página | Arquivo | O que tem |
|---|---|---|
| Início | `index.html` | Hero com animação de rede, serviços, método de trabalho, sobre e contato |
| Contato | `contato.html` | Formulário com nome, e-mail, telefone e mensagem |

### Seções do início

- `#inicio`: hero com a rede de nós animada (canvas).
- `#servicos`: lista de serviços no formato de "unidades de rack".
- `#metodo`: trilha de 4 etapas (diagnóstico, projeto, implantação, acompanhamento).
- `#sobre`: apresentação e ficha resumida.
- `#contato`: canais de contato (WhatsApp, telefone, e-mail, LinkedIn, Instagram).

## Tecnologias

- HTML, CSS e JavaScript puros, sem build, framework ou dependências.
- Fontes **Unbounded** e **Hanken Grotesk**, carregadas do Google Fonts.
- **PHP** apenas para receber o formulário de contato (`enviar.php`).

## Estrutura do projeto

```
index.html       página inicial
contato.html     página do formulário de contato
enviar.php       recebe o formulário, valida e envia por e-mail
css/style.css    todo o CSS do site (variáveis em :root)
js/script.js     ano do rodapé e animação da rede no hero
js/contato.js    validação e envio do formulário
data/            mensagens recebidas (mensagens.txt, fora do git) e .htaccess de proteção
assets/img/      pasta para imagens (hoje vazia)
CLAUDE.md        orientações para o Claude Code trabalhar no projeto
```

## Como rodar

O projeto está na pasta `htdocs` do XAMPP. Com o Apache ligado, abra:

- http://localhost/claudinho/

Sem o Apache, use o servidor embutido do PHP:

```bash
C:/xampp/php/php.exe -S localhost:8080 -t C:/xampp/htdocs/claudinho
```

E abra http://localhost:8080/. Abrir o `index.html` direto do disco (`file://`) funciona só em parte, por isso prefira um dos servidores acima.

## Formulário de contato

1. O visitante preenche **nome, e-mail, telefone e mensagem** em `contato.html`.
2. `js/contato.js` valida os campos no navegador e mostra o erro abaixo de cada um.
3. Os dados vão por `fetch` para `enviar.php`, que valida tudo de novo no servidor.
4. Se estiver válido, o PHP envia um e-mail para `thiagoalmeida@live.com` (com o e-mail do cliente em *Reply-To*) e grava uma cópia em `data/mensagens.txt`.

**Segurança**
- Campo oculto (isca) para barrar robôs.
- Remoção de quebras de linha nos campos de cabeçalho, contra injeção de cabeçalhos de e-mail.
- Limites de tamanho em todos os campos.
- `data/.htaccess` bloqueia o acesso direto às mensagens gravadas.

**Pendente:** o envio de e-mail depende do `mail()` do PHP, que exige um servidor SMTP configurado. No XAMPP isso não vem pronto, e o `enviar.php` ainda será configurado. Enquanto isso, as mensagens ficam salvas em `data/mensagens.txt`. O formulário também não funciona em hospedagens sem PHP, como o GitHub Pages.

## Identidade visual

Tema escuro com roxo e neon. As cores, fontes e o raio das bordas são variáveis CSS em `:root`, no início de `css/style.css`: use as variáveis em vez de valores fixos.

- **Responsivo:** breakpoints em `900px` e `640px`.
- **Animação:** a rede do hero pausa fora da tela e desenha um quadro estático para quem usa `prefers-reduced-motion`.
- **Regra de CSS:** nada de `<style>` ou `style=""` no HTML.

## Dados de contato

Aparecem no topo, no hero, em `#contato` e nos links do WhatsApp. Ao alterar algum, atualize todas as ocorrências:

- WhatsApp e telefone: (67) 98402-6511 (`tel:+5567984026511`, `https://wa.me/5567984026511`)
- E-mail: `thiagoalmeida@live.com`
- LinkedIn: https://www.linkedin.com/in/thiagoalmeida27/
- Instagram: `https://instagram.com/thiagoalmeida` (**valor provisório**, confirmar o perfil real)

## Conteúdo que precisa ser real

O site não traz números de credibilidade (anos de experiência, quantidade de projetos) nem lista de clientes, porque esses dados não são reais. Só adicione quando houver dados verdadeiros, e logos apenas de clientes que autorizarem.

## Fluxo de trabalho no Git

- A branch `main` é a versão publicada.
- Alterações novas vão em uma branch própria e entram na `main` por **pull request**, com aprovação do administrador.
- Mensagens de commit em português, descrevendo o que mudou.
