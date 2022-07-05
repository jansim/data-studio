const target = window.parent
if (!target) {
  console.warn('No parent window found. iframeModuleApi will not work.')
} else {
  console.log('Initializing iframeModuleApi.')
}

// TODO: Add the ability here to register a module and
// request a different default dataformat to be served.

// TODO List:
// - Add the ability here to register a module and request a different default dataformat to be served.
// - Add proper instancing of modules, probably based on a class. This way global variables can finally be dropped.
// - When switching to an instanced version, make sure that the moduleApi is always available e.g. via this.moduleApi

function triggerModuleApiMethod (methodName, originalArguments, additionalParameters = {}) {
  if (!target) {
    console.error('Trying to call remote moduleApi Method without having a target window. Skipping the call.')
    return
  }
  // Trigger a module API method in the parent window
  const dataToSend = {
    type: 'ModuleApiParentCall',

    methodName,
    // Convert arguments to array
    arguments: Array.prototype.slice.call(originalArguments),
    ...additionalParameters
  }

  console.log("Calling ModuleApiMethod", dataToSend)

  target.postMessage(
    // Copy data to avoid issues in serialization / ownership
    JSON.parse(JSON.stringify(dataToSend)),
    '*'
  )
}

// Create a local version of the ModuleApi
const iframeModuleApi = {}
const AVAILABLE_API_METHODS = [
  'setData',
  'loadDatasets',
  'setActiveModule'
]
const AVAILABLE_API_RETURN_METHODS = [
  'getData'
]

AVAILABLE_API_METHODS.forEach(methodName => {
  iframeModuleApi[methodName] = function () {
    triggerModuleApiMethod(methodName, arguments)
  }
})
AVAILABLE_API_RETURN_METHODS.forEach(function (methodName) {
  // Use a promise here to get the return value
  iframeModuleApi[methodName] = function () {
    const _arguments = arguments

    return new Promise((resolve, reject) => {
      // Use time (in ms) to get a unique-enough id for returns
      const returnId = new Date().getTime()

      const listener = (event) => {
        const data = event.data

        if (data.type === 'ModuleApiResponse' && data.returnId === returnId) {
          window.removeEventListener('message', listener)

          resolve(data.response)
        }
      }
      window.addEventListener('message', listener, false)

      // Trigger the actual function
      triggerModuleApiMethod(methodName, _arguments, { returnId })
    })
  }
})

function initializeModule (_module) {
  // Initialize the module itself
  _module.mount(document.getElementById('module'), iframeModuleApi)

  function handleModuleApiChildCall (event) {
    const data = event.data

    if (data.type === 'ModuleApiChildCall') {
      if (data.methodName in _module) {
        _module[data.methodName](...event.data.arguments)
      } else {
        console.error('Trying to call unsupported ModuleApiChildCall-Method')
      }
    }
  }

  // Set up a listener to receive calls from parent frame
  // e.g. onDataChange
  // (There's no need to deregister this handler as the iframe will just cease to be)
  window.addEventListener('message', handleModuleApiChildCall)

  // There is also no need to implement unmount, for the same reason as stated just above
}

export {
  initializeModule
}
