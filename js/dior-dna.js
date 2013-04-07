$(document).ready(function() {
    window.androidMenu = new AndroidMenu('#menuContainer>ul');
    window.pageManager = new PageManager();
});

function j(tagname) {
    var bound = $('<' + tagname + ' />');
    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue;
        if (arguments[i] instanceof jQuery) {
            bound.append(arguments[i]);
        } else {
            for (var key in arguments[i])
                bound.attr(key, arguments[i][key]);
        }
    }
    return bound;
}

function AndroidMenu(selector) {
    this.selector = selector;
    this.dom = $(selector);
    this.initializeContent();
    this.initializeUI();
}

AndroidMenu.prototype.initializeContent = function() {
    var mainMenu =
        j('li',
            j('a', {'class': 'android-menu-nav-header', href: '#', 'data-page': 'about-project'}).text('О проекте'),
            j('ul',
                j('li', j('a', {href: '#', 'data-page': 'about-project'}).text('Dior-DNA')),
                /*j('li', j('a', {href: '#', 'data-page': 'about-speakers'}).text('О докладчиках')),*/
                j('li', j('a', {href: 'https://github.com/dior-dna?tab=repositories'}).text('Dior-DNA на github')),
                j('li', j('a', {href: '#', 'data-page': 'useful-links'}).text('Полезные ссылки'))
            )
        );
    this.dom.append(mainMenu);

    var part1 =
        j('li',
            j('a', {'class': 'android-menu-nav-header', href: '#', 'data-page': 'part-1'}).text('Встречи'),
            j('ul',
                j('li', j('a', {href: '#', 'data-page': 'part-1'}).text('Встреча #1')),
                j('li', j('a', {href: '#', 'data-page': 'part-2'}).text('Встреча #2')),
                j('li', j('a', {href: '#', 'data-page': 'part-3-4'}).text('Встреча #3, Встреча #4'))
            )
        );
    this.dom.append(part1);

    var projects =
        j('li',
            j('a', {'class': 'android-menu-nav-header', href: '#', 'data-page': 'kinoview'}).text('Проекты'),
            j('ul',
                j('li', j('a', {href: '#', 'data-page': 'kinoview'}).text('Kinoview')),
                j('li', j('a', {href: '#', 'data-page': 'cards'}).text('Фреймворк карточных игр'))
            )
        );
    this.dom.append(projects);
};

AndroidMenu.prototype.initializeUI = function() {
    // First level.
    var handlers = $('a.android-menu-nav-header', this.dom);
    handlers.wrap('<div class="android-menu-nav-header-section"></div>')

    // Second level.
    handlers = $('ul>li>a', this.dom);
    handlers.wrap('<div class="android-menu-nav-header2-section"></div>')

    // 'A' handlers.
    handlers = $('a', this.dom);
    handlers.click(function() {
        var pageName = $(this).attr('data-page');
        if (pageName) {
            window.pageManager.load(pageName);
            return false;
        }
    });
};

function PageManager() {
    var self = this;
    this.container = $('#pageContainer');

    var ieversion = 0;
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        ieversion = new Number(RegExp.$1)
    }

    this.hashchangeSupport = 'onhashchange' in window && (ieversion == 0 || ieversion > 7);
    if (this.hashchangeSupport) {
        $(window).bind('hashchange', function(e) {
            self.loadByHash();
        });
    }
    self.loadByHash();
}

PageManager.prototype.loadByHash = function() {
    var self = this;
    var hash = location.hash || '#!/about-project';
    hash = hash.substr(3);
    this.loadContent(hash, function() {
        self.markHandlers(hash);
    });
};

PageManager.prototype.loadContent = function(pageName, cb) {
    var pageUrl = 'pages/' + pageName + '.html';
    this.container.load(pageUrl, cb);
};

PageManager.prototype.markHandlers = function(pageName) {
    $('a', androidMenu.dom).removeClass('active');
    $('a[data-page=' + pageName + ']', androidMenu.dom).addClass('active');
};

PageManager.prototype.load = function(pageName) {
    var self = this;
    if (this.hashchangeSupport) {
        location.hash = '#!/' + pageName;
    } else {
        this.loadContent(pageName, function() {
            location.hash = '#!/' + pageName;
            self.markHandlers(pageName);
        })
    }
};