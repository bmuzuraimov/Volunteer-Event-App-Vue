<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <h1 class="display-1 fw-bold">401</h1>
          <p class="fs-3"> <span class="text-danger">Oops!</span> Unauthorized Access.</p>
          <p class="lead">
            With great power comes great responsibility!
          </p>
          <router-link to="/" class="btn btn-primary">Go Home</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Unauthorized",
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 80px;
  }
  </style>
  