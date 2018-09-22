// var IndexPage = "http://localhost:8080/xxxx.html";
// var AuthCode = "123123";
// import * as Vue from "vue"
import $ from "jquery";
import Vue from "vue";
import VeeValidate from   "vee-validate"
// var IndexPage = "http://localhost:8080/xxxx.html";
// var AuthCode = "123123";

export default function checkIn(){
    init();
    logRecommend();
    verifyRecommend();
    registRecommend();
}
function init(){
$(function(){
    console.log('ok');
    $("#verify-close-button,#login-close-button,#register-close-button").click(function(){
        $(".checkin-content").css("display","none");
    })
    $(".log-button").click(function(){
        console.log('log-button');
        $(".checkin-content").css("display","block");
        $("#login-content").css("display","block");
        $("#verify-content").css("display","none");
        $("#register-content").css("display","none");
    });
    $(".verify-button").click(function(){
        $(".checkin-content").css("display","block");
        console.log('verify-button');
        $("#verify-content").css("display","block");
        $("#login-content").css("display","none");
        $("#register-content").css("display","none");
        });

    $(".register-button").click(function(){
        $(".checkin-content").css("display","block");
        console.log('register-button');
        $("#register-content").css("display","block");
        $("#login-content").css("display","none");
        $("#verify-content").css("display","none");
    });

})    


VeeValidate.Validator.localize('zh_CN');
Vue.use(VeeValidate);
VeeValidate.Validator.localize({
    zh_CN:{
        messages:{
            required: function(name){return name + '不能为空'},
        }
    }
});
// Pass options to make all validators use the arabic language, also merge the english and arabic attributes with the internal dictionary.
// Vue.use(VeeValidate, {
//   locale: 'ar',
//   dictionary: {
//     en: { attributes: attributesEn },
//     ar: { messages: messagesAr, attributes: attributesAr }
//   }
// });


VeeValidate.Validator.extend('account',{
    getMessage:function(){
        // return"请输入正确格式的邮箱或手机号"
        return"Please enter the right format of your email or phone";
    },
    validate:function(value){
        let email = /^\w+@(\w){2,10}(\.(\w){2,4}){1,3}$/;
        let phone = /^\d{7,15}$/;
        return email.test(value)||phone.test(value);//
    }
}
);
VeeValidate.Validator.extend('verify_code',{
    getMessage:function(){return"Please enter the right format of your verification code "},
    validate:function(value){return /^\d{6}/.test(value)}
});

VeeValidate.Validator.extend('password',{
    getMessage:function(){return" Wrong format! it must between 6 and 19"},
    validate:function(value){return /^\w{6,19}/.test(value)}
});


VeeValidate.Validator.extend('password_again',{
    getMessage:function(){return" Didn't match the first password"},
     validate:function(value){return /^\w{6,19}/.test(value)}
});
}


function logRecommend(){
    var classList = new Vue({
        el:"#login-content",
        data: function(){
            return {
                account:"",
                password:"",
            }
        },
        methods:{
            validateBeforeSbmit(){
                this.$validator.validateAll().then((result) => {
                    if(result){
                        $.ajax({
                            url:'/xxxx',
                            data:{
                                Request:"xxxxx",
                                account: this.account,
                                password:this.password
                            },
                            type:'POST',
                            dataType: "json",
                            success:function(data){
                                var msg = data.msg;
                                alert(msg);
                                window.location.href = IndexPage;
                            }
                        });
                        return;
                    }
                    alert("请输入完整推荐信息");
                });
            }
        }
    })
}
function verifyRecommend(AuthCode){
    // console.log('ok');
    var classList = new Vue({
        el:"#verify-content",
        data: function(){
            return {
                account:"",
                verify_code:"",
            }
        },
        methods:{
            validateBeforeSbmit(){
                this.$validator.validateAll().then((result) => {
                    if(result){
                        $.ajax({
                            url:'/xxxx',
                            data:{
                                Request:"xxxxx",
                                account: this.account,
                                verify_code:this.verify_code
                            },
                            type:'POST',
                            dataType: "json",
                            success:function(data){
                                var msg = data.msg;
                                alert(msg);
                                window.location.href = IndexPage;
                            }
                        });
                        return;
                    }
                    alert("请输入完整推荐信息");
                });
            }
        }
    })
}
function registRecommend(AuthCode){
    var classList = new Vue({
        el:"#register-content",
        data: function(){
            return {
                account:"",
                verify_code:"",
                password:"",
                password_again:"",
            }
        },
        methods:{
            validateBeforeSbmit(){
                this.$validator.validateAll().then((result) => {
                    if(result){
                        $.ajax({
                            url:'/xxxx',
                            data:{
                                Request:"xxxxx",
                                account: this.account,
                                password:this.password,
                                verify_code:this.verify_code,
                                password_again:this.password_again

                            },
                            type:'POST',
                            dataType: "json",
                            success:function(data){
                                var msg = data.msg;
                                alert(msg);
                                window.location.href = IndexPage;
                            }
                        });
                        return;
                    }
                    alert("请输入完整推荐信息");
                });
            }
        }
    })
}