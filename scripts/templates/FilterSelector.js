import Template from './Template.js'

class FilterSelector {
  constructor (name, placeholder) {
    this._template = new Template('div', {
      header: new Template('div', {
        input: new Template('input'),
        arrow: new Template('img')
      }),
      list: new Template('ul')
    })

    this._template.attributes = {
      class: `${name}-filter-selector`
    }

    this._template.styles = {
      backgroundColor: '#888888',
      boxSizing: 'border-box',
      padding: '15px',
      width: 'max-content',
      borderRadius: '5px',
      color: 'white'
    }

    this._template.header.styles = {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '15px'
    }

    this._template.header.input.attributes = {
      placeholder
    }

    this._template.header.input.styles = {
      backgroundColor: 'transparent',
      width: '100%',
      border: 'none',
      outline: 'none',
      color: 'white'
    }

    this._template.header.arrow.attributes = {
      src: 'assets/arrow_down.svg',
      alt: 'icon-selector'
    }

    this._template.list.styles = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridColumnGap: '100px',
      listStyleType: 'none',
      marginTop: '15px',
      padding: '0'
    }

    this._template.list.HTMLContents = {
      listItems: `
        <li>Élément 1</li>
        <li>Élément 2</li>
        <li>Élément 3</li>
        <li>Élément 4</li>
        <li>Élément 5</li>
        <li>Élément 6</li>
        <li>Élément 7</li>
        <li>Élément 8</li>
        <li>Élément 9</li>
      `
    }
  }

  addTo (parent) {
    parent.appendChild(this._template.element)
  }
}

export { FilterSelector as default }
