import './style.scss'
import {Link} from 'react-router-dom'
import classNames from "classnames"

function Menu({
                activePages,
                topLevelIds,
                pageList,
                setActivePage,
              }) {

  const pages = pageList.entities.pages
  // console.log(pageList)

  return (
    <div className='menu-list__container'>
      {topLevelIds.map(id => {
        // console.log(id)
        const url = pages[id].url
        const isNested = pages[id].pages && pages[id].pages.length > 0

        const classes = classNames({
          'disclose-arrow' : true,
          'hidden' : !isNested,
          'rotated': activePages.includes(id)
        })

        return <Link key={id} to={url ? url : '/'} onClick={(e) => {
          isNested && setActivePage(id)
        }}>
          <div className={classes}/>
          {pages[id].title}
        </Link>
      })}
    </div>
  )
}

export default Menu


