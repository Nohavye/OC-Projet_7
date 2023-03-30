import Template from './Template.js'

class FilterSelector {
  #_matchExpression = /^/
  #_isExpanded = false
  #_items = new Map()
  #_excludedItems = []

  constructor (name, placeholder) {
    this._template = new Template('div', {

      attributes: {
        class: `filterSelector ${name}FilterSelector`
      },

      styles: {
        backgroundColor: '#777777',
        boxSizing: 'border-box',
        padding: '20px',
        width: 'max-content',
        borderRadius: '5px',
        color: 'white'
      },

      events: {
        mouseleave: () => {
          if (this.#_isExpanded) {
            this.#toggle()
          }
        }
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
              this.#updateDisplayedItems()
            },
            focus: () => {
              this.#inputClickEvent.add()
            },
            blur: () => {
              this.#inputClickEvent.remove()
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

  #inputClickEvent = {
    add: () => {
      setTimeout(() => {
        this._template.header.input.events.key.click = () => {
          this.#toggle()
        }
      }, 250)
    },
    remove: () => {
      this._template.header.input.events.remove('click')
    }
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
    this.#_matchExpression = new RegExp(`^${word}`, 'i')
  }

  #createItemsMap (listItems) {
    this.#_items.clear()
    listItems.forEach((item) => {
      this.#_items.set(item, this.#createItemTemplate(item))
    })
  }

  #createItemTemplate (item) {
    const itemTemplate = new Template('li')
    itemTemplate.HTMLContents.key.text = item
    itemTemplate.styles.key.cursor = 'pointer'
    itemTemplate.events.key.click = () => {
      document.dispatchEvent(new CustomEvent('selectItemFilter', {
        detail: {
          value: item,
          emitter: this
        }
      }))
    }
    return itemTemplate
  }

  #updateDisplayedItems () {
    const itemKeys = Array.from(this.#_items.keys())

    this.#_excludedItems.forEach((excludedItem) => {
      itemKeys.splice(itemKeys.indexOf(excludedItem), 1)
    })

    const matchingItemKeys = itemKeys.filter(
      key => this.#_matchExpression.test(key)
    )

    this._template.list.children.clear()

    let i = 0
    matchingItemKeys.sort().forEach((key) => {
      this._template.list.children.add(`item_${i}`, this.#_items.get(key))
      i += 1
    })
  }

  items = {
    add: (item) => {
      this.#_items.set(item, this.#createItemTemplate(item))
      this.#updateDisplayedItems()
    },

    remove: (item) => {
      this.#_items.delete(item)
      this.#updateDisplayedItems()
    },

    include: (item) => {
      const index = this.#_excludedItems.indexOf(item)
      if (index !== -1) {
        this.#_excludedItems.splice(index, 1)
        this.#updateDisplayedItems()
      }
    },

    exclude: (item) => {
      const index = this.#_excludedItems.indexOf(item)
      if (index === -1 && this.#_items.has(item)) {
        this.#_excludedItems.push(item)
        this.#updateDisplayedItems()
      }
    }
  }

  get backgroundColor () {
    return this._template.styles.key.backgroundColor
  }

  set backgroundColor (value) {
    this._template.styles.key.backgroundColor = value
  }

  get itemsList () {
    return Array.from(this.#_items.keys())
  }

  set itemsList (listItems) {
    this.#createItemsMap(listItems)
    this.#updateDisplayedItems()
  }

  addTo (parent) {
    parent.appendChild(this._template.element)
  }
}

export { FilterSelector as default }
