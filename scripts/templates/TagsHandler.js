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

    const matchingExpressions = []

    this.tagsList.forEach((keyWord) => {
      matchingExpressions.push(new RegExp(`^${keyWord}`, 'i'))
    })

    document.dispatchEvent(new CustomEvent('addTag', {
      detail: {
        emitter,
        matchingExpressions,
        tagsList: this.tagsList,
        value: tagName
      }
    }))
  }

  removeTag (tagName) {
    const emitter = this.#_tags.get(tagName).emitter
    this.#_tagsContainer.removeChild(this.#_tags.get(tagName).template.element)
    this.#_tags.delete(tagName)

    const matchingExpressions = []

    this.tagsList.forEach((keyWord) => {
      matchingExpressions.push(new RegExp(`^${keyWord}`, 'i'))
    })

    document.dispatchEvent(new CustomEvent('removeTag', {
      detail: {
        emitter,
        matchingExpressions,
        tagsList: this.tagsList,
        value: tagName
      }
    }))
  }

  get tagsList () {
    return Array.from(this.#_tags.keys())
  }
}

export { TagsHandler as default }
