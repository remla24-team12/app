<script setup>
import { defineProps, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
    prediction: Object,
    url: String
})

const showFeedbackButtons = ref(true)

const updateButtons = () => {
    showFeedbackButtons.value = false
}

const updateLabel = async () => {
    // The prediction was incorrect, so we need to flip the label 
    // Originally 0 = phishing, 1 = legitimate
    const newLabel = props.prediction.safe[0] === 1 ? 'phishing' : 'legitimate'

    // Post the new label to the API
    try {
        await axios.post('http://localhost:3000/api/label', {
            url: props.url,
            newLabel: newLabel
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    updateButtons()
}
</script>

<template>
    <div class="card">
        <h3 v-if="props.prediction.safe[0] === 1">This URL looks safe!😄</h3>
        <h3 v-else>This URL smells fishy🎣</h3>
        <div v-if="showFeedbackButtons">
            <p>Feedback: Was this result correct?</p>
            <button @click="updateButtons">Yes</button>
            <button @click="updateLabel">No</button>
        </div>
    </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  max-width: 60%;
  min-width: 25%;
  max-height: 50px;

  border: 1px solid rgba(255, 255, 255, .05);
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.25);

  backdrop-filter: blur(6px);
  text-align: center;
}

h3 {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 30px; 
  color: var(--primaryFg); 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); 
}
</style>