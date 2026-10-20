import { useState } from 'react'
import { ImagePlus, MapPin, X } from 'lucide-react'

export default function ComplaintModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', category: 'Roads', location: '', description: '' })
  const [photo, setPhoto] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ ...form, priority: 'Medium', photo })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop-custom" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="complaint-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-topline"><span className="modal-icon"><MapPin size={19} /></span><button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
        <p className="eyebrow">CITIZEN SERVICES</p><h2 id="modal-title">Report a city issue</h2>
        <p className="modal-intro">Tell us what’s happening. Our AI team will route it to the right department.</p>
        <form onSubmit={submit}>
          <label>Issue title<input required maxLength="100" placeholder="e.g. Large pothole on FC Road" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <div className="form-row">
            <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Roads</option><option>Water</option><option>Sanitation</option><option>Streetlights</option><option>Parks</option><option>Other</option></select></label>
            <label>Location<input required placeholder="Area or street name" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
          </div>
          <label>Description<textarea required rows="3" maxLength="500" placeholder="Add any helpful details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="upload-field"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files?.[0] || null)} /><ImagePlus size={17} /><span>{photo?.name || 'Add a photo'}<small>Optional · JPG, PNG, WebP up to 10MB</small></span><span className="upload-browse">Browse</span></label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="submit-button" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit report'} <span>→</span></button></div>
        </form>
      </section>
    </div>
  )
}
