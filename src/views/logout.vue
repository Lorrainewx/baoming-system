<template>
    
</template>

<script>
import Cookies from 'js-cookie';
import Util from '../libs/util';
import env from '../config/env';

export default {
    data () {
        return {
        };
    },
    created: function(){
        var usertype = Cookies.get('user_type');

        Cookies.remove('user_type');
        Cookies.remove('user_name');

        Cookies.remove('admin_token');
        Cookies.remove('admin_info');

        Util.ajax.post('/logout').then((response) => {});   

        if(usertype == 'admin') {
            location.href = (env === 'development' ? '' : '/admin') + '/manage/login';
        } else {
            location.href = (env === 'development' ? '' : '/admin') + '/login';
        }
    }
};
</script>