<template>
  <v-app>
    <div>
      <div class="flex justify-between items-center p-5">
        <h2 class="text-2xl font-bold text-gray-500">
          Tüm Öğrenciler [ {{ students.length || 0 }} ]
        </h2>
        <div class="flex justify-end gap-5">
          <v-dialog v-model="newStudentDialog" width="750">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                style="background-color: rgb(59, 123, 123); color: white"
                v-bind="attrs"
                v-on="on"
              >
                Öğrenci Ekle
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">Yeni Öğrenci Ekle</span>
              </v-card-title>

              <v-card-text>
                <div>
                  <v-text-field
                    v-model="newStudentForm.name"
                    label="Ad"
                    outlined
                  />
                  <v-text-field
                    v-model="newStudentForm.lastName"
                    label="Soyad"
                    outlined
                  />

                  <v-text-field
                    v-model="newStudentForm.mail"
                    label="Mail"
                    outlined
                  />

                  <v-text-field
                    v-model="newStudentForm.phoneNumber"
                    label=" Telefon Numarası"
                    outlined
                  />

                  <v-select
                    v-model="newStudentForm.courses"
                    :items="classes"
                    item-text="courseName"
                    item-value="_id"
                    label="Kurs Seçiniz"
                    outlined
                  ></v-select>
                  <div class="flex justify-end w-full">
                    <v-btn dark @click="createStudent">Ekle</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

          <div v-if="selected">
            <v-dialog v-model="editStudentDialog" width="750">
              <template v-slot:activator="{ on, attrs }">
                <v-btn small dark v-bind="attrs" v-on="on">
                  Öğrenciyi Düzenle
                </v-btn>
              </template>

              <v-card>
                <v-card-title>
                  <span class="text-h5">Öğrenciyi Düzenle</span>
                </v-card-title>

                <v-card-text>
                  <div>
                    <v-text-field
                      v-model="editStudentForm.name"
                      label="Ad"
                      outlined
                    />
                    <v-text-field
                      v-model="editStudentForm.lastName"
                      label="Soyad"
                      outlined
                    />

                    <v-text-field
                      v-model="editStudentForm.mail"
                      label="Mail"
                      outlined
                    />

                    <v-text-field
                      v-model="editStudentForm.phoneNumber"
                      label=" Telefon Numarası"
                      outlined
                    />

                    <v-select
                      v-model="editStudentForm.courses"
                      :items="classes"
                      item-text="courseName"
                      item-value="_id"
                      label="Kurs Seçiniz"
                      outlined
                    ></v-select>
                    <div class="flex justify-end w-full">
                      <v-btn small dark @click="updateStudent">Düzenle</v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-btn small dark @click="snackbarDelete = true"
              >Öğrenciyi Sil</v-btn
            >
            <v-snackbar v-model="snackbarDelete">
              Bu öğrenci silinecektir, emin misiniz?
              <template v-slot:action="{ attrs }">
                <div class="flex">
                  <v-btn
                    color="success"
                    text
                    v-bind="attrs"
                    @click="deleteStudent"
                  >
                    Evet
                  </v-btn>
                  <v-btn
                    color="pink"
                    text
                    v-bind="attrs"
                    @click="snackbarDelete = false"
                  >
                    Hayır
                  </v-btn>
                </div>
              </template>
            </v-snackbar>
          </div>
        </div>
      </div>

      <div class="p-5">
        <table class="table-auto w-full bg-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Ad Soyad</th>
              <th class="px-4 py-2">E-posta</th>
              <th class="px-4 py-2">Kurs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student._id" class="rows">
              <td class="ml-2">
                <v-checkbox
                  :label="student._id"
                  v-model="selected"
                  :value="student._id"
                ></v-checkbox>
              </td>
              <td class="border px-4 py-2">
                {{ student?.name }} {{ student.lastName }}
              </td>
              <td class="border px-4 py-2">{{ student?.mail }}</td>
              <td class="border px-4 py-2">
                {{
                  classes.find((c) => c._id === student.courses[0])?.courseName
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "Sutents",
  created() {
    axios.get("http://localhost:3000/classes").then((response) => {
      this.classes = response.data;
    });

    this.getStudents();
  },
  data: () => ({
    selected: null,
    newStudentDialog: false,
    editStudentDialog: false,
    snackbarDelete: false,
    newStudentForm: {
      name: "",
      lastName: "",
      mail: "",
      phoneNumber: "",
      courses: [],
    },
    editStudentForm: {
      name: "",
      lastName: "",
      mail: "",
      phoneNumber: "",
      courses: [],
    },
    students: [],
    classes: [],
  }),

  watch: {
    selected() {
      if (this.selected) {
        this.editStudentForm = this.students.find(
          (s) => s._id === this.selected
        );
      }
    },
  },

  methods: {
    getStudents() {
      axios.get("http://localhost:3000/students").then((res) => {
        this.students = res.data;
      });
    },
    createStudent() {
      axios
        .post("http://localhost:3000/students/create", {
          ...this.newStudentForm,
          courses: [this.newStudentForm.courses],
        })
        .then((res) => {
          this.newStudentForm = {
            name: "",
            lastName: "",
            mail: "",
            phoneNumber: "",
            courses: [],
          };
          this.getStudents();
          this.newStudentDialog = false;
        });
    },
    deleteStudent() {
      axios
        .delete(`http://localhost:3000/students/${this.selected}/delete`)
        .then(() => {
          this.getStudents();
          this.snackbarDelete = false;
        });
    },
    updateStudent() {
      axios
        .put(`http://localhost:3000/students/${this.selected}/update`, {
          ...this.editStudentForm,
          courses: [this.editStudentForm.courses],
        })
        .then((res) => {
          this.editStudentForm = {
            name: "",
            lastName: "",
            mail: "",
            phoneNumber: "",
            courses: [],
          };
          this.getStudents();
          this.editStudentDialog = false;
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
