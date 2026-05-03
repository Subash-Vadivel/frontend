import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function MonthlyTotalsChart({ data }) {
  return (
    <div className="panel chart-panel">
      <h2>Monthly income vs expense</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#2f855a" />
          <Bar dataKey="expense" fill="#c2410c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
