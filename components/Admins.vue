<template>
  <v-app>
    <div>
      <div class="flex justify-between p-5">
        <h2 class="text-2xl font-bold text-gray-500">
          Tüm Yöneticiler [ {{ admins?.length || 0 }} ]
        </h2>
        <div>
          <v-dialog v-model="newManagerDialog" width="750">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                style="background-color: rgb(59, 123, 123); color: white"
                v-bind="attrs"
                v-on="on"
              >
                Yönetici Ekle
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">Yeni Yönetici Ekle</span>
              </v-card-title>

              <v-card-text>
                <div class="mt-5">
                  <v-text-field
                    v-model="newManagerFrom.name"
                    label="Ad"
                    outlined
                  />
                  <v-text-field
                    v-model="newManagerFrom.lastName"
                    label="Soyad"
                    outlined
                  />
                  <v-text-field
                    v-model="newManagerFrom.password"
                    label="Şifre"
                    type="password"
                    outlined
                  />
                  <v-text-field
                    v-model="newManagerFrom.mail"
                    label="Mail"
                    outlined
                  />
                  <v-text-field
                    v-model="newManagerFrom.phoneNumber"
                    label=" Telefon Numarası"
                    outlined
                  />
                  <v-select
                    v-model="newManagerFrom.role"
                    :items="roles"
                    label="Rol"
                    outlined
                  ></v-select>
                  <div class="flex justify-end w-full">
                    <v-btn dark @click="createManager">Ekle</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <div class="p-5">
        <table class="table-auto w-full bg-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2">Ad Soyad</th>
              <th class="px-4 py-2">E-posta</th>
              <th class="px-4 py-2">Rol</th>
              <th class="px-4 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admin in admins" class="rows">
              <td class="border px-4 py-2">
                {{ admin.name }} {{ admin.lastName }}
              </td>
              <td class="border px-4 py-2">{{ admin.mail }}</td>
              <td class="border px-4 py-2">{{ admin.role }}</td>
              <td class="border px-4 py-2 flex justify-center items-center">
                <v-btn x-small @click="snackbarDelete = true" color="error"
                  >Sil</v-btn
                >
                <v-snackbar v-model="snackbarDelete">
                  Bu öğrenci silinecektir, emin misiniz?
                  <template v-slot:action="{ attrs }">
                    <div class="flex">
                      <v-btn
                        color="success"
                        text
                        v-bind="attrs"
                        @click="handleDelete(admin._id)"
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
  name: "Admins",

  data: () => ({
    admins: [],
    newManagerDialog: false,
    snackbarDelete: false,
    roles: ["manager", "instructor", "editor"],
    newManagerFrom: {
      name: "",
      lastName: "",
      password: "",
      mail: "",
      phoneNumber: "",
      role: "",
    },
  }),
  created() {
    this.getAdmins();
  },
  methods: {
    getAdmins() {
      axios
        .get("http://localhost:3000/admins")
        .then((res) => {
          this.admins = res.data.admins;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    createManager() {
      axios
        .post("http://localhost:3000/admins/create", this.newManagerFrom)
        .then((res) => {
          this.getAdmins();
          this.newManagerDialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleDelete(id) {
      axios
        .delete(`http://localhost:3000/admins/${id}/delete`)
        .then((res) => {
          this.getAdmins();
          this.snackbarDelete = false;
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
