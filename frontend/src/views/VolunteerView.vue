<template>
  <div class="container">
    <WebPath :paths="paths" :button="button" @onButtonClick="deleteVolunteer" />
    <Loading v-if="!form._id && this.$route.path !== '/volunteer/new'" />
    <div
      class="container"
      v-if="form._id || this.$route.path == '/volunteer/new'"
    >
      <div class="row">
        <div class="col-12 col-md-6 px-2 py-2">
          <form @submit.prevent="handleSubmit()">
            <input type="hidden" name="_id" v-model="form._id" />
            <div class="my-3">
              <label for="email">Email</label>
              <input
                type="email"
                v-model="form.email"
                class="form-control"
                placeholder="Enter email"
                id="email"
                name="email"
                required
              />
            </div>
            <div class="my-3">
              <label for="pwd">Reset password</label>
              <input
                type="password"
                v-model="form.password"
                class="form-control"
                placeholder="Enter password"
                id="pwd"
                name="password"
                required
              />
            </div>
            <div class="my-3">
              <label for="name">Name</label>
              <input
                type="text"
                v-model="form.name"
                class="form-control"
                placeholder="Enter name"
                id="name"
                name="name"
                required
              />
            </div>
            <div class="my-3">
              <label for="contact">Contact</label>
              <input
                type="text"
                v-model="form.contact"
                class="form-control"
                placeholder="Enter contact"
                id="contact"
                name="contact"
                required
              />
            </div>
            <div class="my-3">
              <label for="group">Age group</label>
              <select
                class="form-control"
                v-model="form.age_group"
                name="age_group"
                id="group"
              >
                <option value="0-10">0-10</option>
                <option value="11-20">11-20</option>
                <option value="21-30">21-30</option>
                <option value="31-40">31-40</option>
                <option value="41-50">41-50</option>
                <option value="51-60">51-60</option>
                <option value="61-70">61-70</option>
                <option value="71-80">71-80</option>
                <option value="81-90">81-90</option>
                <option value="91-100">91-100</option>
              </select>
            </div>
            <div class="my-3">
              <label for="remarks">About me and remark</label>
              <textarea
                type="text"
                v-model="form.remarks"
                class="form-control"
                placeholder="Enter remarks"
                id="remarks"
                name="remarks"
                required
              ></textarea>
            </div>
            <div class="my-3 form-check">
              <label class="form-check-label">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="termsCheckbox"
                  required
                />
                agree to the terms and conditions.
              </label>
            </div>
            <button type="submit" class="btn btn-primary my-2">{{ saveBtn}}</button>
          </form>
        </div>
        <div class="col-12 col-md-6 px-2 py-2">
          <table class="table" ref="volunteers">
            <thead>
              <tr>
                <th scope="col">Event title</th>
                <th scope="col">Action</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event._id">
                <th>{{ event.title }}</th>
                <td>
                  <router-link
                    :to="`/event/edit/${event._id}`"
                    class="btn btn-outline-secondary"
                    >Edit</router-link
                  >
                </td>
                <td><button @click="delete_enrollment($event)" :event-id="event._id" class="btn btn-outline-danger">X</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebPath from "@/components/WebPath.vue";
import axios from "axios";
import Loading from "@/components/Loading.vue";
export default {
  props: ["id"],
  components: {
    WebPath,
    Loading,
  },
  data() {
    return {
      paths: {
        "/": "Home",
        "/volunteers": "Volunteers",
        "/volunteer/new": "Edit",
      },
      button: null,
      saveBtn: "Save",
      method: "POST",
      events: [],
      form: {
        _id: this.id,
        name: "",
        email: "",
        password: "",
        contact: "",
        age_group: "",
        remarks: "",
      },
    };
  },
  mounted() {
    if (this.$userDecoded && this.$userDecoded.isAdmin) {
      if (this.$route.path !== "/volunteer/new") this.method = "PUT";
      this.fetch_volunteer();
      this.fetch_events();
    } else {
      this.$router.push("/unauthorized");
    }
  },
  methods: {
    async delete_enrollment(event){
      event.target.innerHTML = "Deleting...";
      // get attribute of event-id
      const event_id = event.target.getAttribute("event-id");
      event.target.disabled = true;
      try{
        const response = await axios.delete(`/api/admin/enrollment/${this.form._id}/${event_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if(response.status >= 200 && response.status < 399){
          event.target.innerHTML = "Deleted";
          this.events = this.events.filter((event) => event._id !== event_id);
        }else{
          event.target.innerHTML = "Delete";
          alert(response.data.message);
        }
      }catch(error){
        alert(error.response.data.message);
      }
    },
    async deleteVolunteer() {
      try {
        this.button.msg = "Deleting...";
        const response = await axios.delete(`/api/admin/volunteer/${this.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status >= 200 && response.status < 399) {
          this.button.msg = "Deleted";
          alert(response.data.message);
          this.$router.push("/volunteers");
        } else {
          this.button.msg = "Delete";
          alert(response.data.message);
        }
      } catch (error) {
        this.button.msg = "Delete";
        alert(error.response.data.message);
      }
    },
    async fetch_volunteer() {
      const response = await axios.get(`/api/admin/volunteer/${this.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status >= 200 && response.status < 399) {
        this.form = response.data.volunteer;
        this.button = {
          msg: "Delete",
          path: "/volunteer/delete/" + this.form._id,
          type: "btn btn-danger",
          emitFunc: this.deleteVolunteer,
          isShow: true,
        };
      }
    },
    async fetch_events() {
      try {
        const response = await axios.get(
          `/api/volunteer/myevent/${this.id}?perPage=1000`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.data;
        this.events = result.events;
      } catch (error) {
        alert(error);
      }
    },
    async handleSubmit(){
      this.saveBtn = "Saving...";
      if (
        !this.form.name ||
        !this.form.email ||
        !this.form.password ||
        !this.form.contact ||
        !this.form.age_group ||
        !this.form.remarks
      ) {
        alert("Please fill in all required fields.");
        this.saveBtn = "Save";
        return;
      }
      if (this.form.password.length <= 8) {
        alert("Password should be at least 8 characters long.");
        this.saveBtn = "Save";
        return;
      }
      try {
        if (this.method === "PUT") {
          const response = await axios.put(`/api/admin/volunteer`, this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.status >= 200 && response.status < 399) {
            this.saveBtn = "Saved";
            alert(response.data.message)
          } else {
            alert(response.data.message)
          }
        } else {
          const response = await axios.post(`/api/admin/volunteer`, this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.status >= 200 && response.status < 399) {
            this.saveBtn = "Saved";
            alert("Volunteer saved");
          } else{
            this.saveBtn = "Save";
            alert(response.data.message)
          }
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
};
</script>