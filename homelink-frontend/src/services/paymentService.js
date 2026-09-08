import api from "../api/axios";

const getPayments = async () => {

    const response = await api.get("payments/");

    return response.data;

};

const makePayment = async (data) => {

    const response = await api.post("payments/", data);

    return response.data;

};

const getReceipt = async (id) => {

    const response = await api.get(`payments/${id}/receipt/`);

    return response.data;

};

export default {

    getPayments,

    makePayment,

    getReceipt,

};