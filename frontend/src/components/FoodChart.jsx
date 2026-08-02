import { useState, useEffect } from "react";
import api from "../services/api";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

export default function FoodChart() {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        loadChart();
    }, []);

    const loadChart = async () => {
        try {
            const res = await api.get("/dashboard/category-chart");
            setChartData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="card chart-card mt-4">
            <div className="card-body">

                <h5>Food Rescued by Category</h5>

                <ResponsiveContainer width="100%" height={280}>

                    <BarChart data={chartData}>
    <XAxis dataKey="category" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="total" fill="#4F46E5" />
</BarChart>

                </ResponsiveContainer>

            </div>
        </div>
    );
}