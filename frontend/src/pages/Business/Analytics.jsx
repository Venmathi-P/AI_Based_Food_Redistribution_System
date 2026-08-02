import { useEffect, useState } from 'react'
import { getInventory, getDonations } from '../../services/api_client'

export default function Analytics() {
	const [inventoryCount, setInventoryCount] = useState(0)
	const [donationCount, setDonationCount] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		Promise.all([getInventory(), getDonations()])
			.then(([inv, don]) => {
				if (!mounted) return
				setInventoryCount(inv.data.length)
				setDonationCount(don.data.length)
			})
			.catch(() => {})
			.finally(() => mounted && setLoading(false))

		return () => {
			mounted = false
		}
	}, [])

	return (
		<div style={{ padding: 24 }}>
			<h1>Business Analytics</h1>
			{loading ? (
				<div>Loading analytics…</div>
			) : (
				<div>
					<p>Inventory items: {inventoryCount}</p>
					<p>Donations: {donationCount}</p>
					<p>Simple charts and prediction summaries will go here.</p>
				</div>
			)}
		</div>
	)
}

