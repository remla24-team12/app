<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const version = ref()

// Once this component is mounted, fetch the app's version from the backend
onMounted(async () => {
    await fetchVersion()
})

const fetchVersion = async () => {
  console.log("DEBUG")
  console.log(process.env)
  console.log(process.env.APP_API_URL)
  try {
    const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/lib-version`);
    version.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

</script>

<template>
    <p>{{ version }}</p>
</template>

<style scoped>
p {
    font-size: 15px;
    justify-self: right;
    align-self: right;
}
</style>