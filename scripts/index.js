import Data from './data/DataModule.js'
import Globals from './globals/globals.js'
import Templates from './templates/TemplatesModule.js'
import IndexesFinder from './research/IndexesFinder.js'

const map = {
  recipes: new Map(),
  cards: new Map()
}

const components = {
  searchInput: Globals.DOM.searchInput,
  tagsHandler: new Templates.TagsHandler(Globals.DOM.tagsContainer),

  filters: {
    ingredients: new Templates.FilterSelector('ingredients', 'Ingredients'),
    appliances: new Templates.FilterSelector('appliances', 'Appareils'),
    ustensils: new Templates.FilterSelector('ustensils', 'Ustensiles')
  }
}

async function getRecipesMap () {
  // Chargement des données.
  await Data.Manager.loadData('data/recipes.json')
  const recipesEntities = Data.Manager.getData('recipes', Data.DataFormat.Recipe)
  map.recipes = Data.Manager.hash(recipesEntities, 'id')
}

function createCardMap () {
  // Création des cartes
  map.recipes.forEach((recipeEntity, key) => {
    map.cards.set(key, new Templates.RecipeCard(recipeEntity))
  })
}

function initFilters () {
  components.filters.ingredients.backgroundColor = '#3282F7'
  components.filters.appliances.backgroundColor = '#68D9A4'
  components.filters.ustensils.backgroundColor = '#ED6454'

  components.filters.ingredients.addTo(Globals.DOM.selectorsContainer)
  components.filters.appliances.addTo(Globals.DOM.selectorsContainer)
  components.filters.ustensils.addTo(Globals.DOM.selectorsContainer)
}

function updateDisplayedCards (keys) {
  Globals.DOM.main.innerHTML = ''

  if (typeof (keys) === 'undefined') {
    for (const value of map.cards.values()) {
      value.addTo(Globals.DOM.main)
    }
  } else {
    keys.forEach((key) => {
      map.cards.get(key).addTo(Globals.DOM.main)
    })
  }

  updateFilters(keys)
}

function updateFilters (keys) {
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
    for (const recipe of map.recipes.values()) {
      addItems(recipe)
    }
  } else {
    keys.forEach((key) => {
      addItems(map.recipes.get(key))
    })
  }

  components.filters.ingredients.itemsList = ingredients
  components.filters.appliances.itemsList = appliances
  components.filters.ustensils.itemsList = ustensils
}

function initEvents () {
  IndexesFinder.setIndexesFinder(Array.from(map.recipes.values()), Globals.excludedWords)

  function updateKeyWordsExpressions () {
    IndexesFinder.tagsList = components.tagsHandler.tagsList
    IndexesFinder.expression = components.searchInput.value.length >= 3 ? components.searchInput.value : ''
    updateCards()
  }

  function updateCards () {
    if (IndexesFinder.expression !== '' | IndexesFinder.tagsList.length > 0) {
      const keys = IndexesFinder.indexes
      updateDisplayedCards(keys)
    } else {
      updateDisplayedCards()
    }
  }

  components.searchInput.addEventListener('input', (e) => {
    updateKeyWordsExpressions()
  })

  document.addEventListener('addTag', (e) => {
    e.detail.emitter.items.exclude(e.detail.value)
    updateKeyWordsExpressions()
  })

  document.addEventListener('removeTag', (e) => {
    e.detail.emitter.items.include(e.detail.value)
    updateKeyWordsExpressions()
  })

  document.addEventListener('selectItemFilter', (e) => {
    components.tagsHandler.addTag(e.detail.value, e.detail.emitter.backgroundColor, e.detail.emitter)
  })
}

async function init () {
  await getRecipesMap()
  initFilters()
  createCardMap()
  updateDisplayedCards()
  initEvents()
}

init()
