import { ArrowUpRight, MoreHorizontal } from 'lucide-react'

const statusClass = {
  'In progress': 'status-progress',
  'Assigned': 'status-assigned',
  'Resolved': 'status-resolved',
  'AI review': 'status-review',
}

export default function ComplaintTable({ complaints, onViewAll, showAll }) {
  return (
    <section className="panel complaints-panel">
      <div className="panel-heading table-heading">
        <div><h2>Recent complaints</h2><p>Keep an eye on what needs attention</p></div>
        <button className="text-action" onClick={onViewAll}>{showAll ? 'Showing all' : 'View all'} <ArrowUpRight size={15} /></button>
      </div>
      <div className="table-responsive">
        <table className="table complaint-table mb-0">
          <thead><tr><th>COMPLAINT</th><th>LOCATION</th><th>PRIORITY</th><th>STATUS</th><th>REPORTED</th><th /></tr></thead>
          <tbody>{(showAll ? complaints : complaints.slice(0, 5)).map((item) => (
            <tr key={item.id}>
              <td><span className={`issue-icon issue-${item.category.toLowerCase().replaceAll(' ', '-')}`}>{item.emoji}</span><span className="issue-name">{item.title}<small>{item.id}</small></span></td>
              <td className="location-cell">{item.location}</td>
              <td><span className={`priority priority-${item.priority.toLowerCase()}`}><i />{item.priority}</span></td>
              <td><span className={`status-pill ${statusClass[item.status] || 'status-assigned'}`}>{item.status}</span></td>
              <td className="reported-cell">{item.reported}</td>
              <td><button className="row-menu" aria-label={`More options for ${item.id}`}><MoreHorizontal size={18} /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {complaints.length === 0 && <div className="empty-state">No complaints match this search yet.</div>}
    </section>
  )
}
