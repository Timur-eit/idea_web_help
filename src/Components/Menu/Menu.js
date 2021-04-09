import './style.scss'
// import arrow from 'shared/img/down-arrow.svg'

function Menu({
  topLevelIds,
  pageList,
}) {

  const pages = pageList.entities.pages
  console.log(pageList)

  return (
    <div className='menu-list__container'>
      {topLevelIds.map(id => {
        console.log(id)
        const url = pages[id].url
        return <a key={id} href={url ? url : '/'}>
              {pages[id].pages && pages[id].pages.length > 0 && <div className='disclose-arrow'></div>}
              {pages[id].title}
            </a>
          })}
    </div>
  )
}

export default Menu


