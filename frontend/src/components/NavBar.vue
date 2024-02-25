<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <div class="navbar-brand">
        <img src="/images/logo.svg" alt="logo" width="180" height="30" class="d-inline-block align-text-top" />
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/event" class="nav-link">Events</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/become/volunteer" class="nav-link">Become Volunteer</router-link>
          </li>
          <li class="nav-item" v-if="is_signedin && this.$userDecoded && this.$userDecoded.isAdmin">
            <router-link to="/volunteers" class="nav-link">Volunteers</router-link>
          </li>
          <li class="nav-item" v-if="is_signedin && this.$userDecoded && !this.$userDecoded.isAdmin">
            <router-link to="/myevents" class="nav-link">My events</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <input type="text" class="form-control me-2" placeholder="Search" v-model="searchQuery" />
          <button class="btn btn-outline-success" @click="search">Search</button>
          <router-link v-if="!is_signedin" to="/login" class="btn btn-outline-primary ms-2">Login</router-link>
          <button @click="logout" v-else class="btn btn-outline-primary ms-2">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
export default {
  mounted() {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.search();
      }
    });
  },
  data() {
    return {
      is_signedin: this.$userDecoded ? true : false,
      searchQuery: "", // Data property for the input value
    };
  },
  methods: {
    search() {
      // Navigate to the search route with the keyword
      if(!this.searchQuery) return;
      this.$router.push(`/search/${this.searchQuery}`);
      this.searchQuery = ""; // Reset the input value
    },
    logout() {
      localStorage.removeItem("token");
      this.is_signedin = false;
      this.$userDecoded = null;
      window.location.href = "/login";
    },
  },
};
</script>

<style scoped>
/* Navigation Styles */
.navbar-brand {
  color: #181819;
  font-weight: bold;
}

.nav-link {
  color: #525252;
}

.nav-link:hover {
  color: #007bff;
}

.form-control {
  max-width: 200px;
}
</style>