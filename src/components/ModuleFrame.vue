<template>
  <div class="module-frame" :id="`module-${module.id}`">
    <iframe ref="iframe" :src="module.url" frameborder="0"/>
  </div>
</template>

<script>
import dataStore from '../data/dataStore'
import ModuleApi from '../ModuleApi'

export default {
  name: 'ModuleFrame',
  props: {
    module: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      moduleApi: null
    }
  },
  mounted () {
    this.moduleApi = new ModuleApi(this.module, this, true)

    // Note: Listener is attached to window globally, as it will receive messages
    window.addEventListener('message', this.onMessage)

    dataStore.watchActiveDataset(this.onDataChange, false)
  },
  beforeUnmount () {
    window.removeEventListener('message', this.onMessage)

    dataStore.unwatchActiveDataset(this.onDataChange)
  },
  methods: {
    onMessage (event) {
      console.log('Receiving Message', event)

      const data = event.data

      if (data.type === 'ModuleApiParentCall') {
        // Call function (response might be empty!)
        const response = this.moduleApi[data.methodName](...data.arguments)

        if (data.returnId) {
          const dataToSend = {
            type: 'ModuleApiResponse',
            returnId: data.returnId,
            response
          }
          // When a return answer is expected, send it
          event.source.postMessage(JSON.parse(JSON.stringify(dataToSend)), '*')
        }
      }
    },

    onDataChange () {
      const newData = this.moduleApi.getData()

      this.$refs.iframe.contentWindow.postMessage({
        type: 'ModuleApiChildCall',
        methodName: 'onDataChange',
        arguments: [newData]
      }), '*'
    }
  }
}
</script>

<style lang="css" scoped>
.module-frame {
  flex-grow: 1;
}

.module-frame > iframe {
  height: 100%;
  width: 100%;
}
</style>
