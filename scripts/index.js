import Data from './data/DataModule.js'
import Globals from './globals/globals.js'
import Templates from './templates/TemplatesModule.js'
import InvertedIndex from './research/InvertedIndex.js'
import RecipeCard from './templates/RecipeCard.js'

let recipesMap = new Map()
const cardsMap = new Map()

async function getRecipesMap () {
  // Chargement des données.
  await Data.Manager.loadData('data/recipes.json')
  const recipesEntities = Data.Manager.getData('recipes', Data.DataFormat.Recipe)
  recipesMap = Data.Manager.hash(recipesEntities, 'id')
}

function updateInvertedIndex () {
  // Création de l'indexe inversé.
  InvertedIndex.updateMaps(recipesMap)
}

function createCardMap () {
  // Création des cartes
  recipesMap.forEach((recipeEntity, key, map) => {
    cardsMap.set(key, new RecipeCard(recipeEntity))
  })
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

function updateDisplayedCards (keys) {
  Globals.DOM.main.innerHTML = ''

  if (typeof (keys) === 'undefined') {
    for (const value of cardsMap.values()) {
      value.addTo(Globals.DOM.main)
    }
  } else {
    keys.forEach((key) => {
      cardsMap.get(key).addTo(Globals.DOM.main)
    })
  }
}

function updateFilters (filters, keys) {
  const ingredients = []
  const appliances = []
  const ustensils = []

  const addItems = (recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredients.push(ingredient.name)
    })

    appliances.push(recipe.appliance)

    recipe.ustensils.forEach((ustensil) => {
      ustensils.push(ustensil)
    })
  }

  if (typeof (keys) === 'undefined') {
    for (const recipe of recipesMap.values()) {
      addItems(recipe)
    }
  } else {
    keys.forEach((key) => {
      addItems(recipesMap.get(key))
    })
  }

  filters.ingredients.itemsList = ingredients
  filters.appliances.itemsList = appliances
  filters.ustensils.itemsList = ustensils
}

function initEvents (tagsHandler, filters) {
  document.addEventListener('selectItemFilter', (e) => {
    tagsHandler.addTag(e.detail.value, e.detail.emitter.backgroundColor, e.detail.emitter)
  })

  function updateWithTags (tagsList) {
    if (tagsList.length !== 0) {
      let keys = []
      tagsList.forEach((tag) => {
        const keysIngredients = InvertedIndex.ingredientsMap.get(tag) || []
        const keysAppliances = InvertedIndex.appliancesMap.get(tag) || []
        const keysUstensils = InvertedIndex.ustensilsMap.get(tag) || []
        const newKeys = [...keysIngredients, ...keysAppliances, ...keysUstensils]

        if (keys.length === 0) {
          keys = newKeys
        } else {
          keys = keys.filter(key => newKeys.includes(key))
        }
      })

      updateDisplayedCards(keys)
      updateFilters(filters, keys)
    } else {
      updateDisplayedCards()
      updateFilters(filters)
    }
  }

  document.addEventListener('addTag', (e) => {
    e.detail.emitter.items.exclude(e.detail.value)
    updateWithTags(e.detail.tagsList)
  })

  document.addEventListener('removeTag', (e) => {
    e.detail.emitter.items.include(e.detail.value)
    updateWithTags(e.detail.tagsList)
  })
}

async function init () {
  await getRecipesMap()
  updateInvertedIndex()

  const tagsHandler = createTagsHandler()
  const filters = createFilters()

  createCardMap()
  updateDisplayedCards()
  updateFilters(filters)

  initEvents(tagsHandler, filters)
}

init()
