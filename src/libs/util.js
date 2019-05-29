import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = (title ? title + ' - ' : '') + '幼儿园报名系统';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://baoming.haizr.com' :
    env === 'production' ?
    '' :
    'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    withCredentials: true //允许携带Cookie
});

util.url = ajaxUrl;

export default util;