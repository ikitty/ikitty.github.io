"use strict";

var ref = new Wilddog("https://bkmk.wilddogio.com/todo");

var BabyList = React.createClass({
    displayName: "BabyList",

    getInitialState: function getInitialState() {
        return {};
    },
    componentDidMount: function componentDidMount() {
        var me = this;
        ref.on("value", function (datasnapshot, error) {
            if (error == null) {
                var D = datasnapshot.val();
                me.replaceState(D);
            }
        });
    },
    handleOpClick: function handleOpClick(e) {
        var target = $(e.target);
        var ancestorNode = target.parent().parent();
        var key = ancestorNode.data('index');

        if (!key) {
            return;
        }

        if (target.hasClass('btn_del')) {
            ref.child(key).remove();
            return;
        }
        if (target.hasClass('btn_edit')) {
            ancestorNode.children('div.edit_area').show();

            var orgValue = ancestorNode.children('div.name').html();
            ancestorNode.children('div.edit_area').children('input').val(orgValue).focus();
            return;
        }
        if (target.hasClass('btn_submit')) {
            var v = target.parent().children('input').val();
            ref.child(key).update({
                "name": v
            });

            ancestorNode.children('div.edit_area').hide();
            return;
        }

        if (target.hasClass('btn_close')) {
            ancestorNode.children('div.edit_area').hide();
            return;
        }
    },
    render: function render() {
        var D = this.state;
        var str = [];
        for (var i in D) {
            var k = D[i];
            str.push(React.createElement(
                "li",
                { key: i, "data-index": i, onClick: this.handleOpClick },
                React.createElement(
                    "div",
                    { className: "btn_wrap" },
                    React.createElement(
                        "button",
                        { className: "btn btn_edit" },
                        "Edit"
                    ),
                    React.createElement(
                        "button",
                        { className: "btn btn_del" },
                        "Del"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "name" },
                    k.name
                ),
                React.createElement(
                    "div",
                    { className: "edit_area hide" },
                    React.createElement("input", { type: "text" }),
                    React.createElement(
                        "button",
                        { className: "btn btn_submit" },
                        "Save"
                    ),
                    React.createElement(
                        "button",
                        { className: "btn btn_close" },
                        "Close"
                    )
                )
            ));
        }
        return React.createElement(
            "ul",
            null,
            str
        );
    }
});
ReactDOM.render(React.createElement(BabyList, null), document.getElementById('babyList'));

//add
var BabyAdd = React.createClass({
    displayName: "BabyAdd",

    getInitialState: function getInitialState() {
        return { babyName: '' };
    },
    handleClick: function handleClick() {
        var v = this.refs.txt.value;
        ref.push({
            "name": v,
            "url": 'default url'
        });
        this.setState({ babyName: '' });
    },
    handleChange: function handleChange(e) {
        this.setState({ babyName: e.target.value });
    },
    render: function render() {
        var D = this.state;
        var str = [];
        str.push(React.createElement("input", { key: "baby_add_text", ref: "txt", value: D.babyName, placeholder: "Write ...", onChange: this.handleChange, type: "text" }));
        str.push(React.createElement(
            "button",
            { key: "baby_add_btn", onClick: this.handleClick },
            "AddBaby"
        ));
        return React.createElement(
            "div",
            null,
            str
        );
    }
});
ReactDOM.render(React.createElement(BabyAdd, null), document.getElementById('babyAdd'));

//bk list
var refBk = new Wilddog("https://bkmk.wilddogio.com/bookmark");
var BookmakrList = React.createClass({
    displayName: "BookmakrList",

    getInitialState: function getInitialState() {
        return {};
    },
    componentDidMount: function componentDidMount() {
        var me = this;
        refBk.on("value", function (datasnapshot, error) {
            if (error == null) {
                var D = datasnapshot.val();
                me.replaceState(D);
            }
        });
    },
    handleOpClick: function handleOpClick(e) {
        var target = $(e.target);
        var ancestorNode = target.parent().parent();
        var key = ancestorNode.data('index');

        if (!key) {
            return;
        }

        if (target.hasClass('btn_del')) {
            refBk.child(key).remove();
            return;
        }
        if (target.hasClass('btn_edit')) {
            $('#bkEditArea').show();

            //ancestorNode.children('div.edit_area').show() ;

            //var orgValue = ancestorNode.children('div.name').html() ;
            //ancestorNode.children('div.edit_area').children('input').val(orgValue).focus();
            return;
        }
        if (target.hasClass('btn_submit')) {
            var v = target.parent().children('input').val();
            refBk.child(key).update({
                "name": v
            });

            ancestorNode.children('div.edit_area').hide();
            return;
        }

        if (target.hasClass('btn_close')) {
            ancestorNode.children('div.edit_area').hide();
            return;
        }
    },
    render: function render() {
        var D = this.state;
        var str = [];
        for (var i in D) {
            var k = D[i];
            str.push(React.createElement(
                "li",
                { key: i, "data-index": i, onClick: this.handleOpClick },
                React.createElement(
                    "div",
                    { className: "btn_wrap" },
                    React.createElement(
                        "button",
                        { className: "btn btn_edit" },
                        "Edit"
                    ),
                    React.createElement(
                        "button",
                        { className: "btn btn_del" },
                        "Del"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "name" },
                    React.createElement(
                        "a",
                        { href: k.url, target: "_blank" },
                        k.name
                    )
                ),
                React.createElement(
                    "div",
                    { className: "edit_area hide" },
                    React.createElement("input", { type: "text" }),
                    React.createElement(
                        "button",
                        { className: "btn btn_submit" },
                        "Save"
                    ),
                    React.createElement(
                        "button",
                        { className: "btn btn_close" },
                        "Close"
                    )
                )
            ));
        }
        return React.createElement(
            "ul",
            null,
            str
        );
    }
});
ReactDOM.render(React.createElement(BookmakrList, null), document.getElementById('bkList'));

//bk add
var BookmarkAdd = React.createClass({
    displayName: "BookmarkAdd",

    getInitialState: function getInitialState() {
        return { bkTitle: '', bkUrl: '' };
    },
    handleClick: function handleClick() {
        var title = this.refs.bkTitle.value;
        var url = this.refs.bkUrl.value;

        console.log(title, url);
        if (title === '' || url === '') {
            return;
        }
        refBk.push({
            "name": title,
            "url": url
        });
        this.setState({ bkTitle: '', bkUrl: '' });
    },
    handleChange: function handleChange(e) {
        var self = this;
        this.setState({ bkUrl: self.refs.bkUrl.value, bkTitle: self.refs.bkTitle.value });
    },
    render: function render() {
        var D = this.state;
        var str = [];
        str.push(React.createElement("input", { key: "bk_add_tit", ref: "bkTitle", value: D.bkTitle, placeholder: "Write title ...", onChange: this.handleChange, type: "text" }));
        str.push(React.createElement("input", { key: "bk_add_url", ref: "bkUrl", value: D.bkUrl, placeholder: "Write url ...", onChange: this.handleChange, type: "text" }));
        str.push(React.createElement(
            "button",
            { key: "bk_add_btn", onClick: this.handleClick },
            "Add"
        ));
        return React.createElement(
            "div",
            null,
            str
        );
    }
});
ReactDOM.render(React.createElement(BookmarkAdd, null), document.getElementById('bkAdd'));

//bookmark edit
var BookmarkEdit = React.createClass({
    displayName: "BookmarkEdit",

    getInitialState: function getInitialState() {
        return { bkTitle: '', bkUrl: '', id: '' };
    },
    componentDidMount: function componentDidMount() {
        var key = $(this.refs.bkTitle).data('index');
        var self = this;
        refBk.child(key).on("value", function (d, error) {
            var D = d.val();
            if (error == null && D != null) {
                self.replaceState({ bkTitle: D.name, bkUrl: D.url, id: key });
            }
        });
    },
    //save
    handleClick: function handleClick(e) {
        var target = $(e.target);
        if (target.hasClass('btn_close')) {
            $('#bkEditArea').hide();
            return;
        }

        var title = this.refs.bkTitle.value;
        var url = this.refs.bkUrl.value;
        var key = $(this.refs.bkTitle).data('index');

        console.log(title, url, key);

        if (title === '' || url === '') {
            return;
        }
        refBk.child(key).update({
            "name": title,
            "url": url
        });
        this.setState({ bkTitle: '', bkUrl: '', id: '' });
    },
    handleChange: function handleChange(e) {
        var self = this;
        this.setState({ bkUrl: self.refs.bkUrl.value, bkTitle: self.refs.bkTitle.value });
    },
    render: function render() {
        var D = this.state;
        var str = [];
        var index = D.id || 'testid';

        str.push(React.createElement("input", { key: "bk_add_tit", ref: "bkTitle", "data-index": index, value: D.bkTitle, onChange: this.handleChange, type: "text" }));
        str.push(React.createElement("input", { key: "bk_add_url", ref: "bkUrl", value: D.bkUrl, onChange: this.handleChange, type: "text" }));
        str.push(React.createElement(
            "button",
            { key: "bk_add_btn1", onClick: this.handleClick },
            "Save"
        ));
        str.push(React.createElement(
            "button",
            { key: "bk_add_btn2", className: "btn_close", onClick: this.handleClick },
            "Close"
        ));
        return React.createElement(
            "div",
            null,
            str
        );
    }
});
ReactDOM.render(React.createElement(BookmarkEdit, null), document.getElementById('bkEditArea'));

//ui
var alexTab = function alexTab(obj) {
    var cfg = {
        hd: null,
        bd: null,
        hdActiveCls: 'active',
        bdActiveCls: 'active',
        def: 0,
        mode: 'click',
        callback: 0
    };
    for (var i in obj) {
        obj[i] && (cfg[i] = obj[i]);
    }
    cfg.mode = 'on' + cfg.mode;

    if (!cfg.hd || !cfg.bd) {
        return;
    }
    //init
    $$(cfg.hd).removeClass(cfg.hdActiveCls);
    $$(cfg.hd[cfg.def]).addClass(cfg.hdActiveCls);
    $$(cfg.bd).removeClass(cfg.bdActiveCls);
    $$(cfg.bd[cfg.def]).addClass(cfg.bdActiveCls);

    for (var i = 0, k; k = cfg.hd[i]; i++) {
        k.index = i;
        k[cfg.mode] = function () {
            $$(cfg.hd[cfg.def]).removeClass(cfg.hdActiveCls);
            $$(cfg.hd[this.index]).addClass(cfg.hdActiveCls);

            $$(cfg.bd[cfg.def]).removeClass(cfg.bdActiveCls);
            $$(cfg.bd[this.index]).addClass(cfg.bdActiveCls);

            cfg.callback && typeof cfg.callback == 'function' && cfg.callback(this.index, cfg.def);

            cfg.def = this.index;
        };
    }
};
$(function () {
    window.$$ = $;
    alexTab({
        hd: $('#mainTabHd p'),
        bd: $('#mainTabBd div.tab_item'),
        hdActiveCls: 'on'
    });
});