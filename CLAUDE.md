# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Landing page estática de **Thiago Almeida, especialista em tecnologia da informação e consultor de infraestrutura de TI**. Todo o conteúdo do site é em português do Brasil (`lang="pt-BR"`).

Não há build, dependências, linter nem testes. As únicas dependências externas são as fontes Unbounded e Hanken Grotesk, carregadas do Google Fonts. A única parte com servidor é o formulário de contato (`enviar.php`, PHP).

```
index.html       marcação da página
contato.html     página com o formulário de contato (nome, e-mail, telefone, mensagem)
enviar.php       recebe o formulário, valida, envia e-mail e guarda em data/mensagens.txt (ignorado pelo git)
js/contato.js    validação do formulário e envio por fetch
css/style.css    todo o CSS (não use <style> nem style="" no HTML)
js/script.js     ano do rodapé + animação da rede no hero (canvas)
assets/img/      pasta para imagens (hoje vazia, o site não usa fotos)
```

## Como rodar

O projeto fica dentro do `htdocs` do XAMPP, então com o Apache ligado ele abre em:

- `http://localhost/claudinho/`

Sem o Apache, use o servidor embutido do PHP do XAMPP (configurado como `site` em `.claude/launch.json`):

```bash
C:/xampp/php/php.exe -S localhost:8080 -t C:/xampp/htdocs/claudinho
```

O painel de navegador do app mostra `file://` como cópia avulsa, sem carregar `css/` e `js/`, então use um desses servidores para conferir a página.

## Direção visual

Tema escuro com roxo e neon. Tudo é variável CSS em `:root` de `css/style.css`; use as variáveis em vez de valores fixos.

- **Cores**: fundo violeta quase preto (`--fundo`), superfícies (`--superficie`, `--superficie-2`), bordas (`--linha`), roxo (`--roxo`, `--roxo-vivo`), neon (`--neon`, `--magenta`). O verde `--sinal` aparece só no ponto de status do hero.
- **Tipografia**: Unbounded nos títulos (`--fonte-titulo`), Hanken Grotesk no texto (`--fonte-corpo`). Títulos sem destaque de uma palavra só, sem rótulos em caixa-alta.
- **Elemento memorável**: a rede de nós do hero (`<canvas id="rede">`, desenhada em `js/script.js`). Os pacotes de dados correm pelos elos e as linhas reagem ao mouse. Pausa fora da tela e desenha um quadro estático com `prefers-reduced-motion`. O resto da página é quieto, sem animações de entrada.
- **Serviços**: lista de "unidades de rack" (`.rack` / `.unidade`, com parafusos e LED), não cards iguais.
- **Método**: trilha de 4 etapas numeradas (`.trilha` / `.passo`). A numeração só existe porque é uma sequência real.
- **Responsivo**: breakpoints em `900px` e `640px` (o menu some e a trilha vira vertical). Para checar 390px, use um iframe de 390px de largura: o Edge headless não renderiza janelas tão estreitas.

## Seções

`#inicio` (hero com a rede), `#servicos`, `#metodo`, `#sobre`, `#contato`, depois o `footer`.

## Conteúdo que precisa ser real

- Não há números de credibilidade (anos de experiência, quantidade de projetos) nem lista de clientes: foram removidos por serem inventados. Só adicione quando houver dados reais, e logos só de clientes que autorizarem.
- O LinkedIn real é `https://www.linkedin.com/in/thiagoalmeida27/`.
- O Instagram (`https://instagram.com/thiagoalmeida`) é um valor provisório. Confirme o perfil real.

## Dados de contato

Aparecem no topo (botão), no hero, no `#contato` e nos links do WhatsApp. Ao alterar algum, atualize todas as ocorrências:

- Telefone/WhatsApp: (67) 98402-6511, com links `tel:+5567984026511` e `https://wa.me/5567984026511` (os botões usam `?text=` com mensagem pronta)
- E-mail: `thiagoalmeida@live.com` (link `mailto:`)
