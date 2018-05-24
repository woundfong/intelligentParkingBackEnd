var url_prefix = "http://localhost:2000/";
var gridster;
var unitCount = 5, nums = 5;
var widget_base_dimensions = 25;
var owner;
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    } 
}
window.onload = function() {
    owner = getCookie("iparkUser");
    if(getCookie("isAdmin") == "1") {
        $("#applyList-menu").css({display: "inline-block"})

    } else {
        $("#parkingLotLayout-menu, .opts").css({display: "inline-block"})
        loadApplyingList();
    }
}
function loadApplyingList() {
    console.log(owner);
    $.ajax({
        url: url_prefix + "api/parking/getParkinglots/console",
        data: {
            owner: owner
        },
        beforeSend: function(xhr) {  
            xhr.setRequestHeader("Authorization", "wx.huanfeng.site");  
        },
        success: function(res) {
            if(res.code != "200") {
                alert(res.errMsg);
                return false;
            }
            var parkingLots = res.parkingLots, h = "<ul class='list'>";
            if(parkingLots.length > 0) {
                h += "<li class='title'>已有停车场</li>";
            }
            for(var i = 0; i < parkingLots.length; i++) {
                h += "<li>" + parkingLots[i].remark + "</li>"
            }
            h += "</ul>";
            $(".aside").append(h);
            showLayout();
        }
    })
}
function showLayout() {
    var h = "<ul class='chart-list'>" +
            "</ul>";
    $(".workspace").html(h);
    var workspace_width = $("body").outerWidth() - $(".aside").outerWidth() - 10;
	//sizex的值 = 整个工作区宽度 / (基本宽度px + widget_margin)
	var sizex = Math.floor(workspace_width / 35);
    gridster = $(".chart-list").gridster({
        widget_base_dimensions: [widget_base_dimensions, widget_base_dimensions],
        widget_margins: [10, 10], //widget的margin
        max_cols: sizex,
        serialize_params: function($w, wgd) {
            return { num: $w.attr("data-num"), col: wgd.col, row: wgd.row, size_x: wgd.size_x, size_y: wgd.size_y }
        }
    }).data('gridster');
    var widgets = [
        ["<li class='widget' data-num=入口>入口<span class='iconfont icon-signin'></span></li>", 2, 1, 1, 1],
        ["<li class='widget' data-num=1>1<span class='widget-del iconfont icon-cancel'></span></li>", 2, 1, 3, 1],
        ["<li class='widget' data-num=2>2<span class='widget-del iconfont icon-cancel'></span></li>", 2, 1, 5, 1],
        ["<li class='widget' data-num=3>3<span class='widget-del iconfont icon-cancel'></span></li>", 2, 1, 7, 1],
        ["<li class='widget' data-num=4>4<span class='widget-del iconfont icon-cancel'></span></li>", 2, 1, 9, 1],
        ["<li class='widget' data-num=5>5<span class='widget-del iconfont icon-cancel'></span></li>", 1, 2, 11, 1],
        ["<li class='widget' data-num=出口>出口<span class='iconfont icon-signout'></span></li>", 2, 1, 13, 1],
    ]
    $.each(widgets, function (i, widget) {
        gridster.add_widget.apply(gridster, widget)
    });
}

$("#hori,#verti").click(function(event) {
    console.log(event.target);
    var sizex = 1, sizey = 1;
    if($(event.target).attr("id") == "hori") {
        sizex = 2;
        sizey = 1;
    } else {
        sizex = 1;
        sizey = 2;
    }
    unitCount++;
    nums++;
    var newWidgetHtml = "<li class='widget' data-num=" + nums 
        + ">" + nums + "<span class='widget-del iconfont icon-cancel'></span></li>";
    gridster.add_widget(newWidgetHtml, sizex, sizey);
})
$("body").on("click", ".widget-del", function(e) {
    if(unitCount <= 5) {
        return false;
    }
    var target = $(e.target);
    gridster.remove_widget($(target).parents(".widget").get(0));
    unitCount--;    
})

$("#save").click(function() {
    var positions = gridster.serialize();
    console.log(positions);
    var width = $(".chart-list").outerWidth(), height = $(".chart-list").height();
    var layout = {width: width, height: height, widget_base_dimensions: widget_base_dimensions, positions: positions};
    layout = JSON.stringify(layout);
    var url = url_prefix + "api/parking/layout/update";
    $.ajax({
        url: url,
        data: {
            layout: layout,
            id: 1
        },
        beforeSend: function(xhr) {  
            xhr.setRequestHeader("Authorization", "wx.huanfeng.site");  
        },
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        success: function(res) {
            console.log(res);
            if(res.code == "200") {
                alert("success");
            } else {
                alert("服务器错误");
            }
        }
    })
})
