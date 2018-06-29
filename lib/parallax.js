import z from './zombular.js';
import "./pixi.min.js"

const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const CIRCLE_THRESHOLD = 1.12;
const STARS_NUMBER = Math.floor(screen.width / 100);
const BGLAYERS_NUMBER = 5;
const STAR_RADIUS = 1.5;
const STAR_SPEED = 1;
const ROTATION_SPEED = 0.03;

const OPTIONS = {
    autoStart: false,
    roundPixels: true,
}

function createRadialGradient(width, height, x0, y0, r0, x1, y1, r1, colors) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');

    let gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    colors.forEach(([x, i]) => gradient.addColorStop(x, i));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
}

const app = new PIXI.Application(window.innerWidth, window.innerHeight, OPTIONS);
document.body.appendChild(app.view);

app.loader
  .add(data.objects)
  .load(setup);

function resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    app.renderer.resize(w, h);

    app.stage.removeChildAt(0);
    app.stage.addChildAt(createRadialGradient(w, h, w/2, h, h/4, w/2, h, h,
      [[0, '#1b2735'], [1, '#090a0f']]), 0);
}

function setup(loader, resources) {
    app.stage.addChild(createRadialGradient(app._options.width, app._options.height,
        app._options.width/2, app._options.height, app._options.height/4,
        app._options.width/2, app._options.height, app._options.height,
        [[0, '#1b2735'], [1, '#090a0f']]));

    const stars = new PIXI.Container();

    for (let i = BGLAYERS_NUMBER; i > 0; i--) {
        for (let j = 0; j < STARS_NUMBER; j++) {
            let g = new PIXI.Graphics();
            let r = Math.round(STAR_RADIUS / i * 100) / 100;

            g.beginFill(0xFFFFFF);
            if( r >= CIRCLE_THRESHOLD ) g.arcTo(0, 0, r, 0, 2 * Math.PI, false);
            else g.drawRect(0, 0, r * 3, r * 3);
            g.endFill();

            g.x = randInt(0, app._options.width);
            g.y = randInt(0, app._options.height);
            g.s = Math.round(STAR_SPEED / i * 100) / 100

            stars.addChild(g);
        }
    }

    app.stage.addChild(stars);

    const objects = new PIXI.Container();

    for (let img of data.objects) {
        let texture = resources[img].texture;
        let obj = new PIXI.Sprite(texture);

        obj.x = randInt(0, app._options.width);
        obj.y = randInt(0, app._options.height);
        obj.rotation = randInt(0, 360);

        obj.s = Math.round(STAR_SPEED / randInt(1, BGLAYERS_NUMBER) * 100) / 100;
        obj.as = Math.round(ROTATION_SPEED / randInt(1, BGLAYERS_NUMBER) * 100) / 100;

        let size = randInt(16, Math.min(texture.orig.width, texture.orig.height, 48) * 2);
        obj.height = size;
        obj.width = (texture.orig.width * size) / texture.orig.height;

        obj.anchor.set(0.5);

        objects.addChild(obj);
    }

    app.stage.addChild(objects);

    app.renderer.plugins.prepare.upload(app.stage, _ => app.start());

    window.addEventListener('deviceOrientation', resize, false);
    window.addEventListener('resize', resize, false);

    let pause = false;
    document.addEventListener("webkitvisibilitychange", _ => (pause = document.webkitHidden), false);

    function stepPosition(obj) {
        if (obj.y < app._options.height + obj.height) {
            obj.y += obj.s;
        } else {
            obj.x = randInt(0, app._options.width);
            obj.y = obj.y % app._options.height - Math.max(obj.height, randInt(0, app._options.height/4));
        }
    }

    app.ticker.speed = 0.5;
    app.ticker.add(dt => {
        if (pause) return;
        stars.children.forEach(stepPosition);
        objects.children.forEach(obj => {
            stepPosition(obj);
            obj.rotation += obj.as;
            obj.rotation = obj.rotation % 360;
        });
    })
}
