import Data from './data/DataModule.js'
import Globals from './globals/globals.js'
import Templates from './templates/TemplatesModule.js'
import InvertedIndex from './research/InvertedIndex.js'
import RecipeCard from './templates/RecipeCard.js'

async function getRecipesMap () {
  // Chargement des données.
  await Data.Manager.loadData('data/recipes.json')
  const recipesEntities = Data.Manager.getData('recipes', Data.DataFormat.Recipe)
  const recipesMap = Data.Manager.hash(recipesEntities, 'id')
  return recipesMap
}

function createInvertedIndex (recipesMap) {
  // Création de l'indexe inversé.
  InvertedIndex.createMaps(recipesMap)
}

function createRecipesCardMap (recipesMap) {
  // Création des cartes
  const recipesCardsMap = new Map()
  recipesMap.forEach((recipeEntity, key, map) => {
    recipesCardsMap.set(key, { recipe: recipeEntity, card: new RecipeCard(recipeEntity) })
  })
  return recipesCardsMap
}

function createTagsHandler () {
  return new Templates.TagsHandler(Globals.DOM.tagsContainer)
}

function createFilters () {
  const ingredientsFilter = new Templates.FilterSelector('ingredients', 'Ingredients')
  const appliancesFilter = new Templates.FilterSelector('appliances', 'Appareils')
  const ustensilsFilter = new Templates.FilterSelector('ustensils', 'Ustensiles')

  ingredientsFilter.backgroundColor = '#3282F7'
  appliancesFilter.backgroundColor = '#68D9A4'
  ustensilsFilter.backgroundColor = '#ED6454'

  ingredientsFilter.addTo(Globals.DOM.selectorsContainer)
  appliancesFilter.addTo(Globals.DOM.selectorsContainer)
  ustensilsFilter.addTo(Globals.DOM.selectorsContainer)

  return { ingredients: ingredientsFilter, appliances: appliancesFilter, ustensils: ustensilsFilter }
}

function updateDisplayedCards (recipesCardsMap) {
  // Affichage des cartes
  for (const value of recipesCardsMap.values()) {
    value.card.addTo(Globals.DOM.main)
  }
}

function updateFilters (filters, recipesCardsMap) {
  const ingredients = []
  const appliances = []
  const ustensils = []

  for (const value of recipesCardsMap.values()) {
    const recipe = value.recipe

    recipe.ingredients.forEach((ingredient) => {
      ingredients.push(ingredient.name)
    })

    appliances.push(recipe.appliance)

    recipe.ustensils.forEach((ustensil) => {
      ustensils.push(ustensil)
    })
  }

  filters.ingredients.itemsList = ingredients
  filters.appliances.itemsList = appliances
  filters.ustensils.itemsList = ustensils
}

function initEvents(tagsHandler) {
  document.addEventListener('selectItemFilter', (e) => {
    tagsHandler.addTag(e.detail.value, e.detail.emitter.backgroundColor, e.detail.emitter)
    e.detail.emitter.items.exclude(e.detail.value)
  })

  document.addEventListener('removeTag', (e) => {
    e.detail.emitter.items.include(e.detail.value)
  })
}

async function init () {
  const recipesMap = await getRecipesMap()
  createInvertedIndex(recipesMap)

  const tagsHandler = createTagsHandler()
  const filters = createFilters()

  const recipesCardsMap = createRecipesCardMap(recipesMap)
  updateDisplayedCards(recipesCardsMap)
  updateFilters(filters, recipesCardsMap)

  initEvents(tagsHandler)
}

init()
