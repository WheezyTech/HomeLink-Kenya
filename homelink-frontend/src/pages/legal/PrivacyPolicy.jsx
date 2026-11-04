import { Link } from "react-router-dom";

function PrivacyPolicy() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-lg-5">
                            <p className="text-uppercase fw-semibold text-primary mb-2">Legal</p>
                            <h1 className="display-6 fw-bold mb-3">Privacy Policy and Data Protection Framework</h1>
                            <p className="text-muted mb-4">
                                Effective Date: 01/12/2026 · Last Updated: Today
                            </p>

                            <p>
                                HomeLink Kenya is committed to protecting the privacy, security and personal data of tenants,
                                landlords, agents, property owners and other users who access our platform. This Privacy Policy
                                explains what personal information we collect, how we use it, when we share it, and how we protect it
                                in accordance with Kenya’s data protection framework.
                            </p>

                            <div className="alert alert-warning border-0 mb-4">
                                <strong>Important:</strong> HomeLink Kenya must not claim blanket authority from the Office of the Data
                                Protection Commissioner (ODPC), the Kenya Police or the Directorate of Criminal Investigations (DCI)
                                to collect personal information. Our processing must be lawful, transparent and limited to legitimate
                                platform purposes.
                            </div>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">1. Scope and legal basis</h2>
                                <p>
                                    This policy applies to personal data processed through the HomeLink Kenya website, mobile application,
                                    property listings, verification services, communication tools, reporting features, and support channels.
                                </p>
                                <p>
                                    We process personal data only where there is a valid lawful basis, including consent where required,
                                    contract performance, legitimate interests, compliance with legal obligations, and other lawful grounds
                                    under Kenya’s data protection laws.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">2. Information we collect</h2>
                                <ul>
                                    <li>Account information such as full name, phone number, email address and identification details.</li>
                                    <li>Property information, listing details, ownership records and tenancy-related data.</li>
                                    <li>Verification information, including government-issued identity, KRA PIN, and proof of authority where necessary.</li>
                                    <li>Communication records, support requests, complaints, reports, and interactions through the platform.</li>
                                    <li>Technical information including device data, IP addresses, app logs, browser information and usage patterns.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">3. How we use personal data</h2>
                                <p>We use personal data to:</p>
                                <ul>
                                    <li>Create and manage user accounts.</li>
                                    <li>Facilitate property searches, listings and bookings.</li>
                                    <li>Verify identities, ownership claims and agent credentials.</li>
                                    <li>Support fraud prevention, compliance and platform security.</li>
                                    <li>Respond to reports of suspicious listings, scams and unlawful activity.</li>
                                    <li>Provide customer support, notifications and service-related updates.</li>
                                    <li>Comply with applicable Kenyan laws, regulatory obligations and lawful requests.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">4. Data sharing and disclosure</h2>
                                <p>
                                    HomeLink Kenya may share personal information with authorized stakeholders only where this is necessary
                                    to provide the service, protect users, satisfy legal obligations, or respond to a lawful request from a
                                    competent authority.
                                </p>
                                <p>
                                    We do not sell personal data for marketing purposes. We may disclose information to service providers,
                                    verification partners, payment processors, security specialists, legal advisers, or regulators when required
                                    by law or necessary to prevent harm.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">5. Data protection from the ODPC perspective</h2>
                                <p>
                                    In Kenya, data processing must be carried out in line with the Data Protection Act, 2019 and the Data
                                    Protection (General) Regulations, 2021. The platform must investigate mandatory data controller
                                    registration before launch if it is processing personal data in categories that are not exempt.
                                </p>
                                <p>
                                    Property management information and crime-prevention or security-related processing may require formal
                                    registration and compliance review with the ODPC, even where some business-size thresholds could otherwise
                                    be relevant.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">6. Your rights</h2>
                                <p>Depending on applicable law and the circumstances, you may have rights to:</p>
                                <ul>
                                    <li>Access your personal data.</li>
                                    <li>Correct inaccurate or incomplete information.</li>
                                    <li>Request deletion or restriction of certain data.</li>
                                    <li>Object to processing based on legitimate interests.</li>
                                    <li>Withdraw consent where consent is the legal basis.</li>
                                    <li>Request information about data sharing and processing.</li>
                                </ul>
                                <p>
                                    To exercise these rights, contact our privacy or compliance team through the official support or contact
                                    channels available on the platform.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">7. Security</h2>
                                <p>
                                    We implement reasonable administrative, technical and organizational safeguards to protect personal data
                                    from unauthorized access, alteration, disclosure or destruction. However, no digital platform can guarantee
                                    absolute security and users should exercise caution when sharing sensitive information online.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">8. Retention</h2>
                                <p>
                                    We retain personal data only for as long as necessary to provide services, comply with legal duties,
                                    resolve disputes, enforce agreements and protect against fraud or misuse.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">9. Cookies and tracking</h2>
                                <p>
                                    The platform may use cookies, session data, analytics tools and similar technologies to improve usability,
                                    measure traffic, support security and personalize experiences. Users should review the cookie disclosure
                                    on the website and manage preferences available through the browser or app settings where applicable.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">10. Contact and compliance</h2>
                                <p>
                                    For privacy or data protection inquiries, users may contact the HomeLink Kenya privacy or compliance team
                                    using official contact details published on the platform. We may update this policy periodically to reflect
                                    operational, legal or regulatory changes.
                                </p>
                            </section>

                            <div className="d-flex flex-wrap gap-3 mt-4">
                                <Link to="/terms-and-conditions" className="btn btn-primary">Read Terms and Conditions</Link>
                                <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
