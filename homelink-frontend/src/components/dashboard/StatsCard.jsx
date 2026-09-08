function StatsCard({

    title,

    value,

    icon,

    color,

}) {

    return (

        <div className="card shadow border-0 h-100">

            <div className="card-body">

                <div
                    className="rounded-circle text-white d-flex justify-content-center align-items-center mb-3"
                    style={{
                        width: 55,
                        height: 55,
                        background: color,
                    }}
                >
                    {icon}
                </div>

                <h6>{title}</h6>

                <h3>{value}</h3>

            </div>

        </div>

    );

}

export default StatsCard;