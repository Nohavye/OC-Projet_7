import Template from './Template.js'

class TagsHandler {
  #_tagsElements = new Map()
  #_tagsContainer = null

  constructor (tagsContainer) {
    this.#_tagsContainer = tagsContainer
  }

  addTag (tagName, color) {
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

    this.#_tagsElements.set(tagName, template)
    this.#_tagsContainer.appendChild(template.element)
  }

  removeTag (tagName) {
    this.#_tagsContainer.removeChild(this.#_tagsElements.get(tagName).element)
    this.#_tagsElements.delete(tagName)
  }
}

export { TagsHandler as default }
