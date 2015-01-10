requirejs.config({
    paths: {
        'handlebars.runtime': '../bower_components/handlebars/handlebars.amd',
        underscore: '../bower_components/underscore-amd/underscore',
        backbone: '../bower_components/backbone-amd/backbone',
        jquery: '../bower_components/jquery/jquery'
    }
});
require(['jquery', 'app'], function ($, App) {
    $(function(){

        App();
        
        $('#close').click(function(){
            $('#notification').slideUp({
                done: function() {
                    $('#message-list').hide().slideDown('fast');
                }
            });
        });
        
        $('#msg').focus();
            
    });
});
