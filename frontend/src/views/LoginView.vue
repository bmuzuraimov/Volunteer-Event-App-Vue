<template>
  <main class="d-flex justify-content-center align-items-center vh-100">
    <form
      @submit.prevent="login"
      class="border p-4 rounded shadow-lg"
      style="width: 300px"
    >
      <h3 class="text-center mb-4">Login</h3>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          v-model="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
      </div>

      <div class="mb-4">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="exampleInputPassword1"
        />
      </div>

      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Remember me</label>
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="isLoggingIn"
      >
        {{ isLoggingIn ? "Logging in..." : "Login" }}
      </button>
      <div @click="setadmin" class="alert alert-success mt-2" role="alert">
        Fill admin(grading purposes)
      </div>
      <div @click="setvolunteer" class="alert alert-secondary" role="alert">
        Fill volunteer(grading purposes)
      </div>
    </form>
  </main>
</template>


<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      isLoggingIn: false,
    };
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.$router.push("/");
    }
  },
  methods: {
    setadmin() {
      this.email = "choym@hkbu.hk";
      this.password = "password";
    },
    setvolunteer() {
      this.email = "bmuzuraimov@hkbu.hk";
      this.password = "password";
    },
    async login() {
      try {
        this.isLoggingIn = true;
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        const data = await response.json();
        if (response.status > 399) {
          this.showAlert(data.message);
        } else {
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        }
      } catch (error) {
        alert(error);
      } finally {
        this.isLoggingIn = false;
      }
    },
    showAlert(message) {
      this.$swal(message);
    },
  },
};
</script>