<template>
  <div class="container">
    <WebPath :paths="paths" />
    <!-- The form with email password name contact age group about me and remarks and checkbox to agree with terms and conditions -->
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 px-2 py-2">
          <form action="/become/volunteer" @submit.prevent="submitVolunteer">
            <div class="errors btn-danger" ref="error-box"></div>
            <div class="my-3">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                placeholder="Enter email"
                id="email"
                v-model="form.email"
                required
              />
            </div>
            <div class="my-3">
              <label for="pwd">Password</label>
              <input
                type="password"
                class="form-control"
                placeholder="Enter password"
                id="pwd"
                v-model="form.password"
                required
              />
            </div>
            <div class="my-3">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter name"
                id="name"
                v-model="form.name"
                required
              />
            </div>
            <div class="my-3">
              <label for="contact">Contact</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter contact"
                id="contact"
                v-model="form.contact"
                required
              />
            </div>
            <div class="my-3">
              <label for="group">Age group</label>
              <select class="form-control" v-model="form.age_group" id="group">
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
                class="form-control"
                placeholder="Enter remarks"
                id="remarks"
                v-model="form.remarks"
                required
              ></textarea>
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
            <button type="submit" class="btn btn-primary my-2">Register</button>
          </form>
        </div>
        <div class="col-12 col-md-6">
          <div class="card">
            <div class="img">
              <img class="card-img-top" src="/images/content-1.jpg" alt="" />
            </div>
            <div class="description px-4">
              <h4 class="text-muted my-2">Become a volunteer!</h4>
              <p class="text-muted">
                Your time and talent can make a real different in people's life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import WebPath from "@/components/WebPath.vue";
import axios from "axios";
// document.title = this.$route.name;
export default {
  components: {
    WebPath,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        name: "",
        contact: "",
        age_group: "",
        remarks: "",
        termsCheckbox: false,
      },
      paths: { "/": "Home", "/become/volunteer": "Become a volunteer" },
    };
  },
  methods: {
    async submitVolunteer() {
      try {
        const response = await axios.post(
          `/api/become/volunteer`,
          this.form
        );
        if (response.status >= 200 && response.status < 399) {
          alert("Volunteer submitted!");
          this.$router.push("/");
        }else{
          let errors = response.json()
          for (let key in errors) {
            let span = document.createElement("span");
            span.innerHTML = errors[key];
            this.$refs["error-box"].appendChild(span);
          }
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
};
</script>