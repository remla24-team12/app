<script setup>
import { ref } from 'vue'
import axios from 'axios'
import AppVersion from '@/components/AppVersion.vue'

const inputUrl = ref("") // User input
const responsePrediction = ref('') // Backend response

// Test if URL given by the user is valid using a RegEx
const isValidUrl = async () => {
  const pattern =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

  const isValid = pattern.test(inputUrl.value);
  
  // Invalid URL, ask the user to change it
  if (!isValid) {
    alert('Please enter a valid URL');
    return
  }

  // Valid URL, make a request to the backend
  await fetchPrediction()
}

// Fetch prediction of URL Phishing CNN 
const fetchPrediction = async () => {
  try {
    const response = await  axios.post(`${process.env.VUE_APP_API_URL}/api/prediction`, {
      url: inputUrl.value
    });
    responsePrediction.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    responsePrediction.value = '';
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <div>
        <h1>Phishing Detector</h1>
        <p>This webpage can help you detecting fake URLs.</p>
        <p>Please enter one here to see if it is valid:</p>
      </div>
      <input v-model.trim="inputUrl" placeholder="URL">
      <a @click="isValidUrl" class="button"><button>Test</button></a>
      <div class="versioncontainer">
        <AppVersion />
      </div>
    </div>

    <p v-if="responsePrediction">{{ responsePrediction }}</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 5%;
}

.card {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  max-width: 60%;
  height: 350px;
  padding: 35px;
  margin: 35px;

  border: 1px solid rgba(255, 255, 255, .05);
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.25);

  backdrop-filter: blur(6px);
  text-align: center;
}

h1 {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 40px; 
  color: var(--primaryFg); 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); 
  margin: 20px 0;
}

input {
  height: 50px;
  width: 80%;
  padding: 0 20px;
  font-size: 1rem;
  font-family: 'Manrope', sans-serif;
  color: var(--primaryFg);
  background-color: var(--accentBg);
  border: none;
  border-radius: 13px;
  box-shadow: inset 0 3px 6px var(--primaryHi);
  outline: none;
  transition: all 0.2s ease;
}

input:focus {
  box-shadow: inset 0 3px 6px var(--accentHi), 0 0 8px var(--primaryFg);
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
}

button {
  height: 50px;
  width: 160px;
  clip-path: path("M 0 25 C 0 -5, -5 0, 80 0 S 160 -5, 160 25, 165 50 80 50, 0 55, 0 25");
  border: none;
  border-radius: 13px;
  box-shadow: 0px -3px 15px 0px var(--primaryHi) inset;
  color: var(--primaryFg);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(0px);
  transition: all 0.2s ease;
}

.button:hover > button {
  transform: translateY(5px);
}

.button > button {
  background-color: var(--accentBg);
  box-shadow: 0px -3px 15px 0px var(--accentHi) inset;
  color: var(--accentFg);
}

.versioncontainer {
  display: flex; 
  width: 100%; 
  justify-content: right; 
  align-items: right;
}
</style>