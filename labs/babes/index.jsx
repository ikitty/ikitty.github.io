var ref = new Wilddog("https://bkmk.wilddogio.com/todo");

var BabyList = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        var me = this;
        ref.on("value", function(datasnapshot,error) {
            if (error == null) {
                var D = datasnapshot.val();
                me.replaceState(D)
            }
        });
    },
    handleOpClick: function (e) {
        var target = $(e.target);
        var ancestorNode = target.parent().parent();
        var key = ancestorNode.data('index');

        if (!key) { return  ; }

        if (target.hasClass('btn_del')) {
            ref.child(key).remove();
            return  ;
        }
        if (target.hasClass('btn_edit')) {
            ancestorNode.children('div.edit_area').show() ;

            var orgValue = ancestorNode.children('span.name').html() ;
            ancestorNode.children('div.edit_area').children('input').val(orgValue).focus();
            return  ;
        }
        if (target.hasClass('btn_submit')) {
            var v = target.parent().children('input').val() ;
            ref.child(key).update({
                "name": v
            });

            ancestorNode.children('div.edit_area').hide() ;
            return  ;
        }

        if (target.hasClass('btn_close')) {
            ancestorNode.children('div.edit_area').hide() ;
            return  ;
        }
    },
    render: function () {
        var D  = this.state ;
        var str = []; 
        for (var i in D) {
            var k = D[i];
            str.push(
                <li key={i} data-index={i} onClick={this.handleOpClick}>
                    Name is : <span className="name">{k.name}</span>
                    <div className="btn_wrap">
                        <button className="btn btn_edit">Edit</button>
                        <button className="btn btn_del">Delete</button>
                    </div>
                    <div className="edit_area hide">
                        <input type="text" />
                        <button className="btn btn_submit" >Save</button>
                        <button className="btn btn_close" >Close</button>
                    </div>
                </li>
            ); 
        }
        return (<ul>{str}</ul>) ;
    }
});
ReactDOM.render(<BabyList />, document.getElementById('babyList') );

//add
var BabyAdd = React.createClass({
    getInitialState: function () {
        return {babyName: ''};
    },
    handleClick: function () {
        var v = this.refs.txt.value ;
        ref.push({
            "name": v,
            "url": 'default url'
        })
    },
    handleChange: function (e) {
        this.setState({babyName: e.target.value});
    },
    render: function () {
        var D  = this.state ;
        var str = []; 
        str.push(<input ref="txt" value={D.babyName} placeholder="Write ..." onChange={this.handleChange} type="text" />);
        str.push(<button onClick={this.handleClick}>AddBaby</button>);
        return (<div>{str}</div>) ;
    }
});
ReactDOM.render(<BabyAdd />, document.getElementById('babyAdd') );
