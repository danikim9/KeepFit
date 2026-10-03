import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'

export function Screen({ children, tabs = false, dark = false }: { children: ReactNode; tabs?: boolean; dark?: boolean }) {
  return (
    <div className={`screen${dark ? ' screen--dark' : ''}`}>
      <main className={`screen__body${tabs ? ' screen__body--tabs' : ''}`}>{children}</main>
      {tabs && <TabBar />}
    </div>
  )
}

export function TabBar() {
  const tabs = [
    { to: '/home', label: '홈', icon: 'home' as const },
    { to: '/report', label: '리포트', icon: 'chart' as const },
    { to: '/guide', label: '가이드', icon: 'list' as const },
  ]
  return (
    <nav className="tabbar" aria-label="주요 메뉴">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => `tabbar__item${isActive ? ' is-active' : ''}`}>
          <Icon name={t.icon} size={22} />
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function TopBar({ title, back, step }: { title?: string; back?: string; step?: string }) {
  const navigate = useNavigate()
  return (
    <header className="topbar">
      {back ? (
        <Link to={back} className="icon-btn" aria-label="뒤로">
          <Icon name="back" />
        </Link>
      ) : (
        <button type="button" className="icon-btn" aria-label="뒤로" onClick={() => navigate(-1)}>
          <Icon name="back" />
        </button>
      )}
      {title && <b className="topbar__title">{title}</b>}
      {step && <span className="topbar__step">{step}</span>}
    </header>
  )
}
