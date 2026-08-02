export default function DashboardCard({
    title,
    value,
    subtitle,
    color = "#2563EB"
}) {

    return (

        <div
            className="card dashboard-card h-100 shadow-sm border-0"
        >

            <div className="card-body">

                <small
                    className="fw-semibold text-uppercase"
                    style={{
                        color: color,
                        letterSpacing: "1px"
                    }}
                >
                    {title}
                </small>

                <h2
                    className="fw-bold mt-2 mb-1"
                    style={{ color: "#1E293B" }}
                >
                    {value}
                </h2>

                <small className="text-muted">
                    {subtitle}
                </small>

            </div>

        </div>

    );

}