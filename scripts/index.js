import Data from './data/DataModule.js'
import Globals from './globals/globals.js'
import Templates from './templates/TemplatesModule.js'
import InvertedIndex from './research/InvertedIndex.js'

await Data.Manager.loadData('data/recipes.json')
const recipesEntities = Data.Manager.getData('recipes', Data.DataFormat.Recipe)
const recipes = Data.Manager.hash(recipesEntities, 'id')
InvertedIndex.createMaps(recipes)

console.log('---------------------------------------------------------------------')
console.log('---------------------------------------------------------------------')
console.log('---------------------------------------------------------------------')
InvertedIndex.ustensilsMap.forEach((value, key, map) => {
  console.log(`${key}: ${value}`)
})

const ingredientsFilter = new Templates.FilterSelector('ingredients', 'Ingredients')
const appliancesFilter = new Templates.FilterSelector('appliances', 'Appareils')
const ustensilsFilter = new Templates.FilterSelector('ustensils', 'Ustensiles')

ingredientsFilter.backgroundColor = '#3282F7'
appliancesFilter.backgroundColor = '#68D9A4'
ustensilsFilter.backgroundColor = '#ED6454'

ingredientsFilter.addTo(Globals.DOM.selectorsContainer)
appliancesFilter.addTo(Globals.DOM.selectorsContainer)
ustensilsFilter.addTo(Globals.DOM.selectorsContainer)

ingredientsFilter.itemsList = [
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

appliancesFilter.itemsList = [
  'batteur',
  'four',
  'micro-onde',
  'mixeur',
  'grille pain'
]

ustensilsFilter.itemsList = [
  'fouet',
  'cuillere',
  'couteau',
  'écumoir'
]

ingredientsFilter.items.remove('oeuf')
ingredientsFilter.items.add('oeuf')
ingredientsFilter.items.add('champignons')

const tagsHandler = new Templates.TagsHandler(Globals.DOM.tagsContainer)

document.addEventListener('selectItemFilter', (e) => {
  tagsHandler.addTag(e.detail.value, e.detail.emitter.backgroundColor, e.detail.emitter)
  e.detail.emitter.items.exclude(e.detail.value)
})

document.addEventListener('removeTag', (e) => {
  e.detail.emitter.items.include(e.detail.value)
})
