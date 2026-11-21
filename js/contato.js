(function () {
    var form = document.getElementById("form-contato");
    if (!form) return;

    var botao = document.getElementById("btn-enviar");
    var status = document.getElementById("form-status");
    var campos = ["nome", "email", "telefone", "mensagem"];

    function validar(nome, valor) {
        valor = valor.trim();
        if (nome === "nome") {
            if (valor.length < 3) return "Informe seu nome completo.";
        } else if (nome === "email") {
            if (!valor) return "Informe seu e-mail.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return "Informe um e-mail válido, como nome@exemplo.com.";
        } else if (nome === "telefone") {
            var digitos = valor.replace(/\D/g, "");
            if (!digitos) return "Informe seu telefone.";
            if (digitos.length < 10 || digitos.length > 13) return "Informe o telefone com DDD, por exemplo (67) 98402-6511.";
        } else if (nome === "mensagem") {
            if (valor.length < 10) return "Escreva uma mensagem com pelo menos 10 caracteres.";
        }
        return "";
    }

    function mostrarErro(nome, texto) {
        var campo = form.elements[nome];
        var aviso = document.getElementById("erro-" + nome);
        aviso.textContent = texto;
        if (texto) campo.setAttribute("aria-invalid", "true");
        else campo.removeAttribute("aria-invalid");
    }

    function validarCampo(nome) {
        var erro = validar(nome, form.elements[nome].value);
        mostrarErro(nome, erro);
        return !erro;
    }

    function definirStatus(texto, tipo) {
        status.textContent = texto;
        status.className = "form-status" + (tipo ? " " + tipo : "");
    }

    campos.forEach(function (nome) {
        var campo = form.elements[nome];
        campo.addEventListener("blur", function () { validarCampo(nome); });
        campo.addEventListener("input", function () {
            if (campo.getAttribute("aria-invalid")) validarCampo(nome);
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        definirStatus("");

        var primeiroInvalido = null;
        campos.forEach(function (nome) {
            if (!validarCampo(nome) && !primeiroInvalido) primeiroInvalido = form.elements[nome];
        });
        if (primeiroInvalido) {
            primeiroInvalido.focus();
            return;
        }

        botao.disabled = true;
        botao.textContent = "Enviando...";

        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { "Accept": "application/json" }
        })
            .then(function (resposta) {
                return resposta.json().then(function (dados) {
                    return { ok: resposta.ok && dados.ok, dados: dados };
                });
            })
            .then(function (r) {
                if (r.ok) {
                    form.reset();
                    definirStatus("Mensagem enviada! Retorno em breve pelo e-mail ou telefone informado.", "ok");
                } else {
                    var erros = r.dados && r.dados.erros;
                    if (erros) {
                        Object.keys(erros).forEach(function (nome) { mostrarErro(nome, erros[nome]); });
                    }
                    definirStatus((r.dados && r.dados.mensagem) || "Não foi possível enviar. Tente novamente ou chame no WhatsApp.", "erro");
                }
            })
            .catch(function () {
                definirStatus("Não foi possível enviar agora. Tente novamente ou chame no WhatsApp: (67) 98402-6511.", "erro");
            })
            .then(function () {
                botao.disabled = false;
                botao.textContent = "Enviar";
            });
    });
})();
