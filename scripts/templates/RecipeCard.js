import Template from './Template.js'

class RecipeCard {
  constructor (recipeEntity) {
    const ingredients = () => {
      let htmlContent = ''
      recipeEntity.ingredients.forEach((ingredient) => {
        htmlContent = htmlContent + `
          <div style= "
            display: flex;
            gap: 5px;
            font-weight: 700;
            font-size: 12px;
            line-height: 14px;
            ">
            <b>${ingredient.name}:</b>
            <p>${ingredient.quantity}${ingredient.unit}</p>
          </div>
        `
      })
      return htmlContent
    }

    const description = () => {
      const maxLentgth = 350
      if (recipeEntity.description.length <= maxLentgth) {
        return recipeEntity.description
      } else {
        return recipeEntity.description.substring(0, maxLentgth) + ' (...)'
      }
    }

    this._template = new Template('div', {

      attributes: {
        class: 'recipeCard'
      },

      styles: {
        backgroundColor: '#C7BEBE',
        width: '520px',
        height: '460px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'end'
      }
    },
    {
      presentation: new Template('div', {

        attributes: {},
        styles: {
          boxSizing: 'border-box',
          padding: '30px',
          backgroundColor: '#E7E7E7',
          width: '100%',
          height: '230px'
        }
      },
      {
        header: new Template('div', {
          attributes: {},
          styles: {
            display: 'flex',
            justifyContent: 'space-between'
          }
        },
        {
          title: new Template('h2', {
            styles: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              width: '79%'
            },
            HTMLContents: { title: recipeEntity.name }
          }),
          time: new Template('p', {
            styles: {
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              fontWeight: '700',
              fontSize: '18px'
            },
            HTMLContents: {
              time: `
                <img src="assets/clock.svg" alt="clock" width="25">
                <p>${recipeEntity.time} min</p>
              `
            }
          })
        }),

        content: new Template('div', {

          attributes: {},
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
          }
        },
        {
          ingredients: new Template('p', {
            HTMLContents: {
              ingredients: ingredients()
            }
          }),
          description: new Template('p', {

            styles: {
              width: '220px',
              height: '120px',

              fontFamily: 'Roboto',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '100%'
            },

            HTMLContents: {
              description: description()
            }
          })
        })
      })
    })
  }

  addTo (parent) {
    parent.appendChild(this._template.element)
  }
}

export { RecipeCard as default }
