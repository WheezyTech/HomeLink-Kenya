import { Link } from "react-router-dom";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">

            <div className="container-fluid">

                <Link className="navbar-brand logo" to="/">
                    Home<span>Link</span>
                </Link>

                <form className="d-flex w-50">

                    <div className="input-group">

                        <span className="input-group-text">
                            <FaSearch />
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search properties..."
                        />

                    </div>

                </form>

                <div className="d-flex align-items-center ms-auto">

                    <button
                        className="btn position-relative me-3"
                    >

                        <FaBell size={22} />

                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        >
                            3
                        </span>

                    </button>

                    <div className="d-flex align-items-center">

                        <FaUserCircle
                            size={35}
                            className="me-2"
                        />

                        <div>

                            <strong>Welcome</strong>

                            <br />

                            <small>Landlord</small>

                        </div>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;