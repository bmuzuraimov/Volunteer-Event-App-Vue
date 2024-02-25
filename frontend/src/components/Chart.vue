<template>
    <div>
      <apexchart type="donut" :options="options" :series="series" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['data'],
    data() {
      return {
        options: {
          chart: {
            width: 380,
            type: "pie",
          },
          labels: [],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        series: [],
      };
    },
    mounted() {
      this.options.labels = this.data.map((organizer) => organizer._id);
      this.series = this.data.map((organizer) => Math.round(organizer.percentage));
    },
  };
  </script>
  <style>
  </style>
  