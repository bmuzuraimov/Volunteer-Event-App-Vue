<template>
  <div class="container-fluid">
    <div class="container">
      <WebPath :paths="paths" :button="button" @onButtonClick="deleteEvent" />
      <form class="row" @submit.prevent="handleSubmit">
        <input type="hidden" name="_id" v-model="form._id" />
        <div class="col-12 col-md-6">
          <!-- Form fields -->
          <div class="my-3">
            <label for="title">Event title</label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              id="title"
              name="title"
            />
          </div>
          <div class="my-3">
            <label for="organizer">Organizer</label>
            <input
              v-model="form.organizer"
              type="text"
              class="form-control"
              id="organizer"
              name="organizer"
            />
          </div>
          <div class="my-3">
            <label for="datetime">Datetime</label>
            <input
              v-model="form.datetime"
              type="datetime-local"
              class="form-control"
              id="datetime"
              name="datetime"
            />
          </div>
          <div class="my-3">
            <label for="location">Location</label>
            <input
              v-model="form.location"
              type="text"
              class="form-control"
              id="location"
              name="location"
            />
          </div>
          <div class="my-3 form-check">
            <label class="form-check-label">
              <input
                v-model="form.highlight"
                class="form-check-input"
                name="highlight"
                type="checkbox"
              />
              Highlight
            </label>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <!-- Form fields -->
          <div class="my-3">
            <label for="description">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-control"
              id="description"
              name="description"
            ></textarea>
          </div>
          <div class="my-3">
            <label for="quota">Quota</label>
            <input
              v-model.number="form.quota"
              type="number"
              class="form-control"
              id="quota"
              name="quota"
            />
          </div>
          <div class="my-3">
            <label for="image">Image</label>
            <input
              v-model="form.image"
              type="text"
              class="form-control"
              id="image"
              name="image"
            />
          </div>
          <button class="btn btn-primary" type="submit">{{ saveBtn }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import WebPath from "@/components/WebPath.vue";
export default {
  components: {
    WebPath,
  },
  data() {
    return {
      id: null,
      button: null,
      loading: false,
      saveBtn: "Save",
      form: {
        _id: null,
        title: "",
        organizer: "",
        datetime: "",
        location: "",
        description: "",
        quota: null,
        image: "",
        highlight: false,
      },
      paths: { "/": "Home", "/event": "Events", "/edit": "Edit event" },
    };
  },
  methods: {
    async deleteEvent() {
      try {
        this.button.msg = "Deleting...";
        const response = await axios.delete(
          `/api/admin/event/${this.form._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 399) {
          this.button.msg = "Deleted";
          alert(response.data.message);
          this.$router.push("/event");
        } else {
          this.button.msg = "Delete";
          alert(response.data.message);
        }
      } catch (error) {
        this.button.msg = "Delete";
        alert(error.response.data.message);
      }
    },
    async handleSubmit() {
      try {
        this.saveBtn = "Saving...";
        const response = await axios.put(`/api/admin/event`, this.form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status >= 200 && response.status < 399) {
          this.saveBtn = "Saved";
        } else {
          this.saveBtn = "Save";
          alert(response.data.message);
        }
      } catch (error) {
        this.saveBtn = "Save";
        alert(error.response.data.message);
      }
    },
    async getEvent() {
      try {
        const response = await axios.get(`/api/event/${this.id}`);
        this.form = response.data.event;
        this.button = {
          msg: "Delete",
          type: "btn btn-danger",
          path: "/event/edit/" + this.form._id,
          emitFunc: this.deleteEvent,
          isShow: true,
        };
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
  mounted() {
    if (!this.$userDecoded || !this.$userDecoded.isAdmin) {
      this.$router.push("/unauthorized");
    } else {
      this.id = this.$route.params.id;
      this.getEvent();
    }
  },
};
</script>

