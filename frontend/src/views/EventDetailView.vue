<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row my-4">
        <div class="col-6 px-0">
          <ul class="path">
            <li v-for="(path, key, index) in paths" :key="key" class="mx-1">
              <router-link
                :class="[
                  'text-decoration-none',
                  { 'disabled-link': index === Object.keys(paths).length - 1 },
                ]"
                :to="key"
              >
                {{ path }}
              </router-link>
              <span v-if="index !== Object.keys(paths).length - 1" class="mx-1"
                >/</span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6 my-sm-4">
          <h3>
            {{ event.title }}
          </h3>
          <h5 class="text-muted">
            {{ event.organizer }}
          </h5>
          <p>
            {{ event.description }}
          </p>
          <div class="event-details-bottom rounded">
            <p class="m-0 p-2">
              {{ event.datetime }}
            </p>
            <p
              class="m-0 p-2"
              style="
                border-top: 1px solid #dfdfdf;
                border-bottom: 1px solid #dfdfdf;
              "
            >
              {{ event.location }}
            </p>
            <p class="m-0 p-2">
              {{ event.quota }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6 my-sm-4">
          <div class="card">
            <div class="img">
              <img class="card-img-top" :src="event.image" alt="" />
            </div>
            <div class="description px-4">
              <table class="table" v-if="$userDecoded.isAdmin">
                <thead>
                  <tr>
                    <th scope="col">Volunteer name</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Action</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="volunteer in volunteers" :key="volunteer._id">
                    <th>{{ volunteer.first_name }}</th>
                    <th>{{ volunteer.contact }}</th>
                    <td>
                      <router-link
                        :to="`/volunteer/${volunteer._id}`"
                        class="btn btn-outline-secondary"
                        >Edit</router-link
                      >
                    </td>
                    <td><button @click="delete_enrollment($event)" :volunteer-id="volunteer._id" class="btn btn-outline-danger">X</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      paths: {},
      event: {},
      volunteers: [],
      id: null,
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getEvent();
    if (this.$userDecoded && this.$userDecoded.isAdmin) {
      this.get_volunteers();
    }
  },
  methods: {
    async delete_enrollment(event){
      event.target.innerHTML = "Deleting...";
      // get attribute of event-id
      const volunteer_id = event.target.getAttribute("volunteer-id");
      event.target.disabled = true;
      try{
        const response = await axios.delete(`/api/admin/enrollment/${volunteer_id}/${this.event._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if(response.status >= 200 && response.status < 399){
          event.target.innerHTML = "Deleted";
          this.volunteers = this.volunteers.filter((volunteer) => volunteer._id !== volunteer_id);
        }else{
          event.target.innerHTML = "Delete";
          alert(response.data.message);
        }
      }catch(error){
        alert(error.response.data.message);
      }
    },
    async getEvent() {
      try {
        const response = await axios.get(`/api/event/${this.id}`);
        if (response.status >= 200 && response.status < 399) {
          this.event = response.data.event;
          this.paths = {
            "/": "Home",
            "/event": "Event",
            "/event/detail/idx": this.event.title,
          };
        } else {
          alert(response.data.message);
          this.$route.push("/");
        }
      } catch (error) {
        alert(error.response.data.message);
      } finally {
      }
    },
    async get_volunteers() {
      try {
        const response = await axios.get(`/api/admin/evolunteers/${this.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status >= 200 && response.status < 399) {
          this.volunteers = response.data.volunteers;
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error.response.data.message);
      } finally {
      }
    },
  },
};
</script>

