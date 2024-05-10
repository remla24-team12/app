<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
    fetchVersion()
})

const fetchVersion = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/lib-version');
    // const response = await axios.get('http://localhost:3000');
    version.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

</script>

<template>
    <p>v: {{ version }}</p>
</template>

<style scoped>
p {
    font-size: 15px;
    justify-self: right;
    align-self: right;
}
</style>