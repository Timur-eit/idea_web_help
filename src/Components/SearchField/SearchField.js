import React from 'react'
import { Field, reduxForm } from 'redux-form' // ? react final form
import './style.scss'

let SearchField = (props) => {
    
  return (
    <div className='search__container'>
      <div className='search'>
        <Field name='search' component='input' type='text' placeholder='search' onChange={(e) => {
          console.log(e.target.value)}
        } />
      </div>
    </div>
  )
}

SearchField = reduxForm({
  form: 'searchField',
}, {
})(SearchField)

export default SearchField