import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="h-[70px] shadow-lg px-[100px]">
            <div className="flex items-center h-full">
                <h5 className="flex-[.2]">React Quiz Task</h5>
                <div className="flex items-center gap-5">
                    <Link to="/">Home</Link>
                    <Link to="/summaries">My Summaries</Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
