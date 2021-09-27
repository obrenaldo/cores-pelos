/// <reference path="types/jquery/index.d.ts" />
/// <reference path="./pelo.ts" />
var Seletor;
(function (Seletor) {
    var canvasCtx;
    Seletor.quantPelos = "?";
    Seletor.pelosCarregados = 0;
    function iniciar() {
        canvasCtx = document.getElementById('peloAtual').getElementsByTagName('canvas')[0].getContext('2d');
        jQuery.ajax({ url: "pelos.xml?" + new Date().getTime() }).done(function (resposta) {
            if (!resposta)
                return;
            var xml = $(resposta);
            Seletor.quantPelos = xml.find('pelo').length.toString();
            xml.find("pelo").each(function (index, item) {
                var img = item.getAttribute('src');
                var pelo = new Seletor.Pelo(img);
                document.getElementById('listaPelos').appendChild(pelo.elem);
            });
        });
        canvasCtx.canvas.addEventListener('mousemove', canvasMouseMove);
        canvasCtx.canvas.addEventListener('click', canvasMouseClick);
        document.getElementById('corAtual').addEventListener('mousemove', canvasMouseMove);
        canvasCtx.canvas.addEventListener('mouseleave', function () {
            document.getElementById('corAtual').style.display = 'none';
        });
        document.getElementById('campoHex').addEventListener('click', document.getElementById('campoHex').select);
        document.getElementById('peloAtual').getElementsByTagName('t')[0].innerHTML = (navigator.language.indexOf("pt") == 0 ? "Clique sobre o local desejado para capturar a cor." : "Use the mouse cursor to capture the color you want.");
    }
    window.addEventListener('load', iniciar);
    function desenharNoCanvas(imagem) {
        document.getElementById('peloAtual').style.visibility = 'visible';
        canvasCtx.clearRect(0, 0, 55555, 55555);
        drawImageProp(canvasCtx, imagem, 0, 0, 233, 266);
    }
    Seletor.desenharNoCanvas = desenharNoCanvas;
    function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
        if (arguments.length === 2) {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }
        /// default offset is center
        offsetX = offsetX ? offsetX : 0.5;
        offsetY = offsetY ? offsetY : 0.5;
        /// keep bounds [0.0, 1.0]
        if (offsetX < 0)
            offsetX = 0;
        if (offsetY < 0)
            offsetY = 0;
        if (offsetX > 1)
            offsetX = 1;
        if (offsetY > 1)
            offsetY = 1;
        var iw = img.width, ih = img.height, r = Math.min(w / iw, h / ih), nw = iw * r, /// new prop. width
        nh = ih * r, /// new prop. height
        cx, cy, cw, ch, ar = 1;
        /// decide which gap to fill    
        if (nw < w)
            ar = w / nw;
        if (nh < h)
            ar = h / nh;
        nw *= ar;
        nh *= ar;
        /// calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);
        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;
        /// make sure source rectangle is valid
        if (cx < 0)
            cx = 0;
        if (cy < 0)
            cy = 0;
        if (cw > iw)
            cw = iw;
        if (ch > ih)
            ch = ih;
        /// fill image in dest. rectangle
        ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }
    function canvasMouseMove(event) {
        if (event.target.tagName.toLowerCase() == 'span') {
            event.target.style.left = (event.target.offsetLeft + 2).toString() + 'px';
            event.target.style.top = (event.target.offsetTop + 2).toString() + 'px';
            return;
        }
        var data = canvasCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        if (data[3] == 0) {
            canvasCtx.canvas.style.cursor = "default";
            document.getElementById('corAtual').style.display = 'none';
            return;
        }
        canvasCtx.canvas.style.cursor = "crosshair";
        var hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
        document.getElementById('corAtual').style.display = 'block';
        document.getElementById('corAtual').style.backgroundColor = hex;
        document.getElementById('corAtual').style.left = (event.offsetX + 4).toString() + 'px';
        document.getElementById('corAtual').style.top = (event.offsetY + 4).toString() + 'px';
    }
    function canvasMouseClick(event) {
        var data = canvasCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        var hex;
        if (data[3] == 0) {
            hex = "";
            document.getElementById('campoHex').value = hex;
        }
        else {
            hex = ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
            document.getElementById('peloAtual').getElementsByClassName('cor')[0].style.backgroundColor = hex;
            document.getElementById('campoHex').value = hex;
            document.getElementById('campoHex').select();
            document.getElementById('campoHex').focus();
        }
    }
})(Seletor || (Seletor = {}));
