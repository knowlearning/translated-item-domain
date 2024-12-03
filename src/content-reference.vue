<script setup>
  import { ref } from 'vue'

  const { id } = defineProps({
    id: String
  })

  const name = ref(null)

  Agent
    .state(id)
    .then(async s => {
      if (s.name) name.value = s.name
      else {
        const md = await Agent.metadata(id)
        name.value = md.name
      }
    })
</script>

<template>
  <span>{{ name }}</span>
</template>