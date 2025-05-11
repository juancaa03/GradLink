import React, { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Select,
	MenuItem,
	Typography,
	CircularProgress,
} from '@mui/material';

const AdminDashboard = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch('http://localhost:4000/api/orders');
				const data = await response.json();
				console.log('Fetched orders:', data); // optional: remove after testing

				// Assuming API returns { orders: [...] }
				setOrders(Array.isArray(data) ? data : data.orders);
			} catch (error) {
				console.error('Error fetching orders:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const updateOrderStatus = async (orderId, newStatus) => {
		try {
			await fetch(`http://localhost:4000/api/orders/${orderId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});

			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order.id === orderId ? { ...order, status: newStatus } : order
				)
			);
		} catch (error) {
			console.error('Error updating order status:', error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<CircularProgress />
				<Typography className="ml-4" variant="h6">
					Loading orders...
				</Typography>
			</div>
		);
	}

	return (
		<div className="p-8">
			<Typography variant="h4" className="mb-6 font-bold text-gray-800">
				Admin Dashboard
			</Typography>
			<TableContainer component={Paper} className="shadow-lg rounded-xl">
				<Table>
					<TableHead className="bg-gray-100">
						<TableRow>
							<TableCell className="font-bold">Order ID</TableCell>
							<TableCell className="font-bold">Customer</TableCell>
							<TableCell className="font-bold">Items</TableCell>
							<TableCell className="font-bold">Status</TableCell>
							<TableCell className="font-bold">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id} className="hover:bg-gray-50 transition">
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.customerName}</TableCell>
								<TableCell>
									{order.items.map((item, index) => (
										<div key={index}>
											{item.name} × {item.quantity}
										</div>
									))}
								</TableCell>
								<TableCell>{order.status}</TableCell>
								<TableCell>
									<Select
										value={order.status}
										onChange={(e) =>
											updateOrderStatus(order.id, e.target.value)
										}
										className="w-40"
										size="small"
									>
										<MenuItem value="processing">Processing</MenuItem>
										<MenuItem value="delivering">Delivering</MenuItem>
										<MenuItem value="delivered">Delivered</MenuItem>
									</Select>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default AdminDashboard;
