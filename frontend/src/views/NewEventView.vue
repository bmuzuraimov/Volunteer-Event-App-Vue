<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row my-4">
        <div class="col-6 px-0">
          <ul class="path">
            <li v-for="(value, key, index) in paths" :key="key" class="mx-1">
              <a :class="['text-decoration-none', {'disabled-link': index === Object.keys(paths).length - 1}]" :href="key">
                {{ value }}
              </a>
              <span v-if="index !== Object.keys(paths).length - 1" class="mx-1">/</span>
            </li>
          </ul>
        </div>
      </div>
      <form class="row" @submit.prevent="handleSubmit">
        <div class="col-12 col-md-6">
          <!-- Form fields -->
          <div class="my-3">
            <label for="title">Event title</label>
            <input v-model="form.title" type="text" class="form-control" id="title" name="title">
          </div>
          <div class="my-3">
            <label for="organizer">Organizer</label>
            <input v-model="form.organizer" type="text" class="form-control" id="organizer" name="organizer">
          </div>
          <div class="my-3">
            <label for="datetime">Datetime</label>
            <input v-model="form.datetime" type="datetime-local" class="form-control" id="datetime" name="datetime">
          </div>
          <div class="my-3">
            <label for="location">Location</label>
            <input v-model="form.location" type="text" class="form-control" id="location" name="location">
          </div>
          <div class="my-3 form-check">
            <label class="form-check-label">
              <input v-model="form.highlight" class="form-check-input" name="highlight" type="checkbox"> Highlight
            </label>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <!-- Form fields -->
          <div class="my-3">
            <label for="description">Description</label>
            <textarea v-model="form.description" rows="4" class="form-control" id="description" name="description"></textarea>
          </div>
          <div class="my-3">
            <label for="quota">Quota</label>
            <input v-model.number="form.quota" type="number" class="form-control" id="quota" name="quota">
          </div>
          <div class="my-3">
            <label for="image">Image</label>
            <input v-model="form.image" type="text" class="form-control" id="image" name="image">
          </div>
          <button class="btn btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        title: '',
        organizer: '',
        datetime: '',
        location: '',
        description: '',
        quota: null,
        image: '',
        highlight: false
      },
      paths: { "/": "Home", "/event": "Events", "/event/new": "New event" },
    };
  },
  mounted() {
    if (!this.$userDecoded || !this.$userDecoded.isAdmin) {
      this.$router.push('/unauthorized');
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.title || !this.form.organizer || !this.form.datetime || !this.form.location || !this.form.description) {
        alert('Please fill in all required fields.');
        return;
      }
      if (this.form.quota <= 0) {
        alert('Quota should be a positive number.');
        return;
      }
      if (this.form.image && !/^https?:\/\/.+\..+/.test(this.form.image)) {
        alert('Image URL is not in the correct format.');
        return;
      }
      try {
        const response = await axios.post('/api/event', this.form);
        if(response.status >= 200 && response.status < 399) {
          alert('Event created successfully.');
          this.$router.push('/event');
        }else{
          alert(response.data.message);
        }
      }catch (error) {
        alert(error.response.data.message);
      }
    },
  }
};
</script>
