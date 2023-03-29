import Template from './Template.js'

class TagsHandler {
  #_tags = new Map()
  #_tagsContainer = null

  constructor (tagsContainer) {
    this.#_tagsContainer = tagsContainer
  }

  #createTagTemplate (tagName, color) {
    const template = new Template('div', {

      attributes: {
        class: 'tag'
      },

      styles: {
        backgroundColor: color,
        borderRadius: '5px',
        width: 'max-content',
        padding: '10px 25px',
        display: 'flex',
        gap: '15px'
      }
    },
    {
      tagName: new Template('p', {

        styles: {
          color: 'white'
        },

        HTMLContents: {
          text: tagName
        }
      }),
      cross: new Template('img', {

        attributes: {
          src: 'assets/cross.svg',
          alt: 'cross'
        },

        styles: {
          cursor: 'pointer'
        },

        events: {
          click: () => {
            this.removeTag(tagName)
          }
        }
      })
    })

    return template
  }

  addTag (tagName, color, emitter) {
    if (!this.#_tags.has(tagName)) {
      const template = this.#createTagTemplate(tagName, color)
      this.#_tags.set(tagName, { emitter, template })
      this.#_tagsContainer.appendChild(template.element)
    }
  }

  removeTag (tagName) {
    this.#_tagsContainer.removeChild(this.#_tags.get(tagName).template.element)

    document.dispatchEvent(new CustomEvent('removeTag', {
      detail: {
        value: tagName,
        emitter: this.#_tags.get(tagName).emitter
      }
    }))

    this.#_tags.delete(tagName)
  }

  get tagsList () {
    return Array.from(this.#_tags.keys())
  }
}

export { TagsHandler as default }
