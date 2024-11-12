<script setup>
  import { ref, reactive, watch } from 'vue'
  const myStuff = reactive(await Agent.state('my-content'))
  const activeItem = ref(null)
  const activeItemData = ref(null)

  watch(() => activeItem.value, async (val) => {
    if (!val) return
    activeItemData.value = await Agent.state(val)
  })

  async function addNew() {
    const newId = await Agent.create({
      active: { name: "Bananagrams", hints: ["no", 12, "eating", {}, "slugs"]}
    })
    myStuff[newId] = true
    activeItem.value = newId
  }

  async function addTranslations() {
    if (!activeItem.value) return

  const state = await Agent.state(activeItem.value)
  state.translations = { source_language: 'en-us', paths: [] }
  Object.entries(state)
    .forEach(([key, val]) => {
      if (typeof val === 'string') {
        state.translations.paths.push([key]) 
      } else if (Array.isArray(val)) {
        val.forEach((v,i) => {
          if (typeof v === 'string') state.translations.paths.push([key, i])        
        })
      }
    }) 
  }

</script>

<template>
  <h1>Sandbox</h1>
  <h3>My Stuff</h3>
  <div>
    <div
        v-for="id in Object.keys(myStuff)"
        :class="id === activeItem ? 'active': ''"
        @click="activeItem = id"
        @click.shift="delete myStuff[id]"
    >{{ id }}</div>
  </div>
  <button @click="addTranslations" :disabled="!activeItem">Add Translations</button>
  <button @click="addNew">Add New</button>
  <hr>
  <pre>{{ activeItemData }}</pre>
</template>

<style scoped>
.active { background: chartreuse; }
</style>