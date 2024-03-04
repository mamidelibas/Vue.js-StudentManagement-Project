<template>
  <v-app>
    <div>
      <div class="flex gap-5 p-5">
        <div class="bg-gray-200 p-5 w-1/3 rounded">
          <h1 class="text-gray-600 text-2xl">Toplam Öğrenci</h1>
          <span class="text-gray-600 text-4xl">[ {{ students?.length }} ]</span>
        </div>
        <div class="bg-gray-200 p-5 w-1/3 rounded">
          <h1 class="text-gray-600 text-2xl">Toplam Eğitmen</h1>
          <span class="text-gray-600 text-4xl"
            >[ {{ instructors?.length }} ]</span
          >
        </div>
        <div class="bg-gray-200 p-5 w-1/3 rounded">
          <h1 class="text-gray-600 text-2xl">Toplam Sınıf</h1>
          <span class="text-gray-600 text-4xl">[ {{ classes?.length }} ]</span>
        </div>
      </div>

      <h1
        class="flex font-bold justify-center text-3xl text-gray-600 px-5 py-3"
      >
        SON AÇILAN SINIFLAR
      </h1>
      <div class="flex p-5 gap-3">
        <v-card
          v-for="clas in classes"
          class="mx-auto"
          max-width="330"
          outlined
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                {{ clas?.instructor?.name }} {{ clas?.instructor?.lastName }}
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ clas?.courseName }}
              </v-list-item-title>
              <v-list-item-subtitle
                >Kayıtlı
                {{ clas?.students?.length }} Öğrenci</v-list-item-subtitle
              >
            </v-list-item-content>

            <!-- <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar> -->
          </v-list-item>
        </v-card>
      </div>

      <h1
        class="flex justify-center font-bold text-3xl text-gray-600 px-5 py-3"
      >
        SON KAYIT OLAN ÖĞRENCİLER
      </h1>
      <div class="flex p-5 gap-3">
        <v-card
          v-for="student in students"
          class="mx-auto"
          max-width="330"
          outlined
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                {{ student?.name }} {{ student?.lastName }}
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ student?.mail }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Kayıt Olduğu Kurs :
                {{
                  classes.find((c) => c._id === student.courses[0])?.courseName
                }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <!-- <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar> -->
          </v-list-item>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardPanel",

  data: () => ({
    classes: [],
    students: [],
    instructors: [],
  }),
  created() {
    this.getClasses();
    this.getStudents();
    this.getInstructors();
  },
  methods: {
    async getClasses() {
      await axios.get("http://localhost:3000/classes").then((res) => {
        // console.log("sıınıfr", res.data);
        this.classes = res.data;
      });
    },
    async getStudents() {
      await axios.get("http://localhost:3000/students").then((resp) => {
        // console.log("öğrenci", resp.data);
        this.students = resp.data;
      });
    },
    async getInstructors() {
      await axios.get("http://localhost:3000/instructors").then((respo) => {
        // console.log("eğitmen", respo.data);
        this.instructors = respo.data;
      });
    },
  },
};
</script>
