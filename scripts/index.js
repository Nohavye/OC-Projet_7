import Globals from './globals/globals.js'
import Templates from './templates/TemplatesModule.js'

const ingredientsFilterSelector = new Templates.FilterSelector('ingredients', 'Ingredients')
const appliancesFilterSelector = new Templates.FilterSelector('appliances', 'Appareils')
const toolsFilterSelector = new Templates.FilterSelector('tools', 'Ustensiles')

ingredientsFilterSelector.addTo(Globals.DOM.selectorsContainer)
appliancesFilterSelector.addTo(Globals.DOM.selectorsContainer)
toolsFilterSelector.addTo(Globals.DOM.selectorsContainer)

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

const tagsHandler = new Templates.TagsHandler(Globals.DOM.tagsContainer)
tagsHandler.addTag('Coco', '#3282f7')
tagsHandler.addTag('Banane', '#3282f7')
tagsHandler.addTag('Pain', '#3282f7')
tagsHandler.addTag('Farine', '#3282f7')
