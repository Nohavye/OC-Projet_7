import Globals from './globals/globals.js'
import FilterSelector from './templates/FilterSelector.js'

const ingredientsFilterSelector = new FilterSelector('ingredients', 'Ingredients')
const appliancesFilterSelector = new FilterSelector('appliances', 'Appareils')
const toolsFilterSelector = new FilterSelector('tools', 'Ustensiles')

ingredientsFilterSelector.addTo(Globals.DOM.selectorsArea)
appliancesFilterSelector.addTo(Globals.DOM.selectorsArea)
toolsFilterSelector.addTo(Globals.DOM.selectorsArea)

ingredientsFilterSelector.listItems = [
  'coco',
  'lait',
  'oeuf',
  'farine',
  'patates',
  'carottes',
  'bananes',
  'fraises',
  'poivrons',
  'courgettes',
  'mandarines',
  'huile',
  'sucre',
  'vanille',
  'pain',
  'eau'
]

console.log(ingredientsFilterSelector.listItems)

ingredientsFilterSelector.items.remove('oeuf')
ingredientsFilterSelector.items.add('oeuf')
ingredientsFilterSelector.items.add('champignons')

console.log(ingredientsFilterSelector.listItems)
