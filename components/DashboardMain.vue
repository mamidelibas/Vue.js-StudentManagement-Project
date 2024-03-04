<template>
  <v-app>
    <div class="min-h-screen w-full bg-gray-200">
      <div class="w-full" style="background-color: rgb(59, 123, 123)">
        <div class="w-full flex p-5 justify-between items-center">
          <h1 class="text-xl text-white">YÖNETİM PANELİ</h1>
          <v-btn small @click="logOut" dark>Çıkış Yap</v-btn>
        </div>
      </div>

      <div class="flex gap-5 p-10">
        <div class="w-1/6 bg-white rounded border border-gray-300 h-1/2">
          <div class="w-full p-5 flex gap-5 border-b border-gray-300">
            <v-avatar>
              <img
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                alt="admin"
              />
            </v-avatar>

            <div class="">
              <span>{{ user.name }} {{ user.lastName }}</span>
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <v-list nav dense>
            <v-list-item-group v-model="selectedItem" color="primary">
              <!-- ROLE GÖRE GÖSTERİM -->
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                v-if="item.allowedRole.includes(user.role)"
              >
                <!--  -->
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>

        <div class="w-5/6 bg-white rounded border border-gray-300 h-full">
          <component :is="items[selectedItem].component" />
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import DashboardPanel from "./DashboardPanel";
import Students from "./Students";
import Incstructors from "./Instructors";
import Attendance from "./Attendance";
import Classes from "./Classes";
import { mapGetters } from "vuex";
import Admins from "./Admins";

export default {
  name: "DashboardMain",

  //* KULLANICI GİRİŞ YAPMADAN ANA SAYFAYA YÖNLENDİRİLMEMESİ İÇİN
  created() {
    if (!this.getUser) {
      this.$router.push("/");
    }
  },

  data: () => ({
    //* CREATEDİN FONKSİYONU ÜSTTE

    selectedItem: 0,

    items: [
      {
        text: "Yönetim Paneli",
        icon: "mdi mdi-monitor-dashboard",
        component: DashboardPanel,
        allowedRole: ["manager", "instructor", "editor"],
      },
      {
        text: "Öğrenciler",
        icon: "mdi-account-multiple",
        component: Students,
        allowedRole: ["manager", "editor"],
      },
      {
        text: "Eğitmenler",
        icon: "mdi mdi-human-male-board",
        component: Incstructors,
        allowedRole: ["manager", "editor"],
      },
      {
        text: "Yoklama",
        icon: "mdi mdi-account-group-outline",
        component: Attendance,
        allowedRole: ["manager", "instructor", "editor"],
      },
      {
        text: "Sınıflar",
        icon: "mdi mdi-school",
        component: Classes,
        allowedRole: ["manager", "editor"],
      },
      {
        text: "Yöneticiler",
        icon: "mdi mdi-account-tie",
        component: Admins,
        allowedRole: ["manager", "editor"],
      },
    ],
  }),
  computed: {
    ...mapGetters(["getUser"]),
    user() {
      // Giriş yapmış olan user'ı verir
      return this.getUser;
    },
  },
  methods: {
    logOut() {
      //* ÇIKIŞ YAPILINCA DATAYI SİLMEK İÇİN
      this.$store.commit("LOGOUT");
      //* ÇIKIŞTAN SONRA YÖNLENDİRME
      this.$router.push("/");
    },
  },
};
</script>
