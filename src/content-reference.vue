<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    id: String
  })

  const name = ref(null)

  watch(() => props.id, setName)
  setName()

  async function setName() {
    name.value = null
    const state = await Agent.state(props.id)
    if (state.name) name.value = state.name
    else {
      const md = await Agent.metadata(id)
      name.value = md.name
    }
  }
</script>

<template>
  <span v-if="name === null">-</span>
  <span v-else>{{ name }}</span>
</template>