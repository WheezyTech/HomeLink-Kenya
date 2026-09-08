import React from "react";

function StatCard({
    icon,
    title,
    value,
}){

    return(

        <div className="stat-card">

            <div className="stat-icon">

                {icon}

            </div>

            <div className="stat-title">

                {title}

            </div>

            <div className="stat-value">

                {value}

            </div>

        </div>

    );

}

export default StatCard;