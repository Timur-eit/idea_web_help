import './style.scss'
import classNames from 'classnames'

function Menu({
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
        return <a key={id} href={url ? url : '/'} onClick={pages[id].pages && pages[id].pages.length > 0 ? (e) => {
          // e.preventDefault() // ??? otherwise doesn't work
          setActivePage(id)
          // console.log(id)
        } : null}>
              {pages[id].pages && pages[id].pages.length > 0 && <div className='disclose-arrow'></div>}
              {pages[id].title}
            </a>
          })}
    </div>
  )
}



export default Menu


