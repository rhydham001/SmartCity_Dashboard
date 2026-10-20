import { useState } from 'react'
import { ArrowLeft, Check, ChevronDown, CircleHelp, Mail, Plus, Save, Settings, ShieldCheck, Users } from 'lucide-react'

function TeamPage({ onNotify }) {
  const [members, setMembers] = useState([
    { initials: 'AS', name: 'Aditya Sharma', role: 'City administrator', email: 'aditya@pune.gov.in', color: 'member-purple' },
    { initials: 'NK', name: 'Neha Kulkarni', role: 'Roads & transport', email: 'neha@pune.gov.in', color: 'member-peach' },
    { initials: 'RP', name: 'Rohan Patil', role: 'Water & drainage', email: 'rohan@pune.gov.in', color: 'member-blue' },
  ])

  function inviteMember() {
    setMembers((current) => current.some((member) => member.name === 'New team member')
      ? current
      : [...current, { initials: 'NT', name: 'New team member', role: 'Invitation pending', email: 'invite sent just now', color: 'member-green' }])
    onNotify('Team invitation added to the demo workspace.')
  }

  return (
    <section className="workspace-page">
      <div className="workspace-page-heading">
        <div><span className="eyebrow">CITY WORKSPACE</span><h1>Team & access</h1><p>Manage the people helping Pune move forward.</p></div>
        <button type="button" className="report-button" onClick={inviteMember}><Plus size={16} /> Invite a member</button>
      </div>
      <div className="workspace-summary-grid">
        <article className="workspace-summary-card"><span className="workspace-summary-icon summary-lavender"><Users size={18} /></span><strong>{members.length}</strong><small>Workspace members</small></article>
        <article className="workspace-summary-card"><span className="workspace-summary-icon summary-mint"><ShieldCheck size={18} /></span><strong>4</strong><small>Departments connected</small></article>
        <article className="workspace-summary-card"><span className="workspace-summary-icon summary-peach"><Mail size={18} /></span><strong>{members.filter((member) => member.role === 'Invitation pending').length}</strong><small>Pending invitations</small></article>
      </div>
      <section className="panel workspace-members">
        <div className="panel-heading"><div><h2>Workspace members</h2><p>People with access to this city workspace</p></div><button type="button" className="subtle-action" onClick={inviteMember}><Plus size={15} /> Invite</button></div>
        <div className="member-list">{members.map((member) => <article className="member-row" key={member.email}><span className={`member-avatar ${member.color}`}>{member.initials}</span><span className="member-details"><strong>{member.name}</strong><small>{member.email}</small></span><span className="member-role">{member.role}</span><button type="button" className="member-menu" aria-label={`More options for ${member.name}`} onClick={() => onNotify(`${member.name} · ${member.role}`)}>···</button></article>)}</div>
      </section>
    </section>
  )
}

function SettingsPage({ onNotify }) {
  const [preferences, setPreferences] = useState({ email: true, weekly: false, aiReview: true })
  const toggles = [
    { id: 'email', title: 'Complaint status updates', detail: 'Email the team when a report changes status.' },
    { id: 'weekly', title: 'Weekly city briefing', detail: 'Receive a summary of trends and service performance.' },
    { id: 'aiReview', title: 'Flag uncertain AI suggestions', detail: 'Keep low-confidence recommendations in manual review.' },
  ]
  return (
    <section className="workspace-page">
      <div className="workspace-page-heading"><div><span className="eyebrow">PREFERENCES</span><h1>Settings</h1><p>Choose how your city workspace operates.</p></div></div>
      <section className="panel settings-panel">
        <div className="panel-heading"><div><h2>Workspace preferences</h2><p>These settings apply to the Pune Municipal demo workspace.</p></div><span className="settings-badge"><Settings size={14} /> Preferences</span></div>
        <div className="settings-options">{toggles.map((item) => <label className="setting-row" key={item.id}><span><strong>{item.title}</strong><small>{item.detail}</small></span><input className="setting-toggle" type="checkbox" checked={preferences[item.id]} onChange={(event) => setPreferences((current) => ({ ...current, [item.id]: event.target.checked }))} /></label>)}</div>
        <button type="button" className="submit-button settings-save" onClick={() => onNotify('Your workspace preferences have been saved.') }><Save size={15} /> Save preferences</button>
      </section>
      <section className="panel settings-panel integration-panel"><div className="panel-heading"><div><h2>Connected services</h2><p>Optional integrations can be configured in your backend environment.</p></div></div><div className="integration-chips"><span><i className="integration-dot integration-live" /> OpenStreetMap <small>Connected</small></span><span><i className="integration-dot integration-demo" /> MongoDB Atlas <small>Optional</small></span><span><i className="integration-dot integration-demo" /> Gemini AI <small>Optional</small></span></div></section>
    </section>
  )
}

function HelpPage({ onNotify }) {
  const [openQuestion, setOpenQuestion] = useState('report')
  const questions = [
    { id: 'report', question: 'How do I report a city issue?', answer: 'Go to Overview and choose “Report an issue”. Add a clear title, category, area, and description. A photo is optional.' },
    { id: 'routing', question: 'How are reports routed?', answer: 'The platform suggests a department from the selected category. Municipal staff can review or override this suggestion.' },
    { id: 'ai', question: 'Does AI make the final decision?', answer: 'No. AI provides suggestions only. Uncertain results are marked for review, and authorized staff remain responsible for decisions.' },
    { id: 'status', question: 'Where can I find complaint status?', answer: 'Choose Complaints in the sidebar to see the report queue, search reports, and filter by city department.' },
  ]
  return (
    <section className="workspace-page">
      <div className="workspace-page-heading"><div><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Help center</h1><p>Quick answers for your SmartCityAI workspace.</p></div></div>
      <div className="help-layout">
        <section className="panel help-faq"><div className="panel-heading"><div><h2>Frequently asked questions</h2><p>Helpful basics for city teams</p></div><CircleHelp size={20} className="help-heading-icon" /></div><div className="faq-list">{questions.map((item) => <article className={`faq-item ${openQuestion === item.id ? 'faq-open' : ''}`} key={item.id}><button type="button" aria-expanded={openQuestion === item.id} onClick={() => setOpenQuestion((open) => open === item.id ? '' : item.id)}><span>{item.question}</span><ChevronDown size={16} /></button>{openQuestion === item.id && <p>{item.answer}</p>}</article>)}</div></section>
        <aside className="help-contact-card"><span className="help-contact-icon"><Mail size={20} /></span><h2>Still need a hand?</h2><p>Reach out to the project support team and we’ll point you in the right direction.</p><button type="button" className="submit-button" onClick={() => onNotify('Support contact: support@smartcityai.example')}>Contact support <span>→</span></button><small>Demo support contact</small></aside>
      </div>
    </section>
  )
}

function ProfilePage({ onNotify }) {
  return (
    <section className="workspace-page">
      <div className="workspace-page-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>Administrator profile</h1><p>Profile details for the active demo session.</p></div></div>
      <section className="panel profile-panel"><div className="profile-hero"><span className="user-avatar profile-avatar-large">AS</span><span><h2>Aditya Sharma</h2><p>City administrator · Pune Municipal</p></span><span className="verified-badge"><Check size={13} /> Admin</span></div><div className="profile-info-grid"><div><small>WORK EMAIL</small><strong>aditya@pune.gov.in</strong></div><div><small>WORKSPACE</small><strong>Pune Municipal</strong></div><div><small>ACCESS LEVEL</small><strong>Administrator</strong></div></div><button type="button" className="subtle-action profile-action" onClick={() => onNotify('Profile editing is not enabled in the demo workspace.')}>Edit profile <ArrowLeft size={14} /></button></section>
    </section>
  )
}

export default function WorkspacePage({ page, onNotify, onBack }) {
  let content
  if (page === 'Team') content = <TeamPage onNotify={onNotify} />
  else if (page === 'Settings') content = <SettingsPage onNotify={onNotify} />
  else if (page === 'Help center') content = <HelpPage onNotify={onNotify} />
  else content = <ProfilePage onNotify={onNotify} />

  return <div className="workspace-page-wrap" key={page}><button type="button" className="back-to-overview" onClick={onBack}><ArrowLeft size={15} /> Back to overview</button>{content}</div>
}
