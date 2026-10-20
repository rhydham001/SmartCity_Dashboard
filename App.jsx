import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowDown, ArrowUpRight, Bell, CheckCircle2, ChevronDown, FileText, Filter, Search, Sparkles, Timer, UsersRound, Zap } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import MetricCard from './components/MetricCard.jsx'
import CityMap from './components/CityMap.jsx'
import ComplaintTable from './components/ComplaintTable.jsx'
import ComplaintModal from './components/ComplaintModal.jsx'
import WorkspacePage from './components/WorkspacePage.jsx'
import { createComplaint, getComplaints, getDashboard } from './services/api.js'

const demoMetrics = { total_complaints: 1284, resolved_rate: 76, avg_resolution_hours: 18, active_complaints: 24, resolution_change: 12, complaints_change: 8 }

function displayDate() {
  return new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
}

export default function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [metrics, setMetrics] = useState(demoMetrics)
  const [complaints, setComplaints] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [apiState, setApiState] = useState('loading')
  const [apiError, setApiError] = useState('')
  const [notice, setNotice] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const insightRef = useRef(null)
  const mapRef = useRef(null)
  const complaintsRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    Promise.all([getDashboard(), getComplaints()])
      .then(([dashboard, records]) => {
        setMetrics(dashboard.metrics)
        setComplaints(records)
        setApiState('connected')
      })
      .catch((error) => {
        setApiError(error.message)
        setApiState('offline')
        setComplaints([
          { id: 'SC-2841', title: 'Deep pothole on main road', category: 'Roads', emoji: '⌁', location: 'Shivajinagar, Ward 14', priority: 'High', status: 'In progress', reported: '12 min ago' },
          { id: 'SC-2840', title: 'Streetlight not working', category: 'Streetlights', emoji: '☼', location: 'Deccan Gymkhana, Ward 16', priority: 'Medium', status: 'Assigned', reported: '38 min ago' },
          { id: 'SC-2839', title: 'Water leakage near junction', category: 'Water', emoji: '◉', location: 'Swargate, Ward 20', priority: 'High', status: 'AI review', reported: '1 hr ago' },
          { id: 'SC-2838', title: 'Overflowing public bin', category: 'Sanitation', emoji: '♧', location: 'Koregaon Park, Ward 5', priority: 'Low', status: 'Resolved', reported: '2 hrs ago' },
          { id: 'SC-2837', title: 'Damaged footpath tiles', category: 'Roads', emoji: '⌁', location: 'Kothrud, Ward 28', priority: 'Medium', status: 'In progress', reported: '3 hrs ago' },
        ])
      })
  }, [])

  const filtered = useMemo(() => complaints.filter((item) => {
    const matchesSearch = `${item.title} ${item.location} ${item.id} ${item.status}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (!departmentFilter || item.category === departmentFilter)
  }), [complaints, departmentFilter, search])

  function navigate(label) {
    setActivePage(label)
    if (['Team', 'Settings', 'Help center', 'Profile'].includes(label)) {
      setDepartmentFilter('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (label === 'Overview') {
      setDepartmentFilter('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (label === 'Complaints' || ['Roads & transport', 'Sanitation', 'Water & drainage', 'Parks & public spaces'].includes(label)) {
      const categories = {
        'Roads & transport': 'Roads',
        Sanitation: 'Sanitation',
        'Water & drainage': 'Water',
        'Parks & public spaces': 'Parks',
      }
      setDepartmentFilter(categories[label] || '')
      complaintsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (label === 'Live city map') mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (label === 'AI insights') insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function addComplaint(form) {
    const record = await createComplaint(form)
    setComplaints((current) => [record, ...current])
    setMetrics((current) => ({ ...current, active_complaints: current.active_complaints + 1, total_complaints: current.total_complaints + 1 }))
    setNotice('Your report is in. AI triage has started.')
    window.setTimeout(() => setNotice(''), 4200)
  }

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 4200)
  }

  return (
    <div className="app-shell">
      <Sidebar active={activePage} onNavigate={navigate} />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <span className={`connection-badge ${apiState}`} title={apiError}><i />{apiState === 'connected' ? 'System live' : apiState === 'offline' ? 'Demo mode · API unavailable' : 'Connecting'}</span>
            <button className="top-icon" aria-label="Search complaints" onClick={() => { navigate('Complaints'); window.setTimeout(() => searchInputRef.current?.focus(), 350) }}><Search size={18} /></button>
            <button className="top-icon notification-button" aria-label="Notifications" onClick={() => showNotice('You’re all caught up. No new notifications.')}><Bell size={18} /><i /></button>
            <span className="top-divider" />
            <button className="date-button"><span>{displayDate()}</span><ChevronDown size={15} /></button>
          </div>
        </header>
        {['Team', 'Settings', 'Help center', 'Profile'].includes(activePage)
          ? <WorkspacePage page={activePage} onNotify={showNotice} onBack={() => navigate('Overview')} />
          : <div className="page-content">
          <section className="welcome-row">
            <div><div className="greeting"><span className="greeting-sun">✳</span> GOOD MORNING, ADITYA</div><h1>Your city, <span>in focus.</span></h1><p>Here’s what’s happening across Pune today.</p></div>
            <button className="report-button" onClick={() => setShowModal(true)}><span>＋</span> Report an issue</button>
          </section>

          <section className="metrics-grid">
            <MetricCard title="Total complaints" value={metrics.total_complaints.toLocaleString('en-IN')} change={`+${metrics.complaints_change}%`} detail="vs. last month" icon={FileText} tone="lavender" />
            <MetricCard title="Resolution rate" value={`${metrics.resolved_rate}%`} change={`+${metrics.resolution_change}%`} detail="vs. last month" icon={CheckCircle2} tone="mint" />
            <MetricCard title="Avg. resolution time" value={`${metrics.avg_resolution_hours}h`} change="−2.4h" direction="down" detail="faster this month" icon={Timer} tone="peach" />
            <MetricCard title="Active right now" value={metrics.active_complaints} change="8 urgent" detail="need attention" icon={Activity} tone="blue" />
          </section>

          <section className="insight-banner" ref={insightRef}>
            <div className="insight-orb"><Sparkles size={19} /></div>
            <div className="insight-copy"><span>SMARTCITY AI · DAILY BRIEFING</span><p><strong>Great momentum!</strong> Your team resolved 18% more complaints this week. Road maintenance requests are trending up in Ward 14.</p></div>
            <button onClick={() => navigate('AI insights')}>Explore insights <ArrowUpRight size={15} /></button>
            <div className="banner-decoration" aria-hidden="true">✳</div>
          </section>

          <section className="dashboard-grid">
            <div ref={mapRef}><CityMap /></div>
            <section className="panel activity-panel">
              <div className="panel-heading"><div><h2>Resolution overview</h2><p>Complaints resolved this week</p></div><button className="period-selector">This week <ChevronDown size={14} /></button></div>
              <div className="chart-total"><strong>186</strong><span><ArrowUpRight size={14} /> 14.6%</span><small>vs last week</small></div>
              <div className="chart-wrap">
                <div className="chart-y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div>
                <div className="bar-chart" aria-label="Complaints resolved Monday through Sunday">
                  {[['Mon', 47], ['Tue', 67], ['Wed', 54], ['Thu', 82], ['Fri', 63], ['Sat', 92], ['Sun', 72]].map(([day, height], index) => <div className="bar-column" key={day}><div className={`bar ${index === 5 ? 'bar-highlight' : ''}`} style={{ height: `${height}%` }}><span /></div><small>{day}</small></div>)}
                </div>
              </div>
              <div className="chart-note"><span className="note-icon"><Zap size={14} /></span><span>Peak resolution day is <b>Saturday</b> — 42 cases closed.</span></div>
            </section>
          </section>

          <section className="complaint-section" ref={complaintsRef}>
            <div className="complaint-toolbar">
              <div className="complaint-title"><h2>On the ground</h2><span>{complaints.length} reports</span></div>
              <div className="table-actions"><label className="search-box"><Search size={16} /><input ref={searchInputRef} aria-label="Search complaints" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} /></label><button className={`filter-button ${departmentFilter ? 'filter-selected' : ''}`} onClick={() => { setDepartmentFilter(''); showNotice('Department filter cleared.') }}><Filter size={15} /> {departmentFilter || 'Filters'} <span className="filter-dot" /></button><button className="sort-button"><ArrowDown size={14} /> Newest</button></div>
              </div>
            <ComplaintTable complaints={filtered} showAll={activePage === 'Complaints'} onViewAll={() => navigate('Complaints')} />
          </section>
          <footer className="footer"><span>© 2026 SmartCityAI · Building better cities together</span><span><UsersRound size={14} /> Built for the people of Pune</span></footer>
          </div>}
      </main>
      {showModal && <ComplaintModal onClose={() => setShowModal(false)} onSubmit={addComplaint} />}
      {notice && <div className="toast-notice"><CheckCircle2 size={18} />{notice}</div>}
    </div>
  )
}
