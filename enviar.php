<?php
// Recebe o formulário de contato (contato.html), valida e envia por e-mail.
// Toda mensagem válida também é guardada em data/mensagens.txt, para não se perder
// caso o servidor não consiga enviar e-mail.

const DESTINO = 'thiagoalmeida@live.com';

header('Content-Type: application/json; charset=UTF-8');

function responder(int $codigo, array $dados): void
{
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['ok' => false, 'mensagem' => 'Método não permitido.']);
}

// Campo isca: pessoas não veem, robôs preenchem. Finge sucesso e descarta.
if (!empty($_POST['site'])) {
    responder(200, ['ok' => true]);
}

// Remove quebras de linha para impedir injeção de cabeçalhos de e-mail.
function limpar(string $valor, int $max): string
{
    $valor = trim(preg_replace('/[\r\n]+/', ' ', $valor));
    return mb_substr($valor, 0, $max);
}

$nome     = limpar($_POST['nome'] ?? '', 100);
$email    = limpar($_POST['email'] ?? '', 150);
$telefone = limpar($_POST['telefone'] ?? '', 20);
$mensagem = mb_substr(trim($_POST['mensagem'] ?? ''), 0, 2000);

$erros = [];
if (mb_strlen($nome) < 3) {
    $erros['nome'] = 'Informe seu nome completo.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros['email'] = 'Informe um e-mail válido, como nome@exemplo.com.';
}
$digitos = preg_replace('/\D/', '', $telefone);
if (strlen($digitos) < 10 || strlen($digitos) > 13) {
    $erros['telefone'] = 'Informe o telefone com DDD, por exemplo (67) 98402-6511.';
}
if (mb_strlen($mensagem) < 10) {
    $erros['mensagem'] = 'Escreva uma mensagem com pelo menos 10 caracteres.';
}

if ($erros) {
    responder(422, ['ok' => false, 'mensagem' => 'Confira os campos destacados.', 'erros' => $erros]);
}

$corpo = "Nova mensagem pelo site\n\n"
    . "Nome: $nome\nE-mail: $email\nTelefone: $telefone\n\nMensagem:\n$mensagem\n";

// Guarda a mensagem (a pasta data/ é protegida por .htaccess).
$pasta = __DIR__ . '/data';
if (!is_dir($pasta)) {
    mkdir($pasta, 0755, true);
}
$registro = '[' . date('Y-m-d H:i:s') . "]\n" . $corpo . str_repeat('-', 40) . "\n";
$salvou = file_put_contents($pasta . '/mensagens.txt', $registro, FILE_APPEND | LOCK_EX) !== false;

$assunto = '=?UTF-8?B?' . base64_encode("Contato pelo site: $nome") . '?=';
$cabecalhos = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Reply-To: ' . $email,
];
$enviou = @mail(DESTINO, $assunto, $corpo, implode("\r\n", $cabecalhos));

if ($enviou || $salvou) {
    responder(200, ['ok' => true]);
}

responder(500, ['ok' => false, 'mensagem' => 'Não foi possível enviar. Tente novamente ou chame no WhatsApp.']);
