// Import global CSS at the top
import './assets/main.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@oruga-ui/theme-bootstrap/dist/bootstrap.css';
import '@mdi/font/css/materialdesignicons.min.css';

// Import JavaScript libraries
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import admin_router from './router/admin_router';
import volunteer_router from './router/volunteer_router';

// Import third-party Vue plugins
import Oruga from '@oruga-ui/oruga-next';
import { bootstrapConfig } from '@oruga-ui/theme-bootstrap';
import VueSweetalert2 from 'vue-sweetalert2';
import VueApexCharts from "vue3-apexcharts";
import VueJwtDecode from 'vue-jwt-decode'

// Import Bootstrap JavaScript (consider if necessary as Oruga might cover your needs)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Create Vue application
const app = createApp(App);

const token = localStorage.getItem('token');
if (token) {
    app.config.globalProperties.$userDecoded = VueJwtDecode.decode(token);
} else {
    app.config.globalProperties.$userDecoded = null;
}

// Use plugins with the Vue application
app.use(router);
// app.use(admin_router);
// app.use(volunteer_router);
app.use(Oruga, bootstrapConfig);
app.use(VueSweetalert2);
app.use(VueApexCharts);

// Mount the app to the DOM
app.mount('#app');
