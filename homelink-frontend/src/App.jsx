import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingAIAssistant from "./components/ai/FloatingAIAssistant";

function App() {

    return (
        <BrowserRouter>
            <Navbar />
            <AppRoutes />
            <Footer />
            <FloatingAIAssistant />
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
            <Toaster position="top-right" />
        </BrowserRouter>
    );

}

export default App;