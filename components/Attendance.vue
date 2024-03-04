<template>
  <v-app>
    <div class="p-3">
      <h1 class="text-2xl font-bold text-gray-500">Yoklama İşlemleri</h1>

      <div class="flex items-center gap-3 mt-5">
        <v-select
          solo
          class="w-1/2"
          v-model="selectedCourse"
          label="Kurs Seçiniz"
          :items="classes"
          item-value="_id"
          item-text="courseName"
        />
        <div class="w-1/2">
          <v-text-field
            solo
            type="text"
            v-model="date"
            placeholder="Lütfen yoklama tarihi seçiniz"
            @click="isDatePickerOpen = true"
          />
          <div class="w-full absolute">
            <v-date-picker v-model="date" no-title v-if="isDatePickerOpen">
              <v-spacer></v-spacer>
              <v-btn small color="primary" @click="isDatePickerOpen = false">
                Cancel
              </v-btn>
              <v-btn small color="primary" @click="isDatePickerOpen = false">
                OK
              </v-btn>
            </v-date-picker>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-end">
        <v-btn dark small @click="getAttendance">Yoklamayı Getir</v-btn>
      </div>

      <div class="mt-5">
        <table
          v-if="students?.length > 0"
          class="table-auto w-full bg-gray-300"
        >
          <thead>
            <tr>
              <th class="px-4 py-2">Mevcut</th>
              <th class="px-4 py-2">Ad Soyad</th>
              <th class="px-4 py-2">E-posta</th>
              <th class="px-4 py-2">Kurs</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="student in students" :key="student.id" class="rows">
              <td class="border px-4 py-2">
                <v-checkbox
                  label="Evet"
                  :value="student._id"
                  v-model="selected"
                ></v-checkbox>
              </td>
              <td class="border px-4 py-2">
                {{ student.name }} {{ student.lastName }}
              </td>
              <td class="border px-4 py-2">{{ student.mail }}</td>
              <td class="border px-4 py-2">
                {{
                  classes.find(
                    (course) => course?._id === student?.courses?.[0]
                  )?.courseName
                }}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 class="text-2xl text-gray-800" v-else>
          Lütfen bir kurs ve tarih seçiniz.
        </h2>

        <div
          class="my-3 w-full flex justify-end"
          v-if="selected.length > 0 && date && selectedCourse"
        >
          <v-btn
            small
            style="background-color: rgb(29, 128, 95); color: white"
            @click="createOrUpdateAttendance"
            >Kaydet</v-btn
          >
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Attendance",
  data: () => ({
    selected: [],
    selectedCourse: "",
    isDatePickerOpen: false,
    date: null,
    classes: [],
    students: [],
    attendanceStudents: [],
  }),
  created() {
    this.getClasses();
  },
  methods: {
    checkBoxClick(id) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((item) => item !== id);
      } else {
        this.selected.push(id);
      }
    },
    getClasses() {
      axios
        .get("http://localhost:3000/classes")
        .then((res) => {
          this.classes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getStudents() {
      axios
        .get(
          "http://localhost:3000/classes/" + this.selectedCourse + "/students"
        )
        .then((res) => {
          this.students = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAttendance() {
      this.selected = [];

      this.getStudents();
      const reqBody = {
        classId: this.selectedCourse,
        attanceDate: this.date,
      };

      axios
        .post("http://localhost:3000/attendance/get", reqBody)
        .then((res) => {
          if (res.data) {
            this.attendanceStudents = res.data[0]?.students;
            this.attendanceStudents.forEach((student) => {
              this.selected.push(student);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createOrUpdateAttendance() {
      const reqBody = {
        classId: this.selectedCourse,
        attanceDate: this.date,
        students: this.selected,
      };

      axios
        .post("http://localhost:3000/attendance/record", reqBody)
        .then((res) => {
          this.getAttendance();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.rows:nth-child(odd) {
  background-color: rgb(196, 196, 196);
}
</style>
