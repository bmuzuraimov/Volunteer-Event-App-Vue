<template>
  <div class="container-fluid">
    <div class="container">
      <WebPath :paths="path" :button="button" />
      <div class="row mb-2">
        <!-- User Profile Update Form -->
        <div class="card col-md-8 p-4">
          <h2>Update Profile</h2>
          <form class="row" @submit.prevent="save_profile" v-if="form._id">
            <input type="hidden" v-model="form._id" />
            <div class="col-6">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  @change="button_value = 'Save'"
                />
              </div>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  @change="button_value = 'Save'"
                />
              </div>
              <div class="mb-3">
                <label for="ageGroup" class="form-label">Age group</label>
                <select
                  id="ageGroup"
                  class="form-select"
                  v-model="form.age_group"
                  @change="button_value = 'Save'"
                >
                  <option selected>Choose...</option>
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
              <div class="my-3 form-check">
              <label class="form-check-label">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="termsCheckbox"
                  v-model="form.termsCheckbox"
                  required
                />
                agree to the terms and conditions.
              </label>
            </div>
              <button type="submit" class="btn btn-primary" id="save-btn">{{ button_value }}</button>
            </div>

            <div class="col-6">
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="form.password"
                  @change="button_value = 'Save'"
                />
              </div>
              <div class="mb-3">
                <label for="contact" class="form-label">Contact</label>
                <input
                  type="text"
                  class="form-control"
                  id="contact"
                  v-model="form.contact"
                  @change="button_value = 'Save'"
                />
              </div>
              <div class="mb-3">
                <label for="aboutMe" class="form-label"
                  >About me and remark</label
                >
                <textarea
                  class="form-control"
                  id="aboutMe"
                  rows="3"
                  v-model="form.remarks"
                  @change="button_value = 'Save'"
                ></textarea>
              </div>
            </div>
          </form>
          <Loading v-else/>
        </div>
        <!-- Event Organizers Pie Chart -->
        <div class="card col-md-4 p-4">
          <h2>Event Organizers</h2>
          <!-- Pie chart component would go here -->
          <Chart :data="organizers" v-if="organizers.length > 0"/>
          <Loading v-else/>
        </div>
      </div>
      <Events page="myevents"/>
    </div>
  </div>
</template>

<script>
import WebPath from "@/components/WebPath.vue";
import Loading from "@/components/Loading.vue";
import Events from "@/components/Events.vue";
import Chart from "@/components/Chart.vue";
import axios from "axios";
export default {
  components: {
    WebPath,
    Loading,
    Chart,
    Events,
  },
  data() {
    return {
      path: { "/": "Home", "/myevents": "My events" },
      button: null,
      form: {
        _id: "",
        name: "",
        email: "",
        password: "",
        contact: "",
        age_group: "",
        remarks: "",
        termsCheckbox: false,
      },
      organizers: [],
      button_value: "Save",
    };
  },
  mounted() {
    if (this.$userDecoded && !this.$userDecoded.isAdmin) {
      this.get_organizers();
      this.get_profile();
    }else{
      this.$router.push("/unauthorized");
    }
  },
  methods: {
    async save_profile() {
      try {
        this.button_value = "Saving...";
        const response = await axios.put(
          `/api/volunteer/profile`,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 399) {
          this.button_value = "Saved";
        } else {
          this.button_value = "Save";
        }
      } catch (error) {
        alert(error.response.data.message)
        this.button_value = "Save";
      }
    },
    async get_profile(){
      try {
        const response = await axios.get(
          `/api/volunteer/profile/${this.$userDecoded._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 399) {
          this.form = response.data;
        } else {
          alert(error.response.data.message);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    async get_organizers() {
      try {
        const response = await axios.get("/api/volunteer/organizers",
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 399) {
          this.organizers = response.data.organizers;
        } else {
          alert(error.response.data.message);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
};
</script>