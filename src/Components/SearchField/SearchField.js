import React from 'react'
import {Field, reduxForm} from 'redux-form' // ? react final form
import './style.scss'

import _ from 'lodash'

let SearchField = ({
                     filterData,
                     getSearchedData,
                     pageList,
                     activePages,
                     topLevelIds,
                     setActivePage,
                     setCurrentId

                   }) => {

  const pages = pageList.entities.pages

  function searchHandler(e) {
    const {value} = e.target
    

    // if (activePages.length > 0) {
    //   for (const pageId of activePages) {
    //     if (pages[pageId].title.includes(value)) {
    //       matches.push(pages[pageId].title)
    //     }
    //     if (pages[pageId].pages) {
    //       for (const subPageId of pages[pageId].pages) {
    //         if (pages[subPageId].title.includes(value)) {
    //           matches.push(pages[subPageId].title)
    //         }
    //       }
    //
    //     }
    //   }
    // } else {
    //   for (const pageId of topLevelIds) {
    //     if (pages[pageId].title.includes(value)) {
    //       matches.push(pages[pageId].title)
    //     }
    //   }
    // }
    // filterData(value)



    fetch(`http://localhost:4000/?search=${value}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        // setCurrentId(data.id)
      })
  }

  const debouncedSearchHandler = _.debounce(searchHandler, 2000, {'maxWait': 7000})

  return (
    <div className='search__container'>
      <div className='search'>
        <Field name='search' component='input' type='text' placeholder='search' onChange={(e) => {
          console.log(e.target.value)
          debouncedSearchHandler(e)
        }
        }/>
      </div>
    </div>
  )
}

SearchField = reduxForm({
  form: 'searchField',
}, {})(SearchField)

export default SearchField