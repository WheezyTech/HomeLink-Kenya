import { Link } from "react-router-dom";

function TermsAndConditions() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-lg-5">
                            <p className="text-uppercase fw-semibold text-primary mb-2">Legal</p>
                            <h1 className="display-6 fw-bold mb-3">Terms and Conditions of Use</h1>
                            <p className="text-muted mb-4">
                                Effective Date: 01/12/2026 · Last Updated: Today
                            </p>

                            <p>
                                Welcome to HomeLink Kenya. By accessing, registering or using the HomeLink Kenya platform, you agree to
                                be bound by these Terms and Conditions and any other applicable policies, including the privacy policy,
                                verification requirements and code of conduct.
                            </p>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">1. Introduction</h2>
                                <p>
                                    HomeLink Kenya is a digital property marketplace and property information platform designed to connect
                                    tenants, landlords, property owners, real estate agents and authorized property stakeholders.
                                </p>
                                <p>
                                    The platform may facilitate property listing and advertising, rental property search, landlord and agent
                                    registration, tenant registration and verification, property ownership checks, viewing requests,
                                    communication, reporting of suspicious listings, occupancy records and related activity.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">2. Definitions</h2>
                                <ul>
                                    <li><strong>HomeLink Kenya:</strong> the digital platform, website, mobile application and related services.</li>
                                    <li><strong>User:</strong> any person or organization accessing or using the platform.</li>
                                    <li><strong>Tenant:</strong> an individual seeking to rent residential or commercial property.</li>
                                    <li><strong>Landlord:</strong> a property owner or authorized lessor.</li>
                                    <li><strong>Agent:</strong> a person or organization authorized to market, manage or facilitate rental property activity.</li>
                                    <li><strong>Personal Data:</strong> information relating to an identified or identifiable individual.</li>
                                    <li><strong>Verification:</strong> the process of checking information submitted by users to assess authenticity.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">3. Eligibility</h2>
                                <ul>
                                    <li>Users must be at least 18 years old to independently create an account.</li>
                                    <li>Users must provide truthful, accurate and current information.</li>
                                    <li>Users must not register using another person’s identity without lawful authority.</li>
                                    <li>Organizations must ensure representatives are authorized to use the platform.</li>
                                    <li>HomeLink Kenya may restrict accounts associated with suspected fraud, impersonation or unlawful activity.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">4. User registration and verification</h2>
                                <p>
                                    Users may be required to provide information needed for account creation, fraud prevention and platform
                                    security. Landlords and agents may be requested to submit supporting documents such as national ID,
                                    KRA PIN information where necessary, business registration certificates, property ownership records,
                                    management or agency documentation, and identity verification evidence where justified.
                                </p>
                                <p>
                                    HomeLink Kenya may conduct reasonable verification checks using lawful and appropriately authorized methods.
                                    Verification does not constitute an absolute guarantee of identity, ownership, legal title or user honesty.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">5. Property listings</h2>
                                <p>
                                    Landlords and agents are responsible for ensuring listings are genuine and accurate. Users must have legal
                                    authority to advertise a property, and listings must not contain misleading prices, false photographs,
                                    fabricated addresses or fraudulent contact details.
                                </p>
                                <p>
                                    HomeLink Kenya may review, suspend, reject or remove suspicious listings and may request additional evidence
                                    to establish authenticity. Publication of a listing does not confirm ownership, legal status, physical condition,
                                    or actual availability of the property.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">6. Anti-fraud and security</h2>
                                <p>
                                    Users must not post fraudulent listings, impersonate others, misrepresent ownership, or use the platform for
                                    unlawful activity. HomeLink Kenya may report suspicious activity and cooperate with competent authorities under
                                    the law when required.
                                </p>
                                <p>
                                    Reports of suspicious properties, fraudulent listings or scams should be submitted through the official
                                    reporting channels available on the platform. We may take action, including restricting access or removing content,
                                    in line with applicable laws and platform policies.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">7. User content and communication</h2>
                                <p>
                                    Users remain responsible for the content they submit, including messages, listing details, documents and other
                                    information shared through the platform. Content must not be unlawful, defamatory, abusive, misleading, discriminatory
                                    or harmful to other users.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">8. Data protection and lawful processing</h2>
                                <p>
                                    Personal data processed by HomeLink Kenya must be handled in accordance with Kenya’s Data Protection Act, 2019,
                                    the Data Protection (General) Regulations, 2021 and any other applicable obligations. HomeLink Kenya will process
                                    personal data lawfully, transparently and only for legitimate purposes connected to the platform.
                                </p>
                                <p>
                                    HomeLink Kenya must not imply that it has blanket authority from the ODPC, Kenya Police or DCI to access or collect
                                    personal data beyond what is lawfully permitted under applicable rules and procedures.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">9. Payments, bookings and service requests</h2>
                                <p>
                                    Any booking, payment, lease agreement or service arrangement conducted through the platform is subject to the
                                    applicable platform terms, payment procedures and any separate contract or agreement between the parties.
                                </p>
                                <p>
                                    HomeLink Kenya is not a party to all tenancy, property or service arrangements and does not guarantee the
                                    performance of third-party users, agents, landlords or service providers.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">10. Limitation of liability</h2>
                                <p>
                                    HomeLink Kenya is provided on an “as is” basis. While we aim to maintain secure, reliable and accurate services,
                                    we do not guarantee uninterrupted access, error-free operation or the truthfulness of all third-party information
                                    submitted by users.
                                </p>
                                <p>
                                    To the maximum extent permitted by law, HomeLink Kenya is not liable for indirect, incidental, consequential or
                                    punitive losses arising from use of the platform, except where required by law or where there is clear misconduct.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h4 fw-bold">11. Amendments</h2>
                                <p>
                                    HomeLink Kenya may amend these Terms and Conditions at any time. Continued use of the platform after changes
                                    become effective means that you accept the revised terms.
                                </p>
                            </section>

                            <div className="d-flex flex-wrap gap-3 mt-4">
                                <Link to="/privacy-policy" className="btn btn-primary">Read Privacy Policy</Link>
                                <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsAndConditions;
