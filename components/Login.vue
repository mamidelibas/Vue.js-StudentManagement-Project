<template>
  <v-app>
    <div
      class="w-full bg-gray-200 min-h-screen flex justify-center items-center"
    >
      <div class="w-1/2">
        <div
          class="bg-gray-300 py-5 gap-3 shadow-lg rounded-lg flex flex-col justify-center items-center"
        >
          <img
            src="data:image/webp;base64,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"
          />
          <h2 class="text-2xl font-bold">UBY Portala Hoşgeldiniz</h2>

          <div class="w-3/4 mt-10">
            <label class="text-gray-800 font-bold">E-mail</label>
            <v-text-field
              v-model="email"
              label="E-mail Adresinizi Giriniz."
              solo
            />
          </div>

          <div class="w-3/4">
            <label class="text-gray-800 font-bold">Şifre</label>
            <v-text-field
              v-model="password"
              label="Şifrenizi Giriniz."
              type="password"
              solo
            />
          </div>

          <div class="w-3/4 flex justify-end">
            <v-btn
              depressed
              style="color: white; background-color: #0686c6"
              @click="login"
              >Giriş yap</v-btn
            >
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .post("http://localhost:3000/admins/login", {
          mail: this.email,
          password: this.password,
        })
        .then((res) => {
          if (res.data.status == "success") {
            // console.log(res.data.data);

            //* BİLGİLERİ STORA YAZMAK ve GÜNCELLEMEK İÇİN
            this.$store.commit("SET_USER", res.data.data);

            //* YÖNLENDİRME İÇİN
            this.$router.push("/dashboard");
          }
        })
        .catch((err) => {
          alert("Hatalı Giriş Yaptınız.");
        });
    },
  },
};
</script>
