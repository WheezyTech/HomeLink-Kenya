import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPlay,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-dark text-white mt-5 py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-3 col-md-6">
                        <h3 className="fw-bold mb-3">HomeLink Kenya</h3>
                        <p className="text-white-50">
                            HomeLink Kenya connects tenants, buyers,
                            landlords and verified agents through a
                            secure, modern property marketplace powered
                            by smart technology.
                        </p>

                        <div className="d-flex gap-3 mt-4">
                            <a href="#" className="text-white-50" aria-label="Facebook">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-white-50" aria-label="Instagram">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-white-50" aria-label="Twitter">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-white-50" aria-label="LinkedIn">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="#" className="text-white-50" aria-label="TikTok">
                                <FaPlay size={18} />
                            </a>
                            <a href="#" className="text-white-50" aria-label="YouTube">
                                <FaPlay size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-semibold mb-3">Company</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/">About</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Careers</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Blog</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Agents</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-semibold mb-3">Properties</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties/rent">Rent</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Buy</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Commercial</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Land</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Apartments</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-semibold mb-3">Support</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">FAQ</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Privacy</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Terms</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Contact</Link></li>
                            <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/properties">Help Centre</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-semibold mb-3">Newsletter</h5>
                        <p className="text-white-50 mb-3">
                            Stay Updated. Receive the latest properties.
                        </p>
                        <div className="d-flex flex-column gap-2">
                            <input type="email" className="form-control" placeholder="Your email" />
                            <button className="btn btn-primary">Subscribe</button>
                        </div>

                        <div className="mt-4">
                            <h6 className="fw-semibold">Download HomeLink App</h6>
                            <div className="d-flex gap-2 mt-2">
                                <button className="btn btn-outline-light btn-sm">Google Play</button>
                                <button className="btn btn-outline-light btn-sm">App Store</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 pt-4 border-top border-secondary">
                    <div className="col-lg-6 mb-3 mb-lg-0">
                        <div className="d-flex flex-column flex-md-row gap-2 text-white-50">
                            <span>© 2026 HomeLink Kenya</span>
                            <span>All Rights Reserved</span>
                            <span>Version 1.0.0</span>
                        </div>
                    </div>
                    <div className="col-lg-6 text-lg-end text-white-50">
                        Powered by Wheezy Technologies
                    </div>
                </div>

                <div className="row mt-4 g-3">
                    <div className="col-md-3">
                        <div className="text-center p-3 rounded bg-white bg-opacity-10">
                            <h4 className="fw-bold mb-0">25,000+</h4>
                            <small className="text-white-50">Properties</small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center p-3 rounded bg-white bg-opacity-10">
                            <h4 className="fw-bold mb-0">1,500+</h4>
                            <small className="text-white-50">Verified Agents</small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center p-3 rounded bg-white bg-opacity-10">
                            <h4 className="fw-bold mb-0">47</h4>
                            <small className="text-white-50">Counties Covered</small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center p-3 rounded bg-white bg-opacity-10">
                            <h4 className="fw-bold mb-0">99%</h4>
                            <small className="text-white-50">Customer Satisfaction</small>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;