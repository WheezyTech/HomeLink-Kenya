import {
    FaShieldAlt,
    FaMapMarkerAlt,
    FaMoneyCheckAlt,
    FaHeadset
} from "react-icons/fa";

function WhyChooseUs() {

    const features = [
        {
            icon: <FaShieldAlt size={45} />,
            title: "Verified Listings",
            text: "Every property is reviewed before being published."
        },
        {
            icon: <FaMapMarkerAlt size={45} />,
            title: "GPS Location",
            text: "Locate every property accurately using Google Maps."
        },
        {
            icon: <FaMoneyCheckAlt size={45} />,
            title: "Secure Payments",
            text: "Pay booking fees safely through M-Pesa."
        },
        {
            icon: <FaHeadset size={45} />,
            title: "24/7 Support",
            text: "Our support team is always ready to help."
        }
    ];

    return (

        <section className="why-section py-5">

            <div className="container">

                <h2 className="text-center fw-bold mb-5">
                    Why Choose HomeLink Kenya?
                </h2>

                <div className="row">

                    {features.map((item, index) => (

                        <div
                            key={index}
                            className="col-lg-3 col-md-6 mb-4"
                        >

                            <div className="why-card">

                                <div className="why-icon">

                                    {item.icon}

                                </div>

                                <h5 className="mt-3">

                                    {item.title}

                                </h5>

                                <p>

                                    {item.text}

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default WhyChooseUs;