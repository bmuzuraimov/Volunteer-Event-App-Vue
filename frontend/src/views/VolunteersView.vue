<template>
  <div class="container-fluid">
    <div class="container">
      <WebPath :paths="paths" :button="button" />
      <Loading v-if="total === 0" />
      <table class="table" ref="volunteers" v-if="total !== 0">
        <thead>
          <tr>
            <th scope="col">Volunteer name</th>
            <th scope="col">Email</th>
            <th scope="col">Contact</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="volunteer in volunteers" :key="volunteer._id">
            <th>{{ volunteer.name }}</th>
            <td>{{ volunteer.email }}</td>
            <td>{{ volunteer.contact }}</td>
            <td>
              <router-link
                :to="'/volunteer/' + volunteer._id"
                class="btn btn-secondary"
                >Edit</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="my-4" v-if="total != 0">
        <ul class="pagination">
          <!-- First page -->
          <li class="page-item" :class="{ active: currentPage === 1 }">
            <span
              class="page-link"
              style="cursor: pointer"
              @click="handlePagination($event)"
              >1</span
            >
          </li>

          <!-- Indicate break with "..." if page > 3 -->
          <li v-if="currentPage > 3" class="page-item disabled">
            <span class="page-link" style="cursor: pointer">...</span>
          </li>

          <!-- Middle pages -->
          <li
            v-for="i in middlePages"
            :key="i"
            :class="{ 'page-item': true, active: i === currentPage }"
          >
            <span
              class="page-link"
              style="cursor: pointer"
              @click="handlePagination($event)"
              >{{ i }}</span
            >
          </li>

          <!-- Indicate break with "..." if there's a gap to the last page -->
          <li v-if="currentPage < totalPages - 2" class="page-item disabled">
            <span class="page-link" style="cursor: pointer">...</span>
          </li>

          <!-- Last page, but only if there's more than 1 page -->
          <li
            v-if="totalPages > 1"
            :class="{ 'page-item': true, active: currentPage === totalPages }"
          >
            <span
              class="page-link"
              style="cursor: pointer"
              @click="handlePagination($event)"
              >{{ totalPages }}</span
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import WebPath from "@/components/WebPath.vue";
import Loading from "@/components/Loading.vue";
export default {
  components: {
    WebPath,
    Loading,
  },
  data() {
    return {
      button: {
        msg: "New",
        path: "/volunteer/new",
        type: "btn btn-primary",
        isShow: true,
      },
      volunteers: [],
      currentPage: 1,
      perPage: 6,
      total: 0,
      paths: { "/": "Home", "/volunteers": "Volunteers" },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    middlePages() {
      let start = Math.max(2, this.currentPage - 2);
      let end = Math.min(this.currentPage + 2, this.totalPages - 1);
      let pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  mounted() {
    if (this.$userDecoded && this.$userDecoded.isAdmin) {
      this.get_volunteers();
    } else {
      this.$router.push("/unauthorized");
    }
  },
  methods: {
    async get_volunteers() {
      try {
        const response = await axios.get(
          `/api/admin/volunteer?page=${this.currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 399) {
          this.volunteers = response.data.volunteers;
          this.total = response.data.total;
          this.currentPage = response.data.page;
          this.perPage = response.data.perPage;
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    handlePagination(e) {
      this.total = 0;
      this.$refs.volunteers.style.display = "none";
      this.currentPage = parseInt(e.target.textContent);
      this.get_volunteers();
    },
  },
};
</script>
<style>
</style>