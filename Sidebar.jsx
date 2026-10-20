import { Activity, Bell, CircleHelp, ClipboardList, LayoutDashboard, Map, Settings, ShieldCheck, Sparkles, Users, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const links = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Complaints', icon: ClipboardList, count: '24' },
  { label: 'Live city map', icon: Map },
  { label: 'AI insights', icon: Sparkles, accent: true },
]

export default function Sidebar({ active, onNavigate }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false)

  function goTo(label) {
    setWorkspaceOpen(false)
    onNavigate(label)
  }

  return (
    <aside className="sidebar">
      <button className="brand brand-button" type="button" onClick={() => goTo('Overview')} aria-label="Go to overview">
        <span className="brand-mark"><Activity size={21} strokeWidth={2.7} /></span>
        <span>smartcity<span className="brand-ai">.ai</span></span>
      </button>
      <div className="workspace-wrap">
        <button className="workspace-switch" type="button" aria-label="Pune Municipal workspace menu" aria-expanded={workspaceOpen} onClick={() => setWorkspaceOpen((open) => !open)}>
          <span className="city-avatar">P</span>
          <span className="workspace-copy"><strong>Pune Municipal</strong><small>City workspace</small></span>
          <ChevronDown className={`switch-chevron ${workspaceOpen ? 'rotated' : ''}`} size={16} />
        </button>
        {workspaceOpen && <div className="workspace-menu">
          <span className="workspace-menu-label">CURRENT WORKSPACE</span>
          <button type="button" className="workspace-option selected" onClick={() => setWorkspaceOpen(false)}><span className="city-avatar">P</span><span><strong>Pune Municipal</strong><small>Prototype workspace</small></span><span className="workspace-check">✓</span></button>
          <button type="button" className="workspace-settings" onClick={() => goTo('Settings')}>Workspace settings <span>→</span></button>
        </div>}
      </div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="app-nav">
        {links.map(({ label, icon: Icon, count, accent }) => (
          <button key={label} type="button" aria-label={label} title={label} aria-current={active === label ? 'page' : undefined} className={`nav-link ${active === label ? 'active' : ''} ${accent ? 'nav-ai' : ''}`} onClick={() => goTo(label)}>
            <Icon size={18} /><span>{label}</span>{count && <small className="nav-count">{count}</small>}
          </button>
        ))}
      </nav>
      <div className="nav-caption departments-caption">CITY DEPARTMENTS</div>
      <div className="department-list">
        <button type="button" aria-label="Roads & transport" title="Roads & transport" aria-current={active === 'Roads & transport' ? 'page' : undefined} className={active === 'Roads & transport' ? 'department-active' : ''} onClick={() => goTo('Roads & transport')}><span className="department-dot dot-orange" />Roads & transport<span className="department-total">08</span></button>
        <button type="button" aria-label="Sanitation" title="Sanitation" aria-current={active === 'Sanitation' ? 'page' : undefined} className={active === 'Sanitation' ? 'department-active' : ''} onClick={() => goTo('Sanitation')}><span className="department-dot dot-green" />Sanitation<span className="department-total">06</span></button>
        <button type="button" aria-label="Water & drainage" title="Water & drainage" aria-current={active === 'Water & drainage' ? 'page' : undefined} className={active === 'Water & drainage' ? 'department-active' : ''} onClick={() => goTo('Water & drainage')}><span className="department-dot dot-blue" />Water & drainage<span className="department-total">05</span></button>
        <button type="button" aria-label="Parks & public spaces" title="Parks & public spaces" aria-current={active === 'Parks & public spaces' ? 'page' : undefined} className={active === 'Parks & public spaces' ? 'department-active' : ''} onClick={() => goTo('Parks & public spaces')}><span className="department-dot dot-purple" />Parks & public spaces<span className="department-total">05</span></button>
      </div>
      <div className="sidebar-bottom">
        <div className="impact-card">
          <span className="impact-icon"><ShieldCheck size={17} /></span>
          <strong>City impact</strong>
          <p>Making Pune better, one resolution at a time.</p>
          <div className="impact-progress"><span /></div>
          <small><b>76%</b> monthly goal</small>
        </div>
        <button type="button" aria-label="Team & access" title="Team & access" aria-current={active === 'Team' ? 'page' : undefined} className={`nav-link utility-link ${active === 'Team' ? 'active' : ''}`} onClick={() => goTo('Team')}><Users size={18} /><span>Team & access</span></button>
        <button type="button" aria-label="Settings" title="Settings" aria-current={active === 'Settings' ? 'page' : undefined} className={`nav-link utility-link ${active === 'Settings' ? 'active' : ''}`} onClick={() => goTo('Settings')}><Settings size={18} /><span>Settings</span></button>
        <button type="button" aria-label="Help center" title="Help center" aria-current={active === 'Help center' ? 'page' : undefined} className={`nav-link utility-link ${active === 'Help center' ? 'active' : ''}`} onClick={() => goTo('Help center')}><CircleHelp size={18} /><span>Help center</span><Bell className="help-bell" size={15} /></button>
        <button type="button" className={`user-profile profile-button ${active === 'Profile' ? 'active' : ''}`} onClick={() => goTo('Profile')} aria-label="Open Aditya Sharma profile">
          <div className="user-avatar">AS</div>
          <div className="profile-copy"><strong>Aditya Sharma</strong><small>City administrator</small></div>
          <span className="profile-menu">···</span>
        </button>
      </div>
    </aside>
  )
}
