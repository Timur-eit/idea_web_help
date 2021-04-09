import './style.scss'

function Menu({topLevelIds}) {

  return (
    <div className="menu-list__container">
      {topLevelIds.map(title => <a key={title} href={'#'+title}>{title}</a>)}
    </div>
  )
}


export default Menu


