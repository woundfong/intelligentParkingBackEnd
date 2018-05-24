var url_prefix = "http://localhost:2000/";
$("#login").click(function() {
    var owner = $("#usr").val(),
        psw = $("#psw").val();
    if(!owner || !psw) {
        alert("输入完整信息！");
        return false;
    }
    var url = url_prefix + "ownerLogin";
    $.ajax({
        url: url,
        data: {
            owner: owner,
            password: psw
        },
        beforeSend: function(xhr) {  
            xhr.setRequestHeader("Authorization", "wx.huanfeng.site");  
        },
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        success: function(res) {
            console.log(res);
            if(res.code == "200") {
                console.log("ok");
                location.reload();
            } else {
                alert("账号密码不正确");
            }
        }
    })
})