//Sim, isso é uma gambiarra de gente preguiçosa.
//Não me julge.

namespace Seletor {

    export interface ISize {
        width: number;
        height: number;
    }

    export interface IImagemPelo extends HTMLImageElement {
        pelo: Pelo;
    }

    export function base64Encode(str) {
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
                out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
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

    export class PeloLoader {
        public url: string;

        public constructor(imagem: string, oncomplete: Function) {
            jQuery.ajax({
                url: imagem,
                dataType: 'text',
                mimeType: "text/plain; charset=x-user-defined",
                crossDomain: true,
                success: function(data: string, status, xhr) {
                    oncomplete(null, data, xhr.getResponseHeader("content-type"));
                },
                error: function(xhr, textStatus, errorThrow) {
                    oncomplete(errorThrow, null);
                }
            });
        }
    }

    export class Pelo {
        private imagem: IImagemPelo;
        public imagemDesenho: HTMLImageElement;
        public elem: HTMLDivElement;
        public tamanho: ISize = new Object() as ISize;

        public static CORS_ANONYMOUS: string = "Anonymous";
        public static CORS_NONE: string = "";

        public constructor(url: string) {
            let self: Pelo = this;
            this.elem = document.createElement('div');
            this.elem.className = 'pelo';

            new PeloLoader(url, function(erro: string, data: string, tipo: string) {
                self.imagem = new Image() as IImagemPelo;
                self.imagem.className = 'img-pelo';
                self.imagem.onload = function(e: Event) {
                    self.imagemCarregada();
                };
                self.imagem.onerror = function(e: Event) {
                    self.erroCarregamento(e);
                }

                if (data) {
                    self.imagem.src = 'data:' + tipo + ';base64,' + base64Encode(data);
                } else {
                    self.imagem.crossOrigin = "Anonymous";
                    self.imagem.src = url;
                }
            });
        }

        public carregar(url: string, crossOrigin: string = "") {
            
        }

        public erroCarregamento(e: Event) {
            console.log('cors: ' + (e.target as HTMLImageElement).crossOrigin);
            if ((e.target as HTMLImageElement).crossOrigin == Pelo.CORS_ANONYMOUS) {
                this.carregar((e.target as HTMLImageElement).src, Pelo.CORS_NONE);
            } else {
                this.elem.innerHTML = '<span style="display: block; font-size: 18px; color: coral; text-align: center; word-wrap: break-word">Error</span>';
                this.elem.style.visibility = "visible";
                this.elem.style.opacity = "1";
            }
        }

        public imagemCarregada() {
            let self: Pelo = this;

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

            this.elem.onclick = function() {
               Seletor.desenharNoCanvas(self.imagemDesenho);
            }
        }
    }
}