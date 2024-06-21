import Vue from 'vue';
import Mixin from '@/modules/op.vue.js';
import Saleson from '@/modules/op.saleson.js';
import CryptoJS from 'crypto-js';
import CircuitBreaker from 'opossum';

Vue.mixin(Mixin);
Vue.use(Saleson, {cryptoJS: CryptoJS, circuitBreaker: CircuitBreaker});

