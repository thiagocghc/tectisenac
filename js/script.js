(function () {
    var ano = document.getElementById("ano");
    if (ano) ano.textContent = new Date().getFullYear();

    var canvas = document.getElementById("rede");
    var hero = document.getElementById("inicio");
    if (!canvas || !canvas.getContext || !hero) return;

    var ctx = canvas.getContext("2d");
    var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var NEON = "194, 107, 255";
    var MAGENTA = "255, 79, 216";
    var w = 0, h = 0, alcance = 150;
    var nos = [], pacotes = [], elos = [];
    var mouse = { x: -9999, y: -9999 };
    var rodando = false, visivel = true, raf = 0;

    function criar() {
        var total = Math.round(Math.min(52, Math.max(20, (w * h) / 20000)));
        nos = [];
        pacotes = [];
        for (var i = 0; i < total; i++) {
            var hub = Math.random() < 0.14;
            nos.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: hub ? 3.4 : 1.4 + Math.random() * 1.4,
                hub: hub
            });
        }
    }

    function medir() {
        var caixa = canvas.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = caixa.width;
        h = caixa.height;
        alcance = Math.max(110, Math.min(170, w / 7));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        criar();
        desenhar();
    }

    function mover() {
        for (var i = 0; i < nos.length; i++) {
            var n = nos[i];
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        }
    }

    function desenhar() {
        ctx.clearRect(0, 0, w, h);
        elos.length = 0;

        for (var i = 0; i < nos.length; i++) {
            for (var j = i + 1; j < nos.length; j++) {
                var dx = nos[i].x - nos[j].x;
                var dy = nos[i].y - nos[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < alcance) {
                    var forca = 1 - d / alcance;
                    ctx.strokeStyle = "rgba(" + NEON + "," + (forca * 0.5).toFixed(3) + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nos[i].x, nos[i].y);
                    ctx.lineTo(nos[j].x, nos[j].y);
                    ctx.stroke();
                    elos.push([i, j]);
                }
            }
        }

        for (var k = 0; k < nos.length; k++) {
            var n = nos[k];
            var mx = n.x - mouse.x;
            var my = n.y - mouse.y;
            var dm = Math.sqrt(mx * mx + my * my);
            if (dm < alcance * 1.3) {
                ctx.strokeStyle = "rgba(" + MAGENTA + "," + ((1 - dm / (alcance * 1.3)) * 0.6).toFixed(3) + ")";
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
            if (n.hub) {
                ctx.strokeStyle = "rgba(" + NEON + ",0.35)";
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.fillStyle = "rgba(" + NEON + "," + (n.hub ? 0.95 : 0.7) + ")";
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (var p = pacotes.length - 1; p >= 0; p--) {
            var pk = pacotes[p];
            var a = nos[pk.a];
            var b = nos[pk.b];
            var ddx = a.x - b.x;
            var ddy = a.y - b.y;
            if (pk.t >= 1 || Math.sqrt(ddx * ddx + ddy * ddy) > alcance) {
                pacotes.splice(p, 1);
                continue;
            }
            var x = a.x + (b.x - a.x) * pk.t;
            var y = a.y + (b.y - a.y) * pk.t;
            ctx.fillStyle = "rgba(" + MAGENTA + ",0.25)";
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgb(" + MAGENTA + ")";
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
            if (!reduzir) pk.t += pk.v;
        }

        if (reduzir && pacotes.length === 0) semear(6);
    }

    function semear(qtd) {
        for (var i = 0; i < qtd && elos.length; i++) {
            var e = elos[Math.floor(Math.random() * elos.length)];
            pacotes.push({ a: e[0], b: e[1], t: Math.random(), v: 0.006 + Math.random() * 0.008 });
        }
    }

    function quadro() {
        mover();
        if (pacotes.length < 9 && Math.random() < 0.06) semear(1);
        desenhar();
        raf = requestAnimationFrame(quadro);
    }

    function iniciar() {
        if (reduzir || rodando || !visivel || document.hidden) return;
        rodando = true;
        raf = requestAnimationFrame(quadro);
    }

    function parar() {
        rodando = false;
        cancelAnimationFrame(raf);
    }

    hero.addEventListener("pointermove", function (e) {
        var caixa = canvas.getBoundingClientRect();
        mouse.x = e.clientX - caixa.left;
        mouse.y = e.clientY - caixa.top;
    });

    hero.addEventListener("pointerleave", function () {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) parar(); else iniciar();
    });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entradas) {
            visivel = entradas[0].isIntersecting;
            if (visivel) iniciar(); else parar();
        }).observe(hero);
    }

    var espera = 0;
    window.addEventListener("resize", function () {
        clearTimeout(espera);
        espera = setTimeout(medir, 150);
    });

    medir();
    if (reduzir) { desenhar(); } else { iniciar(); }
})();
