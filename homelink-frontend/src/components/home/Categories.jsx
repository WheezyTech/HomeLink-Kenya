import {
    FaHome,
    FaBuilding,
    FaWarehouse,
    FaMapMarkedAlt,
    FaHotel,
    FaStore,
} from "react-icons/fa";

const categories = [
    {
        name: "Apartments",
        icon: <FaBuilding size={35} />,
    },
    {
        name: "Houses",
        icon: <FaHome size={35} />,
    },
    {
        name: "Commercial",
        icon: <FaWarehouse size={35} />,
    },
    {
        name: "Land",
        icon: <FaMapMarkedAlt size={35} />,
    },
    {
        name: "Hotels",
        icon: <FaHotel size={35} />,
    },
    {
        name: "Shops",
        icon: <FaStore size={35} />,
    },
];

function Categories() {

    return (

        <section className="container py-5">

            <h2 className="fw-bold mb-4 text-center">
                Browse by Category
            </h2>

            <div className="row g-4">

                {categories.map((category, index) => (

                    <div
                        className="col-lg-2 col-md-4 col-6"
                        key={index}
                    >

                        <div className="category-card">

                            {category.icon}

                            <h6 className="mt-3">
                                {category.name}
                            </h6>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default Categories;