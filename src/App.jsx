import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SummaryList from "./components/SummaryList";
import Header from "./components/Header";

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/summaries" element={<SummaryList />} />
            </Routes>
        </div>
    );
};

export default App;
