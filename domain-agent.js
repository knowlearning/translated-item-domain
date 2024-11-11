  import Agent, { getAgent } from 'npm:@knowlearning/agents/deno.js'

  const TranslationAgent = getAgent('f74e9cb3-2b53-4c85-9b0c-f1d61b032b3f.localhost:5889')

  const TRANSLATABLE_TARGET_TYPE = 'application/json;type=translatable_target'

  Agent.on('child', child => {
    const { environment: { user } } = child
    Agent.log(`GOT CHILD CONNECTION`, user)
    child.on('mutate', async ({ scope, patch, id }) => {
      if (patch.find(({ path }) => path[0] === 'translations')) {

        const itemState = await Agent.state(id)
        Agent.log('TRANSLATIONS PATCH', scope, patch, id, JSON.parse(JSON.stringify(itemState)))
        itemState.translations.paths.forEach(async path => {
          const translatableTargetName = `translatable_target/${JSON.stringify([id, ...path])}`
          Agent.log('GETTING METADATA', translatableTargetName)
          const translatableTargetMetadata = await TranslationAgent.metadata(translatableTargetName)
          Agent.log('GOT METADATA', JSON.parse(JSON.stringify(translatableTargetMetadata)))

          if (translatableTargetMetadata.active_type !== TRANSLATABLE_TARGET_TYPE) {
            translatableTargetMetadata.active_type = TRANSLATABLE_TARGET_TYPE
          }

          Agent.log('GETTING STATE', translatableTargetName)
          const translatableTarget = await TranslationAgent.state(translatableTargetName)
          Agent.log('GOT STATE', JSON.stringify(translatableTarget))

          translatableTarget.source_language = itemState.translations.source_language
          translatableTarget.path = [id, ...path]
          Agent.log('RESOLVING PATH', [...path])
          const source_string = resolvePath(path, itemState)
          Agent.log('GOT SOURCE STRING', translatableTargetName, source_string)
          if (source_string) translatableTarget.source_string = source_string
        })
      }
    })
  })

  function resolvePath(path, value) {
    while (path.length && value) value = value[path.shift()]
    return value
  }
