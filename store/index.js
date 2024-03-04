//* VUEX
//* REACT REDUX YERİNE KULLANILAN STORE
//* VERİLERİN SİLİNMEMESİ İÇİNDE KULLANILIR

import Vue from "vue";
import Vuex from "vuex";

//* BÜTÜN SAYFALARDA VUEX KULLANACAĞIMIZI BELİRTİYORUZ
Vue.use(Vuex);

//* TUTULACAK DEĞİŞKENLERİMİZİ STATE'DE TUTUYORUZ
export const state = () => ({
  // VERİLERİN KAYBOLMAMASI İÇİN LOCALSTORAGE KULLANILIR

  // kullanıcı giriş yapmışsa veriler/datalar "loggedUser" key'i olarak tutsun eğer loggedUser key'i yoksa null kalsın
  user: JSON.parse(localStorage?.getItem("loggedUser")) || null,

  // ÖRNEĞİN COUNTER UYGULAMASI STATESİ İÇİN
  //   counter: 0,
});

//* FONKSİYONLAR MUTATİONS'A YAZILIR
export const mutations = {
  // GİRİŞ YAPMIŞ OLAN KULLANICIYI STORA YAZMAYA YARIYOR
  SET_USER(state, user) {
    state.user = user;
    // Giriş yap'a bastıktan sonra localstorage'ye bilgileri "loggedUser"olarak at kaydet
    localStorage?.setItem("loggedUser", JSON.stringify(user));
  },
  // ÇIKIŞ YAPAN KULLANICIYI BAŞLANGIÇ DEĞERİNE GÖNDER
  LOGOUT() {
    state.user = null;
    // Çıkış yapınca sıfırla
    localStorage?.removeItem("loggedUser");
  },
};

//* AXİOS GET İŞLEMLERİ İÇİN
export const getters = {
  // KULLANICININ KİM OLDUĞUNU KULLANMAK İÇİN
  getUser: (state) => state.user,
};

//* ESKİ TARAYICILARDA SORUN ÇIKARMAMASI İÇİN VUE
export const strict = false;
