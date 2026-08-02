import { useState, useEffect } from 'react'
import { getDonations, postDonation } from '../../services/api_client'

export default function Donation() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [form, setForm] = useState({ name: '', quantity: 1, donor: '' })
	const [error, setError] = useState(null)

	const load = () => {
		setLoading(true)
		getDonations()
			.then((res) => setItems(res.data))
			.catch(() => setError('Failed to load donations'))
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		load()
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault()
		postDonation(form)
			.then(() => {
				setForm({ name: '', quantity: 1, donor: '' })
				load()
			})
			.catch(() => setError('Failed to create donation'))
	}

	return (
		<div style={{ padding: 24 }}>
			<h1>Business Donations</h1>
			<form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
				<input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
				<input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
				<input placeholder="Donor" value={form.donor} onChange={(e) => setForm({ ...form, donor: e.target.value })} />
				<button type="submit">Add Donation</button>
			</form>

			{loading && <div>Loading…</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<ul>
				{items.map((it) => (
					<li key={it.id}>{it.name} — {it.quantity} — {it.donor} — {it.status}</li>
				))}
			</ul>
		</div>
	)
}

