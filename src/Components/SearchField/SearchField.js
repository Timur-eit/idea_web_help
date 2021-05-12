import React from 'react'
import { Field, reduxForm } from 'redux-form' // ? react final form
import './style.scss'

import _ from 'lodash'

let SearchField = ({
    pageList,
    setFoundId
}) => {
    
    function searchHandler(e) {
        const { value } = e.target

        fetch(`http://localhost:4000/?search=${value}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setFoundId(data)
            })
    }

    const debouncedSearchHandler = _.debounce(searchHandler, 2000, {
        maxWait: 7000,
    })

    return (
        <div className="search__container">
            <div className="search">
                <Field
                    name="search"
                    component="input"
                    type="text"
                    placeholder="search"
                    onChange={(e) => {
                        console.log(e.target.value)
                        debouncedSearchHandler(e)
                    }}
                />
            </div>
        </div>
    )
}

SearchField = reduxForm(
    {
        form: 'searchField',
    },
    {}
)(SearchField)

export default SearchField
