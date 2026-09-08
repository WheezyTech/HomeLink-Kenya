import { useEffect, useState } from "react";

const STORAGE_KEY = "homelink-true-cost-assumptions";
const defaultAssumptions = {
    utilities: 0,
    serviceCharge: 0,
    transport: 0,
};

function formatCurrency(value) {
    return `KSh ${Number(value).toLocaleString()}`;
}

function TrueCostEstimate({ rent }) {
    const [assumptions, setAssumptions] = useState(defaultAssumptions);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved) {
                setAssumptions({ ...defaultAssumptions, ...saved });
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const updateAssumption = (field, value) => {
        const next = {
            ...assumptions,
            [field]: Math.max(0, Number(value) || 0),
        };
        setAssumptions(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const total = Number(rent) + Object.values(assumptions).reduce(
        (sum, value) => sum + Number(value),
        0,
    );

    return (
        <div className="border rounded p-3 mb-4 bg-light">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                <div>
                    <h5 className="mb-1">Your estimated monthly cost</h5>
                    <p className="small text-muted mb-0">
                        Adjust the optional costs to compare homes realistically.
                    </p>
                </div>
                <strong className="text-primary text-nowrap">
                    {formatCurrency(total)}
                </strong>
            </div>

            <div className="small mb-3">
                <div className="d-flex justify-content-between py-1">
                    <span>Rent from listing</span>
                    <strong>{formatCurrency(rent)}</strong>
                </div>
                <div className="d-flex justify-content-between py-1 text-muted">
                    <span>Your estimated extras</span>
                    <span>{formatCurrency(total - Number(rent))}</span>
                </div>
            </div>

            <div className="row g-2">
                <div className="col-md-4">
                    <label className="form-label small mb-1" htmlFor="estimated-utilities">
                        Utilities / month
                    </label>
                    <input
                        id="estimated-utilities"
                        className="form-control form-control-sm"
                        type="number"
                        min="0"
                        value={assumptions.utilities}
                        onChange={(event) => updateAssumption("utilities", event.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small mb-1" htmlFor="estimated-service-charge">
                        Service charge / month
                    </label>
                    <input
                        id="estimated-service-charge"
                        className="form-control form-control-sm"
                        type="number"
                        min="0"
                        value={assumptions.serviceCharge}
                        onChange={(event) => updateAssumption("serviceCharge", event.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small mb-1" htmlFor="estimated-transport">
                        Transport / month
                    </label>
                    <input
                        id="estimated-transport"
                        className="form-control form-control-sm"
                        type="number"
                        min="0"
                        value={assumptions.transport}
                        onChange={(event) => updateAssumption("transport", event.target.value)}
                    />
                </div>
            </div>

            <p className="small text-muted mt-3 mb-0">
                Deposit, moving costs, and landlord charges are not included. Estimates are saved only in this browser.
            </p>
        </div>
    );
}

export default TrueCostEstimate;
