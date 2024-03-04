<template>
  <v-app>
    <div class="p-3">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-500">
          Sınıflar ve Dersler [ {{ classes.length }} ]
        </h1>

        <v-dialog v-model="newClassModal" width="750">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              small
              style="background-color: rgb(59, 123, 123)"
              v-bind="attrs"
              v-on="on"
              >Yeni Sınıf Ekle</v-btn
            >
          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">Yeni Sınıf Oluştur</span>
            </v-card-title>

            <v-card-text class="mt-5">
              <div>
                <div class="flex gap-5">
                  <v-text-field
                    label="Sınıf Adı"
                    outlined
                    dense
                    class="w-full"
                    v-model="newClass.name"
                  ></v-text-field>

                  <v-text-field
                    label="Toplam Saat"
                    outlined
                    dense
                    class="w-full"
                    v-model="newClass.totalHours"
                  ></v-text-field>
                </div>

                <v-select
                  :items="instructors"
                  :item-text="(item) => `${item.name} ${item.lastName}`"
                  :item-value="(item) => `${item._id}`"
                  v-model="newClass.instructor"
                  label="Eğitmen Seçiniz"
                  outlined
                  dense
                  class="w-full mt-5"
                ></v-select>

                <v-select
                  :items="students"
                  v-model="newClass.students"
                  multiple
                  label="Öğrencileri Seçiniz"
                  :item-text="(item) => `${item.name} ${item.lastName}`"
                  :item-value="(item) => `${item._id}`"
                  outlined
                  dense
                  class="w-full mt-5"
                ></v-select>
                <v-menu
                  ref="startDateMenu"
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Start Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="startDateMenu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.startDateMenu.save(startDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <v-menu
                  ref="endDateMenu"
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      label="End Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="endDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="endDateMenu = false">
                      Cancel
                    </v-btn>
                    <v-btns
                      text
                      color="primary"
                      @click="$refs.endDateMenu.save(endDate)"
                    >
                      OK
                    </v-btns>
                  </v-date-picker>
                </v-menu>
              </div>
              <div class="w-full flex justify-end">
                <v-btn dark small @click="createClass">Sınıfı Oluştur</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>

      <div class="grid grid-cols-4 mt-10 gap-5">
        <div class="border p-3 flex flex-col" v-for="activeClass in classes">
          <h2 class="text-xl text-gray-700">{{ activeClass.courseName }}</h2>
          <span class="text-gray-500"
            >Eğitmen:
            <b
              >{{ activeClass?.instructor?.name || "-" }}
              {{ activeClass?.instructor?.lastName }}</b
            ></span
          >
          <span class="text-gray-500"
            >Toplam Öğrenci:
            <b>{{ activeClass?.students?.length || 0 }}</b></span
          >
          <span class="text-gray-500">
            Tarih:
            <b
              >{{ formatDate(activeClass.startDate) }} -
              {{ formatDate(activeClass.endDate) }}</b
            >
          </span>

          <div class="w-full mt-5">
            <v-dialog v-model="editClassModal" width="750">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  x-small
                  v-bind="attrs"
                  v-on="on"
                  @click="handleEditClass(activeClass)"
                  >Düzenle</v-btn
                >
              </template>

              <v-card>
                <v-card-title>
                  <span class="text-h5">Sınıfı Düzenle</span>
                </v-card-title>

                <v-card-text class="mt-5">
                  <div>
                    <div class="flex gap-5">
                      <v-text-field
                        label="Sınıf Adı"
                        outlined
                        dense
                        class="w-full"
                        v-model="editClassForm.courseName"
                      ></v-text-field>

                      <v-text-field
                        label="Toplam Saat"
                        outlined
                        dense
                        class="w-full"
                        v-model="editClassForm.totalHours"
                      ></v-text-field>
                    </div>
                    <v-select
                      :items="instructors"
                      :item-text="(item) => `${item.name} ${item.lastName}`"
                      :item-value="(item) => `${item._id}`"
                      v-model="editClassForm.instructor"
                      label="Eğitmen Seçiniz"
                      outlined
                      dense
                      class="w-full mt-5"
                    ></v-select>
                    <v-select
                      v-model="editClassForm.students"
                      :items="students"
                      :item-text="(item) => `${item.name} ${item.lastName}`"
                      :item-value="(item) => `${item._id}`"
                      label="Öğrencileri Seçiniz"
                      outlined
                      multiple
                      dense
                      class="w-full mt-5"
                    ></v-select>
                    <v-menu
                      ref="startDateMenu"
                      v-model="startDateMenu"
                      :close-on-content-click="false"
                      :return-value.sync="startDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="startDate"
                          label="Start Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="startDate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="startDateMenu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.startDateMenu.save(startDate)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-menu
                      ref="endDateMenu"
                      v-model="endDateMenu"
                      :close-on-content-click="false"
                      :return-value.sync="endDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="endDate"
                          label="End Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="endDate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="endDateMenu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btns
                          text
                          color="primary"
                          @click="$refs.endDateMenu.save(endDate)"
                        >
                          OK
                        </v-btns>
                      </v-date-picker>
                    </v-menu>
                  </div>
                  <div class="w-full flex justify-end">
                    <v-btn dark small @click="editClass">Güncelle</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-btn dark x-small @click="snackbarDelete = true">Sil</v-btn>
            <v-snackbar v-model="snackbarDelete">
              Bu sınıf silinecektir, emin misiniz?

              <template v-slot:action="{ attrs }">
                <div class="flex">
                  <v-btn
                    color="green"
                    text
                    v-bind="attrs"
                    @click="deleteClass(activeClass._id)"
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
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "Classes",
  data: () => ({
    newClassModal: false,
    editClassModal: false,
    startDate: new Date().toISOString().substr(0, 10),
    startDateMenu: false,
    endDate: new Date().toISOString().substr(0, 10),
    endDateMenu: false,
    snackbarDelete: false,
    newClass: {
      name: "",
      instructor: "",
      students: [],
      startDate: "",
      endDate: "",
      totalHours: 0,
    },
    editClassForm: {
      id: null,
      courseName: "",
      instructor: "",
      students: [],
      startDate: "",
      endDate: "",
      totalHours: 0,
    },
    classes: [],
    students: [],
    instructors: [],
  }),
  async created() {
    await this.getClasses();
    await this.getStudents();
    await this.getInstructors();
  },
  methods: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    handleEditClass(activeClass) {
      this.editClassModal = true;
      console.log(activeClass);
      this.editClassForm = {
        _id: activeClass._id,
        courseName: activeClass.courseName,
        instructor: activeClass.instructor,
        students: activeClass.students,
        startDate: activeClass.startDate,
        endDate: activeClass.endDate,
        totalHours: activeClass.totalHours,
      };
    },
    async getStudents() {
      await axios.get("http://localhost:3000/students/").then((res) => {
        this.students = res.data;
      });
    },
    async getInstructors() {
      await axios.get("http://localhost:3000/instructors/").then((res) => {
        this.instructors = res.data;
      });
    },
    async getClasses() {
      await axios.get("http://localhost:3000/classes").then((res) => {
        this.classes = res.data;
      });
    },
    createClass() {
      const reqBody = {
        courseName: this.newClass.name,
        instructor: this.newClass.instructor,
        students: this.newClass.students,
        startDate: this.startDate,
        endDate: this.endDate,
        totalHours: this.newClass.totalHours,
      };

      axios
        .post("http://localhost:3000/classes/create", reqBody)
        .then((res) => {
          this.getClasses();
          this.newClassModal = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteClass(id) {
      axios.delete(`http://localhost:3000/classes/${id}/delete`).then((res) => {
        this.getClasses();
        this.snackbarDelete = false;
      });
    },
    editClass() {
      axios
        .put(
          `http://localhost:3000/classes/${this.editClassForm._id}/update`,
          this.editClassForm
        )
        .then((res) => {
          this.getClasses();
          this.editClassModal = false;
        });
    },
  },
};
</script>
