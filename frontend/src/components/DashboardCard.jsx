export default function DashboardCard({
    title,
    value,
    subtitle,
    color = "#4F46E5",
    icon
}) {

    return (

        <div
            className="card fb-stat-card h-100 shadow-sm border-0"
            style={{ "--fb-accent-color": color }}
        >

            <div className="card-body">

                {icon && (
                    <div className="fb-stat-icon">
                        {icon}
                    </div>
                )}

                <small
                    className="fw-semibold text-uppercase"
                    style={{
                        color: color,
                        letterSpacing: "0.06em",
                        fontSize: "0.72rem"
                    }}
                >
                    {title}
                </small>

                <h2
                    className="fw-bold mt-2 mb-1"
                    style={{ color: "#0F172A", fontSize: "1.85rem" }}
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
