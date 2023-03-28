import Template from './Template.js'

class FilterSelector {
  #_listItems = []
  #_matchExpression = /^/
  #_listMatchingItems = []
  #_isExpanded = false

  constructor (name, placeholder) {
    this._template = new Template('div', {

      attributes: {
        class: `filterSelector ${name}FilterSelector`
      },

      styles: {
        boxSizing: 'border-box',
        padding: '20px',
        width: 'max-content',
        borderRadius: '5px',
        color: 'white'
      }
    },
    {
      header: new Template('div', {

        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          gap: '15px'
        }
      },
      {
        input: new Template('input', {

          attributes: {
            class: `filterSelector_searchInput ${name}FilterSelector_searchInput`,
            placeholder
          },

          styles: {
            backgroundColor: 'transparent',
            padding: '5px 0',
            width: '150px',
            border: 'none',
            outline: 'none',
            color: 'white'
          },

          events: {
            input: (e) => {
              this.#setMatchExpression(e.target.value)
              this.#updateItemsTemplates()
            },
            focus: () => {
              this.#addInputClickEvent()
            },
            blur: () => {
              this.#removeInputClickEvent()
            }
          }
        }),

        arrow: new Template('img', {

          attributes: {
            src: 'assets/arrow_down.svg',
            alt: 'icon-selector'
          },

          styles: {
            cursor: 'pointer'
          },

          events: {
            click: () => {
              this.#toggle()
            }
          }
        })
      }),

      list: new Template('ul', {

        attributes: {
          class: `filterSelector_list ${name}FilterSelector_list`
        },

        styles: {
          display: 'none',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridGap: '12px',
          gridColumnGap: '100px',
          listStyleType: 'none',
          marginTop: '20px',
          padding: '0'
        }
      })
    })
  }

  #addInputClickEvent () {
    setTimeout(() => {
      this._template.header.input.events.key.click = () => {
        this.#toggle()
      }
    }, 250)
  }

  #removeInputClickEvent () {
    this._template.header.input.events.remove('click')
  }

  #toggle () {
    if (this.#_isExpanded) {
      this.#_isExpanded = false
      this._template.list.styles.key.display = 'none'
      this._template.header.arrow.attributes.key.src = 'assets/arrow_down.svg'
    } else {
      this.#_isExpanded = true
      this._template.list.styles.key.display = 'grid'
      this._template.header.arrow.attributes.key.src = 'assets/arrow_up.svg'
    }
  }

  #setMatchExpression (word) {
    this.#_matchExpression = new RegExp(`^${word}`)
  }

  #createItemTemplate (index, item) {
    const itemTemplate = new Template('li')
    itemTemplate.HTMLContents.key.text = item
    this._template.list.children.add(`item_${index}`, itemTemplate)
  }

  #updateItemsTemplates () {
    this.#_listMatchingItems = this.#_listItems.filter(
      item => this.#_matchExpression.test(item)
    )

    this._template.list.children.clear()

    let i = 0
    this.#_listMatchingItems.forEach((item) => {
      this.#createItemTemplate(i, item)
      i += 1
    })
  }

  items = {
    add: (item) => {
      this.#_listItems.push(item)
      this.#_listItems.sort()
      this.#updateItemsTemplates()
    },

    remove: (item) => {
      this.#_listItems.splice(this.#_listItems.indexOf(item), 1)
      this.#updateItemsTemplates()
    }
  }

  get listItems () {
    return this.#_listItems
  }

  set listItems (listItems) {
    this.#_listItems = listItems.sort()
    this.#updateItemsTemplates()
  }

  addTo (parent) {
    parent.appendChild(this._template.element)
  }
}

export { FilterSelector as default }
