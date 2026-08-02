(function () {
	// placeholder
})();

import { useState } from 'react'
import { postInventory } from '../../services/api_client'
import { useNavigate } from 'react-router-dom'

export default function AddInventory() {
	const [form, setForm] = useState({ name: '', quantity: 1, expiry_date: '', owner: '' })
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		postInventory(form)
			.then(() => navigate('/buisness/dashboard'))
			.catch(() => setError('Failed to add inventory'))
	}

	return (
		<div style={{ padding: 24 }}>
			<h1>Add Inventory (Business)</h1>
			<form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
				<input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
				<input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
				<input placeholder="Expiry date (YYYY-MM-DD)" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
				<input placeholder="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
				<button type="submit">Add</button>
			</form>
			{error && <div style={{ color: 'red' }}>{error}</div>}
		</div>
	)
}

