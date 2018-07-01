import './data.js';

import z from "./lib/zombular.js";
import './lib/pixilax.js';
//import Parallax from './lib/parallax.js'; // "FUCK GO BACK" compatibility!

import './lib/marked.min.js';

import './lib/moment.min.js';
moment.locale('ru');

const Styles = z._style(`
@import url("https://fonts.googleapis.com/css?family=Comfortaa");
@import url("https://fonts.googleapis.com/css?family=PT+Sans");

@import url("https://use.fontawesome.com/releases/v5.1.0/css/all.css");

body { margin: 0; overflow: hidden; font-family: Comfortaa, cursive; font-size: 15px; }
.overlay { position: absolute; height: 100%; width: 100%; top: 0; left: 0; color: #fff;
    overflow: auto; }

.main { max-width: 65em; margin: 45px auto; }
.menu .hamburger { display: none; }
.menu .scrollinks { overflow-y: hidden; max-height: 0; transition: max-height .3s; }
.menu .scrollinks::-webkit-scrollbar { height: 0px; background: transparent; }

@media (max-width: 980px) {
    .servers { display: none; }
    .main { margin: 0; }
}

@media (max-width: 769px) {
    .main .links { display: none; }
    .menu .hamburger { display: flex; }
    .menu.opened .scrollinks { max-height: 96px; }
}

.sp05 { margin-top: 7.5px; }
.sp1 { margin-top: 15px; }
.sp2 { margin-top: 30px; }

.spb0 { margin-bottom: 0; }

.spl05 { margin-left: 7px; }
.spl1 { margin-left: 15px; }
.spl2 { margin-left: 30px; }

.spr1 { margin-right: 15px; }

.wb { font-weight: bold; }

.flex { display: flex; }
.flex.nowrap { flex-wrap: nowrap; }
.flex.wrap { flex-wrap: wrap; }
.flex.reverse { flex-direction: row-reverse; }
.flex.centered { align-items: center; }
.s1 { flex: 1; }
.s2 { flex: 2; }
.s3 { flex: 3; }
.s4 { flex: 4; }
.s5 { flex: 5; }

.bg0 { background-color: rgba(49, 82, 103, 0.95); }
.bg1 { background-color: rgba(8, 52, 72, 0.95); }

.bg2 { background-color: #21ba45; }
.bg3 { background-color: #db2828; }

.bg4 { background-color: #e8e8e8; }
.bg5 { background-color: #b7b7b7; }

.bg0.h, .bg4 > .h { transition: background-color .25s; }

.bg0.h:hover { background-color: rgba(24, 48, 64, 0.95); }
.bg4:hover > .h { background-color: #b7b7b7; }

.p0 { padding: 15px; }
.p1 { padding: .5833em .833em; }
.p2 { padding: .833em 1.0827em; }

.c0 { color: #fff; }
.c1 { color: rgba(0, 0, 0, .6); }

.shd2 { 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12) }

.rnd { border-radius: 2px; }
.rndr { border-top-right-radius: 2px; border-bottom-right-radius: 2px; }
.rndl { border-top-left-radius: 2px; border-bottom-left-radius: 2px; }

.di { display: inline-block; }
.tc { text-align: center; }
.tdn { text-decoration: none; }

.mlh { transition: color .3s; }
.mlh img { transition: filter .3s; }
.mlh:hover { color: #3194d6; }
.mlh:hover img { filter: opacity(.5) drop-shadow(0 0 0 #3194d6); }

.f0 { font-family: sans-serif; }
.f1 { font-family: 'PT Sans', sans-serif; }

.fs0 { font-size: .85714286rem; line-height: .85714286rem; }
.fs1 { font-size: 32px; line-height: 32px; }
.fs2 { font-size: 17px; line-height: 17px; }

.circle { border-radius: 50%; padding: .3em; width: 0; }

.lh0 { line-height: 1.5em; }

.wf { width: 100%; }
.sz0 { width: 300px; }

.cp { cursor: pointer; }

`);

const Icon = (name, cls='fa') => z._i['fa-'+name]({class: cls});

const MenuLink = (text, icon, href) => z._a.di.tc.c0.wb.tdn.mlh({href},
    z._img({src: `assets/icons/sidebar-${icon}.png`, height: '48px'}),
    z.v(text)
);

const Links = z.each([
    MenuLink('Помощь', 'help', '#help'),
    MenuLink('Играть!', 'play', 'https://wiki.ss13.ru/index.php?title=Getting_Started'),
    MenuLink('Вики', 'wiki', 'https://wiki.ss13.ru/'),
    MenuLink('Сервера', 'servers', '#servers'),
    MenuLink('Форум', 'forum', 'https://forum.ss13.ru/'),
    MenuLink('Главная', 'news', '#'),
], i=>i, z.spl2())

let opened;
const Menu = z.menu({class: () => ({opened})},
z.s2.flex.bg1.nowrap.reverse.scrollinks(Links.map(i=>z.sp1(i))),
z.flex.nowrap.bg1.p0.shd2.rnd(
    z.s1.flex.centered(z._a({href: '#'},
        z._img({src: 'assets/main-logo.svg', height: '60px'}),
        z._img({src: 'assets/SS13.RU.svg', style: 'margin-left: 10px; margin-bottom: 15px;'})
    )),
    z.s2.flex.nowrap.reverse.links(Links.slice(0, 11)),
    z.flex.hamburger.centered(
        z.fs1.di.spr1.cp({
            onclick() {
                opened = !opened;
                z.update();
            }
        }, Icon('bars'))
    )
));

const Article = ({name, content, date}) => z.bg0.p0.shd2.rnd.sp1(
    z._h2.flex.centered.lh0.spb0(z('<', name)),
    date ? z.v.sp05(Icon('clock'), ' ', moment(date).calendar()) : undefined,
    z.sp2.f1(z('<', marked(content)))
);

const Articles = data.news.map(Article);

const Servers = data.servers.map(
    ({name, icon, online, players, description, address, links}) => z.di.bg1.p0.shd2.rnd.sp1(
        z.flex.nowrap.centered(z._img({src: icon}), z.spl05.wb(name)),
        z.sp1.f1(z('<', marked(description))),
        z.flex.wrap(z.each(links,
            ({what, text, href}) => z._a.p1.di.bg0.c0.rnd.fs0.h.tdn.sp05({href},
                Icon(what, 'fab fs2'), ' ', text), z.spl05()
        )),
        z.sp2(
            z._a.wf.bg4.c1.rnd.tdn.flex.nowrap({href: address},
                z.p2.di.h.c1.s1.tc.rndl(Icon('play'), ' Join'),
                z.p2.di.bg5.c1.rndr(
                    online ? [z.circle.di.bg2(), ' online'] : [z.circle.di.bg3(), ' offline'],
                    ' ', Icon('users'), ' ', players
                )
            ),
        )
    )
);

const Main = z.overlay(
    z.main(Menu,
        () => {
            let {route, args} = z.route();
            if (route === '')
                return z.flex.nowrap(z.s2(Articles), z.s1.spl1.servers(Servers))
            else if (route === 'help')
                return z.flex.nowrap(z.s2(Article(data.help)), z.s1.spl1.servers(Servers))
            else if (route === 'servers')
                return z.flex.wrap(Servers)
        },

    )
);

const Body = z('', Styles, Main);
//const body = z.('', Styles, Parallax, Main) // "FUCK GO BACK" compatibility!

z.setBody(Body);
