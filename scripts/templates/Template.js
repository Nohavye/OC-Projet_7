class TemplatePropertiesHandler {
  _properties = {}

  _element = null
  _ElementHandlerFunctions = {
    setKey: null,
    deleteKey: null
  }

  setElement (element) {
    this._element = element
  }

  #_proxy_properties = new Proxy(this._properties, {

    get: (target, keyProperty) => {
      if (keyProperty in target) {
        return target[keyProperty]
      } else {
        return false
      }
    },

    set: (target, keyProperty, value) => {
      target[keyProperty] = value
      this._ElementHandlerFunctions.setKey(keyProperty, value)
      return true
    },

    deleteProperty: (target, keyProperty) => {
      const value = target[keyProperty]
      delete target[keyProperty]
      this._ElementHandlerFunctions.deleteKey(keyProperty, value)
      return true
    }

  })

  get properties () {
    return {
      key: this.#_proxy_properties,
      remove: (keyProperty) => {
        delete this.#_proxy_properties[keyProperty]
      }
    }
  }

  set properties (value) {
    if (typeof (value) === 'object') {
      for (const keyProperty in this.#_proxy_properties) {
        delete this.#_proxy_properties[keyProperty]
      }
      for (const keyProperty in value) {
        this.#_proxy_properties[keyProperty] = value[keyProperty]
      }
    } else {
      console.log('erreur')
    }
  }
}

class AttributesHandler extends TemplatePropertiesHandler {
  constructor () {
    super()
    this._ElementHandlerFunctions.setKey = (keyProperty, value) => {
      this._element.setAttribute(keyProperty, value)
    }
    this._ElementHandlerFunctions.deleteKey = (keyProperty, value) => {
      this._element.removeAttribute(keyProperty)
    }
  }
}

class StylesHandler extends TemplatePropertiesHandler {
  constructor () {
    super()
    this._ElementHandlerFunctions.setKey = (keyProperty, value) => {
      this._element.style[keyProperty] = value
    }
    this._ElementHandlerFunctions.deleteKey = (keyProperty, value) => {
      this._element.removeAttribute('style')
      for (const keyProperty in this._properties) {
        this._element.style[keyProperty] = this._properties[keyProperty]
      }
    }
  }
}

class EventsHandler extends TemplatePropertiesHandler {
  constructor () {
    super()
    this._ElementHandlerFunctions.setKey = (keyProperty, value) => {
      this._element.addEventListener(keyProperty, value)
    }
    this._ElementHandlerFunctions.deleteKey = (keyProperty, value) => {
      this._element.removeEventListener(keyProperty, value)
    }
  }
}

class HTMLContentsHandler extends TemplatePropertiesHandler {
  constructor () {
    super()
    this._ElementHandlerFunctions.setKey = (keyProperty, value) => {
      this._element.insertAdjacentHTML('beforeend', value)
    }
    this._ElementHandlerFunctions.deleteKey = (keyProperty, value) => {
      this._element.innerHTML = ''
      for (const keyProperty in this._properties) {
        this._element.insertAdjacentHTML('beforeend', this._properties[keyProperty])
      }
    }
  }
}

class Template {
  #_element = null
  #_attributesHandler = new AttributesHandler()
  #_stylesHandler = new StylesHandler()
  #_eventsHandler = new EventsHandler()
  #_HTMLContentsHandler = new HTMLContentsHandler()

  constructor (tag, children, attributes, styles, events, HTMLContents) {
    this.#_element = document.createElement(tag)

    if (typeof (children) === 'object') {
      for (const key in children) {
        if (children[key] instanceof Template) {
          this[key] = children[key]
          this.#_element.appendChild(this[key].element)
        }
      }
    }
    this.#_attributesHandler.setElement(this.#_element)
    this.#_stylesHandler.setElement(this.#_element)
    this.#_eventsHandler.setElement(this.#_element)
    this.#_HTMLContentsHandler.setElement(this.#_element)

    if (typeof (attributes) === 'object') this.attributes = attributes
    if (typeof (styles) === 'object') this.styles = styles
    if (typeof (events) === 'object') this.events = events
    if (typeof (HTMLContents) === 'object') this.HTMLContents = HTMLContents
  }

  get attributes () {
    return this.#_attributesHandler.properties
  }

  get styles () {
    return this.#_stylesHandler.properties
  }

  get events () {
    return this.#_eventsHandler.properties
  }

  get HTMLContents () {
    return this.#_HTMLContentsHandler.properties
  }

  set attributes (value) {
    this.#_attributesHandler.properties = value
  }

  set styles (value) {
    this.#_stylesHandler.properties = value
  }

  set events (value) {
    this.#_eventsHandler.properties = value
  }

  set HTMLContents (value) {
    this.#_HTMLContentsHandler.properties = value
  }

  get element () {
    return this.#_element
  }
}

export { Template as default }
