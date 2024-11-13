<script setup>
  import { ref, reactive, watch } from 'vue'
  const TRANSLATION_DOMAIN = 'f74e9cb3-2b53-4c85-9b0c-f1d61b032b3f.localhost:5889'

  const myStuff = reactive(await Agent.state('my-content'))
  const activeItem = ref(null)
  const activeItemData = ref(null)
  const translatedActiveItemData = ref(null)
  const translationLanguage = ref('en')

  function applyTranslations(translations, translated) {
    translations
      .forEach(({ path, value }) => {
        let ref = translated
        const p = path.slice(1)
        console.log(ref, p)
        while (p.length > 1 && ref[p[0]]) ref = ref[p.shift()]
        ref[p[0]] = value
      })
  }

  watch(
    () => activeItem.value,
    async (val) => {
      if (!val) return
      activeItemData.value = await Agent.state(val)
    }
  )

  watch(
    () => [activeItemData.value, translationLanguage.value],
    async () => {
      const translated = JSON.parse(JSON.stringify(activeItemData.value))
      const id = activeItem.value
      const lang = translationLanguage.value
      const translations = await Agent.query('translation-set', [id, lang], TRANSLATION_DOMAIN)
      console.log('TRANSLATIONS', translations)
      applyTranslations(translations, translated)
      translatedActiveItemData.value = translated
    }
  )

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
  <div class="translation-container">
    <pre>{{ activeItemData }}</pre>
    <pre><input v-model="translationLanguage" />
{{  translatedActiveItemData  }}</pre>
  </div>
</template>

<style scoped>
.active { background: chartreuse; }

.translation-container {
  display: flex;
}

.translation-container>* {
  flex-grow: 1;
}
</style>