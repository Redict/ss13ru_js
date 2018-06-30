import z from './zombular.js';

const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const CIRCLE_THRESHOLD = 1.12;
const STARS_NUMBER = Math.floor(screen.width / 100);
const BGLAYERS_NUMBER = 5;
const STAR_RADIUS = 1.5;
const STAR_SPEED = 0.03;

class Parallax {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.BGLayers = [];

        for (let i = BGLAYERS_NUMBER; i > 0; i--) {
        	let stars = [];
        	for (let j = 0; j < STARS_NUMBER; j++) {
        		stars.push({
        			x: randInt(0, canvas.width),
        			y: randInt(0, canvas.height),
        			r: Math.round(STAR_RADIUS / i * 100) / 100,
        			s: Math.round(STAR_SPEED / i * 100) / 100,
        		})
        	}
        	this.BGLayers.push(stars);
        }

        this.icons = [];
        for (let obj of data.objects) this.addIcon(`./assets/objects/${obj}.png`);

        this.last = 0;

        let parallax = this;
        this.pause = false;
        document.addEventListener("webkitvisibilitychange", function() {
        	parallax.pause = document.webkitHidden;
        }, false);

        this._update = this.update.bind(this);
        requestAnimationFrame(this._update, this.canvas);
    }

    addIcon(url) {
        let icon = {
            x: randInt(0, this.canvas.width),
            y: randInt(0, this.canvas.height),
            a: randInt(0, 360),
            as: Math.round(STAR_SPEED / randInt(1, BGLAYERS_NUMBER) * 100) / 100,
            s: Math.round(STAR_SPEED / randInt(1, BGLAYERS_NUMBER) * 100) / 100,
            loaded: false
        };
        icon.image = new Image;
        icon.image.onload = function() {
            icon.loaded = true;
            let size = randInt(16, Math.min(icon.image.width, icon.image.height, 48) * 2);
            icon.h = size;
            icon.w = (icon.image.width * size) / icon.image.height;
        }
        icon.image.src = url;
        this.icons.push(icon);
    }

    resize() {
        this.canvas.width = window.outerWidth;
    	this.canvas.height = window.outerHeight;

        this.spaceGradient = this.ctx.createRadialGradient(this.canvas.width/2,
            this.canvas.height, this.canvas.height/4, this.canvas.width/2,
            this.canvas.height, this.canvas.height);
		this.spaceGradient.addColorStop(0, '#1b2735');
		this.spaceGradient.addColorStop(1, '#090a0f');
    }

    update(now) {
        let dt = now - this.last;
    	this.last = now;

    	requestAnimationFrame(this._update, this.canvas);

    	if (this.pause) return;

    	this.ctx.fillStyle = this.spaceGradient;
    	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = '#FFF';

    	for (let layer of this.BGLayers) {
    		for (let star of layer) {
    			if (star.y < this.canvas.height) {
    				star.y += star.s * dt;
    			} else {
    				star.x = randInt(0, this.canvas.width);
    				star.y = star.y % this.canvas.height - randInt(0, this.canvas.height/4);
    			}

    			if( star.r >= CIRCLE_THRESHOLD ) {
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI, false);
                    this.ctx.fill();
                } else {
                    let pixelSize = star.r * 3;
                    this.ctx.fillRect(star.x, star.y, pixelSize, pixelSize);
                }
    		}
    	}

        for (let icon of this.icons) {
            if (icon.y < this.canvas.height) {
                icon.y += icon.s * dt;
            } else {
                icon.x = randInt(0, this.canvas.width);
                icon.y = icon.y % this.canvas.height - icon.h*2;
            }

            icon.a += icon.as * dt
            icon.a = icon.a % 360;

            if (icon.loaded) {
                this.ctx.save();
                this.ctx.translate(icon.x + icon.w/2, icon.y + icon.h/2);
                this.ctx.rotate(icon.a*Math.PI/180);
                this.ctx.translate(-icon.x - icon.w/2, -icon.y - icon.h/2);
                this.ctx.drawImage(icon.image, icon.x, icon.y, icon.w, icon.h);
                this.ctx.restore();
            }
        }
    }
}

export default z._canvas({on$created: e => new Parallax(e.target)});
