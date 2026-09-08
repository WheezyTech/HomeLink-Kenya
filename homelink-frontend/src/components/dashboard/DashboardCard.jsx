function DashboardCard({

    title,
    value,
    subtitle,
    icon,
    color,

}) {

    return (

        <div className="card p-4">

            <h6 className="text-muted">

                {title}

            </h6>

            <h2 className="fw-bold text-primary">

                {value}

            </h2>

        </div>

    );

}

export default DashboardCard;