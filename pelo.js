//Sim, isso é uma gambiarra de gente preguiçosa.
//Não me julge.
var Seletor;
(function (Seletor) {
    function base64Encode(str) {
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = str.length, c1, c2, c3;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += CHARS.charAt(c3 & 0x3F);
        }
        return out;
    }
    Seletor.base64Encode = base64Encode;
    var PeloLoader = /** @class */ (function () {
        function PeloLoader(imagem, oncomplete) {
            jQuery.ajax({
                url: imagem,
                dataType: 'text',
                mimeType: "text/plain; charset=x-user-defined",
                crossDomain: true,
                success: function (data, status, xhr) {
                    oncomplete(null, data, xhr.getResponseHeader("content-type"));
                },
                error: function (xhr, textStatus, errorThrow) {
                    oncomplete(errorThrow, null);
                }
            });
        }
        return PeloLoader;
    }());
    Seletor.PeloLoader = PeloLoader;
    var Pelo = /** @class */ (function () {
        function Pelo(url) {
            this.tamanho = new Object();
            var self = this;
            this.elem = document.createElement('div');
            this.elem.className = 'pelo';
            new PeloLoader(url, function (erro, data, tipo) {
                self.imagem = new Image();
                self.imagem.className = 'img-pelo';
                self.imagem.onload = function (e) {
                    self.imagemCarregada();
                };
                self.imagem.onerror = function (e) {
                    self.erroCarregamento(e);
                };
                if (data) {
                    self.imagem.src = 'data:' + tipo + ';base64,' + base64Encode(data);
                }
                else {
                    self.imagem.crossOrigin = "Anonymous";
                    self.imagem.src = url;
                }
            });
        }
        Pelo.prototype.carregar = function (url, crossOrigin) {
            if (crossOrigin === void 0) { crossOrigin = ""; }
        };
        Pelo.prototype.erroCarregamento = function (e) {
            console.log('cors: ' + e.target.crossOrigin);
            if (e.target.crossOrigin == Pelo.CORS_ANONYMOUS) {
                this.carregar(e.target.src, Pelo.CORS_NONE);
            }
            else {
                this.elem.innerHTML = '<span style="display: block; font-size: 18px; color: coral; text-align: center; word-wrap: break-word">Error</span>';
                this.elem.style.visibility = "visible";
                this.elem.style.opacity = "1";
            }
        };
        Pelo.prototype.imagemCarregada = function () {
            var self = this;
            Seletor.pelosCarregados++;
            document.getElementById('listaPelos').getElementsByTagName('t2')[0].innerHTML = (navigator.language.indexOf("pt") == 0 ? Seletor.pelosCarregados + " pelos carregados de " + Seletor.quantPelos : "Loaded " + Seletor.pelosCarregados + " of " + Seletor.quantPelos + " furs");
            this.tamanho.height = this.imagem.height;
            this.tamanho.width = this.imagem.width;
            this.imagemDesenho = new Image();
            this.imagemDesenho.className = 'img-desenho';
            this.imagemDesenho.src = this.imagem.src;
            this.elem.appendChild(this.imagemDesenho);
            this.imagem.pelo = this;
            this.elem.appendChild(this.imagem);
            this.elem.style.cursor = "hand";
            this.elem.style.visibility = "visible";
            this.elem.style.opacity = "1";
            this.elem.onclick = function () {
                Seletor.desenharNoCanvas(self.imagemDesenho);
            };
        };
        Pelo.CORS_ANONYMOUS = "Anonymous";
        Pelo.CORS_NONE = "";
        return Pelo;
    }());
    Seletor.Pelo = Pelo;
})(Seletor || (Seletor = {}));
